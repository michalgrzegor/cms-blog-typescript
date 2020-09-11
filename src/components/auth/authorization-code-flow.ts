import TOKEN_HANDLER from './token-handler-instance';
import SnackBar from '../shared-ui/snackbar';
import {
  SuccesfullLoginResponse,
  QuerryResponse,
  PKCEConfiguration,
} from '../interfaces/auth-interfaces';

export default class AuthorizationCodeFlow {
  private snackBar: SnackBar;
  private URL: string;
  private CONFIG: PKCEConfiguration;

  constructor() {
    this.snackBar = new SnackBar();
    this.URL = 'https://fierce-anchorage-12434.herokuapp.com/';
    this.CONFIG = {
      client_id: 'FP1rr80oHoUmlKPq2VTdetRERSvt4Xp3JHNWm7SrGsA',
      redirect_uri: 'http://localhost:8080/admin-panel.html',
      authorization_endpoint: 'oauth/authorize',
      token_endpoint: 'oauth/token',
      requested_scopes: 'openid',
      client_secret: 'SpQsQF-LC4bYQgrbHam7DTv7YqjTkKwYArhEEl7z_n8',
    };

    // this.CONFIG = {
    //   client_id: 'fecp3e5pAkjOarXF5nsWAoPe1_qr-s2E81chKuSGP0o',
    //   redirect_uri: 'https://musing-ramanujan-8002a4.netlify.app/admin-panel.html',
    //   authorization_endpoint: 'oauth/authorize',
    //   token_endpoint: 'oauth/token',
    //   requested_scopes: 'openid',
    //   client_secret: 'V0URuNE4mYtY8LqdJ5NN7siTngfEpEs_bvLlXbcZrdk',
    // };
  }

  private generateRandomString(): string {
    const array: Uint32Array = new Uint32Array(28);
    window.crypto.getRandomValues(array);
    return Array.from(array, (dec) => `0${dec.toString(16)}`.substr(-2)).join('');
  }

  private sha256(plain: string): PromiseLike<ArrayBuffer> {
    const encoder: TextEncoder = new TextEncoder();
    const data: Uint8Array = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
  }

  private base64urlencode(str: ArrayBuffer): string {
    const numberArray = new Uint8Array(str);
    return btoa(String.fromCharCode.apply(null, <any>numberArray))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  private async pkceChallengeFromVerifier(v: string): Promise<string> {
    const hashed: ArrayBuffer = await this.sha256(v);
    return this.base64urlencode(hashed);
  }

  async login() {
    const state: string = this.generateRandomString();
    localStorage.setItem('pkce_state', state);
    const codeVerifier: string = this.generateRandomString();
    localStorage.setItem('pkce_code_verifier', codeVerifier);
    const codeChallenge: string = await this.pkceChallengeFromVerifier(codeVerifier);
    const url: string = `${this.URL}${
      this.CONFIG.authorization_endpoint
    }?response_type=code&client_id=${encodeURIComponent(
      this.CONFIG.client_id
    )}&state=${encodeURIComponent(state)}&redirect_uri=${encodeURIComponent(
      this.CONFIG.redirect_uri
    )}&code_challenge=${encodeURIComponent(codeChallenge)}&code_challenge_method=S256`;
    window.location.href = url;
  }

  private parseQueryString(string: string): Object {
    if (string === '') {
      return {};
    }
    const segments = string.split('&').map((s) => s.split('='));
    let queryString = {};
    segments.forEach((s) => {
      queryString = {
        ...queryString,
        ...{
          [s[0]]: s[1],
        },
      };
    });
    return queryString;
  }

  private errorHandling({ response, message = null }: { response: any; message: string }) {
    const text = !message ? response.body : message;
    if (!response.ok) this.snackBar.showSnackBar(text);
    return response;
  }

  private handleToken(body: SuccesfullLoginResponse): void {
    TOKEN_HANDLER.setTokens(body);
    window.history.replaceState({}, null, '/admin-panel.html');
  }

  // Make a POST request and parse the response as JSON
  private async sendPostRequestForAccesToken(query: QuerryResponse): Promise<any> {
    const params = {
      grant_type: 'authorization_code',
      code: query.code,
      client_id: this.CONFIG.client_id,
      redirect_uri: this.CONFIG.redirect_uri,
      code_verifier: localStorage.getItem('pkce_code_verifier'),
      client_secret: this.CONFIG.client_secret,
    };
    return fetch(`${this.URL}${this.CONFIG.token_endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
      .then((r) => this.errorHandling({ response: r, message: 'something went wrong, try again' }))
      .then((r) => r.json())
      .then((r) => {
        if (r.access_token) this.handleToken(r);
      })
      .catch((error) =>
        this.errorHandling({ response: error, message: 'something went wrong, try again' })
      );
  }

  private handleSuccess(query: QuerryResponse): Promise<any> {
    return new Promise((resolve, reject) => {
      if (localStorage.getItem('pkce_state') !== query.state) {
        this.snackBar.showSnackBar('Invalid state');
        localStorage.removeItem('pkce_state');
        localStorage.removeItem('pkce_code_verifier');
        reject();
      } else {
        this.sendPostRequestForAccesToken(query).then(() => {
          localStorage.removeItem('pkce_state');
          localStorage.removeItem('pkce_code_verifier');
          resolve();
        });
      }
    });
  }

  handleRedirect(): Promise<any> {
    return new Promise((resolve, reject) => {
      const query: QuerryResponse = this.parseQueryString(window.location.search.substring(1));
      if (query.code) {
        this.handleSuccess(query).then(() => resolve());
      }
      if (!window.location.search.substring(1)) resolve();
      if (query.error) reject(this.snackBar.showSnackBar(query.error));
    });
  }

  // Refresh Token

  async makeRefreshTokenPost(): Promise<any> {
    const params = {
      grant_type: 'refresh_token',
      client_id: this.CONFIG.client_id,
      redirect_uri: this.CONFIG.redirect_uri,
      client_secret: this.CONFIG.client_secret,
      refresh_token: localStorage.getItem('refresh_token'),
    };
    return fetch(`${this.URL}${this.CONFIG.token_endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
  }

  private async handleLogout(response: any): Promise<any> {
    if (response.status === 200) {
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('refresh_token_created_at');
      localStorage.removeItem('refresh_token_expired_time');
      window.location.href = 'https://musing-ramanujan-8002a4.netlify.app';
    }
    return response;
  }

  async logout(): Promise<any> {
    fetch(
      `${this.URL}oauth/revoke?client_id=${this.CONFIG.client_id}&client_secret=${
        this.CONFIG.client_secret
      }&token=${TOKEN_HANDLER.getToken()}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )
      .then((r) => this.errorHandling({ response: r, message: 'something went wrong, try again' }))
      .then((response) => this.handleLogout(response))
      .catch((error) =>
        this.errorHandling({ response: error, message: 'something went wrong, try again' })
      );
  }
}
