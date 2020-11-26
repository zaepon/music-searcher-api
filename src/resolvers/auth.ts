import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { AuthResponse } from "./types/auth";
import { ApolloError } from "apollo-server-express";
import { Context } from "src/context";
import { spotifyTokenRequest } from "../spotify";

@Resolver()
export class AuthResolver {
  @Mutation(() => AuthResponse)
  async getAccessToken(@Ctx() ctx: Context, @Arg("code") code: string) {
    const req = await spotifyTokenRequest("POST", "authorization_code", {
      code,
    });
    if (!req.data) throw new ApolloError("something went wrong", "AUTH_FAIL");
    const response: AuthResponse = {
      token: `${req.data.token_type} ${req.data.access_token}`,
      expires: req.data.expires_in,
    };
    ctx.res.cookie("gid", req.data.refresh_token, {
      httpOnly: true,
      path: "/",
    });
    return response;
  }
}
