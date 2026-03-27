import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { Toast } from './shared/components/toast/toast';
import { CartService } from './core/services/cart.service';
import { SiteConfigService } from './core/services/site-config.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('frontend');
  constructor(
    private _authService: AuthService,
    private _siteConfigService: SiteConfigService,
  ) {}

  ngOnInit(): void {
    this._authService.authInit();
    this._siteConfigService.fetchConfig();
  }
}
