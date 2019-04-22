/** @namespace req.query.user_name */

const mysql = require('../models/mysql');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = new express.Router({});
const braintree = require('braintree');
const path = require('path');

const brain = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: 'c5nshkgtsjt7szvx',
    publicKey: 'cmmvzxncxd73fnhs',
    privateKey: '8b2eac1ebc51216bff069b8e958f0960'
});
const allowedExt = [
    '.js',
    '.ico',
    '.css',
    '.png',
    '.jpg',
    '.woff2',
    '.woff',
    '.ttf',
    '.svg',
    '*'
  ];
router.post("/operator_login", async function (req, res) {

    try {
        var operator = (await mysql.operator.authenticate(req.query.user_name, req.query.password));
        let token = jwt.sign({id: operator.id}, jwtToken, {});
        mysql.operator.setStatus(operator.id,'enabled');
        res.json({status: 200, token: token, user: operator});
    }
    catch (err) {
        if (isNaN(err.message)) {
            res.json({status: 666, error: err.message});
        } else {
            res.json({status: err.message});
        }
    }
});

router.post('/rider_signUp', async function (req, res) {
    if (process.env.RIDER_MIN_VERSION && req.body.version && parseInt(req.body.version) < process.env.RIDER_MIN_VERSION) {
        res.json({status: 410});
        return;
    }
    let profile = await mysql.rider.signUp(parseInt(req.body.mobile_number),req.body.user_name);
    // switch (profile.status) {
    //     case('blocked'):
    //         res.json({status: 412});
    //         return;
    // }
    // let keys = {
    //     id: profile.id,
    //     prefix: riderPrefix
    // };
    // let token = jwt.sign(keys, jwtToken, {});
    // res.json({status: 200, token: token, user: profile});

    res.json({status: 200, flag: profile});

});

router.post('/rider_login', async function (req, res) {
    if (process.env.RIDER_MIN_VERSION && req.body.version && parseInt(req.body.version) < process.env.RIDER_MIN_VERSION) {
        res.json({status: 410});
        return;
    }
    let profile = await mysql.rider.getProfile(parseInt(req.body.user_name));
    switch (profile.status) {
        case('blocked'):
            res.json({status: 412});
            return;
    }
    let keys = {
        id: profile.id,
        prefix: riderPrefix
    };
    let token = jwt.sign(keys, jwtToken, {});
    res.json({status: 200, token: token, user: profile});
});
router.post('/driver_login', async function (req, res) {
    if (process.env.DRIVER_MIN_VERSION && req.body.version && parseInt(req.body.version) < process.env.DRIVER_MIN_VERSION) {
        res.json({status: 410});
        return;
    }
    let profile = await mysql.driver.getProfile(parseInt(req.body.user_name));
    switch (profile.status) {
        case('disabled'):
            res.json({
                status: 411
            });
            return;
        case('blocked'):
            res.json({status: 412});
            return;
    }
    let keys = {
        id: profile.id,
        prefix: driverPrefix
    };
    let token = jwt.sign(keys, jwtToken, {});
    res.json({status: 200, token: token, user: profile});
});
router.get('/braintree_client_token', async (req, res) => {
    // Input format: { order_id: n, payment_method:paypal, use_credit: true, user_id }
    brain.clientToken.generate({}, (_err, response) => {
        res.send(response.clientToken);
    });
})
router.get('/revoke', async function (req, res) {
    res.json('server Disabled.');
    throw new Error('This server has been revoked for further usage of this app.');
});
router.get('*', (req, res) => {
    console.log('llllllllll')
    /*if(req.url == '/') {
        res.sendFile(path.resolve('dist/index.html'));
    } else {
        res.sendFile(path.resolve(`dist/${req.url}`));
    }*/
    res.send("All Seems good!")
})
module.exports = router;