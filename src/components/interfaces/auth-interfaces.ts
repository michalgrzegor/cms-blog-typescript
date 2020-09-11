import AuthorizationCodeFlow from '../auth/authorization-code-flow';
import TokenHandler from '../auth/token-handler';
import RenderForms from '../auth/render-forms';

export interface SuccesfullLoginResponse {
  access_token: string;
  created_at: number;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface QuerryResponse {
  code?: string;
  state?: string;
  error?: string;
}

export interface PKCEConfiguration {
  client_id: string;
  redirect_uri: string;
  authorization_endpoint: string;
  token_endpoint: string;
  requested_scopes: string;
  client_secret: string;
}

type AuthClasses = AuthorizationCodeFlow | TokenHandler | RenderForms | any;

interface ConstructableAuthClasses<AuthClasses> {
  new (...args: any): AuthClasses;
}

export interface Handler {
  name: string;
  className: ConstructableAuthClasses<AuthClasses>;
  methodName: string;
}
