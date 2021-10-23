import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import cors from "cors";
import { AuthResolver, ArtistResolver, UserResolver } from "./resolvers";
import {
  getComplexity,
  simpleEstimator,
  fieldExtensionsEstimator,
} from "graphql-query-complexity";

// import { initConnection } from "./database/index";
import {
  spotifyTokenRequest,
  createArtistAPI,
  clientCredentialToken,
} from "./spotify";
import { createUserApi } from "./spotify/user";
require("dotenv").config();

const main = async () => {
  // await initConnection();

  const app = express();
  app.use(
    cors({
      origin: process.env.WEB_ORIGIN,
      credentials: true,
    })
  );

  app.get("/", (_req, res) => {
    res.send("API ONLINE");
  });

  app.post("/refresh_token", async (req, res) => {
    const token = req.headers.cookie?.split("gid=")[1];
    if (!(typeof token === "undefined")) {
      const request = await spotifyTokenRequest("POST", "refresh_token", {
        refresh_token: token,
      });
      if (request.data) {
        return res.send({ accessToken: request.data.access_token });
      } else {
        return res.send({ accessToken: "" });
      }
    } else {
      return res.send({ accessToken: "" });
    }
  });

  app.listen(4000, () => {
    console.log("Started server on port 4000");
  });

  const schema = await buildSchema({
    resolvers: [AuthResolver, ArtistResolver, UserResolver],
    validate: false,
  });

  const apolloServer = new ApolloServer({
    schema,
    plugins: [
      {
        requestDidStart: () => ({
          didResolveOperation({ request, document }) {
            const complexity = getComplexity({
              schema,
              operationName: request.operationName,
              query: document,
              variables: request.variables,
              estimators: [
                fieldExtensionsEstimator(),
                simpleEstimator({ defaultComplexity: 0 }),
              ],
            });

            // if complexity exceeds..
            if (complexity > 5) {
              throw new Error(
                `Sorry, too complicated query! ${complexity} is over 5 that is the max allowed complexity.`
              );
            }
          },
        }),
      },
    ],
    context: async ({ req, res }) => {
      const token = req.headers.authorization
        ? req.headers.authorization
        : await clientCredentialToken();

      return {
        req,
        res,
        token,
        artistAPI: createArtistAPI(token as string),
        userAPI: createUserApi(token as string),
      };
    },
  });

  apolloServer.applyMiddleware({ app, cors: false });
};

main();
