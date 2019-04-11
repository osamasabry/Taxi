module.exports = {

    getAllCars: async function () {
        return sql.query("SELECT * FROM car", []);
    },
    
};