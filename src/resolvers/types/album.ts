import { Field, ObjectType } from "type-graphql";
import { SpotifyPagination } from "./pagination";

@ObjectType()
export class Album {
  @Field()
  albumGroup: string;

  @Field()
  albumType: string;

  @Field(() => [String])
  availableMarkets: string[];

  @Field()
  externalSpotifyUrl: string;

  @Field()
  href: string;

  @Field()
  id: string;

  @Field({ nullable: true })
  image?: string;

  @Field()
  name: string;

  @Field()
  releaseDate: string;

  @Field()
  trackCount: number;

  @Field()
  type: string;

  @Field()
  spotifyUri: string;
}

@ObjectType()
export class AlbumResponse {
  @Field()
  pages: SpotifyPagination;

  @Field(() => [Album])
  albums: Album[];
}
