import axios from "axios";
import qs from "qs";


// General API

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


// EntityAPIs
export { createArtistAPI } from "./artist"