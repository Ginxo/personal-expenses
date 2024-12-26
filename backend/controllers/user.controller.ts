import { Request, Response } from "express";
import { prisma } from "..";

const getUser = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

export default {
  getUser,
};
