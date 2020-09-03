const showSnackBar = (message: string) => {
  const snackBarContainer = document.createElement('div');
  snackBarContainer.classList.add('snackbar');
  const paragraph = document.createElement('p');
  paragraph.innerHTML = message;
  snackBarContainer.appendChild(paragraph);
  document.body.appendChild(snackBarContainer);
  setTimeout(() => snackBarContainer.remove(), 5000);
};

export default showSnackBar;
