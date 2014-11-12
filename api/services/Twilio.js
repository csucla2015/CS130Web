var AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN,
    ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;

var twilio = require('twilio');

var client = twilio(ACCOUNT_SID, AUTH_TOKEN);

module.exports = {
    getFreeNumbers : function(callback) {
        client.incomingPhoneNumbers.get(function(err, res) {
            if (err) {
                callback(err);
            }

            var numbers = [];
            // Should account for paging, but we can deal with that later
            for (var i in res.incoming_phone_numbers) {
                numbers.push(res.incoming_phone_numbers[i].phone_number);
            }

            console.log(numbers);
            
            Playlist.find({
                'phoneNumber' : numbers 
            }, function(err, playlists){
                if (err) {
                    callback(err);
                }

                // finds complement of num that exist in available numbers
                console.log(playlists);
                for(var j in playlists) {
                    var index = numbers.indexOf(playlists[j].phoneNumber);    
                    console.log(index);
                    numbers = numbers.slice(0, index).concat(numbers.slice(index+1));
                }
                callback(null,numbers);
            });
        });
    },
    textReceived : function(message) {
        var response = twilio.TwimlResponse();
        response.message(message);
        return response.toString();
    }
}
