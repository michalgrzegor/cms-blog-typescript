import Validator from '../components/auth/validator';

const validator: Validator = new Validator();

describe('testing email input field', () => {
  test('email input field => empty string', () => {
    expect(validator.isValid({ value: '', type: 'email' })).toBeFalsy();
  });

  test('email input field => correct email address', () => {
    expect(validator.isValid({ value: 'test@tes.test', type: 'email' })).toBeTruthy();
  });

  test('email input field => email address without @ part', () => {
    expect(validator.isValid({ value: 'testtes.test', type: 'email' })).toBeFalsy();
  });

  test('email input field => email address with two @ part', () => {
    expect(validator.isValid({ value: 'test@tes.test@tes.test', type: 'email' })).toBeFalsy();
  });
});

describe('testing password input field', () => {
  test('password field is empty', () => {
    expect(validator.isValid({ value: '', type: 'password' })).toBeFalsy();
  });

  test('password is too short', () => {
    expect(validator.isValid({ value: 'asd1', type: 'password' })).toBeFalsy();
  });

  test('password is long enought', () => {
    expect(validator.isValid({ value: 'asdasd', type: 'password' })).toBeTruthy();
  });
});

describe('testing username and token input field', () => {
  test('username or token field is empty', () => {
    expect(validator.isValid({ value: '', type: 'text' })).toBeFalsy();
  });

  test('username or token field is not empty', () => {
    expect(validator.isValid({ value: 'token or username', type: 'text' })).toBeTruthy();
  });
});
