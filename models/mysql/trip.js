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
        const fullPath = "/home/going-operator/htdocs/images/" + relativePath;
        // console.log(fullPath);
   
        if(!fs.isDir(fullPath)){
            await fs.mkdirp("/home/going-operator/htdocs/images/book");
        }
        let fd = await fs.openAsync(fullPath, 'a', 0o755);
        await fs.writeAsync(fd, buffer, 'binary');
        await fs.closeAsync(fd);

        await this.InsertDatabase(reserve_id,relativePath);
        return true;
    },

    searchTrip: async function (Lang_ID,text) {
        let [result, ignored] = await sql.query("SELECT Trip_Name ,Trip_OneLineDescription,Trip_Thumbnail_Image_Name,Trip_OnTripIsFeatured_Image_Name ,id,Supplier_Trip_Trip_ID ,price FROM GetTripsWithLang_View WHERE TripLang_Language_ID = "+Lang_ID+"  And TripLang_Name like '%"+text+"%'  GROUP by Supplier_Trip_Trip_ID");
        return result;
    },
    
    getFeaturedTrips: async function (Lang_ID,City_id) {
        let [result, ignored] = await sql.query("select id,Trip_Name,Trip_Thumbnail_Image_Name,Trip_OnTripIsFeatured_Image_Name ,supplier_trip_id,Supplier_Trip_Trip_ID,price From GetTripsWithLang_View  WHERE TripLang_Language_ID = "+Lang_ID+" and Trip_Is_Featured = 1 and  Trip_City_ID = "+City_id+" GROUP by Supplier_Trip_Trip_ID");
        return result;
    },

    getTripsByCategory: async function (Lang_ID,Category_ID,City_id) {
        let [result, ignored] = await sql.query("SELECT Categories_Trips_Trip_ID ,Trip_Name,Trip_OneLineDescription,Trip_Thumbnail_Image_Name,supplier_trip_id,Trip_OnTripIsFeatured_Image_Name,Supplier_Trip_Trip_ID ,price ,Trips_Categories_Category_ID from GetTripsWithLang_View WHERE TripLang_Language_ID = "+Lang_ID+" And Trips_Categories_Category_ID = "+Category_ID+" And Trip_City_ID = "+City_id+"  GROUP by Supplier_Trip_Trip_ID");
         return result;
    },
 
    getAvailableTrip: async function (Lang_ID,date,count) {
        let [result, ignored] = await sql.query("SELECT * FROM taxi.SupplierTripsFullDataByAvailableSeats_View WHERE RemainingSeats >= "+count+" And (TripBusyAndSupplierCalenderDate="+date+" or TripBusyAndSupplierCalenderDate IS NULL) And TripLang_Language_ID = " + Lang_ID);
         return result;
    },
    
    getOneRow: async function (Lang_id,Supplier_Trip_Trip_ID) {
        let [result, ignored] = await sql.query("select * from taxi.GetTripFullDataWithImages_View where id =" + Supplier_Trip_Trip_ID+ " AND TripLang_Language_ID = " + Lang_id);
        return result;
    },

    ReservationTrips: async function (Lang_ID,rider_id) {
        let [result, ignored] = await sql.query("select * from taxi.GetReservationTrips where Reservation_Rider_ID =" + rider_id+ " And TripLang_Language_ID = "+Lang_ID+" order by reservation_id desc");
        return result;
    },

    saveComplain: async function (json) {
        let [result, ignored] = await sql.query("SELECT taxi.saveComplain('"+json+"') as argument_id");
        return result ;
    },

    doUploadComplain: async function (buffer, argument_id) {
        const fileName = shortId.generate() + '.webp';
        const relativePath = 'complain/' + fileName;
        const fullPath = "/home/going-operator/htdocs/images/" + relativePath;
        // console.log(fullPath);
   
        if(!fs.isDir(fullPath)){
            await fs.mkdirp("/home/going-operator/htdocs/images/complain");
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

    InsertJsonRow: async function (tableName,row,id) {
        // try {
            for (let i = 0; i < Object.keys(row).length; i++) {
                if (Array.isArray(Object.values(row)[i])) {
                    row[Object.keys(row)[i]] = Object.values(row)[i].join(',');
                }
            }
            
            let query = 'UPDATE ' + tableName + ' SET ' + Object.entries(row).map(x => x[0] + ' = ?').join(', ') + " WHERE id = " + id;
            console.log(query);
            let [result, ignored] = await sql.query(query, Object.values(row));
            // console.log(result);
        //     if (tableName === 'service')
        //         serviceTree = await this.service.getServicesTree();

        //     return result.affectedRows === 1;
        // } catch (error) {
        //     throw error;
        // }

        // let result = await sql.query("UPDATE test SET name = JSON_SET (name , '$.fr' ,'Charm el-Cheikh') WHERE id = 6");
        // return result[0].affectedRows === 1;
    },
};