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
