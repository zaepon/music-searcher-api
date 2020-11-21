import { createConnection } from "typeorm";

export const initConnection = async () => {
  const conn = await createConnection({
    type: "postgres",
    host: `${process.env.DB_HOST}`,
    port: 5432,
    username: `${process.env.DB_USERNAME}`,
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_DATABASE}`,
    entities: [],
    synchronize: true,
    logging: false,
  });
  return conn;
};
