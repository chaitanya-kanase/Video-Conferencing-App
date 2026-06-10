const { Router } = require("express");
const { addToHistory, getUserHistory, login, register } = require("../controller/user.controller");



const router = Router();

router.route("/login").post(login)
router.route("/register").post(register)
router.route("/add_to_activity").post(addToHistory)
router.route("/get_all_activity").get(getUserHistory)

module.exports =  router;