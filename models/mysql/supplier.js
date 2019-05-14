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

    insertUserSupplier: async function (row,password,supplier_id) {
        let [result, ignored] = await sql.query("INSERT INTO Trips_Supplier_Users (Trips_Supplier_User_Email,Trips_Supplier_User_Password,Trips_Supplier_User_FullName,Trips_Supplier_User_Permissions,Trips_Supplier_User_Supplier_ID,Trips_Supplier_User_IsOwner) VALUES (?,?,?,?,?,?)", [row.Supplier_Email,password,row.Supplier_Name,'',supplier_id,1]);
        return result.affectedRows === 1
    },
};