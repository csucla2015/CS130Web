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
  get_request_token: function(req, res) {
    rdio.getRequestToken(function(err, oauth_token, oauth_token_secret, results) {
      oauth_request_token = oauth_token; 
      oauth_request_token_secret = oauth_token_secret;
      //url = results.login_url.substring(0, results.login_url.length-1);
      console.log(results.login_url);
      res.redirect(results.login_url + '?oauth_token=' + oauth_token);
    });
  },

  get_access_token: function(req, res) {
    console.log('hi');
    console.log(req.query);
    rdio.getAccessToken(oauth_request_token, oauth_request_token_secret, req.query.oauth_verifier,
      function(error, oauth_token, oauth_token_secret, results) {
        oauth_access_token = oauth_token;
        oauth_access_token_secret = oauth_token_secret;
    });
  },

  search: function(req, res) {
    console.log('search was called');
    console.log(req.query);
    if (req.param('title') != null && req.param('phoneNumber') != null) {
      rdio.api(oauth_access_token, oauth_access_token_secret, {
        method: 'search',
        query: req.param('title'),
        types: ['Track'],
        count: '1'
      }, function(err, data, response) {
        console.log(data);
        data = JSON.parse(data);
        Playlist.findOne({phoneNumber: req.param('phoneNumber')}, function(err, playlist) {
          if (playlist.songs == null)
            playlist.songs = [data.result.results[0]];
          else
            playlist.songs.push(data.result.results[0]);
          playlist.save(function(err) {
            //res.redirect('/playlist?phonenumber=' + playlist.phoneNumber +
            //  '&songkey=' + data.result.results[0].key);
            console.log(playlist);
            res.status(200).json({'song': data.result.results[0]});
          });
        });
      });
    } else {
      res.view('search');
    }
  },

  create: function(req, res){
    res.view('create');
  }
};

