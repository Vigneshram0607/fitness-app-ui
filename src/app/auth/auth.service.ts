import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { authConfig } from './auth.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private userId: string | null = null;
  private payLoad: any;
  // private user: any;


  constructor(private router: Router) {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.payLoad = this.parseJwt(this.token);
      this.userId = this.payLoad ? this.payLoad.sub : null;
    }
  }

  async login() {
    const { clientId, authorizationEndpoint, redirectUri, scope } = authConfig;
    const pkce = await this.createPkce();
    sessionStorage.setItem('pkce_code_verifier', pkce.code_verifier);
    const authUrl = new URL(authorizationEndpoint);
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', scope);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('code_challenge', pkce.code_challenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');
    window.location.href = authUrl.toString();
  }

  async handleLoginCallback() {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      try {
        await this.exchangeCodeForToken(code);
      } finally {
        this.router.navigate([], {
          replaceUrl: true,
          queryParams: {},
        });
      }
    }
  }

  private async exchangeCodeForToken(code: string) {
    const { clientId, tokenEndpoint, redirectUri } = authConfig;
    const code_verifier = sessionStorage.getItem('pkce_code_verifier');
    if (!code_verifier) {
      throw new Error('PKCE code_verifier not found in session storage');
    }

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        redirect_uri: redirectUri,
        code: code,
        code_verifier: code_verifier
      })
    });

    if (response.ok) {
      const data = await response.json();
      this.setCredentials(data.access_token);
    } else {
      const error = await response.json();
      console.error('Failed to exchange code for token:', error);
      throw new Error('Failed to exchange code for token');
    }
  }


  setCredentials(token: string) {
    // userId from sub
    // username from name
    this.token = token;
    this.payLoad = this.parseJwt(token);
    this.userId = this.payLoad ? this.payLoad.sub : null;
    localStorage.setItem('token', token);
    if (this.userId) {
      localStorage.setItem('userId', this.userId);
    }
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): string | null {
    return this.payLoad;
  }

  getUserId(): string | null {
    return this.userId;
  }


  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout() {
    this.token = null;
    this.userId = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  private parseJwt(token: string) {
    try {
      console.log('TOKEN: ',token);
      console.log('TOKEN Parse: ',JSON.parse(atob(token.split('.')[1]))['sub']);
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  private async createPkce() {
    const verifier = this.generateRandomString(64);
    const buffer = await this.sha256(verifier);
    const challenge = this.base64urlencode(buffer);
    return {
      code_verifier: verifier,
      code_challenge: challenge
    };
  }

  private generateRandomString(length: number): string {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  private async sha256(plain: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
  }

  private base64urlencode(a: ArrayBuffer): string {
    let str = "";
    const bytes = new Uint8Array(a);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      str += String.fromCharCode(bytes[i]);
    }
    return btoa(str)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
}


