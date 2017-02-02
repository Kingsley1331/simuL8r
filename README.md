# simuL8r


## Overview

simuL8r is a physics engine that when completed could be used for creating games as well as exploring Newtonian mechanics and other physics phenomena.
This project is at an early stage, currently it is possible for users to create objects that are able to collide with reasonably accurate physics, they are also able to save their work
to both a remote(mongodb) and local(indexedDB) database.

Eventually users should be able to the following:

- create game-like scenarios and actual games

- build simple mechanical machines such as two wheeled vehicles

- create scenes that are physically accurate enough to explore Newtonian mechanics

- create systems of particles capable of demonstrating thermodynamic concepts such as entropy


## Installation

To run this app on your local machine follow the steps below

- download node.js, visit https://nodejs.org/en/download/ and download the appropriate node.js installer

- click the "download ZIP" button on this page https://github.com/Kingsley1331/simuL8r

- from the Command Prompt "cd" into the simuL8r(or whatever you choose to call the main directory) directory and run the following command: "npm install"

- again from the Command Prompt run "bower install" from with the simuL8r directory.

- download the mongodb database from here https://www.mongodb.org/downloads#production, for setup details visit https://docs.mongodb.org/manual/installation/


## Running the Application

- from within the simuL8r directory run "node server" in the Command Prompt to launch the app

- open a web browser and visit http://localhost:5000/ to view and use the app


## Next Steps

- improve efficiency of the collision detection function

- separate overlapping shapes

- scale scenes up or down to accommodate different screen sizes without changing canvas size

- make friction between surfaces more physically accurate

- add metadata such as "date created" to scenes


## General Improvements

- stop relying on global variables

- apply better separation of concerns in js/app/coreApp/index.js and js/app/coreApp/physics.js

- remove repetition from code in coreApp directory
