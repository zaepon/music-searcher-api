import axios from "axios";
import { getData } from "../utils";
import { SpotifyUser } from "./types";
import { SpotifyRecentlyListenedItem } from "./types/artist";

export const createUserApi = (token: string) => {
  return {
    getSpotifyUserProfile: async (): Promise<SpotifyUser> => {
      const req = await axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me",
        headers: { Authorization: token },
      });
      return req.data;
    },

    getCurrentUserRecentlyPlayedTracks: async (): Promise<string[]> => {
      const searchUrl = new URL(
        `https://api.spotify.com/v1/me/player/recently-played`,
      );
      const data = await getData(searchUrl.href, token);
      const artistIds = data.items.map(
        (item: SpotifyRecentlyListenedItem) => item.track.artists[0].id,
      );

      return artistIds;
    },
  };
};
