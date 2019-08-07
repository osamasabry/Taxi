const shortId = require('shortid');

module.exports = {

    save: async function (json) {
        let [result, ignored] = await sql.query("SELECT taxi.test('"+json+"') as reservation_id");
        var reserv_id = result[0].reservation_id;
        var data = JSON.parse(json);
        let [res, ignored] = await sql.query("select  *, taxi.FUN_GetNotificationStringByLangAndType(1,12) As Title ,taxi.FUN_GetNotificationStringByLangAndType(1,13) As Body from taxi.GetNotificationSupplierID_View where Reservation_Supplier_Trip_ID =" + data.Reservation_Supplier_Trip_ID+" Group By Supplier_ID");
        await mysql.trip.InsertSupplierNotification(res[0].Title,res[0].Body,reserv_id,4,res[0].Supplier_ID);
        await mysql.trip.sendNotifcations(res[0].User_Device_ID,res[0].Title,res[0].Body,reserv_id,4);
        return result ;
    },

    InsertSupplierNotification: async function (title,body,action_id,type,supplier_id) {
        let result = await sql.query("INSERT INTO Trip_Supplier_Notifications (Trip_Supplier_Notifications_Title,Trip_Supplier_Notifications_Body,Trip_Supplier_Notifications_ActionID,Trip_Supplier_Notifications_Type_ID,Trip_Supplier_Notifications_Supplier_ID) VALUES (?,?,?,?,?)", [title,body,action_id,type,supplier_id]);
        return result.affectedRows === 1;
    },
    InsertDatabase: async function (reserve_id,relativePath) {
        let result = await sql.query("INSERT INTO Reservation_Attachments (Attachment_FilePath,Attachment_Reservation_ID) VALUES (?,?)", [relativePath,reserve_id]);
        return result.affectedRows === 1;
    },
    
    doUpload: async function (buffer, reserve_id) {
        const fileName = shortId.generate() + '.webp';
        const relativePath = 'book/' + fileName;
        const fullPath = "/home/going-images/htdocs/images/" + relativePath;
        // console.log(fullPath);
   
        if(!fs.isDir(fullPath)){
            await fs.mkdirp("/home/going-images/htdocs/images/book");
        }
        let fd = await fs.openAsync(fullPath, 'a', 0o755);
        await fs.writeAsync(fd, buffer, 'binary');
        await fs.closeAsync(fd);

        await this.InsertDatabase(reserve_id,relativePath);
        return true;
    },

    searchTrip: async function (Lang_ID,text,rider_id) {
        let [result, ignored] = await sql.query("SELECT select FUN_GetCurrencyStringByLangIDAndRiderID("+Lang_ID+","+rider_id+") as currency_symbol,Trip_Name ,Trip_OneLineDescription,Trip_Thumbnail_Image_Name,Trip_OnTripIsFeatured_Image_Name ,id,Supplier_Trip_Trip_ID ,supplier_trip_id,price FROM GetTripsWithLang_View WHERE TripLang_Language_ID = "+Lang_ID+"  And Trip_Name like '%"+text+"%'");
        return result;
    },
    
    getFeaturedTrips: async function (Lang_ID,City_id,rider_id) {
        let [result, ignored] = await sql.query("select FUN_GetCurrencyStringByLangIDAndRiderID("+Lang_ID+","+rider_id+") as currency_symbol,Category_Name,id,Trip_Name,Trip_Thumbnail_Image_Name,Trip_OnTripIsFeatured_Image_Name ,supplier_trip_id,Supplier_Trip_Trip_ID,price From GetTripsWithLang_View  WHERE TripLang_Language_ID = "+Lang_ID+" and Trip_Is_Featured = 1 and  Trip_City_ID = "+City_id);
        return result;
    },

    getTripsByCategory: async function (Lang_ID,Category_ID,City_id,rider_id) {
        let [result, ignored] = await sql.query("SELECT FUN_GetCurrencyStringByLangIDAndRiderID("+Lang_ID+","+rider_id+") as currency_symbol,Categories_Trips_Trip_ID ,Trip_Name,Trip_OneLineDescription,Trip_Thumbnail_Image_Name,supplier_trip_id,Trip_OnTripIsFeatured_Image_Name,Supplier_Trip_Trip_ID ,price ,Trips_Categories_Category_ID from GetTripsWithLang_View WHERE TripLang_Language_ID = "+Lang_ID+" And Trips_Categories_Category_ID = "+Category_ID+" And Trip_City_ID = "+City_id );
         return result;
    },
 
    getAvailableTrip: async function (Lang_ID,date,count,text,rider_id) {
        let [result, ignored] = await sql.query("SELECT * , FUN_GetCurrencyStringByLangIDAndRiderID("+Lang_ID+","+rider_id+") as currency_symbol FROM taxi.SupplierTripsFullDataByAvailableSeats_View WHERE RemainingSeats >= "+count+" And (TripBusyAndSupplierCalenderDate="+date+" or TripBusyAndSupplierCalenderDate IS NULL) And TripLang_Language_ID = " + Lang_ID+" And Trip_Name like '%"+text+"%'");
         return result;
    },
    
    getOneRow: async function (Lang_ID,Supplier_Trip_Trip_ID,rider_id) {
        let [result, ignored] = await sql.query("select * , FUN_GetCurrencyStringByLangIDAndRiderID("+Lang_ID+","+rider_id+") as currency_symbol from taxi.GetTripFullDataWithImages_View  where supplier_trip_id =" + Supplier_Trip_Trip_ID+ " AND TripLang_Language_ID = " + Lang_ID);
        return result;
    },

    ReservationTrips: async function (Lang_ID,rider_id) {
        let [result, ignored] = await sql.query("select * from taxi.GetReservationTrips where Reservation_Rider_ID =" + rider_id+ " And TripLang_Language_ID = "+Lang_ID+" order by reservation_id desc");
        return result;
    },

    saveComplain: async function (json) {
        let [result, ignored] = await sql.query("SELECT taxi.saveComplain('"+json+"') as argument_id");
        return result[0] ;
    },

    doUploadComplain: async function (buffer, argument_id) {
        const fileName = shortId.generate() + '.webp';
        const relativePath = 'complain/' + fileName;
        const fullPath = "/home/going-images/htdocs/images/" + relativePath;
        // console.log(fullPath);
   
        if(!fs.isDir(fullPath)){
            await fs.mkdirp("/home/going-images/htdocs/images/complain");
        }
        let fd = await fs.openAsync(fullPath, 'a', 0o755);
        await fs.writeAsync(fd, buffer, 'binary');
        await fs.closeAsync(fd);

        await this.InsertDatabaseComplain(argument_id,relativePath);
        return true;
    },

    InsertDatabaseComplain: async function (argument_id,relativePath) {
        let result = await sql.query("INSERT INTO Complain_Arguments_Attachment (Complain_ArgumentTitle,ComplainArgumentAttachment_filename,ComplainArgument_ID) VALUES (?,?,?)", ['ooooooo',relativePath,argument_id]);
        return result.affectedRows === 1;
    },

    getComplain: async function (rider_id) {
        let [result, ignored] = await sql.query("select * from taxi.GetComplain_View where Complain_Rider_ID =" + rider_id);
        return result;
    },

    getOneComplain: async function (complaint_id) {
        let [result, ignored] = await sql.query("select * from taxi.GetComplain_View where id =" + complaint_id);
        return result;
    },

    getReviewsRider: async function (rider_id) {
        let [result, ignored] = await sql.query("select * from taxi.GetMyReviews_View where Reservation_Rider_ID =" + rider_id);
        return result;
    },

    getPolicy: async function (Lang_ID,Policy_ID) {
        let [result, ignored] = await sql.query("select * from taxi.GetPolicy_View where SysLang_Sys_Language_ID =" + Lang_ID+" And SysLang_Sys_Setting_ID ="+Policy_ID);
        return result;
    },

    updateStatusReservation: async function (status_code,reserv_id) {
        let [result,ignored] = await sql.query("UPDATE Trips_Reservations SET Reservation_Status_ID = ? WHERE id = ?",[status_code,reserv_id]);
        return result.affectedRows;
    },

    replayComplain: async function (date,text,issued_by,complain_id) {
  
        let res = await sql.query("UPDATE Complain SET Complain_Status_ID = 3 WHERE id = ?",[complain_id]);
        
        let result = await sql.query("INSERT INTO Complain_Arguments (ComplainArgument_Date,ComplainArgument_Details,ComplainArgument_IssuedBy_Type,ComplainArgument_Complain_ID) VALUES (?,?,?,?)", [date,text,issued_by,complain_id]);
        let [id,ignored]  = await sql.query("SELECT LAST_INSERT_ID() as argument_id;");
        // console.log (id);
        return id[0];
    },

    getreplayComplain: async function (complain_id) {
        let [result, ignored] = await sql.query("select * from taxi.GetReplayComplainWithAdditionalImages where id =" + complain_id);
        return result;
    },

    getAvailableSeats: async function (Lang_ID,count,supplier_trip_id) {
        let [result, ignored] = await sql.query("SELECT TripBusyAndSupplierCalenderDate FROM taxi.SupplierTripsFullDataByAvailableSeats_View WHERE RemainingSeats < "+count+"  And TripLang_Language_ID = " + Lang_ID+" And id = " + supplier_trip_id);
         return result;
    },

    updateStatusComplain: async function (complain_id) {
        let [result,ignored] = await sql.query("UPDATE Complain SET Complain_Status_ID = 4 WHERE id = ?",[complain_id]);
        return result.affectedRows;
    },

    updateNotificationSupplier: async function (notificationSupplierId,user_id) {
        let [result,ignored] = await sql.query("UPDATE Trip_Sub_Suppliers SET notification_supplier_id = ? WHERE User_ID = ?",[notificationSupplierId,user_id]);
        return result.affectedRows;
    },

    updateUserLanguage: async function (Language_ID,user_id) {
        console.log("UPDATE rider SET rider_Language_ID = ? WHERE id = ?",[Language_ID,user_id])
        let [result,ignored] = await sql.query("UPDATE rider SET rider_Language_ID = ? WHERE id = ?",[Language_ID,user_id]);
        return result.affectedRows;
    },

    GetUsersNotificationNextDay: async function (date) {
        let [result, ignored] = await sql.query("SELECT rider_Language_ID,Reservation_PickupDate,first_name,id as reservation_id,notification_player_id,taxi.FUN_GetNotificationStringByLangAndType(rider_Language_ID,6) As Title ,taxi.FUN_GetNotificationStringByLangAndType(rider_Language_ID,7) As Body FROM taxi.GetNotificationRiderID_View WHERE Reservation_PickupDate = '"+date+"'");
        return result;
    },

    GetOneUserNotificationSupplierOnHisWay: async function (rider_id) {
        let [result, ignored] = await sql.query("SELECT rider_Language_ID,notification_player_id,taxi.FUN_GetNotificationStringByLangAndType(rider_Language_ID,8) As Title ,taxi.FUN_GetNotificationStringByLangAndType(rider_Language_ID,9) As Body FROM rider WHERE id = "+rider_id);
        return result[0];
    },

    GetOneUserNotificationReplyComplaint: async function (rider_id) {
        let [result, ignored] = await sql.query("SELECT rider_Language_ID,notification_player_id,taxi.FUN_GetNotificationStringByLangAndType(rider_Language_ID,10) As Title ,taxi.FUN_GetNotificationStringByLangAndType(rider_Language_ID,11) As Body FROM rider WHERE id = "+rider_id);
        return result[0];
    },

    InsertRiderNotification: async function (title,body,action_id,type,rider_id) {
        let result = await sql.query("INSERT INTO Trip_Rider_Notifications (Trip_Rider_Notifications_Title,Trip_Rider_Notifications_Body,Trip_Rider_Notifications_ActionID,Trip_Rider_Notifications_Type_ID,Trip_Rider_Notifications_RiderID) VALUES (?,?,?,?,?)", [title,body,action_id,type,rider_id]);
        return result.affectedRows === 1;
    },

    sendNotifcations: async function (fcm,titlemsg,bodymsg,action_id,type) {
        var payload = {
          notification: {
            title: titlemsg,
            body: bodymsg
          },
          data: {
            action: action_id.toString(),
            Type: type.toString(),
          },
          token:fcm
        };
        admin.messaging().send(payload)
          .then(function(response) {
            console.log('Successfully sent message:', response);
            return true
          })
          .catch(function(error) {
            return error;
          });
    },

    getDate: async function(){

        var currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        var day = currentDate.getDate()
        var month = currentDate.getMonth() + 1
        var year = currentDate.getFullYear()

        today = year + '-' + month + '-' + day;

        return today;
    },
};