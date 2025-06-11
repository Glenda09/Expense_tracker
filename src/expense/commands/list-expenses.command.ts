import { Command, CommandRunner } from 'nest-commander';
import { ExpenseService } from '../expense.service';

@Command({ name: 'list', description: 'List all expenses' })
export class ListExpensesCommand extends CommandRunner {
  constructor(private readonly expenseService: ExpenseService) {
    super();
  }

  async run(): Promise<void> {
    await this.expenseService.list();
  }
}
