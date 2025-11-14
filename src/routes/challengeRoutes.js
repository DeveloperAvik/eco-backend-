const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const ctrl = require("../controllers/challengeController");

router.get("/", ctrl.getChallenges);
router.get("/:id", ctrl.getChallenge);
router.post("/", auth, ctrl.createChallenge);
router.patch("/:id", auth, ctrl.updateChallenge);
router.delete("/:id", auth, ctrl.deleteChallenge);
router.post("/join/:id", auth, ctrl.joinChallenge);

module.exports = router;
