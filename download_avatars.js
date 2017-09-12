const request = require('request');
const fs = require('fs');
const dotenv = require('dotenv').config('.env');
const githubAPI = require('./githubAPI.js');

const downloadDir = './avatars';

console.log('Welcome to the GitHub Avatar Downloader!');

const repositoryOwner = process.argv[2];
const repositoryName = process.argv[3];

if (repositoryOwner && repositoryName && repositoryOwner !== '' && repositoryName !== ''
  && process.argv.length === 4) { // makde sure repo owner and name exist and user provided correct # of args
    githubAPI.getRepoContributors(repositoryOwner, repositoryName, function(err, result) { // get all contributors for the project
      result.forEach(function(element) { // iterate through the returned list
        githubAPI.downloadImageByURL(element.avatar_url, `${downloadDir}/${element.login}.jpg`); // download their avatar
      });
    });
  }
  else { // error message when repo owner and repo name are not supplied
    console.log("The given number of arguments is incorrect", process.argv.length - 2 + "; Should be 2");
    console.log("Please supply a repository owner and a repository name");
    console.log("Usage:");
    console.log("\tnode download_avatars.js nodejs node");
  }