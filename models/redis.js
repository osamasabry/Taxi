const redisObject = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redisObject.RedisClient.prototype);
bluebird.promisifyAll(redisObject.Multi.prototype);
const redis = redisObject.createClient('6379', 'localhost');
if(process.env.REDIS_PASSWORD)
    redis.auth(process.env.REDIS_PASSWORD);
redis.on("connect", function () {
    console.log('Redis Connected');
});
redis.on("Error", function (err) {
    console.log(err);
});
module.exports = {
    getPosition: async function (driverId) {
        return await redis.geoposAsync('drivers', driverId);
    },
    getCloseDrivers: async function (position) {
        return await redis.georadiusAsync('drivers', position.x, position.y, 10000, 'm', 'WITHDIST', 'WITHCOORD');
    },
    getAllDrivers: async function (position) {
        return await redis.georadiusAsync('drivers', position.x, position.y, '22000', 'km', 'WITHDIST', 'WITHCOORD');
    },
    setLocation: async function (userId, lat, lng) {
        await redis.geoaddAsync('drivers', lng, lat, userId);
    },
    deleteLocation: async function (userId) {
        await redis.zremAsync('drivers', userId);
    },
    addCallRequest: async function (callData, from) {
        redis.hmsetAsync('complaint:' + callData.id, ['id', callData.id, 'driverNumber', callData.driverNumber, 'driverName', callData.driverName ? callData.driverName : "Unknown", 'riderNumber', callData.riderNumber, 'riderName', callData.riderName ? callData.riderName : "Unknown", 'from', from]);
        redis.expireAsync('complaint:' + callData.id, 150);
    },
    getCallRequests: async function (from, pageSize) {
        let keys = await redis.keysAsync('complaint:*');
        let result = [];
        for (key of keys) {
            result.push(redis.hgetallAsync(key));
        }
        return result;
    },
    deleteCallRequests: async function (Ids) {
        Ids = Ids.map(x => 'complaint:' + x);
        return redis.delAsync(Ids);
    },
    newRequest: async function (driverId, requestId, requestDetails) {
        await redis.saddAsync('driverRequests:' + driverId, requestId);
        await redis.expireAsync('driverRequests:' + driverId, 180); // Expires a request after three minutes (60*3)
        await redis.saddAsync('requestDrivers:' + requestId, driverId);
        await redis.expireAsync('requestDrivers:' + requestId, 180); // Expires a request after three minutes (60*3)
        requestDetails.travel = JSON.stringify(requestDetails.travel);
        await redis.hmsetAsync('request:' + requestId + ":" + driverId, requestDetails);
        await redis.expireAsync('request:' + requestId + ":" + driverId, 180) // Expires a request after three minutes (60*3)
    },
    getDriverRequests: async function (driverId) {
        let requestIds = await redis.smembersAsync('driverRequests:' + driverId);
        let requests = [];
        for (let requestId of requestIds) {
            let request = await redis.hgetallAsync('request:' + requestId + ":" + driverId);
            if (request)
                requests.push(request);
        }
        return requests;
    },
    getRequestDrivers: async function (requestId) {
        let driverIds = await redis.smembersAsync('requestDrivers:' + requestId);
        if (!driverIds)
            return [];
        return driverIds;
    },
    expireRequest: async function (requestId) {
        let driverIds = await redis.smembersAsync('requestDrivers:' + requestId);
        for(let driverId of driverIds) {
            redis.expireAsync('request:' + requestId + ':' + driverId, -1);
            redis.srem('driverRequests:' + driverId, requestId);
        }
        redis.expireAsync('requestDrivers:' + requestId, -1);

    }
};


