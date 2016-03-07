# simuL8r
Physics Engine

# Overview

simuL8r is a physics engine that when completed could be used for creating games as well as exploring Newtonian mechanics and other physics phenomena.
This project is at an early stage, currently it is possible for users to create objects and collide with reasonably accurate physics and save their work
to both a remote(mongodb) and local(indexedDB) database.

Eventually users should be able to the following:

- create game-like scenarios and actual games 
- build simple mechanical machines such as two wheeled vehicles
- create scenes that are physically accurate enough to explore Newtonian mechanics
- create systems of particles capable of demonstrating thermodynamic concepts such as entropy
 

# Installation

To run this app on your local machine follow the steps below

1. Download node.js, visit https://nodejs.org/en/download/ and download the appropriate node.js installer

2. Click the "download ZIP" button on this page https://github.com/Kingsley1331/simuL8r

3. From the Command Prompt "cd" into the simuL8r directory and run the following command: "npm install"

4. Again from the Command Prompt run "bower install" from with the simuL8r directory.

5. Download the mongodb database from here https://www.mongodb.org/downloads#production, for setup details visit https://docs.mongodb.org/manual/installation/


# Running the application 

1. From within the simuL8r directory run "node server" in the Command Prompt to launch the app

2. Open a web browser and visit http://localhost:5000/ to view and use the app


# Next steps 

- improve efficiency of the collision detection function
- separate overlapping shapes
- scale scenes up or down to accommodate different screen sizes without changing canvas size
- make friction between surfaces more physically accurate
- add metadata such as "date created" to scenes