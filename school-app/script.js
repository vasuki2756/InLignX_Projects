
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxMdnfCdXju4z02SR2pH-pNkcJKcORY9ZSdDPtzt1DcbbVC_7ybZWYQ3sKQ03IXvAIKPw/exec";

// Success messages for different actions
const successMessages = [
  "🌟 Your message has been sent successfully!",
  "✨ Thank you! We'll get back to you soon!",
  "🎉 Message delivered with a smile!",
  "💝 Your inquiry is important to us!"
];

const errorMessages = [
  "😔 Oops! Something went wrong. Please try again!",
  "🔧 Technical hiccup! Please give it another try!",
  "📨 Message didn't go through. Please retry!"
];

function sendJSONP(sheet, payload) {
  const cb = "cb_" + Math.random().toString(36).substr(2, 9);
  
  // Show loading state
  const submitButtons = document.querySelectorAll('button[type="submit"]');
  submitButtons.forEach(btn => {
    btn.innerHTML = '<div class="loading"></div> Sending...';
    btn.disabled = true;
  });
  
  window[cb] = function(response) {
    const randomSuccess = successMessages[Math.floor(Math.random() * successMessages.length)];
    const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
    
    if (response.result === "success") {
      // Create and show custom success notification
      showNotification(randomSuccess, 'success');
    } else {
      showNotification(randomError + "\nError: " + response.message, 'error');
    }
    
    // Reset buttons
    submitButtons.forEach(btn => {
      btn.innerHTML = btn.closest('#helpdeskForm') ? 'Send Message 🚀' : 'Send 💌';
      btn.disabled = false;
    });
    
    delete window[cb];
    document.body.removeChild(script);
  };
  
  const script = document.createElement("script");
  script.src = `${WEB_APP_URL}?sheet=${encodeURIComponent(sheet)}&payload=${encodeURIComponent(JSON.stringify(payload))}&callback=${cb}`;
  document.body.appendChild(script);
}

function showNotification(message, type) {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? 'linear-gradient(135deg, #6BCF7F, #4ECDC4)' : 'linear-gradient(135deg, #FF6B6B, #FFB347)'};
    color: white;
    padding: 20px 25px;
    border-radius: 15px;
    font-weight: 600;
    font-size: 1rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.5s ease;
    max-width: 400px;
    white-space: pre-line;
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Add slide-in animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(400px); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  
  // Remove notification after 4 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.5s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 500);
  }, 4000);
}

// Log visits with enhanced tracking
sendJSONP("Visits", {
  page: location.pathname,
  userAgent: navigator.userAgent,
  language: navigator.language,
  referrer: document.referrer,
  timestamp: new Date().toISOString(),
  screenSize: `${screen.width}x${screen.height}`,
  viewportSize: `${window.innerWidth}x${window.innerHeight}`
});

// Help Desk form with validation
document.getElementById("helpdeskForm").onsubmit = function(e) {
  e.preventDefault();
  
  // Form validation
  const formData = new FormData(this);
  const data = Object.fromEntries(formData);
  
  // Add timestamp and additional info
  data.timestamp = new Date().toISOString();
  data.source = 'Help Desk Form';
  
  sendJSONP("HelpdeskContacts", data);
  this.reset();
  
  // Add confetti effect on successful submission
  setTimeout(() => {
    createConfetti();
  }, 1000);
};

// Footer form with validation
document.getElementById("footerForm").onsubmit = function(e) {
  e.preventDefault();
  
  const formData = new FormData(this);
  const data = Object.fromEntries(formData);
  
  // Add timestamp and additional info
  data.timestamp = new Date().toISOString();
  data.source = 'Footer Contact Form';
  
  sendJSONP("FooterContacts", data);
  this.reset();
  
  // Add celebration effect
  setTimeout(() => {
    createConfetti();
  }, 1000);
};

// Confetti animation for form submissions
function createConfetti() {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFD93D', '#6BCF7F', '#A8E6CF', '#FFB347'];
  
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      animation: confettiFall 3s ease-out forwards;
      left: ${Math.random() * 100}vw;
      top: -20px;
      animation-delay: ${Math.random() * 2}s;
    `;
    
    document.body.appendChild(confetti);
    
    // Remove confetti after animation
    setTimeout(() => {
      if (confetti.parentNode) {
        document.body.removeChild(confetti);
      }
    }, 5000);
  }
}

// Add confetti animation styles
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
  @keyframes confettiFall {
    0% {
      transform: translateY(-100vh) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(confettiStyle);

// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add intersection observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'slideInUp 0.8s ease forwards';
      entry.target.style.opacity = '1';
    }
  });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('section, .card, .faculty-card, .event-card').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});

// Add slide-in animation
const slideStyle = document.createElement('style');
slideStyle.textContent = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(slideStyle);

// Add typing effect to hero text
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Initialize typing effect after page load
window.addEventListener('load', () => {
  const heroTitle = document.querySelector('.hero h2');
  const originalText = heroTitle.textContent;
  setTimeout(() => {
    typeWriter(heroTitle, originalText, 80);
  }, 1000);
});

// Add floating animation to cards on hover
document.querySelectorAll('.card, .faculty-card, .event-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.animation = 'float 2s ease-in-out infinite';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.animation = '';
  });
});

// Enhanced form validation with visual feedback
function validateForm(form) {
  const inputs = form.querySelectorAll('input[required], textarea[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    const value = input.value.trim();
    
    if (!value) {
      showFieldError(input, 'This field is required! 📝');
      isValid = false;
    } else if (input.type === 'email' && !isValidEmail(value)) {
      showFieldError(input, 'Please enter a valid email! 📧');
      isValid = false;
    } else {
      clearFieldError(input);
    }
  });
  
  return isValid;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showFieldError(input, message) {
  clearFieldError(input);
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error';
  errorDiv.textContent = message;
  errorDiv.style.cssText = `
    color: #FF6B6B;
    font-size: 0.85rem;
    margin-top: 5px;
    font-weight: 500;
  `;
  
  input.style.borderColor = '#FF6B6B';
  input.parentNode.insertBefore(errorDiv, input.nextSibling);
}

function clearFieldError(input) {
  input.style.borderColor = '#E0E6ED';
  const existingError = input.parentNode.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }
}

// Add real-time validation
document.querySelectorAll('input, textarea').forEach(input => {
  input.addEventListener('blur', function() {
    if (this.hasAttribute('required')) {
      validateForm(this.closest('form'));
    }
  });
  
  input.addEventListener('input', function() {
    clearFieldError(this);
  });
});

console.log('🌟 Sunrise Primary School website loaded successfully!');
console.log('✨ Features: Responsive design, smooth animations, form validation, and confetti celebrations!');