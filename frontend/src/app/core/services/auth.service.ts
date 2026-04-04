import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, tap } from 'rxjs';
import { ITokenData, ILoginRequest, ILoginResponse, IRegisterRequest } from '../models/auth.model';
import { environment } from '../../../environments/environment';
import { ToastService } from './toast.service';
import { IUserResponse } from '../models/user.model';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _toastService: ToastService,
    private _injector: Injector,
  ) {}

  private authData = new BehaviorSubject<ITokenData | null>(null);

  isLoggedIn() {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.decodeToken(token);
      if (this.isValidToken(decodedToken.exp)) {
        return true;
      }
    }
    return false;
  }

  isValidToken(exp: number) {
    const expDate = exp * 1000;
    return expDate > Date.now();
  }

  authInit() {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.decodeToken(token);
      if (this.isValidToken(decodedToken.exp)) {
        this.authData.next(decodedToken);
      } else {
        this.logout();
      }
    }
  }

  private apiURL = environment.apiURL + 'auth';

  login(data: ILoginRequest) {
    return this._http.post<ILoginResponse>(`${this.apiURL}/login`, data).pipe(
      tap((res) => {
        this._toastService.success('Login successful');
        this.storeToken(res.token);
        const decodedToken = this.decodeToken(res.token);
        this.authData.next(decodedToken);
        // Merge local cart into server cart on login
        const cartService = this._injector.get(CartService);
        cartService.mergeLocalCartToServer().subscribe({
          next: (mergeRes) => {
            if (mergeRes?.data) {
              cartService.setLocalCart(mergeRes.data);
            }
          },
          error: () => {
            // Fallback to loading server cart
            cartService.getServerCart().subscribe({
              next: (res) => {
                if (res?.data) {
                  cartService.setLocalCart(res.data);
                }
              },
            });
          },
        });
        const role = decodedToken.role;
        this.navigate(role);
      }),
    );
  }

  register(data: IRegisterRequest) {
    return this._http.post<IUserResponse>(`${this.apiURL}/register`, data).pipe(
      tap((res) => {
        this._toastService.success('Registration successful');
        this._router.navigate(['/login']);
      }),
    );
  }

  getAuthData() {
    return this.authData.asObservable();
  }

  getCurrentRole(): string | null {
    return this.authData.getValue()?.role ?? null;
  }

  private tokenKey = 'token';

  private storeToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  private removeToken() {
    localStorage.removeItem(this.tokenKey);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  private decodeToken(token: string) {
    const decodedToken = jwtDecode<ITokenData>(token);
    return decodedToken;
  }

  private navigate(role: string) {
    if (role === 'admin') {
      this._router.navigate(['/dashboard']);
    } else {
      this._router.navigate(['/home']);
    }
  }

  logout() {
    this.removeToken();
    this.authData.next(null);

    this._toastService.success('Logged out successfully');
    this._router.navigate(['/login']);
  }
}
