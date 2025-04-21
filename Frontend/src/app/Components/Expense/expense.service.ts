import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Expense } from '../../Models/Models';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private ApiUrl = 'http://localhost:5174/api/Expense/';
  constructor(private http: HttpClient, private router: Router) {}
  addExpense(formData: Expense) {
    return this.http.post(this.ApiUrl, formData);
  }
  getexpense(userId: string): Observable<Expense[]> {
    return this.http.get<Expense[]>(
      `http://localhost:5174/api/Expense/user/${userId}`
    );
  }
  // http://localhost:5174/api/Expense/user/f1092d7e-bf82-4634-a741-ae08ba640262
  getexpensebyid(id: number) {
    return this.http.get(`http://localhost:5174/api/Expense/${id}`);
  }
  deleteExpense(id: number) {
    return this.http.delete(`http://localhost:5174/api/Expense/${id}`);
  }
  updateExpense(id: number, formdata: any) {
    return this.http.put(`http://localhost:5174/api/Expense/${id}`, formdata);
  }
  getRecent(userId: string) {
    return this.http.get<Expense[]>(
      `http://localhost:5174/api/Expense/recent/${userId}`
    );
  }

  getFilteredExpenses(userId: string, filterType: string) {
    return this.http.get<Expense[]>(
      `http://localhost:5174/api/Expense/${userId}/${filterType}`
    );
  }
}
