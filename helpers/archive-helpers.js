var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {

  //Async readFile only executes callback arg when reading has finished
  //Callback passed to readListOfUrls is then invoked on entire array of results
  fs.readFile(this.paths.list, 'utf8', function(err, data) {
    var results = data.split('\n');
    callback(results);
  });


};

exports.isUrlInList = function(string, callback) {
  
  //A less abstracted example of what is happening 

  // fs.readFile(this.paths.list, 'utf8', function(err, data) {
  //   var results = data.split('\n');
  //   bool = _.contains(results, string);
  //   callback(bool);
  // });

  //Here, the array arg is the results array from above
  
  this.readListOfUrls(function(array) {
    callback(_.contains(array, string));
  });


};

exports.addUrlToList = function() {
};

exports.isUrlArchived = function() {
};

exports.downloadUrls = function() {
};
