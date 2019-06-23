/** @namespace socket.decoded_token */
/** @namespace coupon.discount_flat */
/** @namespace coupon.discount_percent */

const redis = require('../models/redis');
const geo = require('../models/geo');
const stripe = require('stripe')('');
const socketioJwt = require('socketio-jwt');
const update = require("../libs/update-handler");
const braintree = require('braintree');
const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: 'c5nshkgtsjt7szvx',
    publicKey: 'cmmvzxncxd73fnhs',
    privateKey: '8b2eac1ebc51216bff069b8e958f0960'
});

module.exports = function (io) {
    io.use(socketioJwt.authorize({
        secret: jwtToken,
        handshake: true
    }));
    io.sockets.on('connection', function (socket) {
        socket.decoded_token.prefix === driverPrefix ? drivers[socket.decoded_token.id] = socket.id : riders[socket.decoded_token.id] = socket.id;
            if (socket.decoded_token.prefix === driverPrefix) {
                //TODO:Well we need to know the size!
                operatorsNamespace.emit("ChangeDriversOnline", Object.keys(drivers).length);
                mysql.driver.getIsInfoChanged(socket.decoded_token.id).then(function (isChanged) {
                    if (isChanged)
                        update.rider(io, socket.decoded_token.id);
                });
            }
            if (socket.decoded_token.prefix === riderPrefix)
                mysql.rider.getIsInfoChanged(socket.decoded_token.id).then(function (isChanged) {
                    if (isChanged)
                        update.rider(io, socket.decoded_token.id);
                });
        socket.on('getStatus', async function (callback) {
            if (socket.decoded_token.prefix === driverPrefix) {
                update.driver(io, socket.decoded_token.id);
                let travelId = await mysql.travel.getDriverTravelUnfinished(socket.decoded_token.id);
                if (travelId != null) {
                    let travel = await mysql.getOneRow('travel', {id: travelId});
                    callback(200, travel);
                } else {
                    callback(404);
                }
            } else {
                update.rider(io, socket.decoded_token.id);
                let travelId = await mysql.travel.getRiderTravelUnfinished(socket.decoded_token.id);
                if (travelId != null) {
                    let travel = await mysql.getOneRow('travel', {id: travelId});
                    callback(200, travel);
                } else {
                    callback(404);
                }
            }
        });
        socket.on('disconnect', function () {
            /*if (socket.decoded_token.prefix === driverPrefix) {
                redis.deleteLocation(socket.decoded_token.id);
                delete drivers[socket.decoded_token.id];
                mysql.driver.setState(socket.decoded_token.id, DRIVER_STATE_OFFLINE);
                operatorsNamespace.emit("ChangeDriversOnline", drivers.size);
            } else {
                delete riders[socket.decoded_token.id];
            }*/
        });
        socket.on('changeStatus', async function (statusCode, callback) {
            if (statusCode === 'offline') {
                await redis.deleteLocation(socket.decoded_token.id);
                delete drivers[socket.decoded_token.id];
            }
            if (await mysql.driver.setState(socket.decoded_token.id, statusCode))
                callback(200);
            else
                callback(903);
        });
        socket.on('locationChanged', function (lat, lng) {
            redis.setLocation(socket.decoded_token.id, lat, lng);
        });
        socket.on('calculateFare', async function (pickupPosition, destinationPosition, callback) {
            try {
                let travelDistance = await geo.calculateDistance(pickupPosition, destinationPosition);
                let distanceParsed = await geo.geoParser(travelDistance);
                if (distanceParsed.status !== "OK") {
                    callback(666, distanceParsed.status);
                    return;
                }
                let cats = JSON.parse(JSON.stringify(serviceTree));
                for (let cat of cats)
                    for (let service of cat.services)
                        service['cost'] = await mysql.service.calculateCost(service, distanceParsed.distance.value, distanceParsed.duration.value);
                callback(200, cats);
            } catch (error) {
                if (isNaN(error.message))
                    callback(666, error.message);
                else
                    callback(parseInt(error.message));
            }
        });
        socket.on('requestTaxi', async function (pickupPoint, destinationPoint, pickupLocation, dropOffLocation, serviceId, callback) {
            try {
                let closeDrivers = await redis.getCloseDrivers(pickupPoint);
                let driverIds = closeDrivers.map(x => parseInt(x[0]));
                if (driverIds.length < 1) {
                    callback(404);
                    return;
                }
                let driversOnline = await mysql.driver.getDriversOnline(driverIds);
                if (driversOnline.length < 1) {
                    callback(404);
                    return;
                }
                let [driversWithService, travelMetrics] = await Promise.all([mysql.driver.getDriversWithService(driversOnline, serviceId),
                    geo.geoParser(await geo.calculateDistance(pickupPoint, destinationPoint))]);
                if (driversWithService.length < 1) {
                    callback(303);
                    return;
                }
                if (travelMetrics.status !== "OK") {
                    callback(666, travelMetrics.status);
                    return;
                }

                let service = await mysql.service.getServuceByIdFromTree(serviceId);
                let cost = await mysql.service.calculateCost(service, travelMetrics.distance.value, travelMetrics.duration.value);
                const travel = await mysql.travel.insert(socket.decoded_token.id, pickupPoint, destinationPoint, pickupLocation, dropOffLocation, travelMetrics.distance.value, travelMetrics.duration.value, cost);
                if (driversWithService.length > 1)
                    mysql.travel.setStateByTravelId(travel.id, TRAVEL_STATE_FOUND);
                else {
                    if (Object.keys(drivers).length > 1)
                        mysql.travel.setStateByTravelId(travel.id, TRAVEL_STATE_NOT_FOUND);
                    else
                        mysql.travel.setStateByTravelId(travel.id, TRAVEL_STATE_NO_CLOSE_FOUND);
                }
                for (let driver of driversWithService) {
                    let distance = 0;
                    for (let d of closeDrivers)
                        if (parseInt(d[0]) === driver)
                            distance = parseInt(d[1]);
                    redis.newRequest(driver, travel.id, {
                        distance: travelMetrics.distance.value,
                        fromDriver: distance,
                        cost: parseFloat(cost),
                        travel: travel
                    });
                    if (process.env.ONESIGNAL_DRIVER_REQUEST_TEMPLATE !== null) {
                        let playerIds = await sql.query("SELECT notification_player_id FROM driver WHERE id IN (?) AND notification_player_id IS NOT NULL", [driversWithService]);
                        playerIds = playerIds[0].map(x => x.notification_player_id);
                        let requestNotification = new OneSignal.Notification({
                            template_id: process.env.ONESIGNAL_DRIVER_REQUEST_TEMPLATE,
                            include_player_ids: playerIds
                        });
                        notificationClient.sendNotification(requestNotification, function (err, httpResponse, data) {
                            if (err) {
                                // console.log('Something went wrong...');
                            } else {
                                // console.log(data, httpResponse.statusCode);
                            }
                        });
                    }
                    io.to(drivers[driver]).emit('requestReceived', travel, travelMetrics.distance.value, distance, parseFloat(cost));
                }
                callback(200, driversWithService.length);
            }
            catch (err) {
                const errorNum = parseInt(err.message);
                if (errorNum && errorNum > 0)
                    callback(errorNum);
                else
                    callback(666, err.message);
            }
        });
        socket.on('getRequests', async function (callback) {
            if (socket.decoded_token.prefix !== driverPrefix)
                return;
            let [requests, driver] = await Promise.all([
                redis.getDriverRequests(socket.decoded_token.id),
                mysql.getOneRow('driver', {id: socket.decoded_token.id})
            ]);
            if (driver.status !== 'online') {
                callback(413); // It means driver is offline so why look for requests, Because most of the times when using the app driver is online and also redis is too fast i have let both queries run at the same time.
                return;
            }
            requests.map(x => x.travel = JSON.parse(x.travel));
            callback(200, requests);
        });
        socket.on('notificationPlayerId', async function (playerId) {
            mysql.updateRow(socket.decoded_token.prefix, {notification_player_id: playerId}, socket.decoded_token.id);
        });
        socket.on('driverAccepted', async function (travelId, callback) {
            let [ignored, ignored1, ignored2, ignored3, driver, riderId] = await Promise.all([
                redis.expireRequest(travelId),
                mysql.travel.setDriver(travelId, socket.decoded_token.id),
                mysql.driver.setState(socket.decoded_token.id, DRIVER_STATE_IN_SERVICE),
                mysql.travel.setStateByTravelId(travelId, TRAVEL_STATE_RIDER_ACCEPTED),
                mysql.getOneRow('driver', {id: socket.decoded_token.id}),
                mysql.travel.getRiderId(travelId)
            ]);
            socket.riderId = riderId;
            let [travel, driverLocation] = await Promise.all([
                mysql.travel.getById(travelId),
                redis.getPosition(driver.id)
            ]);
            let driverDistance = await geo.geoParser(await geo.calculateDistance({
                y: driverLocation[0][1],
                x: driverLocation[0][0]
            }, travel.pickup_point));

            if (driverDistance.status === "OK")
                io.to(riders[riderId]).emit('driverAccepted', driver, driverDistance.distance.value, driverDistance.duration.value, travel.cost_best);
            else
                io.to(riders[riderId]).emit('driverAccepted', driver, 0, 0, travel.cost_best);
        
            console.log(travel);

             callback(travel) ;
        });

        socket.on('cancelRequest', async function () {
            let travelId = await mysql.travel.getTravelIdByRiderId(socket.decoded_token.id);
            let otherDriverIds = await redis.getRequestDrivers(travelId);
            for (let otherDriverId of otherDriverIds) {
                io.to(drivers[otherDriverId]).emit('cancelRequest', travelId);
            }
            await redis.expireRequest(travelId);
        });
        socket.on('buzz', async function () {
            io.to(riders[socket.riderId]).emit('driverInLocation');
        });
        socket.on('callRequest', async function (callback) {
            let callData;
            if (socket.decoded_token.prefix === driverPrefix)
                callData = await mysql.driver.getContactInformation(socket.decoded_token.id);
            else
                callData = await mysql.rider.getContactInformation(socket.decoded_token.id);
            redis.addCallRequest(callData, socket.decoded_token.prefix.substring(0, socket.decoded_token.prefix.length - 1));
            operatorsNamespace.emit('callRequested', callData);
            callback(200);
        });
        socket.on('startTravel', async function () {
            let [ignored, riderId, ignored1] = await Promise.all([
                mysql.travel.setStateByUserId(socket.decoded_token.prefix, socket.decoded_token.id, TRAVEL_STATE_STARTED),
                mysql.travel.getRiderIdByDriverId(socket.decoded_token.id),
                mysql.travel.getTravelIdByDriverId(socket.decoded_token.id)
            ]);
            io.to(riders[riderId]).emit('startTravel');
        });
        socket.on('finishedTaxi', async function (cost, time, distance, log, callback) {
            let travelId = await mysql.travel.getDriverTravelUnfinished(socket.decoded_token.id);
            let [ignored, riderId, travel] = await Promise.all([
                mysql.driver.setState(socket.decoded_token.id, DRIVER_STATE_ONLINE),
                mysql.travel.getRiderIdByDriverId(socket.decoded_token.id),
                mysql.getOneRow('travel', {id: travelId}),
            ]);
            let riderBalance = await mysql.rider.getBalance(riderId);
            let paid = false;
            let costAfterCoupon = cost;
            if (travel.rider_coupon_id != null) {
                let coupon = await mysql.getOneRow('coupon', {});
                let riderCoupon = await mysql.getOneRow('rider_coupon', {coupon_id: coupon.id});
                await mysql.updateRow('rider_coupon', {times_used: riderCoupon.times_used + 1}, riderCoupon.id);
                costAfterCoupon = costAfterCoupon * ((100 - coupon.discount_percent) / 100);
                costAfterCoupon = costAfterCoupon - coupon.discount_flat;
            }
            if (riderBalance >= costAfterCoupon) {
                let [ignored3, ignored4] = await Promise.all([
                    mysql.driver.chargeAccount(socket.decoded_token.id, 'travel', travelId, cost),
                    mysql.driver.chargeAccount(socket.decoded_token.id, 'commission', travelId, -(cost * (30 / 100))),
                    mysql.rider.chargeAccount(riderId, 'travel', '', -costAfterCoupon)
                ]);
                paid = true;
            }
            else if ('true' === 'true') {
                await mysql.driver.chargeAccount(socket.decoded_token.id, 'commission', travelId, -(cost * (30 / 100)));
            }
            await mysql.travel.finish(travel.id, paid, cost, costAfterCoupon, time, distance, log);
            callback(200, paid, costAfterCoupon);
            update.driver(io, socket.decoded_token.id);
            update.rider(io, riderId);
            io.to(riders[riderId]).emit('finishedTaxi', 200, paid, costAfterCoupon);
        });
        socket.on('cancelTravel', async function (callback) {
            let [ignored, otherPartyId] = await Promise.all([
                mysql.travel.cancel(socket.decoded_token.prefix, socket.decoded_token.id),
                socket.decoded_token.prefix === driverPrefix ? mysql.travel.getRiderIdByDriverId(socket.decoded_token.id) : mysql.travel.getDriverIdByRiderId(socket.decoded_token.id),
            ]);
            if(socket.decoded_token.prefix === driverPrefix) {
                mysql.driver.setState(socket.decoded_token.id, DRIVER_STATE_ONLINE)
            } else {
                mysql.driver.setState(otherPartyId, DRIVER_STATE_ONLINE)
            }
            let connectionId = (socket.decoded_token.prefix === driverPrefix ? riders[otherPartyId] : drivers[otherPartyId]);
            io.to(connectionId).emit('cancelTravel');
            callback(200);
        });
        socket.on('reviewDriver', async function (score, review, callback) {
            let [travelId, driverId] = await Promise.all([mysql.travel.getTravelIdByRiderId(socket.decoded_token.id), mysql.travel.getDriverIdByRiderId(socket.decoded_token.id)]);
            await Promise.all([mysql.driver.updateScore(driverId, score),
                mysql.driver.saveReview(travelId, driverId, review, score)]);
            callback(200);
        });
        socket.on('getTravels', async function (callback) {
            let result;
            if (socket.decoded_token.prefix === driverPrefix)
                result = await mysql.driver.getTravels(socket.decoded_token.id);
            else
                result = await mysql.rider.getTravels(socket.decoded_token.id);
            callback(200, result);
        });
        socket.on('editProfile', async function (user, callback) {
            try {
                await mysql.updateRow(socket.decoded_token.prefix, JSON.parse(user), socket.decoded_token.id);
                callback(200);
            }
            catch (err) {
                callback(666, err);
            }
        });
        socket.on('changeProfileImage', async function (buffer, callback) {
            try {
                let mediaId = await mysql.insertRow('media', {type: socket.decoded_token.prefix + ' image'});
                let mediaRow = await mysql.media.doUpload(buffer, mediaId);
                await mysql.updateRow(socket.decoded_token.prefix, {media_id: mediaId}, socket.decoded_token.id);
                callback(200, mediaRow);
            } catch (error) {
                callback(666, error);
            }

        });
        socket.on('changeHeaderImage', async function (buffer, callback) {
            try {
                let mediaId = await mysql.insertRow('media', {type: socket.decoded_token.prefix + ' header'});
                let mediaRow = await mysql.media.doUpload(buffer, mediaId);
                await mysql.updateRow(socket.decoded_token.prefix, {car_media_id: mediaId}, socket.decoded_token.id);
                callback(200, mediaRow);
            } catch (error) {
                callback(666, error);
            }
        });
        socket.on('travelInfo', async function (distance, duration, cost) {
            let location = await redis.getPosition(socket.decoded_token.id);
            let riderId = await mysql.travel.getRiderIdByDriverId(socket.decoded_token.id);
            let travel = await mysql.travel.getTravelByRiderId(riderId);
            let finalCost = travel.cost_best;

            io.to(riders[riderId]).emit('travelInfoReceived', distance, parseInt(duration), parseFloat(finalCost), parseFloat(location[0][1]), parseFloat(location[0][0]));
        });
        socket.on('getDriversLocation', async function (point, callback) {
            let result = await redis.getCloseDrivers(point);
            callback(200, result);
        });
        socket.on('chargeAccount', async function (type, token, amount, callback) {
            try {
                if (type === 'stripe') {
                    /** @namespace stripe.charges */
                    const stripeCharge = await stripe.charges.create({
                        amount: amount * 100,
                        currency: 'usd',
                        source: token,
                    });
                    if (socket.decoded_token.prefix === riderPrefix) {
                        await mysql.rider.chargeAccount(socket.decoded_token.id, type, token, amount);
                        await update.rider(io, socket.decoded_token.id);
                    } else {
                        await mysql.driver.chargeAccount(socket.decoded_token.id, type, token, amount);
                        await update.driver(io, socket.decoded_token.id);
                    }
                    const giftPer = parseInt(50000);
                    if (amount > giftPer) {
                        let gift = (amount / giftPer) * parseInt(5000);
                        if (socket.decoded_token.prefix === riderPrefix)
                            await mysql.rider.chargeAccount(riderId, 'gift', '-', gift);
                        else
                            await mysql.driver.chargeAccount(riderId, 'gift', '-', gift);
                    }
                    callback(200);
                }
                if(type === 'braintree') {
                    gateway.transaction.sale({
                        amount,
                        paymentMethodNonce: token,
                        options: {
                            submitForSettlement: true
                        }
                    }, async (err, result) => {
                        if (result.success) {
                            if (socket.decoded_token.prefix === riderPrefix) {
                                const giftPer = parseInt(50000);
                                if (amount > giftPer) {
                                    let gift = (amount / giftPer) * parseInt(5000);
                                    if (socket.decoded_token.prefix === riderPrefix)
                                        await mysql.rider.chargeAccount(riderId, 'gift', '-', gift);
                                    else
                                        await mysql.driver.chargeAccount(riderId, 'gift', '-', gift);
                                }
                                await mysql.rider.chargeAccount(socket.decoded_token.id, type, token, amount);
                                await update.rider(io, socket.decoded_token.id);
                            } else {
                                await mysql.driver.chargeAccount(socket.decoded_token.id, type, token, amount);
                                await update.driver(io, socket.decoded_token.id);
                            }
                            callback(200)
                        } else {
                            const transactionErrors = result.errors.deepErrors();
                            callback(666, transactionErrors);
                            return

                        }
                    });
                }
                
            } catch (error) {
                callback(666, error.message);
            }
        });
        socket.on('getStats', async function (timeQuery, callback) {
            let stats, report;
            switch (timeQuery) {
                case TIME_QUERY_DAILY:
                    [stats, report] = await Promise.all(
                        [
                            mysql.driver.getDailyStats(socket.decoded_token.id),
                            mysql.driver.getDailyReport(socket.decoded_token.id)
                        ]);
                    break;
                case TIME_QUERY_WEEKLY:
                    [stats, report] = await Promise.all(
                        [
                            mysql.driver.getWeeklyStats(socket.decoded_token.id),
                            mysql.driver.getWeeklyReport(socket.decoded_token.id)
                        ]);
                    break;

                case TIME_QUERY_MONTHLY:
                    [stats, report] = await Promise.all(
                        [
                            mysql.driver.getMonthlyStats(socket.decoded_token.id),
                            mysql.driver.getMonthlyReport(socket.decoded_token.id)
                        ]);
                    break;
                default:
                    callback(401, '', '');
                    break;
            }
            callback(200, stats[0][0], report[0]);
        });

        socket.on('requestPayment', async function (callback) {
            let [hasPending, driverInfo] = await Promise.all([mysql.payments.driverHasPending(socket.decoded_token.id), mysql.payments.getDriverUnpaidAmount(socket.decoded_token.id)]);
            if (hasPending) {
                callback(901);
                return;
            }
            if (parseInt(driverInfo.balance) < parseInt(50)) {
                callback(902);
                return;
            }
            /** @namespace driverInfo.balance */
            /** @namespace driverInfo.account_number */
            await mysql.payments.requestPayment(socket.decoded_token.id, driverInfo.balance, driverInfo.account_number);
            callback(200);
            update.operatorStats();
        });
        socket.on('hideTravel', async function (travelId, callback) {
            let result = await mysql.travel.hideTravel(travelId);
            if (result)
                callback(200);
            else
                callback(666);
        });
        socket.on('writeComplaint', async function (travelId, subject, content, callback) {
            await mysql.insertRow('complaint', {
                travel_id: travelId,
                requested_by: socket.decoded_token.prefix,
                subject: subject,
                content: content
            });
            callback(200);
        });
        socket.on('crudAddress', async function (mode, address, callback) {
            let result = await mysql.address.crud(mode, address, socket.decoded_token.id);
            callback(200, result);
        });
        socket.on('getCoupons', async function (callback) {
            try {
                let result = await mysql.getRows('rider_coupon', {rider_id: socket.decoded_token.id});
                result = await result.map(x => x.coupon);
                callback(200, result);
            }
            catch (e) {
                callback(666, e.message);
            }
        });
        socket.on('addCoupon', async function (code, callback) {
            try {
                let coupon = await mysql.getOneRow('coupon', {code: code});
                if (!coupon) {
                    callback(704); // 704 Means there was no such code
                    return;
                }
                let riderCoupon = await mysql.getOneRow('rider_coupon', {coupon_id: coupon.id});
                if (riderCoupon != null) {
                    callback(703); // Coupon is already used
                    return;
                }
                if (Date.parse(coupon.expiration_at) < Date.now()) {
                    callback(702); // Coupon is expired
                    return;
                }
                await mysql.insertRow('rider_coupon', {rider_id: socket.decoded_token.id, coupon_id: coupon.id});
                callback(200);
            }
            catch (e) {
                if (Number.isNaN(e.message))
                    callback(666, e.message);
                else
                    callback(e.message);
            }
        });
        socket.on('applyCoupon', async function (code, callback) {
            try {
                let coupon = await mysql.getOneRow('coupon', {code: code});
                let riderCoupon = await mysql.getOneRow('rider_coupon', {coupon_id: coupon.id});
                let travel = await mysql.travel.getTravelByRiderId(socket.decoded_token.id);
                await mysql.updateRow('travel', {rider_coupon_id: riderCoupon.id}, travel.id);
                let finalCost = travel.cost_best;
                finalCost = finalCost * ((100 - coupon.discount_percent) / 100);
                finalCost = finalCost - coupon.discount_flat;
                callback(200, finalCost);
            }
            catch (e) {
                if (Number.isNaN(e.message))
                    callback(666, e.message);
                else
                    callback(e.message);
            }
        });
        socket.on('getPromotions', async function (callback) {
            try {
                let result = await sql.query('SELECT * FROM promotion WHERE start_timestamp < current_timestamp AND expiration_timestamp > current_timestamp');
                result = await mysql.attachForeignKey(result[0], foreignKeys['promotion']);
                callback(200, result);
            }
            catch (e) {
                callback(666, e.message);
            }
        });
        socket.on('getTransactions', async function (callback) {
            try {
                let result = await sql.query('SELECT * FROM ' + socket.decoded_token.prefix + '_transaction' + ' WHERE ' + socket.decoded_token.prefix + '_id = ' + socket.decoded_token.id + ' ORDER BY id desc LIMIT 50', []);
                callback(200, result[0]);
            } catch (e) {
                callback(e.message);
            }
        });
        /**********************new routs***********************/
        

        socket.on('getCities', async function (Lang_ID,callback) {
            try {
                console.log('oooooooooooooooo')
                console.log(Lang_ID);
                let result = await mysql.getRows('GetCitiy_View',{CityLang_Language_ID:Lang_ID});
                callback(200, result);
            }
            catch (e) {
                callback(666, e.message);
            }
        });

        socket.on('getCategories', async function (Lang_ID,callback) {
            try {
                let result = await mysql.getRows('GetCategories_View',{CategoryLang_Language_ID:Lang_ID});
                // console.log(result);
                // result = await result.map(x => x.coupon);
                callback(200, result);
            }
            catch (e) {
                callback(666, e.message);
            }
        });

        socket.on('getSuppliers', async function (callback) {
            try {
                let result = await mysql.getRows('Trips_Suppliers','');
                // result = await result.map(x => x.coupon);
                callback(200, result);
            }
            catch (e) {
                callback(666, e.message);
            }
        });

        socket.on('getClasses', async function (callback) {
            try {
                let result = await mysql.getRows('LUT_Classes','');
                // result = await result.map(x => x.coupon);
                callback(200, result);
            }
            catch (e) {
                callback(666, e.message);
            }
        });
        
        socket.on('getTrip', async function (Lang_ID,Supplier_Trip_Trip_ID,callback) {
            try {

                let result = await mysql.trip.getOneRow(Lang_ID,Supplier_Trip_Trip_ID);
                callback(200, result[0]);
            }
            catch (e) {
                callback(666, e.message);
            }
        });

        socket.on('getFeaturedTrips', async function (Lang_ID,City_Id,callback) {
            try {
                
                let result = await mysql.trip.getFeaturedTrips(Lang_ID,City_Id);
                callback(200, result);
            }
            catch (e) {
                callback(666, e.message);
            }
        });

        socket.on('getTripsByCategory', async function (Lang_ID,Category_ID,City_Id,callback) {
            try {

                let result = await mysql.trip.getTripsByCategory(Lang_ID,Category_ID,City_Id);
                callback(200, result);
            }
            catch (e) {
                callback(666, e.message);
            }
        });

        socket.on('getTripsByTag', async function (Tag_ID,callback) {
            try {

                let result = await mysql.getRows('Trip_Trips_Tags',{Trips_Tags_Tag_ID:Tag_ID});
                callback(200, result);
            }
            catch (e) {
                callback(666, e.message);
            }
        });

        socket.on('getTripsByName', async function (Lang_ID,text,callback) {
            try {

                let result = await mysql.trip.searchTrip(Lang_ID,text);
                callback(200, result);
            }
            catch (e) {
                callback(666, e.message);
            }
        });

        socket.on('SaveReservation', async function (buffers,json,callback) {
            try {
                let result = await mysql.trip.save(json);
                if (buffers != ''){
                    for (let buffer of buffers)
                        await mysql.trip.doUpload(buffer,result[0].reservation_id);
                }
                callback(200, 'success');
            }
            catch (e) {
                callback(666, e.message);
            }
        });

        socket.on('AvailableTrip', async function (Lang_ID,date,count,callback) {
            try {
                let result = await mysql.trip.getAvailableTrip(Lang_ID,date,count);
                callback(200, result);
            }
            catch (e) {
                callback(666, e.message);
            }
        });

        socket.on('MyReservationTrips', async function (Lang_ID,rider_id,callback) {
            try {
                let result = await mysql.trip.ReservationTrips(Lang_ID,rider_id);
                callback(200, result);
            }
            catch (e) {
                callback(666, e.message);
            }
        });

        socket.on('getComplainDepartment', async function (callback) {
            try {
                let result = await mysql.getRows('LUT_Complain_Department','');
                callback(200, result);
            }
            catch (e) {
                callback(666, e.message);
            }
        });

        socket.on('SaveComplain', async function (buffers,json,callback) {
            try {
                let result = await mysql.trip.saveComplain(json);
                if (buffers != '' ){ 
                    for (let buffer of buffers)
                        await mysql.trip.doUploadComplain(buffer,result.argument_id);
                }
                callback(200, 'success');
            }
            catch (e) {
                callback(666, e.message);
            }
        });

        socket.on('getMyComplain', async function (callback) {
            try {
                let result = await mysql.trip.getComplain(socket.decoded_token.id);
                callback(200, 'success');
            }
            catch (e) {
                callback(666, e.message);
            }
        });

    });
    return io;
};