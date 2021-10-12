import axios from "axios";
import { User } from "src/resolvers/types/user";
import { getData } from "../utils";
import { SpotifyUser } from "./types";
import { SpotifyRecentlyListenedItem } from "./types/artist";

export const createUserApi = (token: string) => {
  const parseUser = (spotifyUser: SpotifyUser): User => {
    return {
      id: spotifyUser.id,
      name: spotifyUser.display_name,
      imageUrl: spotifyUser.images.length
        ? spotifyUser.images[0].url
        : undefined,
    };
  };

  return {
    getSpotifyUserProfile: async (): Promise<User> => {
      const req = await axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me",
        headers: { Authorization: token },
      });
      return parseUser(req.data);
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
