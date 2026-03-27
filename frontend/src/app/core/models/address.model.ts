export interface IAddress {
  _id: string;
  user: string;
  label: string;
  street: string;
  city: string;
  governorate: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAddressesResponse {
  message: string;
  data: IAddress[];
}

export interface IAddressResponse {
  message: string;
  data: IAddress;
}

export interface IAddressRequest {
  label?: string;
  street: string;
  city: string;
  governorate: string;
  isDefault?: boolean;
}
