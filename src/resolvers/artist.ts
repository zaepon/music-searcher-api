import { Context } from "src/context";
import { searchArtistByName } from "../spotify";
import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { ArtistSearchFilter, ArtistsResponse } from "./types/artist";

@Resolver()
export class ArtistResolver {
  @Query(() => ArtistsResponse)
  async artistListByName(
    @Ctx() ctx: Context,
    @Arg("filter") filter: ArtistSearchFilter
  ) {
    return await searchArtistByName(
      filter.name,
      ctx.token,
      filter.limit,
      filter.start
    );
  }
}
