const passport = require("passport");
const router = require("express").Router();
const db = require("../db");

function loginRequired(req, res, next) {
	if(!req.isAuthenticated()) {
		return res.redirect("/login")
	}
	next();
}

function adminRequired(req, res, next) {
	if (!req.user.isAdmin) {
		return res.render("403")
	}
	next();
}

router
	.get("/users", loginRequired, adminRequired, (req, res) => {
		db("users").then((users) => {
			res.send(users)
		})
		.catch((err) => { res.send(err) })
	})
;

module.exports = router;