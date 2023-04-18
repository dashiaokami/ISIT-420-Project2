var express = require('express');
var router = express.Router();

// removed my file management code,

// add mongoDB support  ===============================

// mongoose is a API wrapper overtop of mongodb, just like
// .ADO.Net is a wrapper over raw SQL server interface
const mongoose = require("mongoose");

const OrderSchema = require("../orderSchema");


// edited to include my non-admin, user level account and PW on mongo atlas
// and also to include the name of the mongo DB that the collection is in (MoviesDB)
const dbURI = "mongodb+srv://talam:Black1337@tashibcluster.xzyxl.mongodb.net/OrdersDB?retryWrites=true&w=majority";
  //add correct connection string above

  // Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.


mongoose.set('useFindAndModify', false);

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10,
  useNewUrlParser: true, //delete if app has issues
  useUnifiedTopology: true
};

mongoose.connect(dbURI, options).then(
  () => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});

/* GET all Order data */
router.get('/getAllOrders', function(req, res) {
  // find {  takes values, but leaving it blank gets all}
  OrderSchema.find({}, (err, AllOrders) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(AllOrders);
  });
});

//Verify server is getting order
router.post('/oneOrder', function(req, res) {
  const newOrder = new OrderSchema(req.body);  // get the object from the req object sent from browser
  console.log(newOrder);
  // prepare a reply to the browser
  var response = {
    status  : 200,
    success : 'Server is receiving Order'
  }
  res.end(JSON.stringify(response)); // send reply
});

/* Add one new Order */
router.post('/addOrder', function(req, res) {

  let oneNewOrder = new OrderSchema(req.body);  
  console.log(req.body);
  oneNewOrder.save((err, todo) => {
    if (err) {
      res.status(500).send(err);
    }
    else {
      // console.log(todo);
      // res.status(201).json(todo);
      var response = {
        status  : 200,
        success : 'Added Successfully'
      }
      res.end(JSON.stringify(response)); // send reply
    }
  });
});

router.get('/sortPriceSalesPerson', function(req, res) {
  // find {  takes values, but leaving it blank gets all}
  OrderSchema.find({SalesPersonID:{$in: ['7', '13']}, PricePaid: {$gt:6, $lt:14}}, null, {sort: { SalesPersonID : 'asc' }}, (err, AllOrders) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(AllOrders);
  });
});

router.get('/sortStoreCdPrice', function(req, res) {
  // find {  takes values, but leaving it blank gets all}
  OrderSchema.find({PricePaid: {$gt:9, $lt:16}}, null, {sort: { StoreID:'asc', CdID:'asc', PricePaid : 'desc' }}, (err, AllOrders) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(AllOrders);
  });
});

// delete order
router.delete('/DeleteOrder/:ID', function (req, res) {
  OrderSchema.deleteOne({ ID: req.params.ID }, (err, note) => { 
    if (err) {
      res.status(404).send(err);
    }
    var response = {
      status  : 200,
      success : 'Order ' +  req.params.ID + ' deleted!'
    }
    res.end(JSON.stringify(response)); // send reply
  });
});


module.exports = router;
