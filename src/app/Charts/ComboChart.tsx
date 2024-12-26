import { Category } from '@app/model/Category';
import { CategoryList } from '@app/model/CategoryList';
import { CategorySum } from '@app/model/CategorySum';
import { Skeleton, Slider } from '@patternfly/react-core';
import { QueryStatus } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import Chart from 'react-google-charts';

type ComboChartProps = {
  categorySumByMonth: { [month: string]: CategorySum[] } | undefined;
  categoryList: CategoryList | undefined;
  categorySumByMonthStatus: QueryStatus;
  selectedCategories?: string[];
};
const ComboChart = ({
  categorySumByMonth,
  categoryList,
  categorySumByMonthStatus,
  selectedCategories,
}: ComboChartProps) => {
  const data = useMemo(() => {
    if (categorySumByMonth && categoryList) {
      const categoriesIds = Object.values(categorySumByMonth).flatMap((categorySum) =>
        categorySum.flatMap((e) => e.categoryId),
      );
      const categoriesMap: { [categoryId: string]: Category } = categoriesIds.reduce(
        (acc, categoriesId) => ({
          ...acc,
          [`${categoriesId}`]: categoryList.data.find((category) => categoriesId === category.id),
        }),
        {},
      );

      const sortedCategoriesValues = Object.values(categoriesMap)
        .filter(
          (category) =>
            category !== undefined && (selectedCategories === undefined || selectedCategories.includes(category.id)),
        )
        .sort((a, b) => a.name.localeCompare(b.name));

      const header = [
        'MES',
        'INGRESOS',
        'GASTOS',
        'AHORRO',
        ...sortedCategoriesValues.map((category) => category.name.toUpperCase()),
      ];
      const lines = Object.entries(categorySumByMonth).map(([month, categorySums]) => [
        month,
        categorySums
          .map((categorySum) => parseFloat(`${categorySum._sum.amount}`))
          .filter((amount) => amount > 0)
          .reduce((acc, curr) => acc + curr, 0),
        categorySums
          .map((categorySum) => parseFloat(`${categorySum._sum.amount}`))
          .filter((amount) => amount < 0)
          .reduce((acc, curr) => acc - curr, 0),
        categorySums
          .map((categorySum) => parseFloat(`${categorySum._sum.amount}`))
          .reduce((acc, curr) => acc + curr, 0),
        ...sortedCategoriesValues.map((category) =>
          Math.abs(
            parseFloat(
              `${categorySums.find((categorySum) => categorySum.categoryId === category.id)?._sum.amount ?? 0}`,
            ),
          ),
        ),
      ]);
      return [header, ...lines.filter((line) => line.slice(1).filter((e) => e !== 0).length > line.length / 3)];
    } else {
      return [];
    }
  }, [categorySumByMonth, categoryList, selectedCategories]);

  return categorySumByMonthStatus === 'pending' || data.length === 0 ? (
    <Skeleton height="250px" />
  ) : (
    <Chart
      chartType="ComboChart"
      data={data}
      options={{
        hAxis: { titleTextStyle: { color: '#333' } },
        legend: { position: 'top', maxLines: 3 },
        vAxis: { minValue: 100 },
        chartArea: { width: '90%', height: '80%' },
        seriesType: 'line',
        series: { 0: { type: 'bars' }, 1: { type: 'bars' }, 2: { type: 'bars' } },
      }}
      legendToggle
    />
  );
};

export { ComboChart };
