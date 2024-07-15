# Axure-Sync-Server

If you have any questions, please contact Jarne.

## Important setup instructions

In our axure-project you have to set the string value of global variable `ServerURL` to either:

- `http://localhost:3001/`
  or
- `https://express-axure-test.onrender.com/`
  depending on if you want to use a local server for the project or the hosted one Jarne provides. The hosted server goes to sleep after 15 minutes of inactivity and you have to wait for about 50 seconds before your first request can be processed and the server is back up. If you choose local you can only test the prototype from the perspective of multiple people with different browser tabs on your PC. If you choose the hosted online server you can pick any devices (e.g. multiple mobile devices and a PC).

## Resetting the server

To reset the entire internal server-state please just open your browser and open the `/reset`-Route of the server (local `http://localhost:3001/reset` or online `https://express-axure-test.onrender.com/reset` , depending on your previous choice).
This will create a get request for the `/reset`-Route and the server will reset its state. Then in the axure prototypes you must return the Landingpage and reload the page. Then you can click through the prototype again.

## Starting your local server

- clone this repo
- Build Command: `yarn` or `npm install`
- Start Command: `node app.js`
