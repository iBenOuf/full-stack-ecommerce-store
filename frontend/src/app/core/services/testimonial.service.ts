import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  ICreateTestimonialRequest,
  ITestimonialResponse,
  ITestimonialsResponse,
  IUpdateTestimonialStatusRequest,
} from '../models/testimonial.model';

@Injectable({
  providedIn: 'root',
})
export class TestimonialService {
  constructor(private _http: HttpClient) {}

  private apiURL = environment.apiURL + 'testimonial';

  getApprovedTestimonials() {
    return this._http.get<ITestimonialsResponse>(this.apiURL);
  }

  createTestimonial(data: ICreateTestimonialRequest) {
    return this._http.post<ITestimonialResponse>(this.apiURL, data);
  }

  getAllTestimonials() {
    return this._http.get<ITestimonialsResponse>(`${this.apiURL}/admin`);
  }

  updateTestimonialStatus(id: string, data: IUpdateTestimonialStatusRequest) {
    return this._http.put<ITestimonialResponse>(`${this.apiURL}/${id}`, data);
  }

  deleteTestimonial(id: string) {
    return this._http.delete<ITestimonialResponse>(`${this.apiURL}/${id}`);
  }
}
