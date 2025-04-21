import { Category } from './../../Models/Models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:5174/api/Category';
  createCategory(categoryData: any) {
    return this.http.post(this.apiUrl, categoryData);
  }
  getAllCategory(userId: string) {
    return this.http.get<Category[]>(`${this.apiUrl}/user/${userId}`);
  }
}
