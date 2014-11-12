/**
 * PlaylistController
 *
 * @description :: Server-side logic for managing playlists
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    create : function(req,res) {
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
                    console.log("HELLO WORLD");
                    res.json(playlist);
                });
            }
        });
    }
};

