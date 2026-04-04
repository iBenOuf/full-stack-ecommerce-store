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
  private productCache = new Map<string, IProduct>();
  private isInitialLoad = true;

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }

  get totalQuantity(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  ngOnInit(): void {
    this._cartService.cartData.subscribe((cart) => {
      if (this.isInitialLoad) {
        this.loadCartWithProducts(cart.items);
      } else {
        this.updateCartQuantities(cart.items);
      }
    });
  }

  private loadCartWithProducts(items: ICartItem[]): void {
    if (items.length === 0) {
      this.cartItems = [];
      this.isLoading = false;
      this.isInitialLoad = false;
      this._cdr.detectChanges();
      return;
    }

    this.isLoading = true;

    const requests = items.map((item) => {
      const isPopulated = typeof item.product === 'object' && item.product !== null;
      const productId = isPopulated ? item.product._id : item.product;

      if (isPopulated) {
        this.productCache.set(productId, item.product as IProduct);
        return of({
          productId: productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          product: item.product as IProduct,
        });
      }

      const cached = this.productCache.get(productId);
      if (cached) {
        return of({
          productId: productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          product: cached,
        });
      }

      return this._productService.getProductById(productId).pipe(
        map((res) => {
          this.productCache.set(productId, res.data);
          return {
            productId: productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            product: res.data as IProduct,
          };
        }),
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
      this.isInitialLoad = false;
      this._cdr.detectChanges();
    });
  }

  private updateCartQuantities(items: ICartItem[]): void {
    const missingProducts: string[] = [];
    
    this.cartItems = items.map((item) => {
      const productId = typeof item.product === 'object' ? item.product._id : item.product;
      let cached = this.productCache.get(productId);
      
      if (!cached && !missingProducts.includes(productId)) {
        missingProducts.push(productId);
      }
      
      return {
        productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        product: cached || null,
      };
    });

    if (missingProducts.length > 0) {
      this.loadMissingProducts(items, missingProducts);
    } else {
      this._cdr.detectChanges();
    }
  }

  private loadMissingProducts(items: ICartItem[], missingIds: string[]): void {
    const requests = missingIds.map((id) =>
      this._productService.getProductById(id).pipe(
        map((res) => {
          this.productCache.set(id, res.data);
          return { id, product: res.data as IProduct };
        }),
        catchError(() => of({ id, product: null })),
      ),
    );

    forkJoin(requests).subscribe(() => {
      // Re-render with newly cached products
      this.cartItems = items.map((item) => {
        const productId = typeof item.product === 'object' ? item.product._id : item.product;
        return {
          productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          product: this.productCache.get(productId) || null,
        };
      });
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
