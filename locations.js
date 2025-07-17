// This file contains information about each location in the world journey
const locations = [
    {
        id: 1,
        name: {
            en: "Mount Fuji, Japan",
            hi: "माउंट फुजी, जापान",
            ml: "മൗണ്ട് ഫുജി, ജപ്പാൻ"
            // Add other languages as needed
        },
        timestamp: 6,
        quote: {
            en: "Like Mount Fuji's majestic peak, your potential knows no bounds.",
            hi: "माउंट फुजी की भव्य चोटी की तरह, आपकी क्षमता की कोई सीमा नहीं है।",
            ml: "മൗണ്ട് ഫുജിയുടെ മഹത്തായ കൊടുമുടി പോലെ, നിങ്ങളുടെ സാധ്യതകൾക്ക് അതിർത്തികളില്ല."
            // Add other languages as needed
        }
    },
    {
        id: 2,
        name: {
            en: "Great Wall of China",
            hi: "चीन की महान दीवार",
            ml: "ചൈനയിലെ മഹത്തായ മതിൽ"
            // Add other languages as needed
        },
        timestamp: 12,
        quote: {
            en: "Build your career brick by brick, like the Great Wall of China.",
            hi: "चीन की महान दीवार की तरह, अपना करियर ईंट-ईंट करके बनाएं।",
            ml: "ചൈനയിലെ മഹത്തായ മതിൽ പോലെ, നിങ്ങളുടെ കരിയർ ഓരോ കല്ലായി പണിയുക."
            // Add other languages as needed
        }
    },
    {
        id: 3,
        name: {
            en: "Taj Mahal, India",
            hi: "ताज महल, भारत",
            ml: "താജ് മഹൽ, ഇന്ത്യ"
            // Add other languages as needed
        },
        timestamp: 18,
        quote: {
            en: "Your journey is a monument to your dedication, like the Taj Mahal.",
            hi: "ताज महल की तरह, आपकी यात्रा आपके समर्पण का एक स्मारक है।",
            ml: "താജ് മഹൽ പോലെ, നിങ്ങളുടെ യാത്ര നിങ്ങളുടെ സമർപ്പണത്തിന്റെ സ്മാരകമാണ്."
            // Add other languages as needed
        }
    },
    // Add more locations for each timestamp in the array
    // Continue for all 40 timestamps
];

// Function to get location by timestamp
function getLocationByTimestamp(timestamp) {
    return locations.find(loc => loc.timestamp === timestamp) || locations[0];
}

// Function to get the next location
function getNextLocation(currentLocationId) {
    const currentIndex = locations.findIndex(loc => loc.id === currentLocationId);
    if (currentIndex < locations.length - 1) {
        return locations[currentIndex + 1];
    }
    return null; // No more locations
}