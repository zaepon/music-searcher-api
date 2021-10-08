import axios from "axios";
import { redisClient } from "../cache";

export const getData = async (
  url: string,
  token: string,
  cacheTTL?: number,
) => {
  try {
    const cached = await redisClient.get(url);
    if (cached) return JSON.parse(cached);

    const config = {
      headers: { Authorization: token },
    };
    console.time(`GET ${url}`);
    const searchRes = await axios.get(url, config);
    console.timeEnd(`GET ${url}`);

    await redisClient.set(
      url,
      JSON.stringify(searchRes.data),
      "EX",
      cacheTTL || 1,
    );
    return searchRes.data;
  } catch (e) {
    console.log("error fetching", e);
  }
};
