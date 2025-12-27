import { prisma } from "../../prisma";

export class CatsService {
  async getAll() {
    return await prisma.cat.findMany().catch(() => {
      throw new Error("Can't search for cats right now");
    });
  }

  async getOne(id: string) {
    return await prisma.cat.findUnique({ where: { id } }).catch(() => {
      throw new Error("Can't search for a cat right now");
    });
  }

  async makeOne(data: { name: string; age: number }) {
    return await prisma.cat.create({ data }).catch(() => {
      throw new Error("Could not create cat");
    });
  }

  async updateOne(id: string, data: { name?: string; age?: number }) {
    return await prisma.cat.update({ where: { id }, data }).catch(() => {
      throw new Error("Could not update cat");
    });
  }

  async deleteOne(id: string) {
    return await prisma.cat.delete({ where: { id } }).catch(() => {
      throw new Error("Could not delete cat");
    });
  }
}
