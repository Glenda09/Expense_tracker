import { Command, CommandRunner, Option } from 'nest-commander';
import { ExpenseService } from '../expense.service';

@Command({ name: 'delete', description: 'Delete an expense by ID' })
export class DeleteExpenseCommand extends CommandRunner {
  constructor(private readonly expenseService: ExpenseService) {
    super();
  }

  async run(passedParams: string[], options?: Record<string, any>): Promise<void> {
    const id = parseInt(options?.id);
    if (isNaN(id)) {
      console.error('You must provide a valid --id');
      return;
    }
    await this.expenseService.delete(id);
  }

  @Option({ flags: '--id <id>', description: 'Expense ID to delete' })
  parseId(val: string) {
    return val;
  }
}
