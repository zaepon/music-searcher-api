import axios from "axios";
import { redisClient } from "../cache";

export const getData = async (url: string, token: string, cacheTTL?: number) => {
  const cached = await redisClient.get(url)
  if(cached) return JSON.parse(cached);

  const config = {
    headers: { Authorization: token },
  };
  console.time(`GET ${url}`)
  const searchRes = await axios.get(url, config);
  console.timeEnd(`GET ${url}`)

  console.log(cacheTTL)
  await redisClient.set(url, JSON.stringify(searchRes.data), "EX", cacheTTL)
  return searchRes.data;
};
