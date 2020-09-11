import SnackBar from '../components/shared-ui/snackbar';

const snackBar: SnackBar = new SnackBar();

beforeEach(() => {
  snackBar.showSnackBar('test');
});

describe('testing creating snack bar element', () => {
  test('creating div element', () => {
    // @ts-ignore
    expect(snackBar.createRemoveButton().outerHTML).toBe('<button></button>');
    // @ts-ignore
    expect(snackBar.createSnackBar().outerHTML).toBe(
      '<div class="snackbar"><p></p><button></button></div>'
    );
  });

  test('appending element to DOM', () => {
    expect(document.querySelector('.snackbar')).toBeTruthy();
  });

  test('remove snackbar from DOM', () => {
    // @ts-ignore
    snackBar.removeSnackBar();
    expect(document.querySelector('.snackbar')).toBeFalsy();
  });
});
