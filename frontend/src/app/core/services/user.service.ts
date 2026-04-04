import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IPasswordRequest, IUser, IUserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiURL + 'user';
  constructor(private http: HttpClient) {}
  getUser(id: string) {
    return this.http.get<IUserResponse>(`${this.apiUrl}/${id}`);
  }
  updateUser(id: string, data: IUser) {
    return this.http.put<IUserResponse>(`${this.apiUrl}/${id}`, data);
  }
  updatePassword(id: string, data: IPasswordRequest) {
    return this.http.patch<IUserResponse>(`${this.apiUrl}/${id}/password`, data);
  }

  getAllUsers() {
    return this.http.get<any>(`${this.apiUrl}/all`);
  }

  changeUserStatus(id: string, data: { isActive: boolean }) {
    return this.http.put<IUserResponse>(`${this.apiUrl}/${id}/status`, data);
  }

  deleteUser(id: string) {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
