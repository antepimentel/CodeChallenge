var url = require('url');
var bodyParser = require('body-parser');
var express = require('express'); 
var blockcypher = require('./blockcypher.js');
var backend = require('./backend.js');
var Chart = require('chartJS');

var app = express();
var port = process.env.PORT || 1337;

// HTML Pages
var balance_page = 'html/balance.html';
var error_page = 'html/error.html';
var index_page = 'html/index.html';
var confirm_page = 'html/confirm.html';
var viewhashes_page = 'html/viewhashes.html';
var viewhash_page = 'html/viewhash.html';
var viewhistory_page = 'html/viewhistory.html';

// initialize the backend
backend.init();

// Setup express
app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extend: true }));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

// This is someone visiting the main page
app.get('/', function (req, res) {
    res.render(index_page);
})

// This is a request to get a balance
app.get('/query', function (req, res) {

    // Grab the user input
    var address = url.parse(req.url, true).query.address;

    blockcypher.getAddress(address)
        .then((result) => {

            var balance = result['balance'] / Math.pow(10, 8);
            var txrefs = result['txrefs'];
            //var mychart = new Chart(ctx, {});

            res.render(balance_page, { balance: balance.toString() });
            res.end();
        })
        .catch((err) => {
            console.log("ERROR IS: "+ err);
            res.render(error_page, err);
            res.end();
        });
})

// This is a request to transfer 
app.post('/send', function (req, res) {

    // Grab user input
    //var from = url.parse(req.url, true).query.sender;
    var from = req.body.sender;
    var to = req.body.reciever;
    var amount = parseFloat(req.body.amount);
    var publicKey = req.body.publicKey;
    var privateKey = req.body.privateKey;

    // Basic validation
    if (from && to && amount && publicKey && privateKey) {

        blockcypher.sendBitcoin(amount, to, from, publicKey, privateKey)
        //blockcypher.sendBitcoin(1, 'mtXWDB6k5yC5v7TcwKZHB89SUp85yCKshy', 'mk4UNSVkZzLmDHpkKne6NqdNeWh1wEQTFk', '024b29ecd2fb40f0725d0bff6c811c785352e176e31d1c79a661fd14c0c0bee0a8', 'ece0a01195ad3289f6f4a90276d5e8e06e40a8e5f315c98794e24dc305301282')
            .then( (result) => {
                console.log(result); // TX object

                // Push to DB
                backend.addHash(result.hash);

                res.render(confirm_page, { hash: result.hash.toString() });
                res.end();
            })
            .catch((err) => {
                console.log(err);
                res.render(error_page, err);
                res.end();
            });
    } else {
        res.render(error_page, { error: 'Missing inputs' });
        res.end();
    }
})

app.get('/history', function (req, res) {
    // Grab the user input
    var address = url.parse(req.url, true).query.address;

    blockcypher.getAddress(address)
        .then((result) => {

            //var balance = result['balance'] / Math.pow(10, 8);
            
            //var mychart = new Chart(ctx, {});

            // Build dataset from txref array
            var data = [];
            /*for (var i = 0; i < txrefs.length; i++) {
                if (txrefs[i].confirmed) {
                    var tmp = {
                        x: txrefs[i].confirmed,
                        y: txrefs[i].value
                    };
                    data.push(tmp);
                }
            }*/ 

            var total_sent = result['total_sent'] / Math.pow(10, 8);
            var total_rec = result['total_received'] / Math.pow(10, 8);

            data.push(total_sent);
            data.push(total_rec);

            console.log("DATA: " + data);
            res.render(viewhistory_page, { dataset: data });
            res.end();
        })
        .catch((err) => {
            console.log("ERROR IS: " + err);
            res.render(error_page, err);
            res.end();
        });
})

app.get('/transactions', function (req, res) {

    backend.retrieveHashes()
        .then((result) => {
            res.render(viewhashes_page, { array: result });
        })
})

app.get('/viewhash', function (req, res) {

    var hash = url.parse(req.url, true).query.hash;
    blockcypher.getHash(hash)
        .then((result) => {
            console.log(result);
            res.render(viewhash_page, { tx: result })
        });
})
  
app.listen(port, () => console.log('Listening on port ' + port));


//var testAddr = 'mtXWDB6k5yC5v7TcwKZHB89SUp85yCKshy';

/* Dummy info
 * "private": "ece0a01195ad3289f6f4a90276d5e8e06e40a8e5f315c98794e24dc305301282"
 * "public": "024b29ecd2fb40f0725d0bff6c811c785352e176e31d1c79a661fd14c0c0bee0a8"
 * "address": "mk4UNSVkZzLmDHpkKne6NqdNeWh1wEQTFk"
 * "wif": "cVXAFxQHYHiF2GgTjPymxas7Ypgyv3Y4LUz6gGUXA1QtCtbz5EeA"
 */

// 17xpHyQQSUHBF3sHnpJYXEcv41z3NuGLJu