export interface SpotifyGetResponse {
  limit: number;
  next: string
  offset: number;
  previous: string | null;
  total: number;
  href: string;
}
