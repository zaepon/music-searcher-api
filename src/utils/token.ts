import { redisClient } from "../cache";

export const getBasicToken = () => {
  return redisClient.get("token");
};

export const setBasicToken = async (t: string) => {
  return await redisClient.set("token", t, "EX", 3500);
};
