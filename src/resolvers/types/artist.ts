import { Field, InputType, ObjectType } from "type-graphql";
import { SpotifyPagination } from "./pagination";



@InputType()
export class ArtistSearchFilter {
  @Field()
  name: string;

  @Field({nullable: true})
  start?: number

  @Field({nullable: true})
  limit?: number;
}

@ObjectType()
export class Artist {
  
  @Field(() => [String])
  genres: string[];

  @Field({nullable: true})
  href?: string; 

  @Field()
  id: string;

  @Field({nullable: true})
  image?: string

  @Field()
  name: string;

  @Field()
  spotifyUri: string;
}



@ObjectType()
export class ArtistsResponse {
  @Field()
  pages: SpotifyPagination

  @Field(() => [Artist])
  artists: Artist[]
}