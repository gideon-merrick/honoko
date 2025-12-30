import { z } from "zod";
import type { Prisma } from "../../../src/generated/prisma";

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum([
  "ReadUncommitted",
  "ReadCommitted",
  "RepeatableRead",
  "Serializable",
]);

export const CatScalarFieldEnumSchema = z.enum(["id", "name", "age", "createdAt", "updatedAt"]);

export const SortOrderSchema = z.enum(["asc", "desc"]);

export const QueryModeSchema = z.enum(["default", "insensitive"]);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// CAT SCHEMA
/////////////////////////////////////////

export const CatSchema = z.object({
  id: z.cuid(),
  name: z.string(),
  age: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Cat = z.infer<typeof CatSchema>;

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// CAT
//------------------------------------------------------

export const CatSelectSchema: z.ZodType<Prisma.CatSelect> = z
  .object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    age: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
  })
  .strict();

/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const CatWhereInputSchema: z.ZodType<Prisma.CatWhereInput> = z.strictObject({
  AND: z.union([z.lazy(() => CatWhereInputSchema), z.lazy(() => CatWhereInputSchema).array()]).optional(),
  OR: z
    .lazy(() => CatWhereInputSchema)
    .array()
    .optional(),
  NOT: z.union([z.lazy(() => CatWhereInputSchema), z.lazy(() => CatWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  age: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
});

export const CatOrderByWithRelationInputSchema: z.ZodType<Prisma.CatOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  age: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const CatWhereUniqueInputSchema: z.ZodType<Prisma.CatWhereUniqueInput> = z
  .object({
    id: z.cuid(),
  })
  .and(
    z.strictObject({
      id: z.cuid().optional(),
      AND: z.union([z.lazy(() => CatWhereInputSchema), z.lazy(() => CatWhereInputSchema).array()]).optional(),
      OR: z
        .lazy(() => CatWhereInputSchema)
        .array()
        .optional(),
      NOT: z.union([z.lazy(() => CatWhereInputSchema), z.lazy(() => CatWhereInputSchema).array()]).optional(),
      name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
      age: z.union([z.lazy(() => IntFilterSchema), z.number().int()]).optional(),
      createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
      updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
    }),
  );

export const CatOrderByWithAggregationInputSchema: z.ZodType<Prisma.CatOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  age: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CatCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CatAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CatMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CatMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CatSumOrderByAggregateInputSchema).optional(),
});

export const CatScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CatScalarWhereWithAggregatesInput> =
  z.strictObject({
    AND: z
      .union([
        z.lazy(() => CatScalarWhereWithAggregatesInputSchema),
        z.lazy(() => CatScalarWhereWithAggregatesInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => CatScalarWhereWithAggregatesInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => CatScalarWhereWithAggregatesInputSchema),
        z.lazy(() => CatScalarWhereWithAggregatesInputSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
    name: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
    age: z.union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()]).optional(),
    createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()]).optional(),
    updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()]).optional(),
  });

export const CatCreateInputSchema: z.ZodType<Prisma.CatCreateInput> = z.strictObject({
  id: z.cuid().optional(),
  name: z.string(),
  age: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const CatUncheckedCreateInputSchema: z.ZodType<Prisma.CatUncheckedCreateInput> = z.strictObject({
  id: z.cuid().optional(),
  name: z.string(),
  age: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const CatUpdateInputSchema: z.ZodType<Prisma.CatUpdateInput> = z.strictObject({
  id: z.union([z.cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  age: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
});

export const CatUncheckedUpdateInputSchema: z.ZodType<Prisma.CatUncheckedUpdateInput> = z.strictObject({
  id: z.union([z.cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  age: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
});

export const CatCreateManyInputSchema: z.ZodType<Prisma.CatCreateManyInput> = z.strictObject({
  id: z.cuid().optional(),
  name: z.string(),
  age: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const CatUpdateManyMutationInputSchema: z.ZodType<Prisma.CatUpdateManyMutationInput> = z.strictObject({
  id: z.union([z.cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  age: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
});

export const CatUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CatUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([z.cuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  age: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
});

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([z.string(), z.lazy(() => NestedStringFilterSchema)]).optional(),
});

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([z.number(), z.lazy(() => NestedIntFilterSchema)]).optional(),
});

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([z.coerce.date(), z.lazy(() => NestedDateTimeFilterSchema)]).optional(),
});

export const CatCountOrderByAggregateInputSchema: z.ZodType<Prisma.CatCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  age: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const CatAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CatAvgOrderByAggregateInput> = z.strictObject({
  age: z.lazy(() => SortOrderSchema).optional(),
});

export const CatMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CatMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  age: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const CatMinOrderByAggregateInputSchema: z.ZodType<Prisma.CatMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  age: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const CatSumOrderByAggregateInputSchema: z.ZodType<Prisma.CatSumOrderByAggregateInput> = z.strictObject({
  age: z.lazy(() => SortOrderSchema).optional(),
});

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([z.string(), z.lazy(() => NestedStringWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([z.number(), z.lazy(() => NestedIntWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
});

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([z.coerce.date(), z.lazy(() => NestedDateTimeWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
});

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> =
  z.strictObject({
    set: z.string().optional(),
  });

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> =
  z.strictObject({
    set: z.coerce.date().optional(),
  });

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([z.string(), z.lazy(() => NestedStringFilterSchema)]).optional(),
});

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([z.number(), z.lazy(() => NestedIntFilterSchema)]).optional(),
});

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([z.coerce.date(), z.lazy(() => NestedDateTimeFilterSchema)]).optional(),
});

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> =
  z.strictObject({
    equals: z.string().optional(),
    in: z.string().array().optional(),
    notIn: z.string().array().optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    not: z.union([z.string(), z.lazy(() => NestedStringWithAggregatesFilterSchema)]).optional(),
    _count: z.lazy(() => NestedIntFilterSchema).optional(),
    _min: z.lazy(() => NestedStringFilterSchema).optional(),
    _max: z.lazy(() => NestedStringFilterSchema).optional(),
  });

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([z.number(), z.lazy(() => NestedIntWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
});

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([z.number(), z.lazy(() => NestedFloatFilterSchema)]).optional(),
});

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> =
  z.strictObject({
    equals: z.coerce.date().optional(),
    in: z.coerce.date().array().optional(),
    notIn: z.coerce.date().array().optional(),
    lt: z.coerce.date().optional(),
    lte: z.coerce.date().optional(),
    gt: z.coerce.date().optional(),
    gte: z.coerce.date().optional(),
    not: z.union([z.coerce.date(), z.lazy(() => NestedDateTimeWithAggregatesFilterSchema)]).optional(),
    _count: z.lazy(() => NestedIntFilterSchema).optional(),
    _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
    _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  });

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const CatFindFirstArgsSchema: z.ZodType<Prisma.CatFindFirstArgs> = z
  .object({
    select: CatSelectSchema.optional(),
    where: CatWhereInputSchema.optional(),
    orderBy: z.union([CatOrderByWithRelationInputSchema.array(), CatOrderByWithRelationInputSchema]).optional(),
    cursor: CatWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.union([CatScalarFieldEnumSchema, CatScalarFieldEnumSchema.array()]).optional(),
  })
  .strict();

export const CatFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CatFindFirstOrThrowArgs> = z
  .object({
    select: CatSelectSchema.optional(),
    where: CatWhereInputSchema.optional(),
    orderBy: z.union([CatOrderByWithRelationInputSchema.array(), CatOrderByWithRelationInputSchema]).optional(),
    cursor: CatWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.union([CatScalarFieldEnumSchema, CatScalarFieldEnumSchema.array()]).optional(),
  })
  .strict();

export const CatFindManyArgsSchema: z.ZodType<Prisma.CatFindManyArgs> = z
  .object({
    select: CatSelectSchema.optional(),
    where: CatWhereInputSchema.optional(),
    orderBy: z.union([CatOrderByWithRelationInputSchema.array(), CatOrderByWithRelationInputSchema]).optional(),
    cursor: CatWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z.union([CatScalarFieldEnumSchema, CatScalarFieldEnumSchema.array()]).optional(),
  })
  .strict();

export const CatAggregateArgsSchema: z.ZodType<Prisma.CatAggregateArgs> = z
  .object({
    where: CatWhereInputSchema.optional(),
    orderBy: z.union([CatOrderByWithRelationInputSchema.array(), CatOrderByWithRelationInputSchema]).optional(),
    cursor: CatWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict();

export const CatGroupByArgsSchema: z.ZodType<Prisma.CatGroupByArgs> = z
  .object({
    where: CatWhereInputSchema.optional(),
    orderBy: z.union([CatOrderByWithAggregationInputSchema.array(), CatOrderByWithAggregationInputSchema]).optional(),
    by: CatScalarFieldEnumSchema.array(),
    having: CatScalarWhereWithAggregatesInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict();

export const CatFindUniqueArgsSchema: z.ZodType<Prisma.CatFindUniqueArgs> = z
  .object({
    select: CatSelectSchema.optional(),
    where: CatWhereUniqueInputSchema,
  })
  .strict();

export const CatFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CatFindUniqueOrThrowArgs> = z
  .object({
    select: CatSelectSchema.optional(),
    where: CatWhereUniqueInputSchema,
  })
  .strict();

export const CatCreateArgsSchema: z.ZodType<Prisma.CatCreateArgs> = z
  .object({
    select: CatSelectSchema.optional(),
    data: z.union([CatCreateInputSchema, CatUncheckedCreateInputSchema]),
  })
  .strict();

export const CatUpsertArgsSchema: z.ZodType<Prisma.CatUpsertArgs> = z
  .object({
    select: CatSelectSchema.optional(),
    where: CatWhereUniqueInputSchema,
    create: z.union([CatCreateInputSchema, CatUncheckedCreateInputSchema]),
    update: z.union([CatUpdateInputSchema, CatUncheckedUpdateInputSchema]),
  })
  .strict();

export const CatCreateManyArgsSchema: z.ZodType<Prisma.CatCreateManyArgs> = z
  .object({
    data: z.union([CatCreateManyInputSchema, CatCreateManyInputSchema.array()]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict();

export const CatCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CatCreateManyAndReturnArgs> = z
  .object({
    data: z.union([CatCreateManyInputSchema, CatCreateManyInputSchema.array()]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict();

export const CatDeleteArgsSchema: z.ZodType<Prisma.CatDeleteArgs> = z
  .object({
    select: CatSelectSchema.optional(),
    where: CatWhereUniqueInputSchema,
  })
  .strict();

export const CatUpdateArgsSchema: z.ZodType<Prisma.CatUpdateArgs> = z
  .object({
    select: CatSelectSchema.optional(),
    data: z.union([CatUpdateInputSchema, CatUncheckedUpdateInputSchema]),
    where: CatWhereUniqueInputSchema,
  })
  .strict();

export const CatUpdateManyArgsSchema: z.ZodType<Prisma.CatUpdateManyArgs> = z
  .object({
    data: z.union([CatUpdateManyMutationInputSchema, CatUncheckedUpdateManyInputSchema]),
    where: CatWhereInputSchema.optional(),
    limit: z.number().optional(),
  })
  .strict();

export const CatUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.CatUpdateManyAndReturnArgs> = z
  .object({
    data: z.union([CatUpdateManyMutationInputSchema, CatUncheckedUpdateManyInputSchema]),
    where: CatWhereInputSchema.optional(),
    limit: z.number().optional(),
  })
  .strict();

export const CatDeleteManyArgsSchema: z.ZodType<Prisma.CatDeleteManyArgs> = z
  .object({
    where: CatWhereInputSchema.optional(),
    limit: z.number().optional(),
  })
  .strict();
