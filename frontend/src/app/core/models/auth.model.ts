export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  message: string;
  token: string;
}

export interface ITokenData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
  gender: string;
  iat: number;
  exp: number;
}

export interface IRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  gender?: string;
}
