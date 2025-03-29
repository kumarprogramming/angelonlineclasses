import sampleData from './sample-data';
import { prisma } from './prisma';

async function main() {
    await prisma.user.deleteMany();
    await prisma.user.createMany({ data: sampleData.users })
    await prisma.product.deleteMany();
    await prisma.product.createMany({ data: sampleData.products })
    console.log("Database seeded successfully!");
}

main();