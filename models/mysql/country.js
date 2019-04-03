module.exports = {

    getActiveRows: async function (table,column) {
         var quary = table +' WHERE '+ column +'= 1'; 
        return sql.query("SELECT * FROM " + quary );
    },
};