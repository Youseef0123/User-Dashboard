import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    NgxPaginationModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent implements OnInit {

  // Input properties
  @Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 10;
  @Input() totalItems: number = 0;
  @Input() maxSize: number = 5;
  
  // Output events
  @Output() pageChanged = new EventEmitter<number>();
  @Output() itemsPerPageChanged = new EventEmitter<number>();

  // Available items per page options
  itemsPerPageOptions = [5, 10, 15, 20, 25, 50];

  ngOnInit() {
    // Ensure itemsPerPage is valid
    if (!this.itemsPerPageOptions.includes(this.itemsPerPage)) {
      this.itemsPerPage = 10;
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.pageChanged.emit(page);
  }

  onItemsPerPageChange() {
    this.currentPage = 1; // Reset to first page
    this.itemsPerPageChanged.emit(this.itemsPerPage);
    this.pageChanged.emit(1);
  }

  getStartIndex(): number {
    return ((this.currentPage - 1) * this.itemsPerPage) + 1;
  }

  getEndIndex(): number {
    const endIndex = this.currentPage * this.itemsPerPage;
    return Math.min(endIndex, this.totalItems);
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
}
