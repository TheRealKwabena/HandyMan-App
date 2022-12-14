var express = require("express");
var router = express.Router();
var SHA3 = require("sha3");
const jwt = require("jsonwebtoken");
var encryptionJWTKey = require("../../Domain/Constants.js");

const HandyMan = require("../../Infrastructure/models/HandyManSchema");
const Review = require("../../Infrastructure/models/ReviewSchema");
const Request = require("../../Infrastructure/models/RequestSchema");
const Client = require("../../Infrastructure/models/ClientSchema");

//Sign up handyman
router.post("/api/handymen", async function (req, res, next) {
  const hash = new SHA3.SHA3(512);
  hash.update(req.body.password);
  req.body.password = hash.digest("hex");
  req.body.accessToken = jwt.sign({ data: "123" }, encryptionJWTKey);
  await HandyMan.findOne({email: req.body.email}, (err, handyman) => {
    if (err) return res.status(500).send(err);
    if (handyman === null) {
      var handyMan = new HandyMan(req.body);
      handyMan.save(function (err, handyman) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(201).json(handyman);
        }
      });
    } else {
      return res.status(400).send('A handyman with that email already exists.');
    }
  })
});

//Get all handymen
router.get("/api/handymen", function (req, res, next) {
  if (req.query.profession) {
    HandyMan.find({ profession: { $all: [req.query.profession] } }).exec(
      (err, handymen) => {
        if (err) {
          return res.status(500).send(err);
        }
        return res.status(200).json(handymen);
      }
    );
  } else if (req.query.area) {
    HandyMan.find({ area: {$all: [req.query.area]}}).exec(
      (err, handymen) => {
        if (err) {
          return res.status(500).send(err);
        }
        return res.status(200).json(handymen)
      }
    );
  } else {
    HandyMan.find({}).then(function (err, handymen) {
      if (err) {
        return res.send(err);
      }
      return res.status(200).json({ handymen: handymen });
    });
  }
});

//Get specific handyman
router.get("/api/handymen/:id", function (req, res, next) {
  HandyMan.findById(req.params.id)
  .populate("reviews", "requests")
  .then((handyman) => {
    if (handyman) {
      return res.status(200).json(handyman);
    } else {
      return res.send("No such handyman exists!");
    }
  }).catch(err => {return res.send(err);});
});

//Update handyman profile details
router.put("/api/handymen/:id", function (req, res) {
  HandyMan.findById(req.params.id, (err, handyman) => {
    if (err) return res.status(500).send(err);
    if (!handyman) {
      return res.status(404).send("Handyman could not be found.");
    }
  })
    .then((handyman) => {
      handyman.firstName = req.body.firstName;
      handyman.lastName = req.body.lastName;
      handyman.phoneNumber = req.body.phoneNumber;
      handyman.area = req.body.area;
      handyman.profession = req.body.profession;
      handyman.save(() => {
        return res.status(200).json(handyman);
      });
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

//Patch handyman attributes
router.patch("/api/handymen/:id", function (req, res) {
  HandyMan.findById(req.params.id, (err, handyman) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (!handyman) {
      return res.status(404).send("Handyman could not be found.");
    }
    handyman.firstName = req.body.firstName || handyman.firstName;
    handyman.lastName = req.body.lastName || handyman.lastName;
    handyman.password =
      new SHA3.SHA3(512).update(req.body.password).digest("hex") ||
      handyman.password;
    handyman.phoneNumber = req.body.phoneNumber || handyman.phoneNumber;
    handyman.area = req.body.area || handyman.area;
    handyman.profession = req.body.profession || handyman.profession;
    handyman.save(() => {
      return res.status(200).json(handyman);
    });
  }).catch((err) => {
    return res.status(500).send(err);
  });
});

//Delete all handymen
router.delete("/api/handymen", async function (req, res) {
  await HandyMan.collection
    .deleteMany({})
    .then(() => {
      return res.status(204).send("All handymen deleted successfully.");
    })
    .catch((err) => {
      return res.send(err);
    });
});

//Delete one handyman
router.delete("/api/handymen/:id", function (req, res) {
  HandyMan.findByIdAndRemove(req.params.id, {useFindAndModify: false})
    .then((handyman) => {
      if (handyman == null) {
        return res.status(404).send('Handyman not found.')
      }
      res
        .status(204)
        .json(`User with id ${req.params.id} successfully deleted.`);
    })
    .catch((err) => {
      console.log(err);
      res.send('Handyman could not be deleted.');
    });
});

//Create a request for a specific handyman
router.post("/api/handymen/:id/requests", async function (req, res) {
  let request = new Request({
    handyman: req.params.id,
    client: req.body.client,
    address: req.body.address,
    job: req.body.job,
    date: req.body.date,
    description: req.body.description,
  });
  request.save(function (err, new_request) {
    if (err) {
      return res.status(500).send(err);
    }
    Client.findById(new_request.client, (err, client) => {
      if (err) return res.status(500).send(err);
      if (!client) return res.status(400).send("Client does not exist.");
      client.requests.push(new_request._id);
      client.save().then(() => {    
        HandyMan.findById(new_request.handyman, (err, handyman) => {
          if (err) return res.status(500).send(err);
          if (!handyman) return res.status(400).send("Handyman does not exist.");
          handyman.requests.push(new_request._id);
          handyman.save().then(() => {
            res.status(201).json(new_request);
          });
        });
      });
    });
  });
});

//Create a review for a specific handyman
router.post("/api/handymen/:id/reviews", function (req, res) {
  let review = new Review({
    rating: req.body.rating,
    comment: req.body.comment,
    sender: req.body.sender,
    to: req.params.id,
  });
  review.save(function (err, new_review) {
    if (err) {
      return res.status(500).send(err);
    }
    HandyMan.findById(new_review.to, (err, handyman) => {
      if (handyman == null) return res.status(404).send("Handyman not found.");
      handyman.reviews.push(new_review._id);
      handyman.save().then(() => {
        res.status(201).json(new_review);
      });
    });
  });
});

//Retrieve all reviews made to specific handyman
router.get("/api/handymen/:id/reviews", async function (req, res) {
  HandyMan.findById(req.params.id, { reviews: 1 })
    .populate("reviews")
    .exec((err, handyman) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).json(handyman.reviews);
    });
});

//Gets all requests of a handyman
router.get("/api/handymen/:id/requests", async function (req, res) {
  HandyMan.findById(req.params.id, { requests: 1 })
    .populate("requests")
    .exec((err, handyman) => {
      if (err) {
        return res.status(400).send(err);
      }
      if (!handyman) {
        return res.status(404).send('Handyman was not found.')
      }
      return res.status(200).json(handyman.requests);
    });
});

//Retrieve specific request of specific handyman
router.get("/api/handymen/:id/requests/:rq_id", async function (req, res) {
  HandyMan.findById(req.params.id, { requests: 1 })
    .populate("requests")
    .exec((err, handyman) => {
      if (err) {
        return res.send(err);
      }
      const desiredReq = handyman.requests.filter(
        (request) => request._id == req.params.rq_id
      );
      return res.status(200).json(desiredReq);
    });
});

module.exports = router;
