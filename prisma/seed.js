// Seeds the database with sample customers, tiffin prices, and ~24 days of
// attendance history — the same shape of data the old in-memory mock used.
// Run with: npm run db:seed

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(iso, delta) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + delta);
  return toISODate(date);
}

async function main() {
  console.log("Clearing existing data...");
  await prisma.attendance.deleteMany();
  await prisma.tiffinType.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding customers...");
  const customerSeed = [
    { name: "Kadir", phone: "9876543210", is_active: true },
    { name: "Kedar", phone: "9876543211", is_active: true },
    { name: "Mallikarjun", phone: "9876543212", is_active: true },
    { name: "Basavraj", phone: "9876543213", is_active: true },
  ];
  const customers = [];
  for (const c of customerSeed) {
    customers.push(await prisma.user.create({ data: c }));
  }

  console.log("Seeding tiffin types...");
  const types = await Promise.all([
    prisma.tiffinType.create({ data: { name: "Full Tiffin", code: "FULL", price: 70 } }),
    prisma.tiffinType.create({ data: { name: "Half Tiffin", code: "HALF", price: 50 } }),
    prisma.tiffinType.create({ data: { name: "Only Chapati", code: "CHAPATI", price: 21 } }),
  ]);

  console.log("Seeding ~24 days of attendance history...");
  const activeCustomers = customers.filter((c) => c.is_active);
  const meals = ["LUNCH", "DINNER"];
  const today = toISODate(new Date());

  const rows = [];
  for (let dayOffset = 23; dayOffset >= 0; dayOffset--) {
    const date = addDays(today, -dayOffset);
    for (const customer of activeCustomers) {
      for (const meal of meals) {
        if (Math.random() < 0.12) continue; // simulate real-world gaps

        const roll = Math.random();
        const type = roll < 0.55 ? types[0] : roll < 0.85 ? types[1] : types[2];

        rows.push({
          user_id: customer.id,
          date,
          meal,
          tiffin_type_id: type.id,
          quantity: 1,
          price: type.price,
        });
      }
    }
  }
  await prisma.attendance.createMany({ data: rows });

  console.log(`Done. ${customers.length} customers, ${types.length} tiffin types, ${rows.length} attendance rows.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
