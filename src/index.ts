import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { TestResolver } from "./resolvers";
import { initConnection } from "./database/index";
require("dotenv").config();

const main = async () => {
  await initConnection();

  const app = express();
  app.listen(4000, () => {
    console.log("Started server on port 4000");
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [TestResolver],
      validate: false,
    }),
  });

  apolloServer.applyMiddleware({ app });

  app.get("/", (_, res) => {
    res.send("Server is online");
  });
};

main();
