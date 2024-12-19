import { Movement } from '@app/model/Movement';
import dayjs from 'dayjs';

const excelBulkTreatment = (content: string, userId: string): Movement[] =>
  content
    .split('\n')
    .map((line) => line.split('\t'))
    .filter((lineArr: string[]) => lineArr.length === 3)
    .reduce(
      (movements: Movement[], lineArr: string[]) => [
        ...movements,
        {
          date: dayjs(lineArr[0], 'DD/MM/YYYY').toISOString(),
          name: lineArr[1],
          amount: parseFloat(lineArr[2].replace(/,/g, '')),
          type: +lineArr[2] >= 0 ? 'income' : 'expense',
          userId,
        } as Movement,
      ],
      [] as Movement[],
    );

export { excelBulkTreatment };
