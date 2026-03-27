import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IPageCreateRequest, IPageUpdateRequest, IPageResponse, IPagesResponse } from '../models/page.model';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  constructor(private _http: HttpClient) {}

  private apiURL = environment.apiURL + 'page';

  getPageBySlug(slug: string) {
    return this._http.get<IPageResponse>(`${this.apiURL}/${slug}`);
  }

  getAllPages() {
    return this._http.get<IPagesResponse>(`${this.apiURL}`);
  }

  createPage(data: IPageCreateRequest) {
    return this._http.post<IPageResponse>(this.apiURL, data);
  }

  updatePage(id: string, data: IPageUpdateRequest) {
    return this._http.put<IPageResponse>(`${this.apiURL}/${id}`, data);
  }

  deletePage(id: string) {
    return this._http.delete<IPageResponse>(`${this.apiURL}/${id}`);
  }
}
