import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { map, catchError, of, forkJoin } from 'rxjs';
import { CartDisplayItem, ICartItem } from '../../core/models/cart.model';
import { IProduct } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cart {
  constructor(
    private _cartService: CartService,
    private _productService: ProductService,
    private _cdr: ChangeDetectorRef,
  ) {}

  cartItems: CartDisplayItem[] = [];
  isLoading = true;
  skeletons = ['a', 'b', 'c'];

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }

  get totalQuantity(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  ngOnInit(): void {
    this._cartService.cartData.subscribe((cart) => {
      this.loadCartWithProducts(cart.items);
    });
  }

  private loadCartWithProducts(items: ICartItem[]): void {
    if (items.length === 0) {
      this.cartItems = [];
      this.isLoading = false;
      this._cdr.detectChanges();
      return;
    }

    this.isLoading = true;

    const requests = items.map((item) => {
      const isPopulated = typeof item.product === 'object' && item.product !== null;
      const productId = isPopulated ? item.product._id : item.product;

      if (isPopulated) {
        return of({
          productId: productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          product: item.product as IProduct,
        });
      }

      return this._productService.getProductById(productId).pipe(
        map((res) => ({
          productId: productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          product: res.data as IProduct,
        })),
        catchError(() =>
          of({
            productId: productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            product: null,
          }),
        ),
      );
    });

    forkJoin(requests).subscribe((displayItems) => {
      this.cartItems = displayItems;
      this.isLoading = false;
      this._cdr.detectChanges();
    });
  }

  increase(item: CartDisplayItem): void {
    if (!item.product) return;
    this._cartService.updateLocalCartItemQuantity(item.product, item.quantity + 1);
  }

  decrease(item: CartDisplayItem): void {
    if (!item.product) return;
    this._cartService.updateLocalCartItemQuantity(item.product, item.quantity - 1);
  }

  removeItem(item: CartDisplayItem): void {
    if (!item.product) return;
    this._cartService.removeLocalCartItem(item.product);
  }

  clearCart(): void {
    this._cartService.clearLocalCart();
  }
}
