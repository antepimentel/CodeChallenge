var mysql = require('mysql');
var propReader = require('properties-reader');
var properties = propReader('./properties.ini');

// Get DB info from the properties file
var host = properties.get('db.host').toString();
var user = properties.get('db.user').toString();
var pass = properties.get('db.pass').toString();
var db = properties.get('db.name').toString();

var pool;

var exports = module.exports = {};

/**
 * Initializes the DB connection pool
 */
exports.init = function () {
   pool = mysql.createPool({
        connectionLimit: 100,
        host: host,
        user: user,
        password: pass,
        database: db,
        debug: false
    });
    console.log("Connection pool created");
}

/**
 * Retrieves all tx hashes in the DB
 * @returns RowDataPacket array
 */
exports.retrieveHashes = function () {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, con) {
            con.query("select * from TX_HISTORY", function (err, result) {
                if (err) reject(err);
                Object.keys(result).forEach(function (key) {
                    var row = result[key];
                    console.log(row.name)
                }); 
                resolve(result);
            });
        });
    });
}

/**
 * Inserts a hash into the DB
 * @param {any} hash
 */
exports.addHash = function (hash) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, con) {
            con.query("insert into TX_HISTORY (txhash) values (\'"+hash+"\')"
                    , function (err, result) {
                if (err) reject(err); 
                resolve("Result: Success?");
            });
        });
    });
}