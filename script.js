// Set up the API URL and API Key (will be replaced during deployment)
const apiUrl = 'https://datamall2.mytransport.sg/ltaodataservice/v1/BusArrival?BusStopCode=';
const apiKey = "DEFAULT_API_KEY"; // This will be replaced dynamically

// Function to fetch bus arrival data for a specific bus stop
async function getBusArrivalTimes(stopId) {
  const response = await fetch(`${apiUrl}${stopId}`, {
    headers: {
      'accept': 'application/json',
      'AccountKey': apiKey // Corrected header name
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
  arrivalList.innerHTML = ''; // Clear previous content

  if (data?.Services?.length > 0) {
    data.Services.forEach(service => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>Bus ${service.ServiceNo}</strong>: 
        <ul>
          <li>Next Bus: ${service.NextBus.EstimatedArrival || 'N/A'}</li>
          <li>Subsequent Bus: ${service.NextBus2.EstimatedArrival || 'N/A'}</li>
        </ul>
      `;
      arrivalList.appendChild(li);
    });
  } else {
    arrivalList.innerHTML = '<li>No data available for this bus stop.</li>';
  }
}

// Function to display error messages
function showError(message) {
  const errorMessageDiv = document.getElementById('error-message');
  errorMessageDiv.innerHTML = message;
  errorMessageDiv.style.display = 'block';
}

// Function to clear the error message
function clearError() {
  const errorMessageDiv = document.getElementById('error-message');
  errorMessageDiv.style.display = 'none';
}

// Event listener for the form submission
document.getElementById('get-arrival-times').addEventListener('click', async function () {
  const busStopNumber = document.getElementById('bus-stop-number').value;

  if (!busStopNumber) {
    showError('Please enter a bus stop number');
    return;
  }

  try {
    clearError();
    document.getElementById('arrival-list').innerHTML = 'Loading...';

    const data = await getBusArrivalTimes(busStopNumber);
    renderBusArrivalTimes(data);
  } catch (error) {
    console.error('Error fetching bus data:', error);
    showError('Error: Unable to load bus arrival data. Please try again later.');
  }
});
