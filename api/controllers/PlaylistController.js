/**
 * PlaylistController
 *
 * @description :: Server-side logic for managing playlists
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    index : function(req, res) {
        var phoneNumber = req.param('phonenumber');
        var songkey = req.param('songkey');
        if (phoneNumber) {
            // if phoneNumber exists then return one playlist
            Playlist.findOne({
                'phoneNumber' : phoneNumber
            }, function(err, playlist) {
                if (err) {
                    return res.serverError(err);
                }
                console.log(JSON.stringify(playlist));
                res.view('playlist', {playlist:playlist, songkey:songkey});
                //return res.json(playlist);
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
        var name = req.param('name');
        var description = req.param('description');
        //var filters = [req.param('filter1'), req.param('filter2')];
        Twilio.getFreeNumbers(function(err, numbers) {
            if (numbers.length <=0) {
                return res.send(402,{
                    message : 'No free numbers left on Twilio Account'  
                });
            }
            if (numbers) {
                var number = numbers[0];
                Playlist.create({
                    name : name,
                    description : description,
                    phoneNumber : number,
                    //filters : filters
                }, function(err, playlist) {
                    if (err) {
                        return res.serverError(err);
                    }
                    res.redirect('/playlist?phonenumber=' + playlist.phoneNumber);
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
    },
    playlist: function(req, res) {
        Playlist.findOne({
            'gt': {id:0}
        }, function(err, playlist) {
            if (err) {
                return res.serverError(err);
            }
            res.view('playlist', {playlist:playlist});
        });
    }
};
