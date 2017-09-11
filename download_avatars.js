const request = require('request');
const fs = require('fs');
const dotenv = require('dotenv').config('.env');

const apiCredentials = {
  username: process.env.GITHUB_USER,
  token: process.env.GITHUB_TOKEN
}

console.log(apiCredentials);
// const GITHUB_USER = 'audishos';
// const GITHUB_TOKEN = '4bb1bbc514fce6c9ade965f65d5b0ade3ebf1b13';

console.log('Welcome to the GitHub Avatar Downloader!');

const REPOOWNER = process.argv[2];
const REPONAME = process.argv[3];

// gets the contrubutors for the specified repo owner and repo name
// accepts a callback in order to process the list
function getRepoContributors(repoOwner, repoName, cb) {
  const options = { // github reuires that a User-Agent is passed so we must use the options object
    url: `https://${apiCredentials.username}:${apiCredentials.token}@api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project'
    }
  }

  request(options, function(error, response, body) {
    if (error) { // display error if true
      console.log("The following error occurred:", error);
      return;
    }
   if (response && response.statusCode !== 200) { // display response if not 200
     console.log("The request was not successful. Response code:", response.statusCode);
     return;
   }
    cb(null, JSON.parse(body)); // parse body and return it to the callback function
  });
}

// downloads the image at the specified URL to the specified path
function downloadImageByURL(url, filePath) {
  request.get(url)
  .on('error', function(error) {
    console.log("The following error occurred:", error);
  })
  .on('response', function(response) {
    if (response && response.statusCode !== 200) {
      console.log("The request was not successful. Response code:", response.statusCode);
    }
    else {
      console.log(`Downloading ${url} to ${filePath} ...`);
    }
  })
  .on('end', function() {
    console.log(`Download of ${url} to ${filePath} is complete!!`);
  })
  .pipe(fs.createWriteStream(filePath));

}

if (REPOOWNER && REPONAME && REPOOWNER !== '' && REPONAME !== '') {
  getRepoContributors(REPOOWNER, REPONAME, function(err, result) { // get all contributors for the project
    result.forEach(function(element) { // iterate through the returned list
      downloadImageByURL(element['avatar_url'], `./avatars/${element['login']}.jpg`); // download their avatar
    });
  });
}
else { // error message when repo owner and repo name are not supplied
  console.log("Please enter a repository owner and a repository name");
  console.log("Usage:");
  console.log("\tnode download_avatars.js nodejs node");
}