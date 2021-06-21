const express = require("express");

const router = express.Router();

const saucesCtrl = require("../Controllers/sauces");

const auth = require("../Middleware/auth");
const multer = require("../Middleware/multer-config");


router.get("/", auth, saucesCtrl.getAllSauces); 
router.post("/", auth, multer, saucesCtrl.createSauce );
router.get("/:id", auth, saucesCtrl.getOneSauce);
router.put("/:id", auth, multer, saucesCtrl.modifySauce );
router.delete("/:id", auth, saucesCtrl.deleteSauce);
router.post("/:id/like", auth, saucesCtrl.likeDislike);

module.exports = router;
