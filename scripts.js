let local = true;
  
let urlLocal = 'http://localhost:3001/';
let urlHostedServer = 'https://express-axure-test.onrender.com/';

let url = local ? urlLocal : urlHostedServer;
  
async function get() {
  try {
    const response = await fetch(url, { method: 'GET' });
    const state = await response.text();
    console.log('Current server state:', state);
    if (window.$axure) {
      $axure.setGlobalVariable('apiData', state);
    }
  } catch (error) {
    console.error('Error fetching server state:', error);
  }
}

async function post() {
  try {
    const response = await fetch(url, { method: 'POST' });
    const message = await response.text();
    console.log('Server state updated:', message);
  } catch (error) {
    console.error('Error updating server state:', error);
  }
}


  