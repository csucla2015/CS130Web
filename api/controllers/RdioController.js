/**
 * RdioController
 *
 * @description :: Server-side logic for managing rdios
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var config = {
};

var rdio = require('rdio')(config);

var oauth_request_token;
var oauth_request_token_secret;
var oauth_access_token;
var oauth_access_token_secret;

module.exports = {
  has_access_token: function() {
    return oauth_access_token != null && oauth_access_token_secret != null;
  },

  get_request_token: function(req, res) {
    if (module.exports.has_access_token()) {
      res.redirect('/create');
    } else {
      rdio.getRequestToken(function(err, oauth_token, oauth_token_secret, results) {
        oauth_request_token = oauth_token; 
        oauth_request_token_secret = oauth_token_secret;
        url = results.login_url.substring(0, results.login_url.length-1);
        console.log(results.login_url);
        res.redirect(url + '?oauth_token=' + oauth_token);
      });
    }
  },

  get_access_token: function(req, res) {
    rdio.getAccessToken(oauth_request_token, oauth_request_token_secret, req.query.oauth_verifier,
      function(error, oauth_token, oauth_token_secret, results) {
        oauth_access_token = oauth_token;
        oauth_access_token_secret = oauth_token_secret;
        res.redirect('/create');
    });
  },

  search: function(req, res) {
    if (req.param('title') != null && req.param('phoneNumber') != null
        && req.param('playlistName') != null && req.param('playlistDesc') != null) {
      rdio.api(oauth_access_token, oauth_access_token_secret, {
        method: 'search',
        query: req.param('title'),
        types: ['Track'],
        count: '1'
      }, function(err, data) {
        var song, response;
        data = JSON.parse(data);
        Playlist.findOne({phoneNumber: req.param('phoneNumber')}, function(err, playlist) {
          if (playlist.songs == null) {
            // Create a new playlist
            song = data.result.results[0];
            playlist.songs = [song];
            rdio.api(oauth_access_token, oauth_access_token_secret, {
              method: 'createPlaylist',
              name: req.param('playlistName'),
              description: req.param('playlistDesc'),
              tracks: [song.key]
            }, function(err, data) {
              console.log('new playlist created');
              console.log(data);
              playlist.info = JSON.parse(data).result;
              playlist.save(function(err) {
                console.log(playlist);
                response = {
                  'playlist': playlist.info,
                  'newplaylist': true,
                  'song': song
                };
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(response);
              });
            });
          } else {
            // Add a song to the playlist
            playlist.songs.push(data.result.results[0]);
            newplaylist = false;
            song = data.result.results[0];
            rdio.api(oauth_access_token, oauth_access_token_secret, {
              method: 'addToPlaylist',
              playlist: playlist.info.key,
              tracks: [song.key]
            }, function(err, data) {
              console.log('song added to playlist');
              playlist.info = JSON.parse(data).result;
              playlist.save(function(err) {
                console.log(playlist);
                response = {
                  'newplaylist': false,
                  'song': song
                }
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(response);
              });
            });
          }
        });
      });
    } else {
      res.status(400).send('Required parameters are missing');
    }
  }
};

