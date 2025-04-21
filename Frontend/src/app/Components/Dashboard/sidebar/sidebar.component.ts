import { Component } from '@angular/core';
import { AuthService } from '../../Auth/auth.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [RouterOutlet, RouterLink, CommonModule],
})
export class SidebarComponent {
  userName: string = '';
  isLoggedIn: boolean = false;
  constructor(private authService: AuthService, private router: Router) {
    const user = this.authService.getCurrentUser(); // Assuming this is a method to get the current logged-in user
    if (user) this.userName = user.email;
    this.isLoggedIn = authService.isloggedIn();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
