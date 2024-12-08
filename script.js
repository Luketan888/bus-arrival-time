// Get DOM elements
const form = document.getElementById('bus-form');
const busStopInput = document.getElementById('bus-stop');
const resultDiv = document.getElementById('result');
const loadingDiv = document.getElementById('loading');

// Handle form submission
form.addEventListener('submit', async (event) => {
    event.preventDefault();  // Prevent the default form submission behavior
    
    const busStopNumber = busStopInput.value.trim();
    
    if (!busStopNumber) {
        resultDiv.innerHTML = "<p>Please enter a valid bus stop number.</p>";
        return;
    }

    // Show loading message
    loadingDiv.classList.remove('hidden');
    resultDiv.innerHTML = '';  // Clear any previous results

    // Fetch bus arrival data from LTA API
    const apiKey = 'CDQSBpysS2qRZWVI4loIcw==';  // Replace with your actual API key
    const apiUrl = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${busStopNumber}`;
    
    try {
        const response = await fetch(apiUrl, {
            headers: {
                'OData-Service-Auth-Token': apiKey, // LTA API key
                'Accept': 'application/json'        // Set response type to JSON
            }
        });

        // Hide loading message after fetch is complete
        loadingDiv.classList.add('hidden');

        if (response.ok) {
            const data = await response.json();

            // Process data and display bus arrival times
            if (data.value && data.value.length > 0) {
                let output = `<h2>Bus Arrival Times for Bus Stop ${busStopNumber}:</h2>`;
                data.value.forEach(service => {
                    const nextBus = service.NextBus;
                    output += `
                        <p><strong>Bus ${service.ServiceNo}</strong>: Next bus arrives at ${nextBus.EstimatedArrival}.</p>
                    `;
                });
                resultDiv.innerHTML = output;
            } else {
                resultDiv.innerHTML = '<p>No buses arriving soon at this stop.</p>';
            }
        } else {
            resultDiv.innerHTML = `<p>Error: Unable to fetch data. Please try again later.</p>`;
        }

    } catch (error) {
        loadingDiv.classList.add('hidden');
        resultDiv.innerHTML = `<p>Error: ${error.message}. Please check the bus stop number and try again.</p>`;
    }
});
