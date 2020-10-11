import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { TestResolver, AuthResolver } from "./resolvers";
import { initConnection } from "./database/index";
import { getSpotifyUserProfile } from "./spotify/index"
import { Context } from "./context";
require("dotenv").config();

const main = async () => {
  await initConnection();

  const app = express();
  app.listen(4000, () => {
    console.log("Started server on port 4000");
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [TestResolver, AuthResolver],
      validate: false,
    }),
    context: async ({req}) => {
      const ctx: Context = {user: await getSpotifyUserProfile(req.headers.authorization as string)}
      return ctx
    }
  });

  apolloServer.applyMiddleware({ app });

  app.get("/", (_, res) => {
    res.send("Server is online");
  });
};

main();
