import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { AddExpenseCommand } from './commands/add-expense.command';
import { ListExpensesCommand } from './commands/list-expenses.command';
import { SummaryExpensesCommand } from './commands/summary-expenses.command';
import { DeleteExpenseCommand } from './commands/delete-expense.command';
import { ExportExpensesCommand } from './commands/export-expenses.command';

@Module({
  providers: [
    ExpenseService,
    AddExpenseCommand,
    ListExpensesCommand,
    SummaryExpensesCommand,
    DeleteExpenseCommand,
    ExportExpensesCommand,
  ],
})
export class ExpenseModule {}
