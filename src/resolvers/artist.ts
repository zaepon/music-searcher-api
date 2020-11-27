import { Context } from "src/context";
import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { AlbumResponse } from "./types/album";
import { Artist, ArtistSearchFilter, ArtistsResponse } from "./types/artist";
@Resolver()
export class ArtistResolver {
  @Query(() => ArtistsResponse)
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

  @Query(() => [Artist])
  async similarArtists(
    @Ctx() { artistAPI }: Context,
    @Arg("artistId") artistId: string
  ) {
    return await artistAPI.searchSimilarArtistsById(artistId);
  }

  @Query(() => Artist)
  async artistById(@Ctx() { artistAPI }: Context, @Arg("id") id: string) {
    return await artistAPI.searchArtistById(id);
  }

  @Query(() => AlbumResponse)
  async artistAlbums(
    @Ctx() { artistAPI }: Context,
    @Arg("artistId") artistId: string,
    @Arg("offset", { nullable: true }) offset?: number
  ) {
    return await artistAPI.artistAlbums(artistId, offset);
  }
}
