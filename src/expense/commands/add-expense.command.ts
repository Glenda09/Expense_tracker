import { Command, CommandRunner, Option } from 'nest-commander';
import { ExpenseService } from '../expense.service';

@Command({ name: 'add', description: 'Add an expense' })
export class AddExpenseCommand extends CommandRunner {
  constructor(private expenseService: ExpenseService) {
    super();
  }

  async run(passedParams: string[], options?: Record<string, any>): Promise<void> {
    const description = options?.description;
    const amount = options?.amount;
    const category = options?.category;

    if (!description || !amount) {
      console.error('Description and amount are required');
      return;
    }
    await this.expenseService.add(description, parseFloat(amount), category);
  }

  @Option({ flags: '--description <desc>', description: 'Expense description' })
  parseDescription(val: string) {
    return val;
  }

  @Option({ flags: '--amount <amt>', description: 'Amount of expense' })
  parseAmount(val: string) {
    return val;
  }

  @Option({ flags: '--category <cat>', description: 'Expense category (optional)' })
  parseCategory(val: string) {
    return val;
  }
}
