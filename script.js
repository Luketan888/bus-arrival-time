document.addEventListener('DOMContentLoaded', function () {
    const busRouteSelect = document.getElementById('bus-route');
    const busTimesContainer = document.getElementById('bus-times');

    // Function to fetch bus arrival times based on selected route
    function fetchBusTimes(route) {
        busTimesContainer.innerHTML = "<p>Loading bus arrival times...</p>";

        // Example: Replace this URL with the actual API URL for bus arrival times
        const apiUrl = `https://api.example.com/bus-times?route=${route}`;

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

    // Event listener for when the user selects a new bus route
    busRouteSelect.addEventListener('change', function () {
        const selectedRoute = busRouteSelect.value;
        fetchBusTimes(selectedRoute);
    });

    // Initial load for the first route
    fetchBusTimes(busRouteSelect.value);
});
