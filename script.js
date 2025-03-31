// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const brochureBtn = document.querySelector('.nav-item:nth-child(4)');
    const mobileBrochureBtn = document.querySelector('.mobile-menu-item:nth-child(4)');
    const modal = document.getElementById('brochureModal');
    const closeBtn = document.querySelector('.close-btn');
    const requestButton = document.getElementById('requestButton');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const backToStep1Btn = document.getElementById('backToStep1');
    const brochureForm = document.getElementById('brochureForm');
    const nameInput = document.getElementById('name');
    const mobileInput = document.getElementById('mobile');
    const emailInput = document.getElementById('email');
    const nameError = document.getElementById('nameError');
    const mobileError = document.getElementById('mobileError');
    const emailError = document.getElementById('emailError');
    
    // Open modal when brochure button is clicked (desktop version)
    brochureBtn.addEventListener('click', function() {
        modal.style.display = 'block';
        // Reset to step 1 when opening
        showStep(1);
        resetForm();
    });
    
    // Open modal when mobile brochure button is clicked
    if (mobileBrochureBtn) {
        mobileBrochureBtn.addEventListener('click', function() {
            modal.style.display = 'block';
            // Hide mobile menu when opening modal
            document.querySelector('.mobile-menu').classList.remove('active');
            // Reset to step 1 when opening
            showStep(1);
            resetForm();
        });
    }
    
    // Close modal when X is clicked
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
    
    // Move to form when request button is clicked
    requestButton.addEventListener('click', function() {
        showStep(2);
    });
    
    // Back button functionality
    backToStep1Btn.addEventListener('click', function() {
        showStep(1);
    });
    
    // Form submission handling
    brochureForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset error messages
        resetErrors();
        
        // Validate form
        if (validateForm()) {
            // Instead of Google Sheets, use FormSubmit
            submitToFormSubmit();
        }
    });
    
    // Function to show specific step
    function showStep(stepNumber) {
        step1.style.display = 'none';
        step2.style.display = 'none';
        step3.style.display = 'none';
        
        if (stepNumber === 1) {
            step1.style.display = 'block';
        } else if (stepNumber === 2) {
            step2.style.display = 'block';
        } else if (stepNumber === 3) {
            step3.style.display = 'block';
        }
    }
    
    // Reset form fields and errors
    function resetForm() {
        brochureForm.reset();
        resetErrors();
    }
    
    // Reset error messages
    function resetErrors() {
        nameError.textContent = '';
        mobileError.textContent = '';
        emailError.textContent = '';
    }
    
    // Validate form inputs
    function validateForm() {
        let isValid = true;
        
        // Validate name (at least 2 characters)
        if (nameInput.value.trim().length < 2) {
            nameError.textContent = 'Please enter a valid name (at least 2 characters)';
            isValid = false;
        }
        
        // Validate mobile number (numbers only, 10-15 digits)
        const mobileRegex = /^\d{10,15}$/;
        if (!mobileRegex.test(mobileInput.value.trim())) {
            mobileError.textContent = 'Please enter a valid mobile number (10-15 digits)';
            isValid = false;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            emailError.textContent = 'Please enter a valid email address';
            isValid = false;
        }
        
        return isValid;
    }
    
    // Submit data using FormSubmit
    function submitToFormSubmit() {
        // Create a new hidden form
        const hiddenForm = document.createElement('form');
        hiddenForm.style.display = 'none';
        hiddenForm.method = 'POST';
        hiddenForm.action = 'https://formsubmit.co/kicha2003@gmail.com'; // Replace with your email
        
        // Add form fields
        const fields = {
            name: nameInput.value.trim(),
            mobile: mobileInput.value.trim(),
            email: emailInput.value.trim(),
            brochure: 'Park Tower Dubai Brochure',
            timestamp: new Date().toISOString(),
            _subject: 'New Brochure Request',
            _captcha: 'false',
            _next: window.location.href // Stay on the same page
        };
        
        // Add the fields to the hidden form
        Object.keys(fields).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = fields[key];
            hiddenForm.appendChild(input);
        });
        
        // Add form to body, submit it, and remove it
        document.body.appendChild(hiddenForm);
        
        // Store data in localStorage before submitting
        // This ensures we know the user submitted the form even after redirect
        localStorage.setItem('brochureRequested', 'true');
        
        // Submit the form
        hiddenForm.submit();
        
        // Show success immediately, since FormSubmit will redirect
        showStep(3);
    }
    
    // Check if user is returning from FormSubmit submission
    if (localStorage.getItem('brochureRequested') === 'true') {
        // Clear the flag
        localStorage.removeItem('brochureRequested');
        // Show the success state
        modal.style.display = 'block';
        showStep(3);
    }
});