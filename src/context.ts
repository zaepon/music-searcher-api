import { Request, Response } from "express";
import { createArtistAPI } from "./spotify/artist";
import { createUserApi } from "./spotify/user";

export interface Context {
  req: Request;
  res: Response;
  token: string;
  artistAPI: ReturnType<typeof createArtistAPI>;
  userAPI: ReturnType<typeof createUserApi>;
}
