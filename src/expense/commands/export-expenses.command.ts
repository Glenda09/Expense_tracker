import { Command, CommandRunner } from 'nest-commander';
import { ExpenseService } from '../expense.service';

@Command({ name: 'export', description: 'Export expenses to CSV' })
export class ExportExpensesCommand extends CommandRunner {
  constructor(private readonly expenseService: ExpenseService) {
    super();
  }

  async run(): Promise<void> {
    await this.expenseService.exportToCSV();
  }
}
