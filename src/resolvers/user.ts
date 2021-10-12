import { Resolver, Ctx, Query } from "type-graphql";
import { Context } from "src/context";
import { User } from "./types/user";

@Resolver()
export class UserResolver {
  @Query(() => User)
  async user(@Ctx() ctx: Context) {
    const userApi = ctx.userAPI;

    return userApi.getSpotifyUserProfile();
  }
}
