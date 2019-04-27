const shortId = require('shortid');

module.exports = {

    save: async function (json) {
        return sql.query("SELECT taxi.test("+json+")");
    },

    InsertDatabase: async function (reserve_id,relativePath) {
        let result = await sql.query("INSERT INTO Reservation_Attachments (Attachment_FilePath,Attachment_Reservation_ID) VALUES (?)", [relativePath,reserve_id]);
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

    searchTrip: async function (text) {
        return sql.query("SELECT t.Trip_name,t.Trip_Thumbnail_Image_Name,t.Trip_OnTripIsFeatured_Image_Name ,t.id , tst.Supplier_Trip_Trip_ID ,min(tst.Supplier_Trip_AdultCost + tst.Supplier_Trip_AdultAddedFee) as price FROM `Trips`  as t , Trips_Supplier_Trips as tst WHERE t.Trip_Name like '%sw%' And t.id  = tst.Supplier_Trip_Trip_ID GROUP by tst.Supplier_Trip_Trip_ID");
    },

    getFeaturedTrips: async function (City_id) {
        let result = await sql.query("select t.*, tst.Supplier_Trip_Trip_ID ,min(tst.Supplier_Trip_AdultCost + tst.Supplier_Trip_AdultAddedFee) as price  from Trips t  , Trips_Supplier_Trips tst  WHERE  tst.Supplier_Trip_Trip_ID = t.id  AND  t.Trip_Is_Featured = 1 and t.Trip_City_ID = "+City_id+" GROUP by tst.Supplier_Trip_Trip_ID");
        return result;
    },

    getTripsByCategory: async function (Category_ID,City_id) {
        let result = await sql.query("SELECT ttg.Trips_Trip_ID , t.Trip_Name,t.Trip_Thumbnail_Image_Name,t.Trip_OnTripIsFeatured_Image_Name,tst.Supplier_Trip_Trip_ID ,min(tst.Supplier_Trip_AdultCost + tst.Supplier_Trip_AdultAddedFee) as price  from Trip_Trips_Categories as ttg , Trips as t, Trips_Supplier_Trips as tst  WHERE ttg.Trips_Categories_Category_ID = "+Category_ID+" And ttg.Trips_Trip_ID = t.id And t.Trip_City_ID = "+City_id+" And t.id = tst.Supplier_Trip_Trip_ID GROUP by tst.Supplier_Trip_Trip_ID");
         return result;
    },
    
};