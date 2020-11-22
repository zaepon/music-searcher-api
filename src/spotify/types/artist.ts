import { SpotifyGetResponse } from "./response"

export interface SpotifyArtistImage {
  height: number;
  url: string;
  width: number;
}

export interface SpotifyArtist {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: SpotifyArtistImage[];
  name: string;
  popularity: number;
  type: string;
  uri: string
}

export interface SpotifyArtistResponse extends SpotifyGetResponse {
  items: SpotifyArtist[]
}



