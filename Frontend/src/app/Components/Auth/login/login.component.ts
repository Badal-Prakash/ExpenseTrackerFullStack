import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private authservice: AuthService, private router: Router) {}
  loginData = {
    Email: '',
    password: '',
    confirmPassword: '',
  };
  onSubmit() {
    this.authservice
      .login({
        email: this.loginData.Email,
        password: this.loginData.password,
      })
      .subscribe({
        next: (res) => {
          this.authservice.saveToken(res.token);
          this.router.navigateByUrl('/dashboard');
        },
        error: (error) => {
          console.log(Error);
        },
      });
    console.log(this.loginData);
  }
}
