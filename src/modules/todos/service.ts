import { prisma } from "../../prisma";

export class TodosService {
  async getAll() {
    return await prisma.todo.findMany().catch(() => {
      throw new Error("Can't search for todos right now");
    });
  }

  async getOne(id: string) {
    return await prisma.todo.findUnique({ where: { id } }).catch(() => {
      throw new Error("Can't search for a todo right now");
    });
  }

  async makeOne(data: { userId: string; title: string; completed?: boolean }) {
    return await prisma.todo.create({ data }).catch(() => {
      throw new Error("Could not create todo");
    });
  }

  async updateOne(id: string, data: { title?: string; completed?: boolean }) {
    return await prisma.todo.update({ where: { id }, data }).catch(() => {
      throw new Error("Could not update todo");
    });
  }

  async deleteOne(id: string) {
    return await prisma.todo.delete({ where: { id } }).catch(() => {
      throw new Error("Could not delete todo");
    });
  }

  async getAllFromUser(userId: string) {
    return await prisma.todo.findMany({ where: { userId } }).catch(() => {
      throw new Error("Can't search for a todos for this user right now");
    });
  }

  async getOneFromUser(id: string, userId: string) {
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== userId) {
      throw new Error("Could not update todo for this user");
    }
    return todo;
  }

  async updateOneFromUser(id: string, userId: string, data: { title?: string; completed?: boolean }) {
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== userId) {
      throw new Error("Could not update todo for this user");
    }
    return await prisma.todo.update({ where: { id }, data });
  }

  async deleteOneFromUser(id: string, userId: string) {
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== userId) {
      throw new Error("Could not delete todo for this user");
    }
    return await prisma.todo.delete({ where: { id } });
  }

  async toggleOneFromUser(id: string, userId: string) {
    const todo = await prisma.todo.findUnique({ where: { id, userId } }).catch(() => {
      throw new Error("Could not find the todo to toggle for this user");
    });
    if (!todo) throw new Error("This todo doesn't exist");
    return await prisma.todo.update({ where: { id, userId }, data: { completed: !todo.completed } }).catch(() => {
      throw new Error("Could not toggle the todo for this user");
    });
  }
}
