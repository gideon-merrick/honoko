import { prisma } from "../../prisma";

export class CatsService {
  async getAll() {
    return await prisma.cat.findMany();
  }

  async getOne(id: string) {
    return await prisma.cat.findUnique({ where: { id } });
  }

  async makeOne(data: { name: string; age: number }) {
    return await prisma.cat.create({ data });
  }

  async updateOne(id: string, data: { name?: string; age?: number }) {
    return await prisma.cat.update({ where: { id }, data });
  }

  async deleteOne(id: string) {
    return await prisma.cat.delete({ where: { id } });
  }
}
