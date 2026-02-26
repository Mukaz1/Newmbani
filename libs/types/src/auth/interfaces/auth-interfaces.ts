export interface AuthTokens {
    access_token: string;
    refresh_token: string;
    identifier: string;
}

export interface RefreshResponse {
    access_token: string;
    refresh_token: string;
}