import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'db/dbv1.sqlite',
  synchronize: true,
  logging: false,
  entities: [`${import.meta.dir}/entity/*.ts`],
});
