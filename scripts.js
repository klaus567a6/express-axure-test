let local = true;
let urlLocal = 'http://localhost:3001/';
let urlHostedServer = 'https://express-axure-test.onrender.com/';
let baseUrl = "";

$axure.internal(function ($ax) {
  $ax.public.getGlobalVariable = $ax.getGlobalVariable = function (name) {
      return $ax.globalVariableProvider.getVariableValue(name);
  };
});


if (window.$axure) {
  baseUrl = $axure.getGlobalVariable('ServerURL');
}


async function resetServerState() {
  try {
    const response = await fetch(`${baseUrl}reset`, { method: 'GET' });
    const message = await response.text();
    console.log('Reset server state:', message);
  } catch (error) {
    console.error('Error resetting server state:', error);
  }
}


async function updateCode() {
  console.log('Updating code...');
  let code = 0;
  try {
    if(window.$axure) {
      code = $axure.getGlobalVariable('SessionCode');
      username = $axure.getGlobalVariable('Username');
      console.log('Code from Axure:', code);
    }
    const response = await fetch(`${baseUrl}code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, username }),
    });
    const message = await response.text();
    console.log('Code updated:', message);
  } catch (error) {
    console.error('Error updating code:', error);
  }
}

// Fetch the current code
async function getCode() {
  try {
    const response = await fetch(`${baseUrl}code`, { method: 'GET' });
    const code = await response.text();
    if (window.$axure) {
            $axure.setGlobalVariable('SessionCode',  code);
    }
    console.log('Current code:', code);
  } catch (error) {
    console.error('Error fetching code:', error);
  }
}


async function getPeopleInSession() {
  try {
    const response = await fetch(`${baseUrl}peopleInSession`, { method: 'GET' });
    const data = await response.json();
    if (window.$axure) {
      $axure.setGlobalVariable('PeopleInSession',  data.people);
      $axure.setGlobalVariable('RolesInSession',  data.rolesinsession);
}
    console.log('People in session:', data.people);
    console.log('Roles in session:', data.rolesinsession);
  } catch (error) {
    console.error('Error fetching people in session:', error);
  }
}

// Join a session
async function joinSession() {
  try {
    if(window.$axure) {
      username = $axure.getGlobalVariable('Username');
    }
    const response = await fetch(`${baseUrl}joinSession`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    const message = await response.text();
    console.log('Joined session:', message);
  } catch (error) {
    console.error('Error joining session:', error);
  }
}

async function getDriver() {
  try {
    const response = await fetch("/driver");
    const driver = await response.text();
    console.log('Current driver:', driver);
    if(window.$axure) {
      $axure.setGlobalVariable('Driver', driver);
      console.log('Driver set in Axure:', driver);
    }
  } catch (error) {
    console.error('Error getting driver:', error);
  }
}

async function setDriver() {
  let driver = "";
  try {
    if(window.$axure) {
      driver = $axure.getGlobalVariable('Driver');
      console.log('Driver from Axure:', driver);
    }
    const response = await fetch("/driver", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ driver }),
    });
    const message = await response.text();
    console.log('Driver updated:', message);
  } catch (error) {
    console.error('Error setting driver:', error);
  }
}

async function setMapLocation() {
  let destination = "";
  console.log('Setting destination...');
  try {
    if(window.$axure) {
      destination = $axure.getGlobalVariable('Destination');
      console.log('Destination from Axure:', destination);
    }
    const response = await fetch(`${baseUrl}mapLocation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ destination }),
    });
    const message = await response.text();
    console.log('Destinationupdated:', message);
  } catch (error) {
    console.error('Error setting destination:', error);
  }
}

async function getMapLocation() {
  try {
    const response = await fetch(`${baseUrl}mapLocation`, { method: 'GET' });
    const destination = await response.text();
    if (window.$axure) {
            $axure.setGlobalVariable('Destination',  destination);
    }
    console.log('map location:', destination);
  } catch (error) {
    console.error('Error fetching location:', error);
  }
}

async function setSong() {
  let song = "";
  let artist = "";
  try {
    if(window.$axure) {
      song = $axure.getGlobalVariable('PlayingSong');
      console.log('Song from Axure:', song);
      artist = $axure.getGlobalVariable('PlayingArtist');
      console.log('artist from Axure:', artist);
    }
    const response = await fetch(`${baseUrl}song`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ song, artist }),
    });
    const message = await response.text();
    console.log('Song updated:', message);
  } catch (error) {
    console.error('Error setting song:', error);
  }
}

async function getSong() {
  try {
    const response = await fetch(`${baseUrl}song`, { method: 'GET' });
    const data = await response.json();
    if (window.$axure) {
            $axure.setGlobalVariable('PlayingSong',  data.song);
            $axure.setGlobalVariable('PlayingArtist',  data.artist);
    }
    console.log('Current song:', data.song);
  } catch (error) {
    console.error('Error fetching song:', error);
  }
}
  
// async function get() {
//   try {
//     const response = await fetch(url, { method: 'GET' });
//     const state = await response.text();
//     console.log('Current server state:', state);
//     if (window.$axure) {
//       $axure.setGlobalVariable('apiData', state);
//     }
//   } catch (error) {
//     console.error('Error fetching server state:', error);
//   }
// }

// async function post() {
//   try {
//     const response = await fetch(url, { method: 'POST' });
//     const message = await response.text();
//     console.log('Server state updated:', message);
//   } catch (error) {
//     console.error('Error updating server state:', error);
//   }
// }


  