module.exports = {

    getActiveRows: async function (table,column) {
         var quary = ' WHERE '+ column +'= 1'; 
        return sql.query("SELECT * FROM " + table + quary );
    },
};