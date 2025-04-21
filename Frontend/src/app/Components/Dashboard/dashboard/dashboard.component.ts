import { ExpenseService } from './../../Expense/expense.service';
import { AuthService } from './../../Auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { Router, RouterModule } from '@angular/router';
import { Expense } from '../../../Models/Models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  expenses: Expense[] = [];
  userId: string = '';
  selectedCategory: string = '';
  selectedTimeRange: string = 'Daily';
  categories = ['Food', 'Travel', 'Bills', 'Entertainment', 'Other'];
  timeRanges = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
  isDataLoaded = false; // To track when data is loaded

  constructor(
    private authService: AuthService,
    private expenseService: ExpenseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getCurrentUserId();
    this.expenseService.getexpense(this.userId).subscribe((data: Expense[]) => {
      this.expenses = data;
      this.isDataLoaded = true; // Set to true once data is loaded
      this.onFilterChange(); // Call onFilterChange to update the chart after data load
    });
  }

  pieChartType: ChartType = 'pie';
  pieChartData = {
    labels: this.categories,
    datasets: [
      {
        data: this.getPieChartData(),
      },
    ],
  };

  get filteredExpenses() {
    const now = new Date();
    return this.expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      let dateMatch = false;

      switch (this.selectedTimeRange) {
        case 'Daily':
          dateMatch = expenseDate.toDateString() === now.toDateString();
          break;
        case 'Weekly':
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          dateMatch = expenseDate >= weekAgo && expenseDate <= now;
          break;
        case 'Monthly':
          dateMatch =
            expenseDate.getMonth() === now.getMonth() &&
            expenseDate.getFullYear() === now.getFullYear();
          break;
        case 'Yearly':
          dateMatch = expenseDate.getFullYear() === now.getFullYear();
          break;
      }

      const categoryMatch = this.selectedCategory
        ? expense.category === this.selectedCategory
        : true;

      return dateMatch && categoryMatch;
    });
  }

  getPieChartData(): number[] {
    // Only generate pie chart data when data is loaded
    if (!this.isDataLoaded) return [];
    return this.categories.map((category) =>
      this.filteredExpenses
        .filter((exp) => exp.category === category)
        .reduce((sum, exp) => sum + exp.amount, 0)
    );
  }

  onFilterChange() {
    if (this.isDataLoaded) {
      this.pieChartData = {
        labels: this.categories,
        datasets: [
          {
            data: this.getPieChartData(),
          },
        ],
      };
    }
  }

  navigateToAddExpense() {
    this.router.navigateByUrl('/addexpense');
  }

  navigateToAllExpenses() {
    this.router.navigateByUrl('/expenses');
  }
}
