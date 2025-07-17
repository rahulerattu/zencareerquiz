document.addEventListener('DOMContentLoaded', () => {
    const clickSound = document.getElementById('clickSound');
    const paymentOptions = document.querySelectorAll('.payment-option');
    const countrySpecific = document.getElementById('countrySpecific');
    const countrySpecificImg = document.getElementById('countrySpecificImg');
    const countrySpecificText = document.getElementById('countrySpecificText');
    const countryPaymentTitle = document.getElementById('countryPaymentTitle');
    const countryPaymentDescription = document.getElementById('countryPaymentDescription');
    const qrCodePlaceholder = document.getElementById('qrCodePlaceholder');
    const submitPayment = document.getElementById('submitPayment');
    const emailInput = document.getElementById('email');
    const ageInput = document.getElementById('age');
    
    // Get user selections from session storage
    const userSelections = JSON.parse(sessionStorage.getItem('zenCareerSelections') || '{"language":"en","country":"global","pet":"panda"}');
    
    // Play click sound
    const playClickSound = () => {
        clickSound.currentTime = 0;
        clickSound.play().catch(err => console.log('Audio playback error:', err));
    };
    
    // Set up country-specific payment method based on user's country
    const setupCountrySpecificPayment = () => {
        const country = userSelections.country;
        
        switch(country) {
            case 'india':
                countrySpecificImg.src = "https://cdn.example.com/upi-icon.png";
                countrySpecificText.textContent = "UPI / BHIM";
                countryPaymentTitle.textContent = "Pay via UPI";
                countryPaymentDescription.textContent = "Scan the QR code using any UPI app like Google Pay, PhonePe, or Paytm";
                break;
            case 'thailand':
                countrySpecificImg.src = "https://cdn.example.com/promptpay-icon.png";
                countrySpecificText.textContent = "PromptPay";
                countryPaymentTitle.textContent = "Pay via PromptPay";
                countryPaymentDescription.textContent = "Scan the QR code using your banking app";
                break;
            case 'vietnam':
                countrySpecificImg.src = "https://cdn.example.com/momo-icon.png";
                countrySpecificText.textContent = "MoMo";
                countryPaymentTitle.textContent = "Pay via MoMo";
                countryPaymentDescription.textContent = "Scan the QR code using MoMo app";
                break;
            case 'cambodia':
                countrySpecificImg.src = "https://cdn.example.com/aba-icon.png";
                countrySpecificText.textContent = "ABA Pay";
                countryPaymentTitle.textContent = "Pay via ABA Pay";
                countryPaymentDescription.textContent = "Scan the QR code using ABA mobile app";
                break;
            default:
                countrySpecificImg.src = "https://cdn.example.com/bank-transfer-icon.png";
                countrySpecificText.textContent = "Bank Transfer";
                countryPaymentTitle.textContent = "Pay via Bank Transfer";
                countryPaymentDescription.textContent = "Scan the QR code to complete your payment";
        }
    };
    
    // Set up country-specific payment method
    setupCountrySpecificPayment();
    
    // Handle payment method selection
    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            playClickSound();
            
            // Remove selected class from all options
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            option.classList.add('selected');
            
            // Show/hide country-specific payment section
            if (option.getAttribute('data-method') === 'country-specific') {
                countrySpecific.style.display = 'block';
            } else {
                countrySpecific.style.display = 'none';
            }
        });
    });
    
    // Handle form submission
    submitPayment.addEventListener('click', (e) => {
        playClickSound();
        
        // Simple validation
        if (!emailInput.value || !ageInput.value) {
            alert('Please fill in all required fields');
            return;
        }
        
        // In a real implementation, this would handle the payment process
        // For now, we'll just show a success message
        alert('Thank you for your payment! Your detailed report will be sent to your email shortly.');
        
        // Clear session storage data
        sessionStorage.removeItem('zenCareerSelections');
        sessionStorage.removeItem('zenCareerResults');
        
        // Redirect to home page
        window.location.href = 'welcome.html';
    });
});