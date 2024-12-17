import { Request, Response } from 'express';
import { prisma } from '../server';
import { queryToPagination } from './queryToPagination';

const createMovement = async (req: Request, res: Response) => {
  try {
    const { date, name, description, amount, type, category, user } = req.body;
    const newEntry = await prisma.movement.create({
      data: { date, name, description, amount, type, category, user },
    });
    res.status(200).json(newEntry);
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

const getMovements = async (req: Request, res: Response) => {
  try {
    res.status(200).json(
      await prisma.movement.findMany({
        include: {
          user: true,
          category: true,
        },
        ...queryToPagination(req.query),
      }),
    );
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

const deleteMovement = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const deletedBlogPost = await prisma.movement.delete({
      where: {
        id,
      },
    });
    res.status(200).json(deletedBlogPost);
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

const updateMovements = async (req: Request, res: Response) => {
  try {
    const updatedBlogPost = await prisma.movement.updateMany(req.body);
    res.status(202).json(updatedBlogPost);
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

const bulkMovements = async (req: Request, res: Response) => {
  try {
    const newEntries = await prisma.movement.createMany(req.body);
    res.status(200).json(newEntries);
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

export default {
  createMovement,
  getMovements,
  deleteMovement,
  updateMovements,
  bulkMovements,
};
