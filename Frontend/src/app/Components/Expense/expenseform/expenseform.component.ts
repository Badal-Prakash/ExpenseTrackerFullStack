import { CategoryService } from './../../category/category.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../expense.service';
import { AuthService } from '../../Auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expenseform.component.html',
  styleUrl: './expenseform.component.css',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class ExpenseFormComponent implements OnInit {
  expenseForm: FormGroup;
  submitted = false;
  categories: any[] = [];
  userID: string = '';
  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService
  ) {
    this.expenseForm = this.fb.group({
      id: [0, Validators.required],
      title: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      date: ['', Validators.required],
      userId: [
        this.authService.getCurrentUser()?.nameid || '',
        Validators.required,
      ],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.userID = this.authService.getCurrentUserId();
    if (id) {
      this.expenseService.getexpensebyid(+id).subscribe((expense) => {
        this.expenseForm.patchValue(expense);
      });
    }
    this.categoryService.getAllCategory(this.userID).subscribe({
      next: (res) => {
        this.categories = res;
        console.log(this.categories);
      },
    });
  }
  get f() {
    return this.expenseForm.controls;
  }

  onSubmit() {
    console.log(this.expenseForm.value);

    this.submitted = true;
    if (this.expenseForm.invalid) return;

    this.expenseService.addExpense(this.expenseForm.value).subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: () => {
        console.log(Error);
      },
    });
  }

  onUpdate() {
    const expenseToUpdate = {
      ...this.expenseForm.value,
      userId: this.authService.getCurrentUser()?.nameid || '',
    };

    this.expenseService
      .updateExpense(this.expenseForm.get('id')?.value, expenseToUpdate)
      .subscribe({
        next: (response) => {
          console.log('Expense updated successfully:', response);
        },
        error: (error) => {
          console.error('Error updating expense:', error);
        },
        complete: () => {
          console.log('Expense update process completed.');
          this.router.navigateByUrl('/dashboard');
        },
      });
  }
}
