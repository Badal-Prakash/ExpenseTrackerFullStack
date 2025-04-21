import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  constructor(private authService: AuthService, private router: Router) {}
  formData = {
    fullName: '',
    email: '',
    password: '',
  };
  onSubmit() {
    console.log(this.formData);
    this.authService.signup(this.formData).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigateByUrl('/login');
      },
      error: (Error) => {
        console.log(Error);
      },
    });
  }
}
