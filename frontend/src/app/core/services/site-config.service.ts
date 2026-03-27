import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ISiteConfig, ISiteConfigResponse } from '../models/site-config.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class SiteConfigService {
  private apiURL = environment.apiURL + 'site-config';
  private configData = new BehaviorSubject<ISiteConfig | null>(null);

  constructor(
    private _http: HttpClient,
    private _toastService: ToastService,
  ) {}

  fetchConfig() {
    this.getSiteConfig().subscribe({
      next: (res) => {
        this.configData.next(res.data);
      },
      error: (err) => this._toastService.error(`Failed to load site config ${err}`),
    });
  }

  updateConfig(data: ISiteConfig) {
    return this._http.put<ISiteConfigResponse>(this.apiURL, data).pipe(
      tap((res) => {
        if (res?.data) {
          this.configData.next(res.data);
        }
      }),
    );
  }

  private getSiteConfig() {
    return this._http.get<ISiteConfigResponse>(this.apiURL);
  }

  getSiteConfigData() {
    return this.configData.asObservable();
  }

  getConfigSnapshot(): ISiteConfig | null {
    return this.configData.getValue();
  }
}
