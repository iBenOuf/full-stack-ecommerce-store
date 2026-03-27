import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAddressRequest, IAddressResponse } from '../models/address.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(private http: HttpClient) {}
  private apiUrl = environment.apiURL + 'address';

  getAddressById(id: string) {
    return this.http.get<IAddressResponse>(`${this.apiUrl}/by-id/${id}`);
  }

  getMyAddresses() {
    return this.http.get<IAddressResponse>(`${this.apiUrl}/my-addresses`);
  }

  addAddress(address: IAddressRequest) {
    return this.http.post<IAddressResponse>(`${this.apiUrl}/add`, address);
  }

  updateAddress(id: string, address: IAddressRequest) {
    return this.http.put<IAddressResponse>(`${this.apiUrl}/update/${id}`, address);
  }

  deleteAddress(id: string) {
    return this.http.delete<IAddressResponse>(`${this.apiUrl}/delete/${id}`);
  }

  setDefaultAddress(id: string) {
    return this.http.patch<IAddressResponse>(`${this.apiUrl}/default/${id}`, {});
  }
}
