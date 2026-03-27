import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ISubcategoriesResponse, ISubcategoryResponse } from '../models/subcategory.model';

@Injectable({
  providedIn: 'root',
})
export class SubcategoryService {
  constructor(private _http: HttpClient) {}
  private apiURL = environment.apiURL + 'subcategory';

  getAllSubcategories() {
    return this._http.get<ISubcategoriesResponse>(this.apiURL);
  }

  getAdminSubcategories() {
    return this._http.get<ISubcategoriesResponse>(this.apiURL + '/admin');
  }

  createSubcategory(data: FormData) {
    return this._http.post<ISubcategoryResponse>(this.apiURL, data);
  }

  updateSubcategory(id: string, data: FormData) {
    return this._http.put<ISubcategoryResponse>(this.apiURL + '/' + id, data);
  }

  deleteSubcategory(id: string) {
    return this._http.delete<{ message: string }>(this.apiURL + '/' + id);
  }
}
