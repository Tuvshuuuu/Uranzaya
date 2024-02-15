// Get the button elements and thank you message
const yesButton = document.getElementById('yesButton');
const noButton = document.getElementById('noButton');
const thankYouMessage = document.getElementById('thankYouMessage');
const girlfriendImg = document.getElementById('girlfriendImg');

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

// Add click event listeners to the buttons
yesButton.addEventListener('click', function() {
  // Show thank you message and girlfriend image
  thankYouMessage.classList.remove('hidden');
  girlfriendImg.classList.remove('hidden');

  // Hide the buttons
  yesButton.style.display = 'none';
  noButton.style.display = 'none';
});

noButton.addEventListener('mouseover', function() {
  // Make the noButton escape when mouse is placed over it
  makeButtonEscape(noButton);
});
