document.addEventListener('DOMContentLoaded', function () {
    // Initial message
    appendMessage("Welcome to the Chat! Try commands like 'Madrid top 3' or 'Madrid cheapest 4' to explore hotel information.");

    // Function to handle user input
    window.sendMessage = function () {
        const userInput = document.getElementById('userInput').value.toLowerCase();
        appendMessage(`User: ${userInput}`);
        processUserInput(userInput);
        document.getElementById('userInput').value = '';
    };

    // Function to process user input
    function processUserInput(userInput) {
        // Check if the user input includes 'top' or 'cheapest'
        if (userInput.includes('top') || userInput.includes('cheapest') || userInput.includes('rating')) {
            fetch('./data.json')
                .then(response => response.json())
                .then(data => {
                    if (userInput.includes('top')) {
                        const topCount = parseInt(userInput.split(' ')[2]);
                        const topHotels = data.HOTELS.slice(0, topCount);
                        displayHotelInformation(topHotels);
                    } else if (userInput.includes('cheapest')) {
                        console.log(data.HOTEL_CONTENT);
                        const cheapestCount = parseInt(userInput.split(' ')[2]);
                        const sortedHotels = data.HOTELS.slice().sort((a, b) => a.priceProvider - b.priceProvider);
                        const cheapestHotels = sortedHotels.slice(0, cheapestCount);
                        displayHotelInformation(cheapestHotels);
                    } 
                    else if (userInput.includes('rating')) {
                        const rating = parseInt(userInput.split(' ')[2]);
                        const hotelsWithRating = getHotelsByRating(data, rating);
                        displayHotelInformation(hotelsWithRating);
                    }
                    else {
                        appendMessage("Sorry, I didn't understand that command.");
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    appendMessage('Error fetching data. Please try again.');
                });
        } else {
            appendMessage("Sorry, I didn't understand that command.");
        }
    }
    // Function to get hotels with a specific rating
    function getHotelsByRating(data, rating) {
        const hotelsWithRating = [];
        data.HOTEL_CONTENT.forEach(hotelContent => {
            if (hotelContent.descriptiveContent.lsrRating === rating) {
                const hotelCode = hotelContent.propertyCode;
                console.log(hotelCode);
                const hotel = data.HOTELS.find(h => h.propertyCode === hotelCode);
                if (hotel) {
                    hotelsWithRating.push(hotel);
                }
            }
        });
        return hotelsWithRating;
    }

    // Function to display hotel information in the chat box
    function displayHotelInformation(hotels) {
        hotels.forEach(hotel => {
            appendMessage(`Hotel Name: ${hotel.name}, Price: ${hotel.priceProvider.amount}`);
        });
    }

    // Function to append messages to the chat box
    function appendMessage(message) {
        const chatBox = document.getElementById('chatBox');
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
    }
});
