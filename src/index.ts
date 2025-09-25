import 'dotenv/config';
import { createServer } from './interfaces/graphql/server';
import { sequelize } from './infrastructure/database/models';
const PORT = process.env.PORT || 4000;

async function bootstrap() {
  try {
    await sequelize.sync({ force: true });
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ Unable to connect to DB', err);
  }

  const app = await createServer();
  app.listen(PORT, () => console.log(`Server ready at http://localhost:${PORT}/graphql`));
}

bootstrap();
