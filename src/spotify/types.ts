interface SpotifyUserImage {
  url: string;
}

export interface SpotifyUser {
  country: string;
  display_name: string;
  email: string;
  external_urls: {
    spotify: string;
  };
  followers: {
    total: number;
  };
  href: string;
  id: string;
  images: SpotifyUserImage[];
  product: string;
  type: string;
  uri: string;
}
