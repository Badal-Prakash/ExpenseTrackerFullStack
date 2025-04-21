import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Auth/auth.service';
import { User } from '../../Models/Models';
@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  userId!: string;
  user!: User;
  successMsg = '';
  errorMsg = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    this.userId = this.authService.getCurrentUserId();
    this.authService.getUserDetails(this.userId).subscribe({
      next: (data) => {
        this.user = data;
        this.initializeForm();
      },
      error: () => {
        this.errorMsg = 'Failed to load user data';
      },
    });
  }

  initializeForm() {
    this.profileForm = this.fb.group({
      name: [this.user.name, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      phoneNumber: [this.user.phoneNumber],
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    const updatedUser: User = {
      ...this.user,
      ...this.profileForm.value,
    };

    this.authService.updateUserDetails(updatedUser).subscribe({
      next: () => {
        this.successMsg = 'Profile updated successfully!';
      },
      error: () => {
        this.errorMsg = 'Failed to update profile.';
      },
    });
  }
}
