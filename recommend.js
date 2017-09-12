const request = require('request');
const fs = require('fs');
const dotenv = require('dotenv').config('.env');
const githubAPI = require('./githubAPI.js');

const apiCredentials = {
  username: process.env.GITHUB_USER,
  token: process.env.GITHUB_TOKEN
}

const repositoryOwner = process.argv[2];
const repositoryName = process.argv[3];

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
  });
}

function getStarredRepos(starredUrl, cb) {
  const options = { // github reuires that a User-Agent is passed so we must use the options object
    url: starredUrl.split('//').join(`//${apiCredentials.username}:${apiCredentials.token}@`).replace('{/owner}{/repo}', ''),
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project'
    }
  }

  console.log(options.url);

  request(options, function(error, response, body) {
    if (error) { // display error if true
      console.log("The following error occurred:", error);
      return;
    }
    else if (response && response.statusCode === 404) {
      console.log(`404 - ${options.starred_url} was not found!`);
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
  });
}

const starredRepositories = [];
//{id: 123, name: superRepo, count: 5},

if (fs.existsSync('.env')) { // make sure .env file isn't missing
if (apiCredentials.username && apiCredentials.token) { // make aure api credentials exist
  if (repositoryOwner && repositoryName && repositoryOwner !== '' && repositoryName !== ''
    && process.argv.length === 4) { // makde sure repo owner and name exist and user provided correct # of args
      getRepoContributors(repositoryOwner, repositoryName, function(err, result) { // get all contributors for the project
        result.forEach(function(contributor) { // iterate through the returned list
          console.log(contributor.starred_url);
          getStarredRepos(contributor.starred_url, function(err, result) {
            result.forEach(function(starredRepo) {
              starredRepositories.forEach(function(element) {
                console.log(starredRepo.id);
                if (element.id[starredRepo.id]) {
                  element.id[starredRepo.id].count++;
                }
                else {
                  starredRepositories.push({id: starredRepo.id, repoName: starredRepo.name, owner: starredRepo.owner.login, starredCount: 1})
                }
              });
              console.log(starredRepositories);
            });
          });
        });
      });
    }
    else { // error message when repo owner and repo name are not supplied
      console.log("The given number of arguments is incorrect", process.argv.length - 2 + "; Should be 2");
      console.log("Please supply a repository owner and a repository name");
      console.log("Usage:");
      console.log("\tnode download_avatars.js nodejs node");
    }
}
else {
  console.log(".env file is missing information!");
}
}
else {
console.log(".env file with api credentials is missing!");
}