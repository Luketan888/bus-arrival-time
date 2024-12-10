document.addEventListener('DOMContentLoaded', function () {
    const busStopSelect = document.getElementById('bus-stop');
    const busTimesContainer = document.getElementById('bus-times');

    // Function to fetch bus times for the selected bus stop
    function fetchBusTimes(stop) {
        busTimesContainer.innerHTML = "<p>Loading bus arrival times...</p>";

        // Example: Replace this URL with the actual API URL for bus arrival times
        const apiUrl = `https://api.example.com/bus-times?stop=${stop}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.arrivals) {
                    // Clear the loading message and display bus times
                    busTimesContainer.innerHTML = "";
                    data.arrivals.forEach(arrival => {
                        const timeElement = document.createElement('p');
                        timeElement.textContent = `Bus arrives at: ${arrival.time}`;
                        busTimesContainer.appendChild(timeElement);
                    });
                } else {
                    busTimesContainer.innerHTML = "<p>No bus times available at the moment.</p>";
                }
            })
            .catch(error => {
                console.error('Error fetching bus times:', error);
                busTimesContainer.innerHTML = "<p>Failed to load bus times. Please try again later.</p>";
            });
    }

    // Event listener for when the user selects a new bus stop
    busStopSelect.addEventListener('change', function () {
        const selectedStop = busStopSelect.value;
        fetchBusTimes(selectedStop);
    });

    // Initialize by fetching bus times for the first selected stop
    fetchBusTimes(busStopSelect.value);
});
