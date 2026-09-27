// MOCKED — in-memory proxy stub
const noOp = {
  findMany: async () => [],
  findFirst: async () => null,
  findUnique: async () => null,
  create: async (d: any) => d?.data ?? {},
  update: async (d: any) => d?.data ?? {},
  delete: async () => ({}),
  $queryRawUnsafe: async () => [],
  $disconnect: async () => {},
};

export const prisma: any = new Proxy({}, {
  get: () => noOp,
});

export default prisma;
