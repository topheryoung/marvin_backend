const passport = require("passport");
const router = require("express").Router();
const db = require("../db");

function loginRequired(req, res, next) {
	if(!req.isAuthenticated()) {
		return res.redirect("/login")
	}
	next();
}

router
	.get("/songs", loginRequired, (req, res, next) => {
		db("songs").then((songs) => {
			res.send(songs)
		}, next)
	})
	.get("/songs/:id", loginRequired, (req, res, next) => {
		const { id } = req.params;
		db("songs")
			.where("id", id)
			.first()
			.then((songs) => {
				if (!songs) {
					return res.sendStatus(400)
				}
				res.send(songs)
			}, next)
	})
	.post("/songs", loginRequired, (req, res, next) => {
		db("songs")
			.insert(req.body)
			.then((songIds) => {
				res.send(songIds)
			}, next)
	})
	.put("/songs/:id", loginRequired, (req, res, next) => {
		const { id } = req.params;
		db("songs")
			.where("id", id)
			.update(req.body)
			.then((result) => {
				if (result === 0 ) {
					return res.sendStatus(400)
				}	
				res.send(200);
			}, next)
	})
	.delete("/songs/:id", loginRequired, (req, res, next) => {
		const { id } = req.params;
		db("songs")
			.where("id", id)
			.delete()
			.then((result) => {
				if (result === 0 ) {
					return res.sendStatus(400)
				}	
				res.send(200);
			}, next)
	})
;

module.exports = router;