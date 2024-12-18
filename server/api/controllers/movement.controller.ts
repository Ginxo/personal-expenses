import { Request, Response } from 'express';
import { prisma } from '../server';
import { queryToPagination } from './queryToPagination';

const createMovement = async (req: Request, res: Response) => {
  try {
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

    const [data, total] = await prisma.$transaction([
      prisma.movement.findMany({
        where: {
          userId,
        },
        include: {
          user: true,
          category: true,
        },
        ...queryToPagination(req.query),
      }),
      prisma.movement.count(),
    ]);

    res.status(200).json({
      data,
      meta: { total },
    });
  } catch (e) {
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
