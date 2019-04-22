module.exports = {

    save: async function (json) {
        return sql.query("SELECT taxi.test("+json+")");
    },
    
};