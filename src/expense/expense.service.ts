import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { writeToPath } from 'fast-csv';
import * as fs from 'fs';
import { format } from 'date-fns';

@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService) {}

  async add(description: string, amount: number, category?: string) {
    const data: any = { description, amount };
    if (category) data.category = category;
    const expense = await this.prisma.expense.create({ data });

    console.log(`Expense added successfully (ID: ${expense.id})`);
  }

  async update(
    id: number,
    description?: string,
    amount?: number,
    category?: string,
  ) {
    const exists = await this.prisma.expense.findUnique({ where: { id } });
    if (!exists) {
      console.error('Expense not found');
      return;
    }
    await this.prisma.expense.update({
      where: { id },
      data: { description, amount, category },
    });
    console.log('Expense updated successfully');
  }

  async delete(id: number) {
    const expense = await this.prisma.expense.findUnique({ where: { id } });
    if (!expense) {
      console.error(`Expense with ID ${id} not found.`);
      return;
    }

    await this.prisma.expense.delete({ where: { id } });
    console.log(`Expense deleted successfully (ID: ${id})`);
  }

  async list() {
    const expenses = await this.prisma.expense.findMany({
      orderBy: { date: 'asc' },
    });
    if (expenses.length === 0) {
      console.log('No expenses found.');
      return;
    }

    console.table(
      expenses.map((e) => ({
        ID: e.id,
        Date: e.date.toISOString().split('T')[0],
        Description: e.description,
        Amount: `$${e.amount}`,
        Category: e.category ?? '-',
      })),
    );
  }

  async summary(month?: number) {
    const allExpenses = await this.prisma.expense.findMany();
    const filtered = month
      ? allExpenses.filter((e) => new Date(e.date).getMonth() + 1 === month)
      : allExpenses;

    const total = filtered.reduce((acc, e) => acc + e.amount, 0);
    const label = month
      ? `Total expenses for month ${month}`
      : 'Total expenses';

    console.log(`${label}: $${total}`);
  }

  //   async exportToCSV() {
  //     const expenses = await this.prisma.expense.findMany();
  //     const rows = expenses.map((e) => ({
  //       ID: e.id,
  //       Description: e.description,
  //       Amount: e.amount,
  //       Category: e.category ?? '',
  //       Date: format(e.date, 'yyyy-MM-dd'),
  //     }));

  //     const filePath = 'expenses.csv';
  //     const ws = fs.createWriteStream(filePath);

  //     writeToPath(filePath, rows, { headers: true })
  //       .on('finish', () => console.log(`Exported successfully to ${filePath}`))
  //       .on('error', (err) => console.error('Failed to export CSV:', err));
  //   }

  async exportToCSV() {
    // Obtiene todos los registros de gastos desde la base de datos usando Prisma.
    const expenses = await this.prisma.expense.findMany();

    // Mapea cada gasto a un objeto con las propiedades necesarias para el CSV.
    const rows = expenses.map((e) => ({
      ID: e.id, // Asigna el ID del gasto.
      Description: e.description, // Asigna la descripción del gasto.
      Amount: e.amount, // Asigna el monto del gasto.
      Category: e.category ?? '', // Asigna la categoría o una cadena vacía si es nula.
      Date: format(e.date, 'yyyy-MM-dd'), // Formatea la fecha al formato 'yyyy-MM-dd'.
    }));

    // Define la ruta y nombre del archivo CSV a generar.
    const filePath = 'expenses.csv';

    // Crea un stream de escritura para el archivo CSV (aunque no se usa directamente después).
    const ws = fs.createWriteStream(filePath);

    // Escribe los datos mapeados en el archivo CSV, incluyendo los encabezados.
    writeToPath(filePath, rows, { headers: true })
      // Cuando termina de escribir, muestra un mensaje de éxito en consola.
      .on('finish', () => console.log(`Exported successfully to ${filePath}`))
      // Si ocurre un error durante la exportación, lo muestra en consola.
      .on('error', (err) => console.error('Failed to export CSV:', err));
  }
}
