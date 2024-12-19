import { Request, Response } from 'express';
import { prisma } from '../server';
import { queryToPagination } from './queryToPagination';

const getCategories = async (req: Request, res: Response) => {
  try {
    const [categories, count] = await prisma.$transaction([
      prisma.category.findMany({
        include: {
          user: true,
        },
        ...queryToPagination(req.query),
      }),
      prisma.category.count(),
    ]);

    res.status(200).json({
      data: categories,
      meta: { total: count },
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

export default {
  getCategories,
};
