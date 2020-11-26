import { Request, Response } from "express";
import { createArtistAPI } from "./spotify/artist";

export interface Context {
  req: Request;
  res: Response;
  token: string;
  artistAPI: ReturnType<typeof createArtistAPI>
}
