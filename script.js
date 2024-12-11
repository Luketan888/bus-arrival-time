```javascript
const busStopCodeInput = document.getElementById('busStopCode');
const getArrivalTimesButton = document.getElementById('getArrivalTimes');
const busArrivalTimesDiv = document.getElementById('busArrivalTimes');

// API Key will be replaced during deployment
const apiKey = 'REPLACE_WITH_API_KEY';

// Function to calculate estimated waiting time
function calculateWaitingTime(estimatedArrival) {
    if (!estimatedArrival) return 'No timing available';
    
    const now = new Date();
    const arrivalTime = new Date(estimatedArrival);
    const diffMinutes = Math.round((arrivalTime - now) / 60000);
    
    if (diffMinutes <= 0) return 'Arriving';
    return `${diffMinutes} min`;
}

getArrivalTimesButton.addEventListener('click', async function() {
    const busStopCode = busStopCodeInput.value.trim();

    // Validate the bus stop code
    if (!busStopCode || busStopCode.length !== 5 || isNaN(busStopCode)) {
        alert('Please enter a valid 5-digit bus stop code.');
        return;
    }

    // Clear previous results
    busArrivalTimesDiv.innerHTML = 'Loading bus arrival times...';

    try {
        // Directly call LTA Datamall API
        const response = await fetch(`https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${busStopCode}`, {
            method: 'GET',
            headers: {
                'AccountKey': apiKey,
                'accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch bus data');
        }

        const data = await response.json();

        // Process and display the bus arrival times
        if (data.Services && data.Services.length > 0) {
            let arrivalTimesHTML = '';
            data.Services.forEach(bus => {
                const nextBus = bus.NextBus || {};
                const subsequentBus = bus.SubsequentBus || {};

                const busInfo = `
                    <div class="bus-service">
                        <p><strong>Bus Service:</strong> ${bus.ServiceNo}</p>
                        <p><strong>Next Bus:</strong> 
                            Type: ${nextBus.Type || 'N/A'}, 
                            Estimated Arrival: ${calculateWaitingTime(nextBus.EstimatedArrival)}
                        </p>
                        <p><strong>Subsequent Bus:</strong> 
                            Type: ${subsequentBus.Type || 'N/A'}, 
                            Estimated Arrival: ${calculateWaitingTime(subsequentBus.EstimatedArrival)}
                        </p>
                    </div>
                `;
                arrivalTimesHTML += busInfo;
            });
            busArrivalTimesDiv.innerHTML = arrivalTimesHTML;
        } else {
            busArrivalTimesDiv.innerHTML = 'No upcoming buses at this stop.';
        }

    } catch (error) {
        console.error('Error fetching bus arrival data:', error);
        busArrivalTimesDiv.innerHTML = `Error: ${error.message}. Please try again later.`;
    }
});
```
