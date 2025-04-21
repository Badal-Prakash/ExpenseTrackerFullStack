import { Expense } from '../../../Models/Models';
import { ChartData } from './../../../../../node_modules/chart.js/dist/types/index.d';
import { AuthService } from './../../Auth/auth.service';
import { ExpenseService } from './../../Expense/expense.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private expenseService: ExpenseService,
    private authService: AuthService
  ) {}
  ChartData: Expense[] = [];
  labeldata: string[] = [];
  chartdata: number[] = [];
  userId: string = '';
  ngOnInit(): void {
    this.userId = this.authService.getCurrentUserId();
    this.expenseService.getFilteredExpenses(this.userId, 'daily');
    this.loadChartData();
  }
  loadChartData() {
    this.expenseService.getexpense(this.userId).subscribe((item) => {
      this.ChartData = item;
    });
  }
}
