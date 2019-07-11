module.exports = {

    authenticate: async function (userName, password) {
        let [result, ignored] = await sql.query("SELECT * FROM Trips_Supplier_Users WHERE Trips_Supplier_User_Email = ? And Trips_Supplier_User_Password = ?", [userName, password]);
        if (result.length !== 1) {
            throw new Error(300);
        }
        else {
            result = result[0];
            // result['media'] = await mysql.getOneRow('media',{id:result.media_id});
            return result;
        }
    },

    insertUserSupplier: async function (row,password,permisions,supplier_id) {
        let [result, ignored] = await sql.query("INSERT INTO Trips_Supplier_Users (Trips_Supplier_User_Email,Trips_Supplier_User_Password,Trips_Supplier_User_FullName,Trips_Supplier_User_Permissions,Trips_Supplier_User_Supplier_ID,Trips_Supplier_User_IsOwner) VALUES (?,?,?,?,?,?)", [row.Supplier_Email,password,row.Supplier_Name,permisions,supplier_id,1]);
        return result.affectedRows === 1
    },

    getReviewsSupplier: async function (supplier_id) {
        let [result, ignored] = await sql.query("select * from taxi.GetMyReviews_View where Supplier_Trip_Supplier_ID =" + supplier_id);
        return result;
    },

    getComplainSupplier: async function (supplier_id) {
        let [result, ignored] = await sql.query("select * from taxi.GetSupplierComplain_View where Supplier_Trip_Supplier_ID =" + supplier_id);
        return result;
    },

    getSupplierCities: async function (supplier_id) {
        let [result, ignored] = await sql.query("select * from taxi.SuppliersCities_View where Supplier_Trip_Supplier_ID =" + supplier_id);
        return result;
    },
    stopReservation: async function (date,trip_supplier_id) {
        // console.log("select taxi.StopReservation('"+date+"','"+trip_supplier_id+"') as insert_id");
        let [result, ignored] = await sql.query("select taxi.StopReservation('"+date+"','"+trip_supplier_id+"') as insert_id" );
        return result;
    },

    restartReservation: async function (date,trip_supplier_id) {
        let [result, ignored] = await sql.query("DELETE FROM `Trips_Supplier_Calendar` WHERE Supplier_Trip_Calendar_Date = '"+date+"' And Supplier_Trip_Calendar_Supplier_Trip_ID = "+ trip_supplier_id);
        return result.affectedRows === 1
    },

    updateSupplierPassword: function (operatorId, oldPass, newPass) {
        return sql.query("UPDATE Trips_Supplier_Users SET Trips_Supplier_User_Password = ? WHERE Trips_Supplier_User_Password = ? AND id = ?", [newPass, oldPass, operatorId]);
    },

    getReservationTripsSupplier: async function (city_id,date,supplier_id) {
        var queryText = 'SELECT Trip_Supplier_Trip_ID,'
                        +"Trip_Name,"
                        +"Supplier_Trip_AdultAddedFee,"
                        +"Supplier_Trip_AdultCost,"
                        +"Supplier_Trip_Supplier_ID,"
                        +"Trip_City_ID,"
                        +"taxi.FUN_GetSumACIForReservationByDate(Trip_Supplier_Trip_ID, '"+date+"') As SumACI,"
                        +"taxi.FUN_CheckIfTripIsAvilableForReservation(Trip_Supplier_Trip_ID,'"+ date +"') as IsAvilableForReservation"
                        +" from taxi.SupplierTripsWithReservationMiniData_View where Trip_City_ID ="+city_id+" And Supplier_Trip_Supplier_ID ="+supplier_id;
        console.log(queryText);
        let [result, ignored] = await sql.query(queryText);
        return result;
    },

    getReservationTripDetails: async function (supplier_trip_id) {
        let [result, ignored] = await sql.query("select * from taxi.GetReservationBySupplierTripID where Reservation_Supplier_Trip_ID = "+supplier_trip_id);
        return result;
    },

    getReservationSupplierFinancials: async function (from,to,supplier_id) {
        console.log("select * from Trips_Reservation_Supplier_Financials where Reservation_Supplier_Financials_ActionDate BETWEEN '"+from+"' AND '"+to+"' AND Reservation_Supplier_Financials_Supplier_ID ="+ supplier_id);
        let [result, ignored] = await sql.query("select * from Trips_Reservation_Supplier_Financials where Reservation_Supplier_Financials_ActionDate BETWEEN '"+from+"' AND '"+to+"' AND Reservation_Supplier_Financials_Supplier_ID ="+ supplier_id);
        return result;
    },
    
};