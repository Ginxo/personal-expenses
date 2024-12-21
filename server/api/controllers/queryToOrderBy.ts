import { ParsedQs } from 'qs';

export const queryToOrderBy = ({ order_by, direction }: ParsedQs, mapping: { [key: string]: { name: string } }) => ({
  orderBy: mapping[`${order_by}`] ? mapping : { [`${order_by}`]: direction },
});
