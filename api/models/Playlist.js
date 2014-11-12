/**
* Playlist.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    attributes: {
        playlistName : {
            type: 'string',
            required: true
        },
        phoneNumber : {
            type: 'string',
            required: true
        },
        songs : {
            type: 'array'
        }
    }
};

