const bcrypt = require("bcrypt-nodejs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("./db");

passport.use(new LocalStrategy(authenticate));
passport.use("local-register", new LocalStrategy({passReqToCallback: true}, register))

function authenticate(email, password, done) {
	db("users")
		.where("email", email)
		.first()
		.then((user) => {
			if(!user || !bcrypt.compareSync(password, user.password)) {
				return done(null, false, {message: "Invalid user and password combination"});
			}
			done(null, user)
		}, done)
};

function register(req, email, password, done) {
	db("users")
		.where("email", email)
		.first()
		.then((user) => {
			if(user) {
				return done(null, false, {message: "User with that email already"});
			}
			if(password !== req.body.password2) {
				return done(null, false, {message: "Passwords dont match"})
			}

			const newUser =  {
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				userName: req.body.userName,
				email: email,
				password: bcrypt.hashSync(password)
			};

			db("users")
				.insert(newUser)
				.then((ids) => {
					newUser.id = ids[0]
					done(null, newUser)
			})
		})
}

passport.serializeUser(function(user, done) {
	done(null, user.id)
});

passport.deserializeUser(function(id, done) {
	db("users")
		.where("id", id)
		.first()
		.then((user) => {
			done(null, user)
		}, done)
});