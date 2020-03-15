const passport = require('passport');
const axios = require('axios');
const keys = require('../config/keys');

module.exports = app => {
  app.get(
    '/auth/spotify',
    passport.authenticate('spotify', {
      scope: [
        'streaming',
        'user-read-private',
        'playlist-read-private',
        'user-modify-playback-state',
        'user-read-playback-state'
      ],
      showDialog: true
    }),
    function(req, res) {
      // The request will be redirected to spotify for authentication, so this
      // function will not be called.
    }
  );

  app.get(
    '/auth/spotify/callback',
    passport.authenticate('spotify', { session: false, failureRedirect: '/login' }),
    function(req, res) {
      const template = `
          <script type='text/javascript'>
            fetch("http://localhost:8080/login", {
              method: "POST",
              body: JSON.stringify({
                "accessToken": "${req.user.accessToken}",
                "refreshToken": "${req.user.refreshToken}"
              }),
              headers: new Headers({
                'Content-Type': 'application/json'
              }),
              mode: "cors"
            });
          </script>
          <body><p>Login successfully!</p></body>
        `;
      return res.send(template);
    }
  );

  app.post('/api/refresh_token', (req, res) => {
    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      params: {
        grant_type: 'refresh_token',
        refresh_token: req.body.refreshToken
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(`${keys.spotifyClientID}:${keys.spotifyClientSecret}`).toString('base64')
      }
    })
      .then(result => {
        res.send(result.data.access_token);
      })
      .catch(error => console.log(error));
  });
};
