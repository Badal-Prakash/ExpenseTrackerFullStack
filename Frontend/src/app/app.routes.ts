import { Routes } from '@angular/router';
import { SignupComponent } from './Components/Auth/signup/signup.component';
import { LoginComponent } from './Components/Auth/login/login.component';
import { DashboardComponent } from './Components/Dashboard/dashboard/dashboard.component';
import { ExpenseFormComponent } from './Components/Expense/expenseform/expenseform.component';
import { ExpenseComponent } from './Components/Expense/expense/expense.component';
import { AuthGuard } from './Components/Auth/auth.guard';
import { CategoryComponent } from './Components/category/category.component';

export const routes: Routes = [
  {
    path: '',
    component: SignupComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'addexpense',
    component: ExpenseFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'editexpense/:id',
    component: ExpenseFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'expenses',
    component: ExpenseComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'categories',
    component: CategoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
];
