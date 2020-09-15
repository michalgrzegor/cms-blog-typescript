import { AuthMediator } from '../components/auth/auth-mediator';
import Validator from '../components/auth/validator';

const authMediator: AuthMediator = new AuthMediator();

describe('adding new handlers to mediator', () => {
  test('should add handler', () => {
    authMediator.addHandler({
      name: 'validate',
      className: Validator,
      methodName: 'validate',
    });
    // @ts-ignore
    expect(authMediator.handlerArray.length).toBe(1);
  });
  test('ignore duplicate handlers', () => {
    authMediator.addHandler({
      name: 'validate',
      className: Validator,
      methodName: 'validate',
    });
    authMediator.addHandler({
      name: 'validate',
      className: Validator,
      methodName: 'validate',
    });
    authMediator.addHandler({
      name: 'is valid',
      className: Validator,
      methodName: 'isValid',
    });
    // @ts-ignore
    expect(authMediator.handlerArray.length).toBe(2);
  });
});

describe('testing handle requests', () => {
  test('should fire snack bar if no handler', async () => {
    return authMediator
      .handleRequest('handler')
      .catch(() => expect(document.querySelector('.snackbar')).toBeTruthy());
  });
  test('should fire snack bar if no handlers', async () => {
    authMediator.addHandler({
      name: 'is valid',
      className: Validator,
      methodName: 'isValid',
    });
    return authMediator
      .handleRequest('is valid', {
        value: 'test@tes.com',
        type: 'email',
      })
      .then((res) => expect(res).toBe(true));
  });
});
