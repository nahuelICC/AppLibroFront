export class RatingDistribution {
  stars?: number;
  count?: number;
  percentage?: number;

  constructor(stars: number, count: number, percentage: number) {
    this.stars = stars;
    this.count = count;
    this.percentage = percentage;
  }
}
