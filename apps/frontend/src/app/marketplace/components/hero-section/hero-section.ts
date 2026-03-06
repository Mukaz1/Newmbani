
import { Component, EventEmitter, Output } from '@angular/core';
import { SearchBar } from '../search-bar/search-bar';

@Component({
  selector: 'app-hero-section',
  imports: [SearchBar],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSection {
  @Output() filtersApplied = new EventEmitter<any>();

  onSearch(filters: any) {
    this.filtersApplied.emit(filters);
  }
}
