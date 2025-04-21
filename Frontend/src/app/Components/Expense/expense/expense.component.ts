import { Expense } from './../../../Models/Models';
import { AuthService } from './../../Auth/auth.service';
import { ExpenseService } from './../expense.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expense',
  imports: [CommonModule, DatePipe],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css',
})
export class ExpenseComponent implements OnInit {
  id = '';
  expense: Expense[] = [];
  constructor(
    private expenseService: ExpenseService,
    private Auth: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.id = this.Auth.getCurrentUserId();
    this.getAllExpense();
  }
  getAllExpense() {
    this.expenseService.getexpense(this.id).subscribe({
      next: (res: Expense[]) => {
        this.expense = res;
      },
      error: (err) => {
        console.error('Error fetching expenses:', err);
      },
      complete: () => {
        console.log('completed');

        console.log(this.expense);
      },
    });
  }
  onDelete(id: number) {
    this.expenseService.deleteExpense(id).subscribe({
      next: (res) => {
        console.log('deleted');
      },
      error: (Error) => console.log(Error),
    });
  }
  onEdit(id: number) {
    console.log('Editing expense with ID:', id);
    this.router.navigateByUrl(`/editexpense/${id}`);
  }
  onAddExpense() {
    this.router.navigateByUrl('/addexpense');
  }
}
