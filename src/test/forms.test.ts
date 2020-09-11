import RenderForms from '../components/auth/render-forms';

document.body.innerHTML = `
<main class="auth__container">
    <div class="auth__form"></div>
  </main>

  <template id="form__signup">
    <div class="form__signup">
      <form>
        <ul>
          <li>
            <label for="user_name_signup">user name</label>
            <input id="user_name_signup" type="text" />
          </li>
          <li>
            <label for="user_email_signup">email</label>
            <input id="user_email_signup" type="email" />
          </li>
          <li>
            <label for="user_token_signup">token</label>
            <input id="user_token_signup" type="text" />
          </li>
          <li>
            <label for="user_password_signup">password</label>
            <input id="user_password_signup" type="password" />
          </li>
        </ul>
        <button type="button" class="form__button button--main">Sign Up</button>
      </form>
      <div class="form__switchbtn">
        <button type="button" switchTo="form__login" class="form__button button--text">
          Log in
        </button>
      </div>
    </div>
  </template>

  <template id="form__reset">
    <div class="form__reset">
      <form>
        <ul>
          <li>
            <label for="user_email_reset">email</label>
            <input id="user_email_reset" type="email" />
          </li>
        </ul>
        <button type="button" class="form__button button--main">Reset password</button>
      </form>
      <div class="form__switchbtn">
        <button type="button" switchTo="form__signup" class="form__button button--text">
          Don't have an account? Sign Up
        </button>
        <button type="button" switchTo="form__login" class="form__button button--text">
          Log in
        </button>
      </div>
    </div>
  </template>`;

const renderForms: RenderForms = new RenderForms(document.querySelector('.auth__form'));

describe('rendering forms', () => {
  test('rendering signup form', () => {
    renderForms.renderForm('form__signup');
    expect(document.querySelector('.form__signup')).toBeTruthy();
  });
  test('rendering reset form', () => {
    renderForms.renderForm('form__reset');
    expect(document.querySelector('.form__reset')).toBeTruthy();
  });
});
