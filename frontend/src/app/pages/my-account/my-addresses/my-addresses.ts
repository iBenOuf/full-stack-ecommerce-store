import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IAddress, IAddressRequest } from '../../../core/models/address.model';
import { AddressService } from '../../../core/services/address.service';
import { ToastService } from '../../../core/services/toast.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-addresses',
  imports: [ReactiveFormsModule],
  templateUrl: './my-addresses.html',
  styleUrl: './my-addresses.css',
})
export class MyAddresses implements OnInit {
  constructor(
    private _addressService: AddressService,
    private _toastService: ToastService,
    private _cdr: ChangeDetectorRef,
  ) {}

  addresses: IAddress[] = [];
  isLoading = true;
  isSaving = false;
  showModal = false;
  editingAddress: IAddress | null = null;
  skeletons = ['a', 'b'];

  addressForm = new FormGroup({
    label: new FormControl('', Validators.required),
    street: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    governorate: new FormControl('', Validators.required),
    isDefault: new FormControl(false),
  });

  ngOnInit(): void {
    this.loadAddresses();
  }

  private loadAddresses(): void {
    this.isLoading = true;
    this._addressService.getMyAddresses().subscribe({
      next: (res) => {
        this.addresses = Array.isArray(res.data) ? res.data : [res.data];
        this.isLoading = false;
        this._cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this._toastService.error('Failed to load addresses');
        this._cdr.detectChanges();
      },
    });
  }

  openAdd(): void {
    this.editingAddress = null;
    this.addressForm.reset({ isDefault: false });
    this.showModal = true;
  }

  openEdit(address: IAddress): void {
    this.editingAddress = address;
    this.addressForm.patchValue({
      label: address.label,
      street: address.street,
      city: address.city,
      governorate: address.governorate,
      isDefault: address.isDefault,
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingAddress = null;
    this.addressForm.reset();
  }

  onSubmit(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    const payload = this.addressForm.value as IAddressRequest;

    const request$ = this.editingAddress
      ? this._addressService.updateAddress(this.editingAddress._id, payload)
      : this._addressService.addAddress(payload);

    request$.subscribe({
      next: () => {
        this.isSaving = false;
        this.closeModal();
        this.loadAddresses();
        this._toastService.success(this.editingAddress ? 'Address updated' : 'Address added');
      },
      error: (err) => {
        this.isSaving = false;
        this._toastService.error(err?.error?.message || 'Failed to save address');
        this._cdr.detectChanges();
      },
    });
  }

  setDefault(id: string): void {
    this._addressService.setDefaultAddress(id).subscribe({
      next: () => {
        this.loadAddresses();
        this._toastService.success('Default address updated');
        this._cdr.detectChanges();
      },
      error: () => this._toastService.error('Failed to update default address'),
    });
  }

  deleteAddress(id: string): void {
    this._addressService.deleteAddress(id).subscribe({
      next: () => {
        this.loadAddresses();
        this._toastService.success('Address removed');
        this._cdr.detectChanges();
      },
      error: () => this._toastService.error('Failed to remove address'),
    });
  }
}
