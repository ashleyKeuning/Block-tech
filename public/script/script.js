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
// met hulp van victor boucher
