import axios from "axios";
import { Artist, ArtistsResponse } from "src/resolvers/types/artist";
import { getData } from "src/utils";
import { SpotifyUser } from "./types";
import { SpotifyArtist, SpotifyArtistImage, SpotifyArtistResponse, SpotifySimilarArtistResponse } from "./types/artist";

export const createArtistAPI = (token: string) => {


  const parseArtist = (artist: SpotifyArtist): Artist => {
    let imageObj = artist.images!.filter(
      (img: SpotifyArtistImage) => img.width === 640
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
  }

  return {
    searchArtistByName: async (
      name: string,
      limit = 20,
      offset = 0
    ) => {
      const searchRes = await getData(
        `https://api.spotify.com/v1/search?q=${name}&type=artist&offset=${offset}&limit=${limit}`,
        token,
        900
      );
      const artistsData: { artists: SpotifyArtistResponse } = searchRes;
    
      const parsedArtists = artistsData.artists.items.map((a) => parseArtist(a));
    
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
    searchSimilarArtistsById: async (
      artistId: string,
    ) => {
      const searchRes = await getData(
        `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
        token,
        900
      );
    
      const artistsData: SpotifySimilarArtistResponse = searchRes;
      const parsedArtists = artistsData.artists.map((a) => parseArtist(a));
    
      return parsedArtists;
    },
   getSpotifyUserProfile: async (
    ): Promise<SpotifyUser> => {
      const req = await axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me",
        headers: { Authorization: token },
      });
      return req.data;
    },
  }
}