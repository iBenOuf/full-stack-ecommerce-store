import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ICategoriesResponse, ICategoryResponse } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private _http: HttpClient) {}

  private apiURL = environment.apiURL + 'category';

  getAllCategories() {
    return this._http.get<ICategoriesResponse>(this.apiURL + '/all');
  }

  getAdminCategories() {
    return this._http.get<ICategoriesResponse>(this.apiURL + '/all/admin');
  }

  createCategory(data: FormData) {
    return this._http.post<ICategoryResponse>(this.apiURL + '/add', data);
  }

  updateCategory(id: string, data: FormData) {
    return this._http.put<ICategoryResponse>(this.apiURL + '/update/' + id, data);
  }

  deleteCategory(id: string) {
    return this._http.delete<{ message: string }>(this.apiURL + '/delete/' + id);
  }
}
