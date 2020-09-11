import Loader from '../shared-ui/loader';
import TOKEN_HANDLER from './token-handler-instance';
import authMediator from './auth-mediator';
import TokenHandler from './token-handler';

export class HttpRequestsInterface {
  URL: string;
  private loader: Loader;
  TOKEN_HANDLER: TokenHandler;

  constructor() {
    this.URL = 'https://fierce-anchorage-12434.herokuapp.com/';
    this.loader = new Loader();
    this.TOKEN_HANDLER = TOKEN_HANDLER;
  }

  async makeRequest(request: Function, data: any): Promise<any> {
    if (this.TOKEN_HANDLER.getIsToken() && !this.TOKEN_HANDLER.getIsExpired()) {
      return request(data);
    }
    if (this.TOKEN_HANDLER.getIsRefresh()) {
      return this.TOKEN_HANDLER.refreshToken().then(() => request(data));
    }
    return authMediator.handleRequest('login');
  }

  signup() {
    const formData = {
      email: document.querySelector<HTMLInputElement>('#user_email_signup').value,
      password: document.querySelector<HTMLInputElement>('#user_password_signup').value,
      username: document.querySelector<HTMLInputElement>('#user_name_signup').value,
      token: document.querySelector<HTMLInputElement>('#user_token_signup').value,
    };
    this.loader.showLoader(document.body);
    fetch(`${this.URL}registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.details === 'Registration token needed.') {
          authMediator.handleRequest('form render error', {
            message: 'wrong token',
            id: 'user_token_signup',
          });
        }
        if (data.message === 'Registration was successful.') {
          authMediator.handleRequest('login');
        }
      })
      .then(() => this.loader.removeLoader());
  }

  reset() {
    const formData = {
      email: document.querySelector<HTMLInputElement>('#user_email_reset').value,
    };
    fetch(`${this.URL}reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then((response) => response.json());
  }

  async getToken() {
    return fetch(`${this.URL}registration_tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.TOKEN_HANDLER.getToken()}`,
      },
    });
  }

  generateToken = async () => this.makeRequest(this.getToken.bind(this), null);
}
