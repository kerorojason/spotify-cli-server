const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const keys = require('../config/keys');

passport.use(
  new SpotifyStrategy(
    {
      clientID: keys.spotifyClientID,
      clientSecret: keys.spotifyClientSecret,
      // callbackURL: 'http://localhost:8080/auth/spotify/callback'
      callbackURL: '/auth/spotify/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = { accessToken, refreshToken };
      return done(null, user);
    }
  )
);
