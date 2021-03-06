global.GROUP_BY_DAY = 0;
global.GROUP_BY_WEEK = 1;
global.GROUP_BY_MONTH = 2;
const mysql = require("mysql2/promise");
let config = {
    connectionLimit: 100,
    host: '35.246.191.111',
    user: 'root',
    password: 'Ma13579',
    database: 'taxi',
    debug: false,
    multipleStatements: true
};

mysql.createConnection({host: '35.246.191.111', user: 'root', password: 'Ma13579'}).then(function (resCon) {
    resCon.query("CREATE DATABASE IF NOT EXISTS " + 'taxi', []).then(async function (result) {
        dbMigrate.sync('20190208165024-braintree').then(async function (resMigrate) {
            global.sql = await mysql.createPool(config);
            require('./../libs/update-handler').init();
        });
    });
});
global.getDateFormat = function (dateColumnName, groupBy) {
    let colVal, group, dateWhereClause;
    switch (groupBy) {
        case GROUP_BY_DAY:
            //DATE format would be: 7, Oct
            colVal = dateColumnName;
            group = "DATE(" + dateColumnName + ")";
            dateWhereClause = "DATEDIFF(NOW()," + dateColumnName + ") <= ?";
            break;
        case GROUP_BY_WEEK:
            //DATE format would be: W5, 2017
            colVal = dateColumnName;
            group = dateColumnName;
            dateWhereClause = "(WEEK(NOW()) - WEEK(" + dateColumnName + ")) BETWEEN 0 AND ?";
            break;
        case GROUP_BY_MONTH:
            //DATE format would be: Jan, 2017
            colVal = dateColumnName;
            group = "YEAR(" + dateColumnName + "),MONTH(" + dateColumnName + ")";
            dateWhereClause = "(MONTH(NOW()) - MONTH(" + dateColumnName + ")) BETWEEN 0 AND ?";
            break;
    }
    return [colVal, group, dateWhereClause];
};
global.getPointTextFromArray = function (latLngArray) {
    return 'POINT (' + latLngArray.x + ' ' + latLngArray.y + ')';
};
module.exports = {
    init: async function() {

    },
    getOneRow: async function (tableName, filters) {
        let query = 'SELECT * FROM ' + tableName;
        if(Object.keys(filters).length > 0)
            query = query +' WHERE ' + Object.entries(filters).map(x => x[0] + ' = ?').join(', ');
        let [result, ignored] = await sql.query(query, Object.values(filters));
        result = await this.attachForeignKey(result, foreignKeys[tableName]);
        return result[0];
    },

    getReportRows: async function (table, filers, column, date1, date2) {
        let query = '';
        let whereClauses = [];
        let queryArguments = [];
        let  cond = '';
        let result = '';
        for (const filter in filers) {
            if (filers.hasOwnProperty(filter) && filers[filter] && filers[filter] !== '') {
                whereClauses.push(filter + "= ?");
                queryArguments.push(filers[filter]);
            }
        }
        if (whereClauses.length > 0)
            query += " WHERE " + whereClauses.join(" AND ");

        if (date1.length > 0 && date2.length > 0 && Object.keys(filers).length > 0)
            cond += " And "+column+" BETWEEN '"+date1+"' AND '"+date2+"'";
        else if (date1.length > 0 && date2.length > 0 && Object.keys(filers).length == 0)
            cond += " WHERE "+column+" BETWEEN '"+date1+"' AND '"+date2+"'";
        
        if (query != '') {
             [result, ignored] = await sql.query("SELECT * FROM " + table + query + cond , queryArguments);
        }else{
             [result, ignored] = await sql.query("SELECT * FROM " + table + cond);
        }
        return result;
    },
    getRows: async function (tableName, filters) {
        let query = 'SELECT * FROM ' + tableName;
        if (Object.values(filters).length > 0)
            query += ' WHERE ' + Object.entries(filters).map(x => x[0] + ' = ?').join(', ');
        let [result, ignored] = await sql.query(query, Object.values(filters));
        result = await this.attachForeignKey(result, foreignKeys[tableName]);
        return result;
    },
    attachForeignKey: async function (rows, foreignKeys) {
        try {
            for (let foreignKey in foreignKeys) {
                if (foreignKeys.hasOwnProperty(foreignKey)) {
                    for (let row of rows) {
                        if (!row[foreignKey] || row[foreignKey] === "")
                            continue;
                        row[foreignKey.slice(0, -3)] = await this.getOneRow(foreignKeys[foreignKey], {id: row[foreignKey]});
                    }
                }
            }
            return rows;
        } catch (error) {
            throw error;
        }
    },
    getRowsCustom: async function (table, filers, sort, from, pageSize, fullTextFields, fullTextValue) {
        console.log(filers);
        // console.log(table,filers,sort,from,pageSize,fullTextFields,fullTextValue);
        let query = '';
        let whereClauses = [];
        let queryArguments = [];
        if (fullTextValue !== "" && fullTextValue !== null)
            whereClauses.push(fullTextFields.join('|') + " LIKE '%" + fullTextValue + "%'");
        for (const filter in filers) {
            
            if (filers.hasOwnProperty(filter) && filers[filter] && filers[filter] !== '') {
                console.log(filter);
                whereClauses.push(filter + "= ?");
                queryArguments.push(filers[filter]);
            }
        }
        if (whereClauses.length > 0)
            query += " WHERE " + whereClauses.join(" AND ");
         console.log("SELECT COUNT(id) AS count FROM " + table + query, queryArguments)
        let [count, ignored2] = await sql.query("SELECT COUNT(id) AS count FROM " + table + query, queryArguments);
        count = count[0].count;
        if (count === 0)
            return [];
        let [result, ignored] = await sql.query("SELECT * FROM " + table + query + " ORDER BY " + sort.property + " " + sort.direction + " LIMIT ? OFFSET ?", queryArguments.concat([parseInt(pageSize), parseInt(from)]));
        if (result.length > 0) {
            result[0].count = count;
            result = await this.attachForeignKey(result, foreignKeys[table]);
        }
        return result;
    },
    updateRow: async function (tableName, row, id) {
        try {
            for (let i = 0; i < Object.keys(row).length; i++) {
                if (Array.isArray(Object.values(row)[i])) {
                    row[Object.keys(row)[i]] = Object.values(row)[i].join(',');
                }
            }
            if (tableName === 'operator')
                row['status'] = 'updated';
            let query = 'UPDATE ' + tableName + ' SET ' + Object.entries(row).map(x => x[0] + ' = ?').join(', ') + " WHERE id = " + id;
            let [result, ignored] = await sql.query(query, Object.values(row));
            if (tableName === 'service')
                serviceTree = await this.service.getServicesTree();

            return result.affectedRows === 1;
        } catch (error) {
            throw error;
        }
    },

    insertRow: async function (tableName, row) {
        for (let i = 0; i < Object.keys(row).length; i++) {
            if (Array.isArray(Object.values(row)[i])) {
                row[Object.keys(row)[i]] = Object.values(row)[i].join(',');
            }
        }
        let query = 'INSERT INTO ' + tableName + '(' + Object.keys(row).join(',') + ') VALUES (' + ''.padStart((Object.values(row).length * 2) - 1, '?,') + ')';
        let [result, ignored] = await sql.query(query, Object.values(row));
        if (tableName === 'service')
            serviceTree = await this.service.getServicesTree();
        return result.insertId;
    },
    deleteRows: async function (tableName, Ids) {
        try {
            let [result, ignored] = await sql.query("DELETE FROM " + tableName + " WHERE id IN (?)", [Ids]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    },
    deleteRowsCustom: async function (tableName, filter) {
        try {
            let [result, ignored] = await sql.query("DELETE FROM " + tableName + " WHERE " + Object.entries(filter).map(x => x[0] + ' = ?').join(', '), Object.values(filter));
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    },

    driver: require('./mysql/driver'),
    rider: require('./mysql/rider'),
    operator: require('./mysql/operator'),
    serverStats: require('./mysql/server-stat'),
    payments: require('./mysql/payment'),
    travel: require('./mysql/travel'),
    service: require('./mysql/service'),
    address: require('./mysql/address'),
    media: require('./mysql/media'),
    trip: require('./mysql/trip'),
    supplier: require('./mysql/supplier'),
};