const redis = require('../models/redis');
const socketioJwt = require('socketio-jwt');

module.exports = function (io) {
    return io.of('/operators').use(socketioJwt.authorize({
        secret: jwtToken,
        handshake: true
    })).on('connection', function (socket) {
        mysql.operator.getStatus(socket.decoded_token.id).then(function (result) {
            if (result === 'disabled') {
                socket.error('301');
                socket.disconnect();
            }
            if (result === 'updated') {
                socket.error('302');
                socket.disconnect();
            }
        });
        // socket.on('getAllCountries', async function (callback) {
        //     let countries = await mysql.country.getAllCountries();
        //     console.log(countries[0]);
        //     callback(countries[0]);
        // });

        // socket.on('getAllTags', async function (callback) {
        //     let tags = await mysql.country.getAllTags();
        //     callback(tags[0]);
        // });

        // socket.on('getAllClasses', async function (callback) {
        //     let classes = await mysql.country.getAllClasses();
        //     callback(classes[0]);
        // });

      
        socket.on('getActiveRows', async function (table,action,column, callback) {
            let operator = await mysql.getOneRow('operator', {id: socket.decoded_token.id});
            if (operator['operator_permission'].indexOf('can' + action + table) < 0) {
                callback(410);
                return;
            }
            try {
                let result = await mysql.country.getActiveRows(table, column);
                callback(200, result[0]);
            } catch (error) {
                if(error.message !== undefined)
                    callback(666, error.message);
                else
                    callback(666,error);
            }
        });
        
    });
};