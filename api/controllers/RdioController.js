/**
 * RdioController
 *
 * @description :: Server-side logic for managing rdios
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var request = require('request');
var qs = require('querystring');

var RDIO_ID = process.env.RDIO_ID,
    RDIO_SECRET = process.env.RDIO_SECRET;

var api = 'http://api.rdio.com';

module.exports = {
  auth : function(req, res) {
    request.post({
      url: api + '/oauth/request_token',
      oauth: {
        callback: 'http://localhost:1337/get_access_token',
        consumer_key: RDIO_ID,
        consumer_secret: RDIO_SECRET
      }
    }, function(e, r, body) {
      var response = qs.parse(body),
      login_url = response.login_url;
      url = login_url.substring(0, login_url.length-1);
      res.redirect(url + '?oauth_token=' + response.oauth_token);
    });
  },

  get_access_token : function(req, res) {
    request.post({
      url: api + '/oauth/access_token',
      oauth: {
        consumer_key: RDIO_ID,
        consumer_secret: RDIO_SECRET,
        token: req.query.oauth_token,
        verifier: req.query.oauth_verifier
      }
    }, function(e, r, body) {
      console.log(body);
    });
  }
};

