const redis = require('../models/redis');
const socketioJwt = require('socketio-jwt');

module.exports = function (io) {
    return io.of('/suppliers').use(socketioJwt.authorize({
        secret: jwtToken,
        handshake: true
    })).on('connection', function (socket) {
        // mysql.supplier.getStatus(socket.decoded_token.id).then(function (result) {
        //     if (result === 'disabled') {
        //         socket.error('301');
        //         socket.disconnect();
        //     }
        //     if (result === 'updated') {
        //         socket.error('302');
        //         socket.disconnect();
        //     }
        // });

        socket.on('saveRowSupplier', async function (table,action ,row, callback) {
            try {
                let supplier = await mysql.getOneRow('Trips_Supplier_Users', {id: socket.decoded_token.id});
                // if (supplier['Trips_Supplier_User_Permissions'].indexOf('can' + action + table) < 0) {
                //     callback(411);
                //     return;
                // }
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

        socket.on('getRowsSupplier', async function (table,action ,filers, sort, from, pageSize, fullTextFields, fullTextValue, callback) {
            
            if (fullTextValue === null && fullTextFields === null) {
                callback(100);
                return;
            }
            let supplier = await mysql.getOneRow('Trips_Supplier_Users', {id: socket.decoded_token.id});
            // if (operator['permission_' + table] !== undefined && operator['permission_' + table].indexOf('view') < 0) {
            
            // if (supplier['Trips_Supplier_User_Permissions'].indexOf('can' + action + table) < 0) {
            //     callback(410);
            //     return;
            // }
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

        socket.on('updateSupplierPassword', async function (oldPass, newPass, callback) {
            if (process.env.TEST_MODE && process.env.TEST_MODE === "true")
                return;
            let result = (await mysql.supplier.updateSupplierPassword(socket.decoded_token.id, oldPass, newPass))[0];
            if (result.affectedRows === 1) {
                callback(200);
            }
            else {
                callback(403);
            }
        });

        socket.on('updateStatusReservation', async function (status_code,reserv_id,callback) {
            try {
                let result = await mysql.trip.updateStatusReservation(status_code,reserv_id);
                callback(200, result);
            }
            catch (err) {
                console.log(err.message);
            }

        });

        socket.on('stopReservation', async function (date,trip_supplier_id,callback) {
            try {
                let result = await mysql.supplier.stopReservation(date,trip_supplier_id);
                callback(200, result);
            }
            catch (e) {
                callback(666, e.message);
            }
        });

        socket.on('restartReservation', async function (date,trip_supplier_id,callback) {
            try {
                let result = await mysql.supplier.restartReservation(date,trip_supplier_id);
                callback(200, result);
            }
            catch (e) {
                callback(666, e.message);
            }
        });

        socket.on('getReservationTripsSupplier', async function (city_id,date,supplier_id,callback) {
            try {
                let result = await mysql.supplier.getReservationTripsSupplier(city_id,date,supplier_id);
                callback(200, result);
            }
            catch (e) {
                callback(666, e.message);
            }
        });
        
    });
};