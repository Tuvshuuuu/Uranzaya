const yesButton = document.getElementById('yesButton');
const noButton = document.getElementById('noButton');
const thankYouMessage = document.getElementById('thankYouMessage');
const h1Element = document.querySelector('h1'); // Select the <h1> element

// Function to handle button press (for mobile)
function handleButtonPress(button) {
  button.style.transform = 'scale(1.1)';
}

// Function to handle button release (for mobile)
function handleButtonRelease(button) {
  button.style.transform = 'scale(1)';
}

// Function to make the noButton escape
function makeButtonEscape(button) {
  button.style.position = 'absolute';
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  const buttonHeight = button.offsetHeight;
  const buttonWidth = button.offsetWidth;
  const maxY = windowHeight - buttonHeight;
  const maxX = windowWidth - buttonWidth;
  
  button.style.top = Math.floor(Math.random() * maxY) + 'px';
  button.style.left = Math.floor(Math.random() * maxX) + 'px';
}

yesButton.addEventListener('click', function() {
  // Show thank you message
  thankYouMessage.classList.remove('hidden');
  // Hide the <h1> element
  h1Element.style.display = 'none';

  // Determine if the user is on a mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Change background image based on device type
  if (isMobile) {
    // Set background image for mobile users
    document.body.style.backgroundImage = "url('mobile-background.jpg')";
  } else {
    // Set background image for non-mobile users
    document.body.style.backgroundImage = "url('background.jpg')";
  }

  document.body.style.backgroundColor = "transparent"; // Ensure background color is transparent

  // Hide buttons
  yesButton.style.display = 'none';
  noButton.style.display = 'none';
});

noButton.addEventListener('mousedown', function() {
  // Change button appearance on press (for mobile)
  handleButtonPress(noButton);
});

noButton.addEventListener('touchstart', function() {
  // Change button appearance on touch (for mobile)
  handleButtonPress(noButton);
});

noButton.addEventListener('mouseup', function() {
  // Restore button appearance on release (for mobile)
  handleButtonRelease(noButton);
});

noButton.addEventListener('touchend', function() {
  // Restore button appearance on touch end (for mobile)
  handleButtonRelease(noButton);
});

noButton.addEventListener('mouseover', function() {
  // Make the noButton escape when mouse is placed over it (for desktop)
  makeButtonEscape(noButton);
});