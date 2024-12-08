const form = document.getElementById('bus-form');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const busStopNumber = document.getElementById('bus-stop').value.trim();

    // Check if the input is a valid bus stop number
    if (!busStopNumber) {
        resultDiv.innerHTML = '<p>Please enter a valid bus stop number.</p>';
        return;
    }

    // Define the API URL with CORS Proxy
    const apiKey = 'CDQSBpysS2qRZWVI4loIcw=='; // Your API Key
    const apiUrl = `https://cors-anywhere.herokuapp.com/https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${busStopNumber}`;

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

            if (data.value && data.value.length > 0) {
                let output = `<h2>Bus Arrival Times for Bus Stop ${busStopNumber}:</h2>`;
                
                data.value.forEach(service => {
                    const nextBus = service.NextBus;
                    const nextBus2 = service.NextBus2;
                    const nextBus3 = service.NextBus3;

                    // Get arrival times for up to 3 buses
                    output += `
                        <p>Bus ${service.ServiceNo}: 
                            Next bus arrives at ${formatArrivalTime(nextBus.EstimatedArrival)}.<br>
                            Second bus at ${formatArrivalTime(nextBus2.EstimatedArrival)}.<br>
                            Third bus at ${formatArrivalTime(nextBus3.EstimatedArrival)}.
                        </p>`;
                });

                resultDiv.innerHTML = output;
            } else {
                resultDiv.innerHTML = '<p>No buses arriving soon.</p>';
            }
        } else {
            resultDiv.innerHTML = '<p>Error fetching data from API. Please try again later.</p>';
        }
    } catch (error) {
        console.error('Error:', error); // Log the error to the console for debugging
        resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});

// Format the arrival time from UTC to a more readable format
function formatArrivalTime(utcTime) {
    if (!utcTime) return 'N/A';
    const date = new Date(utcTime);
    return date.toLocaleString(); // Converts to local time in string format
}
