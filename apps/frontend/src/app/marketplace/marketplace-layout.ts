
import { Component } from '@angular/core';
import { Footer } from './partials/footer/footer';
import { Header } from './partials/header/header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [Footer, Header, RouterOutlet],
  templateUrl: './marketplace-layout.html',
  styleUrl: './marketplace-layout.scss',
})
export class MarketplaceLayout {}
