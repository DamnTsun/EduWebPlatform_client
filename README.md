# EduWebPlatform_client

This is the client / frontend for the educational web platform.

*This README expects you to have already read through and set up the API / backend. Please do so before continuing if you have not yet done this.*

# Prerequisites

In order to run the solution, you will need the following:
* A modern web browser, such as Google Chrome or Mozilla Firefox.
* Node.js and npm installed on your machine.
* The 'Client ID' and 'App ID' keys generated using your Google and Facebook accounts. These keys **must** correspond to the 'Client Secret' / 'App Secret' keys used on the API.

# Setting up the System

To setup the system, do the following:
1. Open ```src/environments/environment.prod.ts``` and ```src/environments/environment.ts```.
2. For both, change the ```environment.apiUrl``` attribute to the URL that the API is hosted at, such as ```https://api.domain.com/```.
3. Open ```src/app/app.module.ts```.
4. Find the config object, this will contain two objects, one for sign in with Google functionality, and one for sign in with Facebook functionality.
```TypeScript
let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('{{google_client_id}}', googleLoginOptions)
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('{{facebook_client_id}}')
  }
]);
```
5. Update the values of ```{{google_client_id}}``` and ```{{facebook_app_id}}``` with your Google client ID / Facebook app ID.

# Building the System

To build the system, do the following:
1. Open the Node.js commandprompt.
2. Navigate to where you have downloaded the system.
3. Enter ```npm install``` to install dependencies.
4. Enter ```ng serve``` to run the system on a localhost server.
5. Open your web browser and go to ```http://localhost:4200```. This should show the system. From here you can check that the system is acting as expected.
6. When you wish to deploy the system, enter ```ng build --prod```. This will build the system into production mode.
7. Navigate into the folder named ```dist```. This is where Angular outputs the built system.
8. Simply copy the files inside the ```dist``` folder to where ever you want to host the system.
