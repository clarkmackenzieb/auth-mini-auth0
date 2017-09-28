const   express = require('express'),
        session = require ('express-session'),
        passport = require('passport'),
        Auth0Strategy = require('passport-auth0')
        port = 3005,
        { thesecret, thedomain, clientid, clientsecret } = require('./config');

const app = express();

app.listen(port, () => {
    console.log(`I'll be right by your side till ${3005}`);
})

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: thesecret
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('./public'));

passport.use(new Auth0Strategy({
    domain: thedomain,
    clientID: clientid,
    clientSecret: clientsecret,
    callbackURL: 'http://localhost:3005/auth/callback'
  }, function(accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);
  }));

app.get('/auth', passport.authenticate('auth0'));
app.get('/auth/callback', passport.authenticate('auth0', {successRedirect: '/me'}), (req, res, next) => {
    res.status(200).send(req.user);
})


passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

app.get('/me', (req, res, next) => {
    return res.json(req.user);
})  