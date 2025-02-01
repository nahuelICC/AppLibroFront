export class Paginacion {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  displayedPages: (number | string)[];

  constructor(currentPage: number, itemsPerPage: number, totalPages: number, displayedPages: (number | string)[]) {
    this.currentPage = currentPage;
    this.itemsPerPage = itemsPerPage;
    this.totalPages = totalPages;
    this.displayedPages = displayedPages;
  }
}
