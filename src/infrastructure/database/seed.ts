import sequelize from './sequelize';
import { UserModel } from './models/UserModel';

async function seed() {
  await sequelize.sync({ alter: true }); // WARNING: drops tables in DB — good for dev
  await UserModel.create({ id: '11111111-1111-1111-1111-111111111111', name: 'Alice', email: 'alice@example.com' });
  await UserModel.create({ id: '22222222-2222-2222-2222-222222222222', name: 'Bob', email: 'bob@example.com' });
  console.log('Seed complete.');
  process.exit(0);
}

seed();
