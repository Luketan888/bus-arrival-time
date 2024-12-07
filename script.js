const form = document.getElementById('submit');
const resultDiv = document.getElementById('result');

form.addEventListener('click', async (event) => {
    event.preventDefault();

    const busStopNumber = document.getElementById('bus-stop').value;

    // Check if the input is a valid number
    if (!busStopNumber) {
        resultDiv.innerHTML = '<p>Please enter a valid bus stop number.</p>';
        return;
    }

    // LTA API v3 URL
    const apiKey = 'CDQSBpysS2qRZWVI4loIcw==';  // Your API key
    const apiUrl = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${busStopNumber}`;

    try {
        // Fetch data from LTA API
        const response = await fetch(apiUrl, {
            headers: {
                'OData-Service-Auth-Token': apiKey,  // Correct header for v3 API
                'Accept': 'application/json'         // Ensures the response is JSON
            }
        });

        if (response.ok) {
            const data = await response.json();

            // Check if the data contains any services (bus arrivals)
            if (data.value && data.value.length > 0) {
                let output = `<h2>Bus Arrival Times for Bus Stop ${busStopNumber}:</h2>`;
                
                data.value.forEach(service => {
                    const nextBus = service.NextBus;
                    output += `
                        <p>Bus ${service.ServiceNo}: 
                            Next bus arrives in ${nextBus.EstimatedArrival} minutes.
                        </p>`;
                });

                resultDiv.innerHTML = output;
            } else {
                resultDiv.innerHTML = '<p>No buses arriving soon.</p>';
            }
        } else {
            resultDiv.innerHTML = '<p>Error fetching data from API.</p>';
        }
    } catch (error) {
        resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});
