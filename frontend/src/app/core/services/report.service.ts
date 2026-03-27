import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IReportResponse } from '../models/report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private _http: HttpClient) {}

  private apiURL = environment.apiURL + 'report';

  getDashboardReport(startDate?: string, endDate?: string) {
    let url = this.apiURL;
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return this._http.get<IReportResponse>(url);
  }
}
