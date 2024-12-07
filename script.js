form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const busStopNumber = document.getElementById('bus-stop').value;

  // Check if the input is a valid number
  if (!busStopNumber) {
    resultDiv.innerHTML = 'Please enter a valid bus stop number.';
    return;
  }

  const apiKey = 'CDQSBpysS2qRZWVI4loIcw=='; // Your API key
  const apiUrl = `https://api.data.gov.sg/v2/transport/bus-arrival?bus_stop_id=${busStopNumber}`; // Update to v2
  
  console.log(`API URL: ${apiUrl}`); // Log the API URL to inspect it

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'AccountKey': apiKey
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('API Data:', data); // Log the response data to inspect it

      // Process the response to display bus arrival times
      const arrivals = data.services;
      if (arrivals.length > 0) {
        let output = `<h2>Bus Arrival Times for Bus Stop ${busStopNumber}:</h2>`;
        arrivals.forEach(service => {
          output += `<p>Bus ${service.bus_no}: ${service.next_bus.estimate_arrival} minutes</p>`;
        });
        resultDiv.innerHTML = output;
      } else {
        resultDiv.innerHTML = 'No buses arriving soon.';
      }
    } else {
      resultDiv.innerHTML = 'Error fetching data from API.';
    }
  } catch (error) {
    console.log(error); // Log the error
    resultDiv.innerHTML = `Error: ${error.message}`;
  }
});
