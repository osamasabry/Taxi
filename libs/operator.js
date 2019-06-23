const redis = require('../models/redis');
const socketioJwt = require('socketio-jwt');
const update = require('../libs/update-handler');
global.foreignKeys = {
    'service':
        {
            'media_id': 'media'
        },
    'car':
        {
            'media_id': 'media'
        },
    'driver':
        {
            'car_id': 'car',
            'media_id': 'media',
            'car_media_id': 'media'
        },
    'rider':
        {
            'media_id': 'media'
        },
    'travel':
        {
            'driver_id': 'driver',
            'rider_id': 'rider',
            'rider_coupon_id': 'rider_coupon'
        },
    'rider_coupon':
        {
            'coupon_id':'coupon',
            'rider_id':'rider'
        },
    'promotion':
        {
            'media_id':'media'
        },
    'payment_request':
        {
            'driver_id':'driver'
        },
    'Cities':
        {
            'City_Country_ID':'Countries'
        },
    'Reservation_Attachments':
        {
            'Attachment_Reservation_ID':'Trips_Reservations'
        },
    'Trips':
        {
            'Trip_City_ID':'Cities',
        },
    'Trips_Busy':
        {
            'Trips_Busy_Reservation_ID':'Trips_Reservations',
            'Trips_Busy_Supplier_Trip_ID':'Trips_Supplier_Trips'
        },
    'Trips_Review':
        {
            'Trips_Review_Reservation_ID':'Trips_Reservations',
        },
    'Trips_Suppliers':
        {
            'Supplier_Class_ID':'LUT_Classes',
            'Supplier_City_ID':'Cities',
        },
    'Trips_Supplier_Trips':
        {
            'Supplier_Trip_Supplier_ID':'Trips_Suppliers',
            'Supplier_Trip_Trip_ID':'Trips',
        },
    'Trip_Trips_Categories':
        {
            'Trips_Trip_ID':'Trips',
            'Trips_Categories_Category_ID':'Trips_Categories',
        },
    'Trip_Trips_Tags':
        {
            'Trips_Trip_ID':'Trips',
            'Trips_Tags_Tag_ID':'Trips_Tags',
        },
     'Trips_Reservations':
        {
            'Reservation_PaymentMethod_ID':'LUT_Payment_Methods',
            'Reservation_Status_ID':'LUT_Reservation_Status',
            'Reservation_Supplier_Trip_ID':'Trips_Supplier_Trips',
            'Reservation_Rider_ID':'rider'
        },
    'Trips_Supplier_Calendar':
        {
            'Supplier_Trip_Calendar_Supplier_Trip_ID':'Trips_Supplier_Trips'
        },
    'Trips_Reservation_Supplier_Financials':
        {
            'Reservation_Supplier_Financials_ActionID':'Trips_Reservations',
            'Reservation_Supplier_Financials_ActionType_ID':'LUT_Reservation_Financials_ActionTypes',
            'Reservation_Supplier_Financials_Supplier_ID':'Trips_Suppliers'
        },
    'Trips_Supplier_Users':
        {
            'Trips_Supplier_User_Supplier_ID':'Trips_Suppliers'
        },

     'Trips_Supplier_Withdraw_Requests':
        {
            'Withdraw_Request_Status_ID':'LUT_Supplier_Withdraw_Request_Status',
            'Withdraw_Supplier_ID':'Trips_Suppliers'
        },
    'Trips_Supplier_Withdraw':
        {
            'Withdraw_Withdraw_Request_ID':'Trips_Supplier_Withdraw_Requests',
            'Withdraw_Supplier_ID':'Trips_Suppliers'
        },
    'Complain':
        {
            'Complain_Reservation_ID':'Trips_Reservations',
            'Complain_Travel_ID':'travel',
            'Complain_CloseType_ID':'LUT_Complain_CloseType',
            'Complain_ComplainDepartment_ID':'LUT_Complain_Department',
            'Complain_Status_ID':'LUT_Complain_Status',
            'Complain_Rider_ID':'rider',
            'Complain_Driver_ID':'driver'
        },   
        
};
module.exports = function (io) {
    return io.of('/operators').use(socketioJwt.authorize({
        secret: jwtToken,
        handshake: true
    })).on('connection', function (socket) {
        mysql.operator.getStatusOperator(socket.decoded_token.id).then(function (result) {
            if (result === 'disabled') {
                socket.error('301');
                socket.disconnect();
            }
            if (result === 'updated') {
                socket.error('302');
                socket.disconnect();
            }
        });
        socket.on('getAllCars', async function (callback) {
            let cars = await mysql.operator.getAllCars();
            callback(cars[0]);
        });

        socket.on('getRows', async function (table,action ,filers, sort, from, pageSize, fullTextFields, fullTextValue, callback) {
            
            if (fullTextValue === null && fullTextFields === null) {
                callback(100);
                return;
            }
            let operator = await mysql.getOneRow('operator', {id: socket.decoded_token.id});
            // if (operator['permission_' + table] !== undefined && operator['permission_' + table].indexOf('view') < 0) {
            
            if (operator['operator_permission'].indexOf('can' + action + table) < 0) {
                callback(410);
                return;
            }
            try {
                // console.log('*******************');
                let result = await mysql.getRowsCustom(table, filers, sort, from, pageSize, fullTextFields, fullTextValue);
                /*if (foreignKeys[table])
                    result = await mysql.attachForeignKey(result, foreignKeys[table]);*/
                callback(200, result);
            } catch (error) {
                if(error.message !== undefined)
                    callback(666, error.message);
                else
                    callback(666,error);
            }
        });
        

        socket.on('getRowsSupplier', async function (table,action ,filers, sort, from, pageSize, fullTextFields, fullTextValue, callback) {
            
            if (fullTextValue === null && fullTextFields === null) {
                callback(100);
                return;
            }
            let supplier = await mysql.getOneRow('Trips_Supplier_Users', {id: socket.decoded_token.id});
            // if (operator['permission_' + table] !== undefined && operator['permission_' + table].indexOf('view') < 0) {
            
            if (supplier['Trips_Supplier_User_Permissions'].indexOf('can' + action + table) < 0) {
                callback(410);
                return;
            }
            try {
                let result = await mysql.getRowsCustom(table, filers, sort, from, pageSize, fullTextFields, fullTextValue);
                /*if (foreignKeys[table])
                    result = await mysql.attachForeignKey(result, foreignKeys[table]);*/
                callback(200, result);
            } catch (error) {
                if(error.message !== undefined)
                    callback(666, error.message);
                else
                    callback(666,error);
            }
        });
        socket.on('saveRow', async function (table,action ,row, callback) {
            try {
                let operator = await mysql.getOneRow('operator', {id: socket.decoded_token.id});
                // if (operator['permission_' + table] !== undefined && operator['permission_' + table].indexOf('update') < 0) {
                if (operator['operator_permission'].indexOf('can' + action + table) < 0) {
                   
                    callback(411);
                    return;
                }
                //TODO:Dirty fix for null id rows. do it properly
                if (row.media_id !== undefined && row.media_id === "")
                    delete row.media_id;
                if (row.car_id !== undefined && row.car_id === "")
                    delete row.car_id;
                if (row.id !== undefined && row.id !== 0 && row.id !== "") {
                    let id;
                    if (Array.isArray(row.id))
                        id = row.id[0];
                    else
                        id = row.id;
                    delete row.id;
                    let result = await mysql.updateRow(table, row, id);
                    callback(200, result);
                    return;
                }
                if (row.id)
                    delete row.id;

                var result = '';
                if (table =='Trips_Suppliers'){
                    let password = row.Trips_Supplier_User_Password;
                    delete row.Trips_Supplier_User_Password;
                    let id = await mysql.insertRow(table, row);
                     result = await mysql.supplier.insertUserSupplier(row,password,id);
                    console.log(result);
                }else{
                     result = await mysql.insertRow(table, row);
                }
                callback(200, result);

            } catch (error) {
                if(error.message !== undefined)
                    callback(666, error.message);
                else
                    callback(666,error);
            }
        });

        socket.on('saveRowSupplier', async function (table,action ,row, callback) {
            try {
                let supplier = await mysql.getOneRow('Trips_Supplier_Users', {id: socket.decoded_token.id});
                // if (operator['permission_' + table] !== undefined && operator['permission_' + table].indexOf('update') < 0) {
                if (supplier['Trips_Supplier_User_Permissions'].indexOf('can' + action + table) < 0) {
                   
                    callback(411);
                    return;
                }
                //TODO:Dirty fix for null id rows. do it properly
                if (row.media_id !== undefined && row.media_id === "")
                    delete row.media_id;
                if (row.car_id !== undefined && row.car_id === "")
                    delete row.car_id;
                if (row.id !== undefined && row.id !== 0 && row.id !== "") {
                    let id;
                    if (Array.isArray(row.id))
                        id = row.id[0];
                    else
                        id = row.id;
                    delete row.id;
                    let result = await mysql.updateRow(table, row, id);
                    callback(200, result);
                    return;
                }
                if (row.id)
                    delete row.id;

                let result = await mysql.insertRow(table, row);

                callback(200, result);

            } catch (error) {
                if(error.message !== undefined)
                    callback(666, error.message);
                else
                    callback(666,error);
            }
        });
        socket.on('deleteRows', async function (table, Ids, callback) {
            try {
                let operator = await mysql.getOneRow('operator', {id: socket.decoded_token.id});
                if (operator['operator_permission'].indexOf('can' + action + table) < 0) {
                    callback(412);
                    return;
                }
                let result = await mysql.deleteRows(table, Ids);
                callback(200, result);
            } catch (error) {
                if(error.message !== undefined)
                    callback(666, error.message);
                else
                    callback(666,error);
            }
        });
        socket.on('deleteRowsCustom', async function (table, filter, callback) {
            try {
                let operator = await mysql.getOneRow('operator', {id: socket.decoded_token.id});
                if (operator['operator_permission'].indexOf('can' + action + table) < 0) {
                    callback(412);
                    return;
                }
                let result = await mysql.deleteRowsCustom(table, filter);
                callback(200, result);
            } catch (error) {
                callback(666, error);
            }
        });
        socket.on('getCallRequests', async function (from, pageSize, callback) {
            let callRequests = await redis.getCallRequests(from, pageSize);
            let result = await Promise.all(callRequests);
            callback(result);
        });
        socket.on('deleteCallRequests', async function (Ids, callback) {
            await redis.deleteCallRequests(Ids);
            callback(200);
        });
        socket.on('markPaymentRequestsPaid', async function (Ids, callback) {
            let driverIds = await mysql.driver.markPaymentRequestsPaid(Ids);
            update.operatorStats();
            for (let driverId of driverIds)
                update.driver(io, driverId);
            callback(200);
        });
        socket.on('getReviews', async function (driverId, callback) {
            callback((await mysql.operator.getDriverReviews(driverId))[0]);
        });
        socket.on('getDriversTransactions', async function (driverId, callback) {
            let result = await mysql.driver.getTransactions(driverId);
            callback(result);
        });
        socket.on('chargeDriver', async function (json, callback) {
            await mysql.driver.chargeAccount(json.driver_id, json.transaction_type, json.document_number, json.amount);
            update.driver(io, json.driver_id);
            callback(200);
        });
        socket.on('chargeRider', async function (json, callback) {
            await mysql.rider.chargeAccount(json.rider_id, json.transaction_type, json.document_number, json.amount);
            update.rider(io, json.rider_id);
            callback(200);
        });
        socket.on('markComplaintsReviewed', async function (Ids, callback) {
            await mysql.operator.markComplaintsReviewed(Ids);
            callback(200);
        });
        socket.on('getDriversLocation', async function (point, callback) {
            try {
                let result = await redis.getAllDrivers(point);
                result = result.map(x => {
                    return {lat: x[2][1], lng: x[2][0]}
                });
                callback(200, result);
            }
            catch (err) {
                console.log(err.message);
            }
        });
        socket.on('setColumnValue', async function (tableName, id, column, value, callback) {
            try {
                if (process.env.TEST_MODE && process.env.TEST_MODE === "true" && tableName === "operator")
                    return;
                switch (tableName) {
                    case('operator'):
                        mysql.operator.setStatus(id, 'updated');
                        break;
                    case('driver'):
                        update.driver(io, id);
                        break;
                    case ('rider'):
                        update.rider(io, id);
                        break;
                }
                let result = await mysql.operator.setColumnValue(tableName, id, column, value);
                if (result)
                    callback(200);
                else
                    callback(666);
            } catch (error) {
                callback(666, error);
            }
        });
        socket.on('updateMedia', async function (buffers, table,type,row, callback) {
            try {

                let icon = '';
                let  featrured  ='';

                let cover_page ='';
                let featured_web ='';

                if (buffers[0].icon != null && buffers[0].icon != '') {
                     icon = await mysql.media.doUpload(buffers[0].icon,type,table);
                }
                if(buffers[1].featrured != null && buffers[1].featrured != ''){
                    featrured  = await mysql.media.doUpload(buffers[1].featrured,type,table);
                }

                if (buffers[2].coverPage != null && buffers[2].coverPage != '') {
                        cover_page  = await mysql.media.doUpload(buffers[2].coverPage,type,table);
                }

                if (table != 'Trips') {
                    if (buffers[3].featuredWeb != null && buffers[3].featuredWeb != '') {
                        featured_web  = await mysql.media.doUpload(buffers[3].featuredWeb,type,table);
                    }
                }

                if (table == 'Trips_Categories') {
                    if (buffers[0].icon != '') {
                        row.Category_Icon_Image_Name = icon; 
                    }
                    if (buffers[1].featrured != '') {
                        row.Category_Featrured_Image_Name = featrured; 
                    }
                    if (buffers[2].coverPage != '') {
                        row.Category_CoverPage_Name = cover_page; 
                    }
                    if (buffers[3].featuredWeb != '') {
                        row.Category_Featured_Image_Web = featured_web; 
                    }

                }else if (table == 'Trips') {
                    if (buffers[0].icon != '') {
                        row.Trip_Thumbnail_Image_Name = icon; 
                    }
                    if (buffers[1].featrured != '') {
                        row.Trip_OnTripIsFeatured_Image_Name = featrured; 
                    }
                    if (buffers[2].coverPage != '') {
                        row.Trip_CoverPage_Name = cover_page; 
                    }
                }else if (table == 'Cities') {
                    if (buffers[0].icon != '') {
                        row.City_Icon_Image_Name = icon; 
                    }
                    if (buffers[1].featrured != '') {
                        row.City_Featrured_Image_Name = featrured; 
                    }
                    if (buffers[2].coverPage != '') {
                        row.City_CoverPage_Name = cover_page; 
                    }
                    if (buffers[3].featuredWeb != '') {
                        row.City_Featured_Image_Web = featured_web; 
                    }
                }
                   
                
                if (row.id !== undefined && row.id !== 0 && row.id !== "") {
                    let id;
                    if (Array.isArray(row.id))
                        id = row.id[0];
                    else
                        id = row.id;
                    delete row.id;
                    let result = await mysql.updateRow(table,row, id);
                    callback(200, result);
                    return;
                }

                // callback(200);
            } catch (error) {
                callback(666, error);
            }
        });
        socket.on('newMedia', async function (buffers,table,type,row, callback) {
            try {

                let  icon  = await mysql.media.doUpload(buffers[0].icon,type,table);
                let  featrured  = await mysql.media.doUpload(buffers[1].featrured,type,table);
                let  cover_page  = await mysql.media.doUpload(buffers[2].coverPage,type,table);

                let featured_web ='';

                if (table != 'Trips') {
                    featured_web  = await mysql.media.doUpload(buffers[3].featuredWeb,type,table);
                }

                if (table == 'Trips_Categories') {
                    row.Category_Icon_Image_Name = icon; 
                    row.Category_Featrured_Image_Name = featrured; 
                    row.Category_CoverPage_Name = cover_page; 
                    row.Category_Featured_Image_Web = featured_web;
                }else if (table == 'Trips') {
                    row.Trip_Thumbnail_Image_Name = icon; 
                    row.Trip_OnTripIsFeatured_Image_Name = featrured;
                    row.Trip_CoverPage_Name = cover_page; 
                }else if (table == 'Cities') {
                    row.City_Icon_Image_Name = icon; 
                    row.City_Featrured_Image_Name = featrured;
                    row.City_CoverPage_Name = cover_page; 
                    row.City_Featured_Image_Web = featured_web; 
                }
                
                let mediaId = await mysql.insertRow(table, row);
                callback(200,mediaId);
            } catch (error) {
                callback(666, error);
            }
        });

        socket.on('TripMedia', async function (buffers,table,type,row, callback) {
            try {
           
                let ArrayOfIds = [];
                if (buffers[0].slider1.length > 0) 
                    ArrayOfIds.push (await mysql.media.doUpload(buffers[0].slider1,type,table));
                if (buffers[1].slider2.length > 0) 
                    ArrayOfIds.push (await mysql.media.doUpload(buffers[1].slider2,type,table));
                if (buffers[2].slider3.length > 0) 
                    ArrayOfIds.push (await mysql.media.doUpload(buffers[2].slider3,type,table));
                if (buffers[3].slider4.length > 0) 
                    ArrayOfIds.push (await mysql.media.doUpload(buffers[3].slider4,type,table));
                if (buffers[4].slider5.length > 0) 
                    ArrayOfIds.push (await mysql.media.doUpload(buffers[4].slider5,type,table)); 
                 if (buffers[5].slider6.length > 0) 
                    ArrayOfIds.push (await mysql.media.doUpload(buffers[5].slider6,type,table));
                 if (buffers[6].slider7.length > 0) 
                    ArrayOfIds.push (await mysql.media.doUpload(buffers[6].slider7,type,table));
                 if (buffers[7].slider8.length > 0) 
                    ArrayOfIds.push (await mysql.media.doUpload(buffers[7].slider8,type,table));
                 if (buffers[8].slider9.length > 0) 
                    ArrayOfIds.push (await mysql.media.doUpload(buffers[8].slider9,type,table));
                 if (buffers[9].slider10.length > 0) 
                    ArrayOfIds.push (await mysql.media.doUpload(buffers[9].slider10,type,table));
                 
                for (let Id of ArrayOfIds){
                    row.Trip_Attachment_FilePath =Id;
                    await mysql.insertRow(table, row);
                }
                callback(200);
                // let mediaId = await mysql.insertRow(table, row);
                // callback(200);
            } catch (error) {
                callback(666, error);
            }
        });
        socket.on('updateOperatorPassword', async function (oldPass, newPass, callback) {
            if (process.env.TEST_MODE && process.env.TEST_MODE === "true")
                return;
            let result = (await mysql.operator.updateOperatorPassword(socket.decoded_token.id, oldPass, newPass))[0];
            if (result.affectedRows === 1) {
                callback(200);
            }
            else {
                callback(403);
            }
        });
        socket.on('getStats', async function (callback) {
            let [result, ignored] = await sql.query("SELECT (SELECT COUNT(*) FROM driver) as drivers, (SELECT COUNT(*) FROM travel) as travels, (SELECT COUNT(*) FROM rider) as riders,(SELECT COUNT(*) FROM complaint WHERE is_reviewed = FALSE) AS complaints_waiting");
            callback(result[0]);
        });
        socket.on('getConfigs', async function (callback) {
            let result = {
                max_drivers: 10,
                max_distance: 10000,
                minimum_payment_request: 50,
                percent_company: 30,
                cash_payment_commission: true,
                rider_min_ver_ios: 1,
                driver_min_ver_ios: 1,
                rider_min_ver_android: 9,
                driver_min_ver_android: 9
            };
            callback(result);
        });

        // ********************new routes*****************************

        socket.on('updateStatusReservation', async function (status_code,reserv_id,callback) {
            try {
                let result = await mysql.trip.updateStatusReservation(status_code,reserv_id);
                callback(200, result);
            }
            catch (err) {
                console.log(err.message);
            }

        });
    });
};