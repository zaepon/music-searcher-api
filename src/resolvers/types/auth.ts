import {ObjectType, Field} from "type-graphql"

@ObjectType()
export class AuthResponse {
  @Field()
  token: string;

  @Field()
  refreshToken: string;

  @Field()
  expires: number;
}

@ObjectType()
export class RefreshTokenResponse {
  @Field()
  token: string;

  @Field()
  expires: number;
}