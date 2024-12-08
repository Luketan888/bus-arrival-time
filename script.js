// app.js

// Use the injected API key from environment variables
const apiKey = process.env.DATAMALL_API_KEY || 'DEFAULT_API_KEY';

// Function to fetch bus arrival times
async function fetchBusArrivalTimes(busStopNumber) {
  const url = `https://api.data.gov.sg/v1/transport/bus-arrival?bus_stop_id=${busStopNumber}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'AccountKey': apiKey
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('Error fetching bus data:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error fetching bus data:', error);
    return null;
  }
}

// Event listener for button click to get bus arrival times
document.getElementById('get-arrival-times').addEventListener('click', async function() {
  const busStopNumber = document.getElementById('bus-stop-number').value;
  
  if (!busStopNumber) {
    alert('Please enter a valid bus stop number');
    return;
  }
  
  const data = await fetchBusArrivalTimes(busStopNumber);
  
  if (data) {
    // Display the data in your UI
    document.getElementById('result').innerHTML = JSON.stringify(data, null, 2);
  } else {
    document.getElementById('result').innerHTML = 'No data found.';
  }
});
