document.addEventListener('DOMContentLoaded', function() {
    // Get saved preferences
    const selectedLang = localStorage.getItem('zencareer-language') || 'en';
    const selectedCountry = localStorage.getItem('zencareer-country') || 'US';
    
    // Audio elements
    const clickSound = document.getElementById('click-sound');
    const backgroundMusic = document.getElementById('background-music');
    const toggleMusicBtn = document.getElementById('toggle-music');
    
    // Payment elements
    const currencySymbol = document.getElementById('currency-symbol');
    const priceAmount = document.getElementById('price-amount');
    const paymentTabs = document.querySelectorAll('.payment-tab');
    const paymentTabContents = document.querySelectorAll('.