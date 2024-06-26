
let local = true;
let urlLocal = 'http://localhost:3001/';
let urlHostedServer = 'https://express-axure-test.onrender.com/';
let baseUrl = local ? urlLocal : urlHostedServer;

$axure.internal(function ($ax) {
  $ax.public.getGlobalVariable = $ax.getGlobalVariable = function (name) {
      return $ax.globalVariableProvider.getVariableValue(name);
  };
});

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
      console.log('Code from Axure:', code);
    }
    const response = await fetch(`${baseUrl}code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
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
    const response = await fetch(`http://localhost:3001/code`, { method: 'GET' });
    const code = await response.text();
    if (window.$axure) {
            $axure.setGlobalVariable('SessionCode',  code);
    }
    console.log('Current code:', code);
  } catch (error) {
    console.error('Error fetching code:', error);
  }
}

// Fetch people in session
async function getPeopleInSession() {
  try {
    const response = await fetch(`${baseUrl}peopleInSession`, { method: 'GET' });
    const people = await response.json();
    console.log('People in session:', people);
  } catch (error) {
    console.error('Error fetching people in session:', error);
  }
}

// Join a session
async function joinSession(name) {
  try {
    const response = await fetch(`${baseUrl}joinSession`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
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


  