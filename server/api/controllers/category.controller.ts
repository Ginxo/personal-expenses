import { Request, Response } from 'express';
import { prisma } from '../server';
import { queryToPagination } from './queryToPagination';

const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, userId } = req.body;
    const newEntry = await prisma.category.create({
      data: { name, userId },
    });
    res.status(200).json(newEntry);
  } catch (e) {
    console.error('[CREATE]', e);
    res.status(500).json({ error: e });
  }
};

const getCategories = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const [categories, count] = await prisma.$transaction([
      prisma.category.findMany({
        where: {
          userId,
        },
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
  createCategory,
};
