import { SpotifyGetResponse } from "./response";

export interface SpotifyImage {
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
  images: SpotifyImage[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface SpotifyAlbum {
  album_group: string;
  album_type: string;
  artists: [
    {
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      name: string;
      type: string;
      uri: string;
    },
  ];
  available_markets: string[];
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

export interface SpotifyArtistResponse extends SpotifyGetResponse {
  items: SpotifyArtist[];
}

export interface SpotifySimilarArtistResponse {
  artists: SpotifyArtist[];
}

export interface SpotifyArtistAlbumResponse extends SpotifyGetResponse {
  items: SpotifyAlbum[];
}

export interface SpotifyRecentlyListenedItem {
  track: Track;
  played_at: string;
  context: Context;
}

interface Context {
  uri: string;
  external_urls: Externalurls;
  href: string;
  type: string;
}

export interface Track {
  artists: SpotifyArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: Externalurls;
  href: string;
  id: string;
  name: string;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
}

interface Externalurls {
  spotify: string;
}
