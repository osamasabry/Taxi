/** @namespace socket.decoded_token */
const cors = require('cors')();
const express = require('express');
const rp = require('request-promise-any');
const app = express();
app.enable('trust proxy');
require('dotenv').config();

const _dbm = require('db-migrate');

// console.log(_dbm.getInstance());
global.dbMigrate = _dbm.getInstance(true);
// console.log('ppp');

const bluebird = require('bluebird');
global.fs = bluebird.promisifyAll(require("fs"));
global.OneSignal = require('onesignal-node');

global.notificationClient = new OneSignal.Client({
    // userAuthKey: process.env.ONESIGNAL_USER_AUTH_KEY,
    userAuthKey:'OWM1YmE1ZDctMmY4Yy00NjIyLTkyY2QtM2JkYjczMGMzZTg5',
    app: { appAuthKey:'MzE4YzM1MzktNmQ4Ni00NzM2LTg3NzEtYzg5ZDNmMDUwMDM3', appId: 'ddbb2130-86cc-49c7-b40a-29344dd93524' }
});
const bodyParser = require('body-parser');
// rp({uri: 'http://31.220.15.49:9000/verify?purchaseCode=6b996707-a58a-47c6-82e2-cc0d12e73737', headers: { 'User-Agent': 'node.js' }, json: true}).then(function(result) {
//     if(result.status === "OK") {
            // console.log(result);
            global.jwtToken = 'H12VE6k_E';
            global.riderPrefix = "rider";
            global.driverPrefix = "driver";
            global.publicDir = __dirname + "/public/";
            global.mysql = require('./models/mysql');
            global.baseData = [];
            global.serviceTree = [];
            global.drivers = {};
            global.riders = {};
            app.use(cors);
            app.options('*', cors);
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({extended: true}));
            app.use('/img', express.static(__dirname + "/public/img"));
            app.use(express.static('/srv/'));
            app.use(require("./libs/express-router"));

            var options = {
                key:    fs.readFileSync('/home/going-operator/certs/server.key'),
                cert:   fs.readFileSync('/home/going-operator/certs/server.crt'),
                ca:     fs.readFileSync('/home/going-operator/certs/server.ca-bundle')
            };
            let server = require('https').createServer(options,app);
            const io = require("socket.io").listen(server);
            global.operatorsNamespace = require("./libs/operator")(io);
            require("./libs/client")(io);
            require("./libs/interface")(io);
            require("./libs/supplier-web")(io);

            process.on('unhandledRejection', r => console.log(r));
            server.listen(8080, function () {
                console.log("Listening on " + 8080);

            });

    // } else {
    //     throw new Error(result.message);
    // }
// });
