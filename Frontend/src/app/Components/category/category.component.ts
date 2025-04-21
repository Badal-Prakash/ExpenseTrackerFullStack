import { CategoryScale } from './../../../../node_modules/chart.js/dist/types/index.d';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../Auth/auth.service';
import { Category } from '../../Models/Models';
import { CategoryService } from './category.service';

@Component({
  selector: 'app-category',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private categoryService: CategoryService
  ) {}
  categories: any[] = [];
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  successMessage = signal('');
  errorMessage = signal('');
  categoryForm = this.fb.group({
    name: ['', Validators.required],
    userId: ['', Validators.required],
  });
  ngOnInit(): void {
    this.categoryForm.patchValue({
      userId: this.auth.getCurrentUserId(),
    });
    const userId = this.categoryForm.get('userId')?.value as string;
    if (userId) {
      this.categoryService.getAllCategory(userId).subscribe({
        next: (res) => {
          this.categories = res;
          console.log(this.categories);
        },
      });
    } else {
      console.error('User ID is invalid or missing.');
    }
    console.log('CategoryComponent initialized');
  }

  submitForm() {
    if (this.categoryForm.invalid) return;
    const categoryData = this.categoryForm.value;
    this.categoryService.createCategory(categoryData).subscribe({
      next: () => {
        console.log(categoryData);
        this.successMessage.set('Category created successfully!');
        this.categoryForm.reset();
      },
      error: (err) => {
        this.errorMessage.set('Failed to create category.');
        console.error(err);
      },
    });
  }
}
