function checkRequirements() {
  const request = require('request');
  const fs = require('fs');
  const dotenv = require('dotenv').config('.env');

  let pass = true;

  if (!fs.existsSync('.env')) {
    console.log(".env file with api credentials is missing!");
    pass = false;
  }
  else if (!process.env.GITHUB_USER || !process.env.GITHUB_TOKEN) {
    console.log(".env file is missing information!");
    pass = false;
  }

  return pass;
}

// gets the contrubutors for the specified repo owner and repo name
// accepts a callback in order to process the list
function getRepoContributors(repoOwner, repoName, cb) {
  const request = require('request');
  const fs = require('fs');
  const dotenv = require('dotenv').config('.env');

  const apiCredentials = {
    username: process.env.GITHUB_USER,
    token: process.env.GITHUB_TOKEN
  }
  const options = { // github reuires that a User-Agent is passed so we must use the options object
    url: `https://${apiCredentials.username}:${apiCredentials.token}@api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project'
    }
  }

  request(options, function(error, response, body) {
    const request = require('request');
    const fs = require('fs');
    const dotenv = require('dotenv').config('.env');

    const apiCredentials = {
      username: process.env.GITHUB_USER,
      token: process.env.GITHUB_TOKEN
    }

    const downloadDir = './avatars';

    if (checkRequirements()) {

        if (error) { // display error if true
          console.log("The following error occurred:", error);
          return;
        }
        else if (response && response.statusCode === 404) {
          console.log(`404 - https://github.com/${repoOwner}/${repoName} was not found!`);
          return;
        }
        else if (response && response.statusCode === 401) {
          console.log("401 - Incorrect credentials. This is likely because your token is incorrect!");
          return;
        }
        else if (response && response.statusCode !== 200) { // display response if not 200
          console.log("The request was not successful. Response code:", response.statusCode);
          return;
        }
        cb(null, JSON.parse(body)); // parse body and return it to the callback function
      }
      else {
        return;
    }
  });
}

// downloads the image at the specified URL to the specified path
function downloadImageByURL(url, filePath) {
  const request = require('request');
  const fs = require('fs');
  const dotenv = require('dotenv').config('.env');

  const apiCredentials = {
    username: process.env.GITHUB_USER,
    token: process.env.GITHUB_TOKEN
  }

  const downloadDir = filePath.split('/').slice(0, -1).join('/');

  if(checkRequirements()) {

    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir);
    }
    request.get(url)
    .on('error', function(error) {
      console.log("The following error occurred:", error);
    })
    .on('response', function(response) {
      if (response && response.statusCode === 200) {
        console.log(`Downloading ${url} to ${filePath} ...`);
      }
      else if (response && response.statusCode === 404) {
        console.log(`404 - ${url} was not found!`)
      }
      else {
        console.log("The request was not successful. Response code:", response.statusCode);
      }
    })
    .on('end', function() {
      console.log(`Download of ${url} to ${filePath} is complete!!`);
    })
    .pipe(fs.createWriteStream(filePath));
  }
  else {
    return;
  }
}

module.exports = {
  getRepoContributors: getRepoContributors,
  downloadImageByURL: downloadImageByURL
};