import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IFAQRequest, IFAQResponse, IFAQsResponse } from '../models/faq.model';

@Injectable({
  providedIn: 'root',
})
export class FaqService {
  constructor(private _http: HttpClient) {}

  private apiURL = environment.apiURL + 'faq';

  getActiveFaqs() {
    return this._http.get<IFAQsResponse>(this.apiURL);
  }
  getAllFaqs() {
    return this._http.get<IFAQsResponse>(`${this.apiURL}/admin`);
  }

  createFaq(data: IFAQRequest) {
    return this._http.post<IFAQResponse>(this.apiURL, data);
  }

  updateFaq(id: string, data: IFAQRequest) {
    return this._http.put<IFAQResponse>(`${this.apiURL}/${id}`, data);
  }

  deleteFaq(id: string) {
    return this._http.delete<IFAQResponse>(`${this.apiURL}/${id}`);
  }
}
