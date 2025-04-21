import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../Auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true,
  imports: [CommonModule],
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signal for login status
  loggedin = this.authService.isloggedIn;

  // Computed signal for userName
  userName = computed(() => {
    const user = this.authService.getCurrentUser();
    console.log(user);

    return user?.email ?? '';
  });

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  login() {
    this.router.navigateByUrl('/login');
  }
}
