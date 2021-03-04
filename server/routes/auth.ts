/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
import express from 'express';

const passport = require('passport');

const session = require('express-session');


// const InstagramStrategy = require('passport-instagram').Strategy;

const FacebookStrategy = require('passport-facebook').Strategy;

const db = require('../models/UserModel.ts');

const variables = require('../../settings.ts');

const app = express();

app.use(express.json());

passport.serializeUser(function (user: any, done: (arg0: null, arg1: any) => void) {
  done(null, user);
});
passport.deserializeUser(function (obj: any, done: (arg0: null, arg1: any) => void) {
  done(null, obj);
});


app.use(session({ 
  secret: variables.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
 }));

app.use(passport.initialize());
app.use(passport.session());

app.get("/user/get", function (req, res) {
  res.render("account", { user: req.user });
});

app.get('/user', (req: express.Request, res, next) => {
  console.log('in /user');
  if (!req.user) {
    console.log('error ocurred')
    res.status(300).send('no user found');
  } else {
    console.log('no error')
    res.status(200).json(req.user)
  }
});

// let URL: string;
// if (process.env.NODE_ENV === 'development') {
//   URL = 'localhost:3000';
// } else {
//   URL = 'localhost:8080';
// }

passport.use(new FacebookStrategy({
  clientID: variables.FACEBOOK_APP_ID,
  clientSecret: variables.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:8080/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'email']
}, async function (accessToken: string, refreshToken: any, profile: { id: any; displayName: string }, done: (arg0: null, arg1: any) => any) {
  // asynchronous verification, for effect...
  const findUser = "SELECT * FROM users WHERE facebook_id = $1";
  const params = [profile.id];
  let user = await db
    .query(findUser, params)
    .then((data: { rows: any[]; }) => data.rows[0])
    .catch((err: string | undefined) => {
      throw new Error(err);
    });
  if (!user) {
  const postQuery = `
          INSERT INTO users (facebook_id, username, password)
          VALUES ($1, $2, $3)
          RETURNING *
        `;

    const createUserParams = [
      profile.id,
      profile.displayName,
      accessToken
    ];
     user = await db
      .query(postQuery, createUserParams)
      .then((data: { rows: any[]; }) => data.rows[0])
      .catch((err: string | undefined) => {
        throw new Error(err);
      });
  } 
  return done(null, user);
  }
  )
  );

app.get('/auth/facebook',
  passport.authenticate('facebook'));

  app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.locals.user = req.user
    console.log('req user', res.locals)
    res.redirect('http://localhost:8080/');
  });

module.exports = app;