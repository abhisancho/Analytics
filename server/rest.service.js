var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

var getConnection = function (uri, fCallback) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        database = db.db("analytics");
        fCallback(database, db);
    });
};

var promiseToResponse = function (res, promise) {
    promise.then(function (result) {
        res.json(result);
    });
};

//get all
router.get('/rest/:table', (req, res) => {
    getConnection(req.appconfig.dburl, function (database, db) {
        database.collection(req.params.table).find({}, (err, mongores) => {
            if (err) {
                res.status(500).json(err);
                database.close();
                return;
            }
            promiseToResponse(res, mongores.toArray());
            db.close();
        });
    });
});

//get by id
router.get('/rest/:table/:id', (req, res) => {
    getConnection(req.appconfig.dburl, function (database, db) {
        database.collection(req.params.table).findOne({ _id: ObjectId(req.params.id) }, (err, mongores) => {
            if (err) {
                res.status(500).json(err);
                database.close();
                return;
            }
            res.json(mongores);
            db.close();
        });
    });
});

//create
router.put('/rest/:table', (req, res) => {
    getConnection(req.appconfig.dburl, function (database, db) {
        database.collection(req.params.table).insert(req.body, (err, mongores) => {
            if (err) {
                res.status(500).json(err);
                database.close();
                return;
            }
            res.json(mongores);
            db.close();
        });
    });

});

//update
router.post('/rest/:table/:id', (req, res) => {
    var query = {
        _id: ObjectId(req.params.id)
    };
    getConnection(req.appconfig.dburl, function (database, db) {
        database.collection(req.params.table).updateOne(query, { $set: req.body }, (err, mongores) => {
            if (err) {
                res.status(500).json(err);
                database.close();
                return;
            }
            res.json(mongores);
            db.close();
        });
    });
});

//delete
router.delete('/rest/:table/:id', (req, res) => {
    getConnection(req.appconfig.dburl, function (database, db) {
        database.collection(req.params.table).deleteOne({ _id: ObjectId(req.params.id) }, (err, mongores) => {
            if (err) {
                res.status(500).json(err);
                database.close();
                return;
            }
            res.json(mongores);
            db.close();
        });
    });
});

// module.exports = {
//     router: router,
//     test: test
// };

module.exports = router;