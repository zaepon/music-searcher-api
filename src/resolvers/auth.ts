import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import axios from "axios";
import qs from "qs";
import { DateTime } from "luxon";
import { AuthResponse, RefreshTokenResponse } from "./types/auth";
import {Context} from "../context";

@Resolver()
export class AuthResolver {
  async spotifyRequest(type: "GET" | "POST", grant_type: string, params: any) {
    const options = {
      method: type,
      url: "https://accounts.spotify.com/api/token",
      headers: {
        Authorization: `${process.env.SPOTIFY_BASIC_AUTH}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify({
        grant_type: grant_type,
        redirect_uri: `${process.env.LOGIN_REDIRECT_URI}`,
        ...params,
      }),
    };

    return await axios(options);
  }

  @Mutation(() => AuthResponse)
  async getAccessToken(@Arg("code") code: string) {
    const req = await this.spotifyRequest("POST", "authorization_code", {
      code,
    });

    const response: AuthResponse = {
      token: `${req.data.token_type} ${req.data.access_token}`,
      expires: DateTime.utc()
        .plus({ seconds: req.data.expires_in })
        .toSeconds(),
      refreshToken: req.data.refresh_token,
    };

    return response;
  }

  @Mutation(() => RefreshTokenResponse)
  async refreshAccessToken(@Arg("refreshToken") refreshToken: string, @Ctx() ctx: Context) {
    console.log(ctx)
    const req = await this.spotifyRequest("POST", "refresh_token", {refresh_token: refreshToken})

    const response: RefreshTokenResponse = {
      token: `${req.data.token_type} ${req.data.access_token}`,
      expires: DateTime.utc()
        .plus({ seconds: req.data.expires_in }).toSeconds()
    }

    return response;
  }
}
