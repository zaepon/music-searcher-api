import axios from "axios";
import qs from "qs";
import { getBasicToken, setBasicToken } from "../utils/token";

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
      Authorization: `basic ${process.env.SPOTIFY_BASIC_AUTH}`,
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

export const clientCredentialToken = async () => {
  const sToken = await getBasicToken();
  if (sToken) return sToken;
  const r = await axios({
    method: "post",
    url: `https://accounts.spotify.com/api/token`,
    headers: {
      Authorization: "Basic " + process.env.CLIENT_ID_SECRET,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    params: {
      grant_type: "client_credentials",
    },
  });
  const newToken = `Bearer ${r.data.access_token}`;
  await setBasicToken(newToken);
  return newToken;
};

// EntityAPIs
export { createArtistAPI } from "./artist";
