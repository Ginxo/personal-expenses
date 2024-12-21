import { Request, Response } from 'express';
import { prisma } from '../server';
import { queryToPagination } from './queryToPagination';
import { queryToOrderBy } from './queryToOrderBy';

const createMovement = async (req: Request, res: Response) => {
  try {
    req.query;
    const { date, name, description, amount, type, categoryId, userId } = req.body;
    const newEntry = await prisma.movement.create({
      data: { date, name, description, amount, type, categoryId, userId },
    });
    res.status(200).json(newEntry);
  } catch (e) {
    console.error('[CREATE]', e);
    res.status(500).json({ error: e });
  }
};

const getMovements = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { page, size, direction, order_by, ...rest } = req.query;
    const filter = {
      name: rest.name ? { contains: rest.name, mode: 'insensitive' } : undefined,
      amount: rest.amount ? { gt: rest.amount } : undefined,
      categoryId: rest.categories ? { in: (rest.categories as string).split(',') } : undefined,
      type: rest.types ? { in: (rest.types as string).split(',') } : undefined,
      date: rest.from || rest.to ? { gte: rest.from, lte: rest.to } : undefined,
    };

    const [data, total] = await prisma.$transaction([
      prisma.movement.findMany({
        where: {
          userId,
          ...JSON.parse(JSON.stringify(filter)),
        },
        include: {
          user: true,
          category: true,
        },
        ...queryToPagination({ page, size }),
        ...queryToOrderBy({ order_by, direction }, { category: { name: direction as string } }),
      }),
      prisma.movement.count(),
    ]);

    res.status(200).json({
      data,
      meta: { total },
    });
  } catch (e) {
    console.log('[GET MOVEMENTS]', e);
    res.status(500).json({ error: e });
  }
};

const deleteMovement = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const element = await prisma.movement.delete({
      where: {
        id,
      },
    });
    res.status(200).json(element);
  } catch (e) {
    console.error(`[DELETE] id: ${req.params.id}`, e);
    res.status(500).json({ error: e });
  }
};

const updateMovements = async (req: Request, res: Response) => {
  try {
    const updatedMovements = req.body
      .map((movement) => {
        const { id, date, name, description, amount, type, categoryId, userId } = movement;
        return { id, date, name, description, amount, type, categoryId, userId };
      })
      .map(
        async (movement) =>
          await prisma.movement.update({
            where: {
              id: movement.id,
            },
            data: {
              ...movement,
            },
          }),
      );
    res.status(202).json(updatedMovements);
  } catch (e) {
    console.error('[UPDATE]', req.body, e);
    res.status(500).json({ error: e });
  }
};

const bulkMovements = async (req: Request, res: Response) => {
  try {
    const newEntries = await prisma.movement.createMany({ data: req.body });
    res.status(200).json(newEntries);
  } catch (e) {
    console.error('[BULK]', req.body, e);
    res.status(500).json({ error: e });
  }
};

const deleteMovements = async (req: Request, res: Response) => {
  try {
    const ids = req.body;
    const deletedElements = await prisma.movement.deleteMany({
      where: {
        id: { in: ids },
      },
    });
    res.status(200).json(deletedElements);
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

export default {
  createMovement,
  getMovements,
  deleteMovement,
  deleteMovements,
  updateMovements,
  bulkMovements,
};
