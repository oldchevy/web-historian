// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var http = require('http');
var archive = require('../helpers/archive-helpers');

exports.fetchHTML = function(url) {

  //Grab all the websites that are in the list but haven't been archived yet
  archive.readListOfUrls(function(array) {
    array.forEach(function(oneUrl) {
      console.log('One entry:', oneUrl);
      archive.isUrlArchived(oneUrl, function(bool) {
        console.log('Bool for this entry: ', bool);
        if (!bool) {
          console.log('This is a valid thing we want to request');
          var options = {
            hostname: oneUrl,
          };
          var success = function(data) {
            console.log('We made it all the way down here:', data);
          };

          http.request(options, success);

          //Definitely know this is where we get the new HTML
          //Perform GET request???
        }
      });
    });
  });
    //Once you have that list, submit a GET request for the HTML of each one

    //Upon finishing, save that HTML to the archives/sites/ folder

};