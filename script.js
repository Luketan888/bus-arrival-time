// Replace this with your LTA Datamall API key
const apiKey = 'nOtlZbS8RGqtGYubx6yqig==';

// DOM elements
const busStopCodeInput = document.getElementById('busStopCode');
const getArrivalTimesButton = document.getElementById('getArrivalTimes');
const busArrivalTimesDiv = document.getElementById('busArrivalTimes');

// Event listener for the "Get Arrival Times" button
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
        // Fetch the bus arrival data from LTA's Datamall API
        const response = await fetch(`http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${busStopCode}`, {
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
        if (data.value && data.value.length > 0) {
            let arrivalTimesHTML = '';
            data.value.forEach(bus => {
                const busInfo = `
                    <p><strong>Bus Service:</strong> ${bus.ServiceNo}</p>
                    <p><strong>Next Arrival:</strong> ${bus.EstimatedArrival}</p>
                    <p><strong>Expected Waiting Time:</strong> ${bus.EstimatedArrival}</p>
                    <p><strong>Bus Type:</strong> ${bus.Type}</p>
                `;
                arrivalTimesHTML += busInfo;
            });
            busArrivalTimesDiv.innerHTML = arrivalTimesHTML;
        } else {
            busArrivalTimesDiv.innerHTML = 'No upcoming buses at this stop.';
        }

    } catch (error) {
        console.error('Error fetching bus arrival data:', error);
        busArrivalTimesDiv.innerHTML = 'Error fetching bus arrival times. Please try again later.';
    }
});
