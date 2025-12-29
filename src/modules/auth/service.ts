import { prisma } from "../../prisma";

export class AuthService {
  async getWithEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async makeOne(data: { username: string; email: string; password: string }) {
    return await prisma.user.create({ data });
  }
}
