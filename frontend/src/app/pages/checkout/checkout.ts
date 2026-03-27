import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, catchError, of, forkJoin } from 'rxjs';
import { IAddress } from '../../core/models/address.model';
import { IProduct } from '../../core/models/product.model';
import { AddressService } from '../../core/services/address.service';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { ToastService } from '../../core/services/toast.service';
import { environment } from '../../../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  constructor(
    private _cartService: CartService,
    private _addressService: AddressService,
    private _orderService: OrderService,
    private _productService: ProductService,
    private _toastService: ToastService,
    private _router: Router,
    private _cdr: ChangeDetectorRef,
  ) {}

  cartItems: IProduct[] = [];
  cartItemMap: Map<string, number> = new Map();
  savedAddresses: IAddress[] = [];

  selectedAddressId: string | null = null;
  showAddressForm = false;
  isMergingCart = true;
  isPlacingOrder = false;
  staticFilesURL = environment.staticFilesURL;

  addressForm = new FormGroup({
    street: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    governorate: new FormControl('', Validators.required),
  });

  phoneForm = new FormGroup({
    deliveryPhone: new FormControl('', Validators.required),
  });

  get subtotal(): number {
    return this.cartItems.reduce((sum, product) => {
      const qty = this.cartItemMap.get(product._id) ?? 0;
      return sum + product.price * qty;
    }, 0);
  }

  get total(): number {
    return this.subtotal;
  }

  ngOnInit(): void {
    this.loadCheckoutData();
  }

  private loadCheckoutData(): void {
    const cartSnapshot = this._cartService.getCartSnapshot();
    const items = cartSnapshot.items;

    if (items.length === 0) {
      this.isMergingCart = false;
      this._cdr.detectChanges();
      return;
    }

    const productRequests = items.map((item) => {
      const isPopulated = typeof item.product === 'object' && item.product !== null;
      const productId = isPopulated ? (item.product as IProduct)._id : (item.product as string);
      this.cartItemMap.set(productId, item.quantity);

      if (isPopulated) {
        return of(item.product as IProduct);
      }
      return this._productService.getProductById(productId).pipe(
        map((res) => res.data as IProduct),
        catchError(() => of(null)),
      );
    });

    forkJoin([
      forkJoin(productRequests),
      this._addressService.getMyAddresses().pipe(catchError(() => of({ data: [] as IAddress[] }))),
    ]).subscribe(([products, addressRes]) => {
      this.cartItems = products.filter(Boolean) as IProduct[];
      this.savedAddresses = Array.isArray(addressRes.data)
        ? addressRes.data
        : [addressRes.data as any];

      const defaultAddr = this.savedAddresses.find((a) => a.isDefault);
      if (defaultAddr) {
        this.selectedAddressId = defaultAddr._id;
        this.showAddressForm = false;
      } else if (this.savedAddresses.length === 0) {
        this.showAddressForm = true;
      } else {
        this.selectedAddressId = this.savedAddresses[0]._id;
      }

      this.isMergingCart = false;
      this._cdr.detectChanges();
    });
  }

  getItemQuantity(productId: string): number {
    return this.cartItemMap.get(productId) ?? 0;
  }

  selectSavedAddress(address: IAddress): void {
    this.selectedAddressId = address._id;
    this.showAddressForm = false;
    this.addressForm.reset();
  }

  useNewAddress(): void {
    this.selectedAddressId = null;
    this.showAddressForm = true;
  }

  placeOrder(): void {
    if (this.phoneForm.invalid) {
      this.phoneForm.markAllAsTouched();
      this._toastService.error('Please enter a delivery phone number');
      return;
    }

    let shippingAddress: { street: string; city: string; governorate: string } | null = null;

    if (this.selectedAddressId) {
      const addr = this.savedAddresses.find((a) => a._id === this.selectedAddressId);
      if (addr) {
        shippingAddress = { street: addr.street, city: addr.city, governorate: addr.governorate };
      }
    } else if (this.showAddressForm) {
      if (this.addressForm.invalid) {
        this.addressForm.markAllAsTouched();
        this._toastService.error('Please fill in the shipping address');
        return;
      }
      shippingAddress = this.addressForm.value as {
        street: string;
        city: string;
        governorate: string;
      };
    }

    if (!shippingAddress) {
      this._toastService.error('Please select or enter a shipping address');
      return;
    }

    this.isPlacingOrder = true;

    this._orderService
      .createOrder({
        shippingAddress,
        deliveryPhone: this.phoneForm.value.deliveryPhone!,
      })
      .subscribe({
        next: (res) => {
          const orderId = (res.data as any)._id;
          setTimeout(() => {
            this._cartService.replaceCart({ _id: '', user: '', items: [] });
            this._router.navigate(['/order-confirmation', orderId]);
          });
        },
        error: (err) => {
          this.isPlacingOrder = false;
          this._toastService.error(err?.error?.message || 'Failed to place order');
          this._cdr.detectChanges();
        },
      });
  }
}
