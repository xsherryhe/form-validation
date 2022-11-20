const form = document.querySelector('form');
const emailInput = document.querySelector('#email');
const emailError = document.querySelector('#email+.error');
const countryInput = document.querySelector('#country');
const countryError = document.querySelector('#country+.error');
const zipCodeInput = document.querySelector('#zip-code');
const zipCodeError = document.querySelector('#zip-code+.error');
const passwordInput = document.querySelector('#password');
const passwordError = document.querySelector('#password+.error');
const passwordConfirmInput = document.querySelector('#password-confirm');
const passwordConfirmError = document.querySelector('#password-confirm+.error');

function humanReadable(string) {
  const humanReadableString = string.replace(/-/g, ' ');
  return (
    humanReadableString[0].toUpperCase() +
    humanReadableString.slice(1).toLowerCase()
  );
}

function hideValidity(input, error) {
  input.setCustomValidity('');
  error.classList.add('hidden');
}

function reportValidity(input, error) {
  if (!input.checkValidity()) {
    error.classList.remove('hidden');
    error.textContent = input.validationMessage;
  }
}

function validateRequired(input) {
  if (input.value === '')
    input.setCustomValidity(`${humanReadable(input.name)} cannot be blank`);
}

function validateLength(input, length, { type = 'exact' } = {}) {
  const adverb = { min: 'at least', exact: 'exactly', max: 'at most' }[type];
  const comparison = {
    min: (x) => x < length,
    exact: (x) => x !== length,
    max: (x) => x > length,
  }[type];

  if (comparison(input.value.length))
    input.setCustomValidity(
      `${humanReadable(input.name)} must be ${adverb} ${length} characters long`
    );
}

function validatePattern(
  input,
  reg,
  { message = 'must have the correct format' } = {}
) {
  if (!reg.test(input.value))
    input.setCustomValidity(`${humanReadable(input.name)} ${message}`);
}

function reportEmailValidity() {
  hideValidity(emailInput, emailError);
  validatePattern(emailInput, /^\w+@\w+(\.\w+)*$/, {
    message: 'must have the format of an email address',
  });
  validateRequired(emailInput);
  reportValidity(emailInput, emailError);
}
emailInput.addEventListener('input', reportEmailValidity);

function reportCountryValidity() {
  hideValidity(countryInput, countryError);
  validateLength(countryInput, 4, { type: 'min' });
  validateRequired(countryInput);
  reportValidity(countryInput, countryError);
}
countryInput.addEventListener('input', reportCountryValidity);

function reportZipCodeValidity() {
  hideValidity(zipCodeInput, zipCodeError);
  validatePattern(zipCodeInput, /\d{5}/);
  validateLength(zipCodeInput, 5);
  validateRequired(zipCodeInput);
  reportValidity(zipCodeInput, zipCodeError);
}
zipCodeInput.addEventListener('input', reportZipCodeValidity);

function reportPasswordValidity() {
  hideValidity(passwordInput, passwordError);
  validatePattern(
    passwordInput,
    /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()])/,
    {
      message:
        'must contain at least 1 of each: uppercase letter, lowercase letter, number, and symbol',
    }
  );
  validateLength(passwordInput, 6, { type: 'min' });
  validateLength(passwordInput, 20, { type: 'max' });
  validateRequired(passwordInput);
  reportValidity(passwordInput, passwordError);
}
passwordInput.addEventListener('input', reportPasswordValidity);

function reportPasswordConfirmValidity() {
  hideValidity(passwordConfirmInput, passwordConfirmError);
  if (passwordConfirmInput.value === '') return;

  if (passwordConfirmInput.value !== passwordInput.value)
    passwordConfirmInput.setCustomValidity('Passwords do not match');
  reportValidity(passwordConfirmInput, passwordConfirmError);
}
passwordInput.addEventListener('input', reportPasswordConfirmValidity);
passwordConfirmInput.addEventListener('input', reportPasswordConfirmValidity);

function reportAllValidity() {
  reportEmailValidity();
  reportCountryValidity();
  reportZipCodeValidity();
  reportPasswordValidity();
  reportPasswordConfirmValidity();
}

function confirmSubmission() {
  document.body.textContent = '👍';
  const newFormButton = document.createElement('button');
  newFormButton.textContent = 'Fill out the form again';
  newFormButton.addEventListener('click', () => {
    window.location.reload();
  });
  document.body.append(newFormButton);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  reportAllValidity();
  if (form.checkValidity()) confirmSubmission();
});
