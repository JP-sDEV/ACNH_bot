# Animal Crossing New Horizons Bot (ACNH_bot)

## Table of Contents 
* Installation  
* What is it?
* Technologies/Packages Used

# Installation 
1. `npm install` - installs required dependencies
2. `npm install --only=dev` (optional) - installs development dependencies
    * only install dev dependecies if you want to make changes, add features, etc.
3. `npm start` - runs main, posts new image to Twitter
    * script made to run on Unix-based machines
    * change to `rmdir /S /Q to run on Windows`
4. `npm run dev` - script to be used to run development settings

# What is it?
ACNH_bot, is a checks r/animalcrossingmeme every hour, and posts the top meme of that hour onto Twitter. 

# Technologies/Packages Used
* nodejs
* aws-sdk
* babel
* axios
* snoowrap
* twit
