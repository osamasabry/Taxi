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

// 
// console.log(schedule);

var j = schedule.scheduleJob('16 0 * * *', async function(){
  try {
        let date = await mysql.trip.getDate()
        let results = await mysql.trip.GetUsersNotificationNextDay(date);
        for (let result of results){
            await mysql.trip.InsertRiderNotification(result.Title,result.Body,result.reservation_id,1,result.rider_id);
            await mysql.trip.sendNotifcations(result.notification_player_id,result.Title,result.Body,result.reservation_id,1);
        }
    }
    catch (err) {
        console.log(err);
    }
});

router.post("/test", async function (req, res) {

    try {
        
        // let date = await mysql.trip.getDate()
        // let results = await mysql.trip.GetUsersNotification(date);

        // for (let result of results){
        //     await mysql.trip.InsertRiderNotification(result.Title,result.Body,result.reservation_id,1,result.rider_id);
        //     await mysql.trip.sendNotifcations(result.notification_player_id,result.Title,result.Body,result.reservation_id,1);
        // }
        // console.log(req.query.text);
        // let result = await mysql.getRowsCustom('GetComplain_View',{},{property:'id',direction:'asc'},0,35,'','');
        let results = await mysql.trip.GetOneUserNotification(66);
        // console.log(result);
        res.json({status: 200, results: results})

    }
    catch (err) {
        console.log(err);
    }
});


router.post("/public", async function (req, res) {

    try {
        let token = jwt.sign({id: 1}, jwtToken, {});
        res.json({status: 200, token: token});
    }
    catch (err) {
        if (isNaN(err.message)) {
            res.json({status: 666, error: err.message});
        } else {
            res.json({status: err.message});
        }
    }
});


router.post("/getCountries", async function (req, res) {

    try {
        let result = await mysql.getRows('Countries','');
        res.json({status: 200, result: result})

    }
    catch (err) {
        console.log(err);
    }
});


router.post("/operator_login", async function (req, res) {

    try {
        var operator = (await mysql.operator.authenticate(req.query.user_name, req.query.password));
        let token = jwt.sign({id: operator.id}, jwtToken, {});
        mysql.operator.setStatus(operator.id,'enabled');
        delete operator.password ;
        delete operator.operator_permission;
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

router.post("/supplier_login", async function (req, res) {

    try {
        var supplier = (await mysql.supplier.authenticate(req.query.email, req.query.password));
        let token = jwt.sign({id: supplier.id}, jwtToken, {});
        delete supplier.Trips_Supplier_User_Password ;
        
        // mysql.operator.setStatus(operator.id,'enabled');
        res.json({status: 200, token: token, user: supplier});
    }
    catch (err) {
        if (isNaN(err.message)) {
            res.json({status: 666, error: err.message});
        } else {
            res.json({status: err.message});
        }
    }
});

// sign up and login from web 
router.post('/rider_register', async function (req, res) {
    let profile = await mysql.rider.register(parseInt(req.body.mobile_number),req.body.user_name,parseInt(req.body.phone_code),req.body.email,req.body.password);
    res.json({status: 200, flag: profile});
});

router.post('/rider_webLogin', async function (req, res) {
    let profile = await mysql.rider.getWebProfile(req.body.email,req.body.password);
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


// sign up and login from mobile from mobile
router.post('/rider_signUp', async function (req, res) {
    if (process.env.RIDER_MIN_VERSION && req.body.version && parseInt(req.body.version) < process.env.RIDER_MIN_VERSION) {
        res.json({status: 410});
        return;
    }

    var phoneCodelength = req.body.phone_code.length;
    var mobileNumber    = req.body.mobile_number.substring(phoneCodelength);
    var checkNumber = mobileNumber.toString()[0];

    if (checkNumber==0) 
        mobileNumber = parseInt(req.body.phone_code) + mobileNumber.substring(1)
    else
        mobileNumber = parseInt(req.body.phone_code) + mobileNumber;

    console.log(mobileNumber);
    let profile = await mysql.rider.signUp(parseInt(mobileNumber),req.body.user_name,parseInt(req.body.phone_code),req.body.nationality_code);
    res.json({status: 200, flag: profile});
});

router.post('/rider_login', async function (req, res) {
    if (process.env.RIDER_MIN_VERSION && req.body.version && parseInt(req.body.version) < process.env.RIDER_MIN_VERSION) {
        res.json({status: 410});
        return;
    }
    // var mobileNumber =0;
    console.log("user_name");
    console.log(req.body.user_name);

    // if (checkNumber==0) 
    //     mobileNumber = req.body.user_name.substring(1)
    // else
    //     mobileNumber = req.body.user_name;

    // console.log(mobileNumber)
   
    let profile = await mysql.rider.getProfile(parseInt(req.body.user_name));
    console.log("profile");
    console.log(profile);
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
    console.log("token");
    console.log(token);
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
