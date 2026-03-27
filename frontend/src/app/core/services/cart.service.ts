import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ICart, ICartItem, ICartResponse } from '../models/cart.model';
import { IProduct } from '../models/product.model';
import { ToastService } from './toast.service';
import { BehaviorSubject, map, of } from 'rxjs';
import { AuthService } from './auth.service';
import { ITokenData } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(
    private _http: HttpClient,
    private _toastService: ToastService,
    private _authService: AuthService,
  ) {
    this._authService.getAuthData().subscribe((data) => {
      this.userData = data;
      if (this.userData) {
        const localCart = this._cart.value;
        if (localCart.items.length > 0 && !localCart._id) {
          this.mergeLocalCartToServer().subscribe({
            next: (res) => {
              if (res?.data) {
                this.setLocalCart(res.data);
              }
            },
            error: () => {
              this._toastService.error('Failed to sync cart with server');
            },
          });
        } else {
          this.getServerCart().subscribe({
            next: (res) => {
              if (res?.data) {
                this.setLocalCart(res.data);
              }
            },
            error: () => {
              this._toastService.error('Failed to load cart');
            },
          });
        }
      }
    });
  }

  userData!: ITokenData | null;
  private apiURL = environment.apiURL + 'cart';
  localCartKey = 'cart';

  private _cart = new BehaviorSubject<ICart>(this._getInitialCart());
  cartData = this._cart.asObservable();

  cartCount = this.cartData.pipe(
    map((cart) => cart.items.reduce((acc: number, item: ICartItem) => acc + item.quantity, 0)),
  );

  private _getInitialCart(): ICart {
    const cart = localStorage.getItem(this.localCartKey);
    if (!cart || cart === 'undefined') {
      return { _id: '', user: '', items: [] };
    }
    try {
      return JSON.parse(cart);
    } catch (e) {
      console.error('Error parsing cart from localStorage', e);
      return { _id: '', user: '', items: [] };
    }
  }

  getLocalCart() {
    return localStorage.getItem(this.localCartKey);
  }

  getLocalCartItemsCount() {
    const cart = this._cart.value;
    return cart.items.reduce((acc: number, item: ICartItem) => acc + item.quantity, 0);
  }

  setLocalCart(cart: ICart) {
    if (!cart) return;
    localStorage.setItem(this.localCartKey, JSON.stringify(cart));
    this._cart.next(cart);
  }

  clearLocalCart() {
    if (this.userData) {
      this.clearServerCart().subscribe({
        next: () => {},
        error: () => {
          this._toastService.error('Failed to clear cart');
        },
      });
    }
    localStorage.removeItem(this.localCartKey);
    this._cart.next({ _id: '', user: '', items: [] });
    this._toastService.success('Cart cleared');
  }

  addToLocalCart(product: IProduct, quantity: number) {
    if (quantity > product.stockQuantity) {
      this._toastService.error('Product is out of stock');
      return;
    }
    if (this.userData) {
      this.addToServerCart(product, quantity).subscribe({
        next: (res) => {
          this.setLocalCart(res.data);
          this._toastService.success('Added to cart');
        },
        error: () => {
          this._toastService.error('Failed to add to cart');
        },
      });
    } else {
      const cart = this._cart.value;
      if (cart) {
        const item = cart.items.find((item: ICartItem) => {
          const itemId = typeof item.product === 'object' ? item.product._id : item.product;
          return itemId === product._id;
        });
        if (item) {
          if (item.quantity + quantity > product.stockQuantity) {
            this._toastService.error('Product is out of stock');
            return;
          }
          item.quantity += quantity;
        } else {
          cart.items.push({ product: product._id, quantity: 1, unitPrice: product.price });
        }
        this.setLocalCart(cart);
      } else {
        const cartObj: ICart = {
          _id: '',
          user: '',
          items: [{ product: product._id, quantity, unitPrice: product.price }],
        };
        this.setLocalCart(cartObj);
      }
      this._toastService.success('Added to cart');
    }
  }

  updateLocalCartItemQuantity(product: IProduct, quantity: number) {
    if (quantity > product.stockQuantity) {
      this._toastService.error('Product is out of stock');
      return;
    }
    if (quantity < 1) {
      this._toastService.error('Quantity must be at least 1');
      return;
    }
    if (this.userData) {
      this.updateServerCart(product, quantity).subscribe({
        next: (res) => {
          this.setLocalCart(res.data);
          this._toastService.success('Cart updated');
        },
        error: () => {
          this._toastService.error('Failed to update cart');
        },
      });
    } else {
      const cart = this._cart.value;
      if (cart) {
        const item = cart.items.find((item: ICartItem) => {
          const itemId = typeof item.product === 'object' ? item.product._id : item.product;
          return itemId === product._id;
        });
        if (item) {
          item.quantity = quantity;
        }
        this.setLocalCart(cart);
      }
    }
  }

  removeLocalCartItem(product: IProduct) {
    if (this.userData) {
      this.removeFromCart(product).subscribe({
        next: (res) => {
          this.setLocalCart(res.data);
          this._toastService.success('Removed from cart');
        },
        error: () => {
          this._toastService.error('Failed to remove from cart');
        },
      });
    } else {
      const cart = this._cart.value;
      if (cart) {
        cart.items = cart.items.filter((item: ICartItem) => {
          const itemId = typeof item.product === 'object' ? item.product._id : item.product;
          return itemId !== product._id;
        });
        this.setLocalCart(cart);
      }
      this._toastService.success('Removed from cart');
    }
  }

  getServerCart() {
    return this._http.get<ICartResponse>(this.apiURL);
  }
  addToServerCart(product: IProduct, quantity: number) {
    return this._http.post<ICartResponse>(this.apiURL, { productId: product._id, quantity });
  }
  updateServerCart(product: IProduct, quantity: number) {
    return this._http.put<ICartResponse>(this.apiURL, { productId: product._id, quantity });
  }
  removeFromCart(product: IProduct) {
    return this._http.delete<ICartResponse>(this.apiURL + '/item/' + product._id);
  }
  clearServerCart() {
    return this._http.delete<ICartResponse>(this.apiURL);
  }
  mergeLocalCartToServer() {
    const cart = this._cart.value;
    return this._http.post<ICartResponse>(this.apiURL + '/merge', cart);
  }

  getCartSnapshot(): ICart {
    return this._cart.value;
  }

  replaceCart(cart: ICart) {
    this.setLocalCart(cart);
  }

  syncStatus() {
    if (this.getSyncStatus() === 'synced') {
      return;
    } else {
      this.mergeLocalCartToServer().subscribe({
        next: (res) => {
          this.setLocalCart(res.data);
          this._toastService.success('Cart synced');
        },
        error: () => {
          this._toastService.error('Failed to sync cart');
        },
      });
    }
  }
  getSyncStatus() {
    return localStorage.getItem('cartSyncStatus');
  }
}
