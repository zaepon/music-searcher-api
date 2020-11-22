import axios from "axios";
import qs from "qs";
import { Artist, ArtistsResponse } from "src/resolvers/types/artist";
import { getData } from "../utils";
import { SpotifyUser } from "./types";
import {
  SpotifyArtist,
  SpotifyArtistImage,
  SpotifyArtistResponse,
} from "./types/artist";

export const getSpotifyUserProfile = async (
  token: string
): Promise<SpotifyUser> => {
  const req = await axios({
    method: "GET",
    url: "https://api.spotify.com/v1/me",
    headers: { Authorization: token },
  });
  return req.data;
};

export const spotifyTokenRequest = async (
  type: "GET" | "POST",
  grant_type: string,
  params: any
) => {
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
  try {
    return await axios(options);
  } catch (e) {
    return e;
  }
};

export const searchArtistByName = async (
  name: string,
  token: string,
  limit = 20,
  offset = 0
) => {
  const searchRes = await getData(
    `https://api.spotify.com/v1/search?q=${name}&type=artist&offset=${offset}&limit=${limit}`,
    token,
    900
  );
  const artistsData: { artists: SpotifyArtistResponse } = searchRes;

  const parsedArtists = artistsData.artists.items.map((a) => parseArtist(a));

  const res: ArtistsResponse = {
    pages: {
      start: artistsData.artists.offset,
      limit: artistsData.artists.limit,
      total: artistsData.artists.total,
    },
    artists: parsedArtists,
  };

  return res;
};

export const parseArtist = (artist: SpotifyArtist): Artist => {
  let imageObj = artist.images!.filter(
    (img: SpotifyArtistImage) => img.width === 640
  );

  const parsedArtist = {
    genres: artist.genres,
    href: artist.href,
    id: artist.id,
    image: imageObj[0]?.url,
    name: artist.name,
    spotifyUri: artist.uri,
  };

  return parsedArtist;
};
