import axios from "axios";
import { Album, AlbumResponse } from "src/resolvers/types/album";
import { Artist, ArtistsResponse } from "src/resolvers/types/artist";
import { getData } from "../utils/index";
import { SpotifyUser } from "./types";
import {
  SpotifyArtist,
  SpotifyImage,
  SpotifyArtistResponse,
  SpotifySimilarArtistResponse,
  SpotifyAlbum,
  SpotifyArtistAlbumResponse,
} from "./types/artist";

export const createArtistAPI = (token: string) => {
  const parseArtist = (artist: SpotifyArtist): Artist => {
    let imageObj = artist.images!.filter(
      (img: SpotifyImage) => img.width === 640
    );

    const parsedArtist = {
      genres: artist.genres,
      href: artist.href,
      id: artist.id,
      image: imageObj[0]?.url,
      name: artist.name,
      spotifyUri: artist.uri,
    };
    return parsedArtist;
  };

  const parseAlbum = (album: SpotifyAlbum): Album => {
    let imageObj = album.images!.filter(
      (img: SpotifyImage) => img.width === 640
    );

    const parsedAlbum: Album = {
      availableMarkets: album.available_markets,
      albumGroup: album.album_group,
      albumType: album.album_type,
      externalSpotifyUrl: album.external_urls.spotify,
      href: album.href,
      releaseDate: album.release_date,
      trackCount: album.total_tracks,
      type: album.type,
      id: album.id,
      image: imageObj[0]?.url,
      name: album.name,
      spotifyUri: album.uri,
    };
    return parsedAlbum;
  };

  return {
    artistAlbums: async (
      id: string,
      offset?: number
    ): Promise<AlbumResponse> => {
      let searchQ = `https://api.spotify.com/v1/artists/${id}/albums?limit=50`;

      if (offset) searchQ += `&offset=${offset}`;

      const albumData: SpotifyArtistAlbumResponse = await getData(
        searchQ,
        token,
        900
      );
      return {
        pages: {
          start: albumData.offset,
          limit: albumData.limit,
          total: albumData.total,
        },
        albums: albumData.items.map((album) => parseAlbum(album)),
      };
    },

    searchArtistByName: async (name: string, limit = 20, offset = 0) => {
      const searchRes = await getData(
        `https://api.spotify.com/v1/search?q=${name}&type=artist&offset=${offset}&limit=${limit}`,
        token,
        900
      );
      const artistsData: { artists: SpotifyArtistResponse } = searchRes;

      const parsedArtists = artistsData.artists.items.map((a) =>
        parseArtist(a)
      );

      const res: ArtistsResponse = {
        pages: {
          start: artistsData.artists.offset,
          limit: artistsData.artists.limit,
          total: artistsData.artists.total,
        },
        artists: parsedArtists,
      };

      return res;
    },
    searchArtistById: async (id: string) => {
      const artist: SpotifyArtist = await getData(
        `https://api.spotify.com/v1/artists/${id}`,
        token,
        900
      );

      const parsedArtist = parseArtist(artist);
      return parsedArtist;
    },
    searchSimilarArtistsById: async (artistId: string) => {
      const searchRes = await getData(
        `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
        token,
        900
      );

      const artistsData: SpotifySimilarArtistResponse = searchRes;
      const parsedArtists = artistsData.artists.map((a) => parseArtist(a));

      return parsedArtists;
    },
    getSpotifyUserProfile: async (): Promise<SpotifyUser> => {
      const req = await axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me",
        headers: { Authorization: token },
      });
      return req.data;
    },
  };
};
