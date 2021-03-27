const toggleButtons = document.querySelectorAll('.toggle');

function toggleClass(e) {
  const parentContainer = e.target.parentElement.parentElement;
  const infoContainer = parentContainer.querySelector('.info');

  infoContainer.classList.toggle('active');

  if (infoContainer.classList.contains('active')) {
    e.target.innerText = 'minder info';
  } else {
    e.target.innerText = 'meer info';
  }
}

toggleButtons.forEach((button) => {
  button.addEventListener('click', toggleClass);
});

// 2de toggle
const toggleButton = document.getElementsByClassName('skipButtonToggle')[0];
const account = document.getElementsByClassName('accounts')[0];

function hiding(e) {
  account.classList.toggle('active2');
  console.log('geklikt');
}

toggleButton.addEventListener('click', hide);
console.log('geklik');
