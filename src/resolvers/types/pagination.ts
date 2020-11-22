import { Field, ObjectType } from "type-graphql";



@ObjectType()
export class SpotifyPagination {
  @Field()
  start: number;

  @Field()
  limit: number;

  @Field()
  total: number;
}