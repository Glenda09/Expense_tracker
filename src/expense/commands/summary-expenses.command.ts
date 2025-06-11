import { Command, CommandRunner, Option } from 'nest-commander';
import { ExpenseService } from '../expense.service';

@Command({ name: 'summary', description: 'Show summary of expenses' })
export class SummaryExpensesCommand extends CommandRunner {
  constructor(private readonly expenseService: ExpenseService) {
    super();
  }

  async run(passedParams: string[], options?: Record<string, any>): Promise<void> {
    const month = options?.month ? parseInt(options.month) : undefined;
    await this.expenseService.summary(month);
  }

  @Option({ flags: '--month <month>', description: 'Filter by month (1-12)' })
  parseMonth(val: string): string {
    return val;
  }
}