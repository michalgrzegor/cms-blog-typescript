import { makeRefreshTokenPost, errorHandling } from './pkce';
import { SuccesfullLoginResponse } from '../interfaces/auth-interface';

export default class TokenHandler {
  TOKEN: string;
  isExpired: boolean;

  constructor() {
    this.TOKEN = null;
    this.isExpired = true;
  }

  setTokens(response: SuccesfullLoginResponse) {
    this.TOKEN = response.access_token;
    this.isExpired = false;
    localStorage.setItem('refresh_token', response.refresh_token);
    localStorage.setItem('refresh_token_created_at', `${response.created_at}`);
    localStorage.setItem('refresh_token_expired_time', `${response.expires_in}`);
    this.setExpireTime();
  }

  setIsExpired(isAdminPanel: boolean) {
    if (
      localStorage.getItem('refresh_token') &&
      localStorage.getItem('refresh_token') !== 'undefined'
    ) {
      const tokenCreationTime = Number(localStorage.getItem('refresh_token_created_at')) * 1000;
      const NowMs = new Date().getTime();
      const expTime = Number(localStorage.getItem('refresh_token_expired_time')) * 1000;
      this.isExpired = NowMs - tokenCreationTime > expTime;
      if (!this.isExpired) this.refreshToken();
    } else if (
      (isAdminPanel && !localStorage.getItem('refresh_token')) ||
      (isAdminPanel && localStorage.getItem('refresh_token') === 'undefined')
    ) {
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('refresh_token_created_at');
      localStorage.removeItem('refresh_token_expired_time');
      window.location.href = 'https://musing-ramanujan-8002a4.netlify.app/index.html';
    } else {
      this.isExpired = true;
    }
  }

  setExpireTime() {
    const tokenCreationTime = Number(localStorage.getItem('refresh_token_created_at')) * 1000;
    const NowMs = new Date().getTime();
    const expTime = Number(localStorage.getItem('refresh_token_expired_time')) * 1000;
    if (NowMs - tokenCreationTime < expTime) {
      setTimeout(() => {
        this.isExpired = true;
        this.refreshToken();
      }, expTime - NowMs + tokenCreationTime - 300000);
    }
  }

  async refreshToken() {
    return makeRefreshTokenPost()
      .then((r) => errorHandling(r, 'something went wrong, try again'))
      .then((r) => r.json())
      .then((r) => this.setTokens(r))
      .catch((error) => errorHandling(error, 'something went wrong, try again'));
  }

  getToken() {
    return this.TOKEN;
  }

  getIsToken() {
    return this.TOKEN !== null;
  }

  getIsExpired() {
    return this.isExpired;
  }

  getIsRefresh() {
    return (
      localStorage.getItem('refresh_token') && localStorage.getItem('refresh_token') !== undefined
    );
  }
}
