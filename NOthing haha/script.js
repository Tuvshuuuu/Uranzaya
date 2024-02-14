function showMessage(choice) {
    if (choice === 'yes') {
        document.getElementById('message').classList.remove('hidden');
        document.getElementById('no-btn').style.display = 'none';
    }
}

function moveButton() {
    var button = document.getElementById('no-btn');
    var container = document.querySelector('.button-container');
    var rect = container.getBoundingClientRect();

    var randomX = Math.random() * (rect.width - button.offsetWidth);
    var randomY = Math.random() * (rect.height - button.offsetHeight);

    button.style.position = 'absolute';
    button.style.left = randomX + 'px';
    button.style.top = randomY + 'px';
}