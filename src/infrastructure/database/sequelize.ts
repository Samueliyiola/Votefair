import { Sequelize } from 'sequelize';
import {env} from "../../shared"
// import {setupAssociations} from "./associations";
const sequelize = new Sequelize(
  env.DATABASE_NAME || 'postgres',
  env.DATABASE_USER || 'postgres',
  env.DATABASE_PASSWORD || 'postgres',
  {
    host: env.DATABASE_HOST || 'localhost',
    port: +(env.DATABASE_PORT || 5432),
    dialect: 'postgres',
    logging: false,
  }
);

// setupAssociations();

export default sequelize;
