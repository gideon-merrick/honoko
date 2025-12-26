import type { CatCreateInput, CatUpdateInput } from "../../generated/prisma/models";
import { prisma } from "../../prisma";

export class CatsService {
  public getAllCats = async () => {
    const cats = await prisma.cat.findMany();
    return cats;
  };

  public getOneCat = async (id: string) => {
    const cat = await prisma.cat.findUnique({ where: { id } });
    return cat;
  };

  public createCat = async (data: CatCreateInput) => {
    const cat = await prisma.cat.create({ data });
    return cat;
  };

  public updateCat = async (id: string, data: CatUpdateInput) => {
    const cat = await prisma.cat.update({ where: { id }, data });
    return cat;
  };

  public deleteCat = async (id: string) => {
    const cat = await prisma.cat.delete({ where: { id } });
    return cat;
  };
}
