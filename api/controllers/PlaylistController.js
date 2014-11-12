/**
 * PlaylistController
 *
 * @description :: Server-side logic for managing playlists
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index : function(req, res) {
        var phoneNumber = req.param('phonenumber');
        if (phoneNumber) {
            // if phoneNumber exists then return one playlist
            Playlist.findOne({
                'phoneNumber' : phoneNumber
            }, function(err, playlist) {
                if (err) {
                    return res.serverError(err);
                }
                return res.json(playlist);
            });
        } else {
            Playlist.find({}, function(err, playlists) {
                if (err) {
                    return res.serverError(err);
                }
                return res.json(playlists);
            });
        }
    },
    create : function(req, res) {
        var playlistName = req.param('name');
        Twilio.getFreeNumbers(function(err, numbers) {
            if (numbers.length <=0) {
                return res.send(402,{
                    message : 'No free numbers left on Twilio Account'  
                });
            }
            if (numbers) {
                var number = numbers[0];
                Playlist.create({
                    playlistName : playlistName,
                    phoneNumber : number
                }, function(err, playlist) {
                    if (err) {
                        return res.serverError(err);
                    }
                    return res.json(playlist);
                });
            }
        });
    },
    addSong : function(req, res) {
        var twilioNum = req.param('To'),
            clientNum = req.param('From'),
            body = req.param('Body');
        Playlist.findOne({
            phoneNumber : twilioNum
        }, function(err, playlist) {
            if (err) {
                return res.serverError(err);
            }
            if (playlist.songs) {
                playlist.songs.push(body);
            } else {
                playlist.songs = [body];
            }
            playlist.save(function(err) {
                if (err) {
                    return res.serverError(err);
                }
                twiML = Twilio.textReceived(body + ' was added to the playlist: ' + playlist.playlistName);
                res.send(twiML);
            });
        });
    }
};
