const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const session = require("express-session");
const RedisStore = require('connect-redis')(session);

const passport = require("passport");

// Routes
const authRoutes = require("./routes/auth");
const songsRoutes = require("./routes/songs");
const userRoutes = require("./routes/users");

require("./passport");

//GET /users get all users
//GET /users/:id get single user
//POST /users create
//PUT /users/:id update user
//DELECT /users/:id 

express()
	.set("view engine", "hjs")
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({extended: false}))
	.use(session({
		store: new RedisStore(),
		secret: "two lost souls",
		resave: false,
		saveUninitialized: false
	}))
	.use(passport.initialize())
	.use(passport.session())
	.use(authRoutes)
	.use(songsRoutes)
	.use(userRoutes)
	.get("/", (req, res, next) => {
		res.send({
			session: req.session,
			user: req.user,
			authenticated: req.isAuthenticated()
		})
	})
	.listen(3000)
;