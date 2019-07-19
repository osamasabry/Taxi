const shortId = require('shortid');

module.exports = {

    save: async function (json) {
        let [result, ignored] = await sql.query("SELECT taxi.test('"+json+"') as reservation_id");
        return result ;
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

    searchTrip: async function (Lang_ID,text) {
        let [result, ignored] = await sql.query("SELECT Trip_Name ,Trip_OneLineDescription,Trip_Thumbnail_Image_Name,Trip_OnTripIsFeatured_Image_Name ,id,Supplier_Trip_Trip_ID ,price FROM GetTripsWithLang_View WHERE TripLang_Language_ID = "+Lang_ID+"  And Trip_Name like '%"+text+"%'");
        return result;
    },
    
    getFeaturedTrips: async function (Lang_ID,City_id) {
        let [result, ignored] = await sql.query("select Category_Name,id,Trip_Name,Trip_Thumbnail_Image_Name,Trip_OnTripIsFeatured_Image_Name ,supplier_trip_id,Supplier_Trip_Trip_ID,price From GetTripsWithLang_View  WHERE TripLang_Language_ID = "+Lang_ID+" and Trip_Is_Featured = 1 and  Trip_City_ID = "+City_id);
        return result;
    },

    getTripsByCategory: async function (Lang_ID,Category_ID,City_id) {
        let [result, ignored] = await sql.query("SELECT Categories_Trips_Trip_ID ,Trip_Name,Trip_OneLineDescription,Trip_Thumbnail_Image_Name,supplier_trip_id,Trip_OnTripIsFeatured_Image_Name,Supplier_Trip_Trip_ID ,price ,Trips_Categories_Category_ID from GetTripsWithLang_View WHERE TripLang_Language_ID = "+Lang_ID+" And Trips_Categories_Category_ID = "+Category_ID+" And Trip_City_ID = "+City_id );
         return result;
    },
 
    getAvailableTrip: async function (Lang_ID,date,count) {
        let [result, ignored] = await sql.query("SELECT * FROM taxi.SupplierTripsFullDataByAvailableSeats_View WHERE RemainingSeats >= "+count+" And (TripBusyAndSupplierCalenderDate="+date+" or TripBusyAndSupplierCalenderDate IS NULL) And TripLang_Language_ID = " + Lang_ID);
         return result;
    },
    
    getOneRow: async function (Lang_id,Supplier_Trip_Trip_ID) {
        let [result, ignored] = await sql.query("select * from taxi.GetTripFullDataWithImages_View where supplier_trip_id =" + Supplier_Trip_Trip_ID+ " AND TripLang_Language_ID = " + Lang_id);
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

    updateStatusReservation: async function (complain_id) {
        let [result,ignored] = await sql.query("UPDATE Complain SET Complain_Status_ID = ? WHERE id = ?",[complain_id]);
        return result.affectedRows;
    },
};