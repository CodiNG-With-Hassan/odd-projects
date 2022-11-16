import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'hassankhousheish',
  password: 'postgres',
  database: 'odd-projects',
  synchronize: true,
  entities: ['dist/**/*.entity.js'],
};
