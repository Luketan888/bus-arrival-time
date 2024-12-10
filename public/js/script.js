// Replace with your actual API key during deployment
const apiKey = "DEFAULT_API_KEY";

// Base API URL for fetching bus arrival data
const apiUrl = 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=';

// Function to fetch bus arrival times
async function getBusArrivalTimes(stopId) {
  try {
    const response = await fetch(`${apiUrl}${stopId}`, {
      headers: {
        'accept': 'application/json',
        'AccountKey': apiKey
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch bus data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Function to format the ISO date
function formatDate(isoDate) {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  }).format(date);
}

// Function to render bus arrival times in HTML
function renderBusArrivalTimes(data) {
  const arrivalList = document.getElementById('arrival-list');
  arrivalList.innerHTML = ''; // Clear previous content

  if (!data || !data.Services || data.Services.length === 0) {
    arrivalList.innerHTML = 'No data available for this bus stop or invalid bus stop number.';
    return;
  }

  data.Services.forEach(service => {
    const li = document.createElement('li');
    const arrivalTime = formatDate(service.NextBus.EstimatedArrival);
    li.textContent = `Bus ${service.ServiceNo} - Next Arrival: ${arrivalTime}`;
    arrivalList.appendChild(li);
  });
}

// Function to display error messages
function showError(message) {
  const errorMessageDiv = document.getElementById('error-message');
  errorMessageDiv.textContent = message;
  errorMessageDiv.style.display = 'block'; // Show the error message
}

// Function to clear the error message
function clearError() {
  const errorMessageDiv = document.getElementById('error-message');
  errorMessageDiv.style.display = 'none'; // Hide the error message
}

// Event listener for the button
document.getElementById('get-arrival-times').addEventListener('click', async () => {
  const busStopNumber = document.getElementById('bus-stop-number').value;

  if (!busStopNumber) {
    showError('Please enter a bus stop number');
    return;
  }

  try {
    // Clear any previous error messages
    clearError();

    // Show loading message while fetching data
    document.getElementById('arrival-list').textContent = 'Loading...';

    // Fetch bus arrival data
    const data = await getBusArrivalTimes(busStopNumber);

    // Render bus arrival times on the page
    renderBusArrivalTimes(data);
  } catch (error) {
    showError('Error: Unable to load bus arrival data. Please try again later.');
  }
});
