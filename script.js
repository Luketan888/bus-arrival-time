// Use the LTA API to fetch bus arrival times
const form = document.getElementById('bus-form');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const busStopNumber = document.getElementById('bus-stop').value;

  // Check if the input is a valid number
  if (!busStopNumber) {
    resultDiv.innerHTML = '<p>Please enter a valid bus stop number.</p>';
    return;
  }

  // Fetch bus arrival data from LTA's Datamall API
  const apiKey = 'CDQSBpysS2qRZWVI4loIcw=='; // Your API key
  const apiUrl = `https://api.data.gov.sg/v1/transport/bus-arrival?bus_stop_id=${busStopNumber}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'AccountKey': apiKey
      }
    });

    if (response.ok) {
      const data = await response.json();

      // Process the response to display bus arrival times
      const arrivals = data.services;
      if (arrivals.length > 0) {
        let output = `<h3>Bus Arrival Times for Bus Stop ${busStopNumber}:</h3>`;
        arrivals.forEach(service => {
          output += `<p>Bus ${service.bus_no}: ${service.next_bus.estimate_arrival} minutes</p>`;
        });
        resultDiv.innerHTML = output;
      } else {
        resultDiv.innerHTML = `<p>No buses arriving soon.</p>`;
      }
    } else {
      resultDiv.innerHTML = '<p>Error fetching data from API.</p>';
    }
  } catch (error) {
    resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
  }
});
