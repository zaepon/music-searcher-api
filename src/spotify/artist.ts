import { Album, AlbumResponse } from "src/resolvers/types/album";
import { Artist } from "src/resolvers/types/artist";
import { getData } from "../utils/index";
import {
  SpotifyArtist,
  SpotifyImage,
  SpotifyArtistResponse,
  SpotifySimilarArtistResponse,
  SpotifyAlbum,
  SpotifyArtistAlbumResponse,
  Track,
} from "./types/artist";
import { createUserApi } from "./user";

export const createArtistAPI = (token: string) => {
  const parseArtist = (artist: SpotifyArtist): Artist => {
    let imageObj = artist.images!.filter(
      (img: SpotifyImage) => img.width === 640,
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
      (img: SpotifyImage) => img.width === 640,
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
    getRecommendations: async () => {
      const userApi = createUserApi(token);
      const ids = await userApi.getCurrentUserRecentlyPlayedTracks();

      const randomFive = ids
        .map((v) => ({ v, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map((sorted) => sorted.v)
        .slice(0, 5);

      let searchQ = new URL(
        `https://api.spotify.com/v1/recommendations?seed_artists=${randomFive.join(
          ",",
        )}`,
      );
      const recommendations = await getData(searchQ.href, token);

      const artists = recommendations.tracks.map(
        (track: Track) => track.artists[0].id,
      );

      const multipleArtistQuery = new URL(
        `https://api.spotify.com/v1/artists?ids=${artists.join(",")}`,
      );
      const artistsByIds: { artists: SpotifyArtist[] } = await getData(
        multipleArtistQuery.href,
        token,
      );

      const recommendedArtists = artistsByIds.artists
        .filter(
          (artist, i, arr) =>
            arr.findIndex((itm) => itm.id === artist.id) === i,
        )
        .map((spotifyArtist) => parseArtist(spotifyArtist));

      return {
        pages: {},
        artists: recommendedArtists,
      };
    },

    artistAlbums: async (
      id: string,
      offset?: number,
    ): Promise<AlbumResponse> => {
      let searchQ = `https://api.spotify.com/v1/artists/${id}/albums?limit=50`;

      if (offset) searchQ += `&offset=${offset}`;

      const albumData: SpotifyArtistAlbumResponse = await getData(
        searchQ,
        token,
        900,
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
      const searchRes: { artists: SpotifyArtistResponse } = await getData(
        `https://api.spotify.com/v1/search?q=${name}&type=artist&offset=${offset}&limit=${limit}`,
        token,
        900,
      );
      const artist = searchRes.artists.items.map((a) => parseArtist(a));

      return {
        pages: {
          start: searchRes.artists.offset,
          limit: searchRes.artists.limit,
          total: searchRes.artists.total,
        },
        artists: artist,
      };
    },
    searchArtistById: async (id: string) => {
      const artist: SpotifyArtist = await getData(
        `https://api.spotify.com/v1/artists/${id}`,
        token,
        900,
      );

      const parsedArtist = parseArtist(artist);
      return parsedArtist;
    },
    searchSimilarArtistsById: async (artistId: string) => {
      const searchRes = await getData(
        `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
        token,
        900,
      );

      const artistsData: SpotifySimilarArtistResponse = searchRes;
      const parsedArtists = artistsData.artists.map((a) => parseArtist(a));

      return parsedArtists;
    },
  };
};
