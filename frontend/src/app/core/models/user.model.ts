export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  role: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUserResponse {
  message: string;
  data: IUser;
}

export interface IUsersResponse {
  message: string;
  data: IUser[];
}

export interface IPasswordRequest {
  currentPassword: string;
  newPassword: string;
}
