import axios from "axios";
import {SpotifyUser} from "./types"

export const getSpotifyUserProfile = async (token: string): Promise<SpotifyUser> => {
  const req = await axios({
    method: "GET",
    url: "https://api.spotify.com/v1/me",
    headers: {'Authorization': token}
  })
  return req.data;
}