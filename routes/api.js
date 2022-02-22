const router = require("express").Router();
const Transaction = require("../model/transaction");

//Creates a single transaction using the req body
router.post("/api/transaction", ({body}, res) => {
  Transaction.create(body)
    .then(dbTransaction => {
      res.status(201).json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

//Creates a batch (array) of transactions
router.post("/api/transaction/bulk", ({body}, res) => {
  Transaction.insertMany(body)
    .then(dbTransaction => {
      res.status(201).json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

//gets all transactions and sorts by date descending
router.get("/api/transaction", (req, res) => {
  Transaction.find({}).sort({date: -1})
    .then(dbTransaction => {
      res.status(200).json(dbTransaction);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

module.exports = router;