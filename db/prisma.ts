// Import needed packages
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

// Setup
neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

// Init prisma client
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
export const prisma = new PrismaClient({ adapter }).$extends({
    result: {
        product: {
            price: { compute(product) { return product.price.toString() } },
            rating: { compute(product) { return product.rating.toString() } }
    } }
});

// Use Prisma Client as normal
