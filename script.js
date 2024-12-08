// Set up the API URL and API Key (will be replaced during deployment)
const apiUrl = 'https://api.data.gov.sg/v1/transport/bus-arrival?stop_id=';

// Retrieve the API key from environment variable (GitHub Secrets will inject this during CI/CD)
const apiKey = "DEFAULT_API_KEY";  // This will be replaced by the GitHub Actions workflow

// Function to fetch bus arrival data for a specific bus stop
async function getBusArrivalTimes(stopId) {
  const response = await fetch(`${apiUrl}${stopId}`, {
    headers: {
      'accept': 'application/json',
      'OData-Service-Auth-Token': apiKey // Dynamically use the injected API key here
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch bus data');
  }

  const data = await response.json();
  return data;
}

// Function to render bus arrival times in HTML
function renderBusArrivalTimes(data) {
  const arrivalList = document.getElementById('arrival-list');
  arrivalList.innerHTML = '';

  if (data && data.services && data.services.length > 0) {
    data.services.forEach(service => {
      const li = document.createElement('li');
      li.innerHTML = `${service.no} - Next Arrival: ${service.next_bus.est_arrival}`;
      arrivalList.appendChild(li);
    });
  } else {
    arrivalList.innerHTML = 'No data available for this bus stop.';
  }
}

// Event listener for the form submission
document.getElementById('get-arrival-times').addEventListener('click', async function () {
  const busStopNumber = document.getElementById('bus-stop-number').value;

  if (!busStopNumber) {
    alert('Please enter a bus stop number');
    return;
  }

  try {
    // Show loading message while fetching data
    document.getElementById('arrival-list').innerHTML = 'Loading...';

    // Fetch bus arrival data
    const data = await getBusArrivalTimes(busStopNumber);
    
    // Render bus arrival times on the page
    renderBusArrivalTimes(data);
  } catch (error) {
    console.error('Error fetching bus data:', error);
    document.getElementById('arrival-list').innerHTML = 'Error: Unable to load bus arrival data.';
  }
});
