import { Component, Input } from '@angular/core';
import { Expense } from '../../../Models/Models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-expense-cards',
  imports: [DatePipe],
  templateUrl: './expense-cards.component.html',
  styleUrl: './expense-cards.component.css',
})
export class ExpenseCardsComponent {
  @Input() expense!: Expense;
}
