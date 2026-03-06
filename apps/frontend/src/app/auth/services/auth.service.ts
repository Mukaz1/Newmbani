import {
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
  computed,
} from '@angular/core';
import { catchError, Observable, of, throwError, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

import { API_ENDPOINTS } from '../../common/routes.constants';
import { NotificationService } from '../../common/services/notification.service';
import {
  HttpResponseInterface,
  NotificationStatusEnum,
  ResetPassword,
  User,
  UserLogin,
} from '@newmbani/types';
import {
  AUTH_REFRESH_TOKEN_KEY,
  AUTH_REMEMBER_ME_KEY,
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  PERMISSIONS_KEY,
} from '../auth.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private notify = inject(NotificationService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private isBrowser = isPlatformBrowser(this.platformId);

  // 🔥 Signals
  private _user = signal<User | null>(null);
  user = computed(() => this._user());
  isAuthenticated = computed(() => this.user() !== null);

  private _permissions = signal<string[]>([]);
  permissions = computed(() => this._permissions());

  constructor() {
    // Restore from storage immediately if browser
    if (this.isBrowser) {
      const storedUser = localStorage.getItem(AUTH_USER_KEY);
      const storedPermissions = localStorage.getItem(PERMISSIONS_KEY);
      if (storedUser) this._user.set(JSON.parse(storedUser));
      if (storedPermissions)
        this._permissions.set(JSON.parse(storedPermissions));
    }
  }

  // -------------------------
  // Auth State
  // -------------------------
  setCurrentUser(user: User | null, permissions: string[] = []) {
    this._user.set(user);
    this._permissions.set(permissions);
    if (this.isBrowser) {
      if (user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions));
      } else {
        this.clearStorage();
      }
    }
  }

  getStoredUser(): User | null {
    return this.isBrowser
      ? JSON.parse(localStorage.getItem(AUTH_USER_KEY) || 'null')
      : null;
  }

  getUserType() {
    const user = this.getStoredUser();
    return {
      admin: !!user?.employeeId,
      landlord: !!user?.landlordId,
      customer: !!user?.customerId,
    };
  }

  // -------------------------
  // Tokens
  // -------------------------
  getAccessToken(): string | null {
    return this.isBrowser ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
  }

  isRememberMeChecked(): boolean {
    return this.isBrowser
      ? JSON.parse(localStorage.getItem(AUTH_REMEMBER_ME_KEY) || 'false')
      : false;
  }

  private clearStorage() {
    if (this.isBrowser) {
      [
        AUTH_TOKEN_KEY,
        AUTH_REFRESH_TOKEN_KEY,
        AUTH_USER_KEY,
        PERMISSIONS_KEY,
        AUTH_REMEMBER_ME_KEY,
      ].forEach((k) => localStorage.removeItem(k));
    }
  }

  async persistTokens(res: HttpResponseInterface): Promise<void> {
    const { access_token, refresh_token, permissions, user } = res.data;
    if (this.isBrowser) {
      localStorage.setItem(AUTH_TOKEN_KEY, access_token);
      localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, refresh_token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions));
    }
    this._user.set(user);
    this._permissions.set(permissions);
  }

  // -------------------------
  // Refresh / Logout
  // -------------------------
  refreshAccessToken(): Observable<HttpResponseInterface> {
    const refreshToken = this.isBrowser
      ? localStorage.getItem(AUTH_REFRESH_TOKEN_KEY) || ''
      : '';
    return this.http
      .post<HttpResponseInterface>(API_ENDPOINTS.REFRESH_TOKEN, {
        refresh_token: refreshToken,
      })
      .pipe(
        tap((res) => this.persistTokens(res)),
        catchError((err) => {
          console.error('Error refreshing token:', err);
          return throwError(() => err);
        })
      );
  }

  async logout(sessionExpired = false, redirect = true): Promise<void> {
    this.clearStorage();
    this._user.set(null);
    this._permissions.set([]);

    this.notify.notify({
      title: sessionExpired ? 'Session Expired!' : 'Logged out',
      message: sessionExpired
        ? 'Your session expired. Please log in again.'
        : 'You have been logged out successfully.',
      status: sessionExpired
        ? NotificationStatusEnum.WARNING
        : NotificationStatusEnum.INFO,
    });

    if (redirect) {
      await this.router.navigateByUrl('/auth/login');
    }
  }

  // -------------------------
  // Auth API
  // -------------------------
  login(payload: UserLogin): Observable<HttpResponseInterface> {
    return this.http.post<HttpResponseInterface>(API_ENDPOINTS.LOGIN, payload);
  }

  magicLoginRequestToken(payload: { destination: string }) {
    return this.http
      .post(API_ENDPOINTS.MAGIC_LOGIN, payload)
      .pipe(catchError((error) => of(error)));
  }

  magicLoginValidateToken(token: string) {
    return this.http
      .get(`${API_ENDPOINTS.MAGIC_LOGIN_CALLBACK}?token=${token}`)
      .pipe(catchError((error) => of(error)));
  }

  // -------------------------
  // Account APIs
  // -------------------------
  getMyAccount() {
    return this.http.get(API_ENDPOINTS.ACCOUNT);
  }

  myAuthLogs() {
    return this.http.get(API_ENDPOINTS.AUTH_LOGS);
  }

  resetPassword(email: string): Observable<{
    statusCode: number;
    message: string;
    data: string | null;
  }> {
    const endpoint = API_ENDPOINTS.RESET_PASSWORD;

    return this.http.post<{
      statusCode: number;
      message: string;
      data: string | null;
    }>(endpoint, { email });
  }

  updatePassword(userData: {
    resetToken: string;
    newPassword: string;
    userId: string;
    otpCode?: string;
  }): Observable<{
    statusCode: number;
    message: string;
    data: string | null;
  }> {
    const endpoint = API_ENDPOINTS.CONFIRM_PASSWORD_RESET;
    return this.http.patch<{
      statusCode: number;
      message: string;
      data: string | null;
    }>(endpoint, userData);
  }

  validateResetToken(resetToken: string): Observable<HttpResponseInterface> {
    const endpoint = API_ENDPOINTS.VERIFY_PASSWORD_RESET_TOKEN;
    return this.http.post<HttpResponseInterface>(endpoint, {
      token: resetToken,
    });
  }

  updatePasswordWhenLoggedIn(
    payload: {
      currentPassword: string;
      newPassword: string;
    }
  ): Observable<{
    statusCode: number;
    message: string;
    data: string | null;
  }> {
    const endpoint = API_ENDPOINTS.UPDATE_PASSWORD;
    return this.http.patch<{
      statusCode: number;
      message: string;
      data: string | null;
    }>(endpoint, payload);
  }

  uploadUserProfileImage(
    formData: FormData
  ): Observable<HttpResponseInterface<User>> {
    return this.http
      .patch<HttpResponseInterface<User>>(
        API_ENDPOINTS.ACCOUNT_PROFILE_IMAGE,
        formData
      )
      .pipe(
        tap({
          next: (res) => {
            this._user.set(res.data);
          },
        })
      );
  }
}
