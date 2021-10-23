import { Context } from "src/context";
import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { AlbumResponse } from "./types/album";
import { Artist, ArtistSearchFilter, ArtistsResponse } from "./types/artist";
@Resolver()
export class ArtistResolver {
  @Query(() => ArtistsResponse, { complexity: 1 })
  async artistRecommendations(@Ctx() ctx: Context) {
    const artistApi = ctx.artistAPI;
    const recommendations = await artistApi.getRecommendations();

    return recommendations;
  }

  @Query(() => ArtistsResponse, { complexity: 1 })
  async artistListByName(
    @Ctx() ctx: Context,
    @Arg("filter") filter: ArtistSearchFilter
  ) {
    const artistApi = ctx.artistAPI;
    return await artistApi.searchArtistByName(
      filter.name,
      filter.limit,
      filter.start
    );
  }

  @Query(() => [Artist], { complexity: 1 })
  async similarArtists(
    @Ctx() { artistAPI }: Context,
    @Arg("artistId") artistId: string
  ) {
    return await artistAPI.searchSimilarArtistsById(artistId);
  }

  @Query(() => Artist, { complexity: 1 })
  async artistById(@Ctx() { artistAPI }: Context, @Arg("id") id: string) {
    return await artistAPI.searchArtistById(id);
  }

  @Query(() => AlbumResponse, { complexity: 1 })
  async artistAlbums(
    @Ctx() { artistAPI }: Context,
    @Arg("artistId") artistId: string,
    @Arg("offset", { nullable: true }) offset?: number
  ) {
    return await artistAPI.artistAlbums(artistId, offset);
  }
}
