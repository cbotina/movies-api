export type Purchase = {
  movieId: number;
  quantity: number;
};

export class BuyMoviesDto {
  movies: Purchase[];
}
