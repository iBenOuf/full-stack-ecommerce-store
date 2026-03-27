import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ITokenData } from '../../core/models/auth.model';
import { UserService } from '../../core/services/user.service';
import { IUser } from '../../core/models/user.model';

@Component({
  selector: 'app-my-account',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './my-account.html',
  styleUrl: './my-account.css',
})
export class MyAccount implements OnInit {
  constructor(
    private _authService: AuthService,
    private _userService: UserService,
    private _cdr: ChangeDetectorRef,
  ) {}

  userData: ITokenData | null = null;
  user!: IUser;
  memberSince!: string;

  ngOnInit(): void {
    this._authService.getAuthData().subscribe((data) => {
      this.userData = data;
      if (this.userData) {
        this._userService.getUser(this.userData._id).subscribe((res) => {
          this.user = res.data;
          this.memberSince = new Date(res.data.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
          this._cdr.detectChanges();
        });
      }
    });
  }

  logout() {
    this._authService.logout();
  }
}
