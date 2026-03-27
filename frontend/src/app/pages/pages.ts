import { Component } from '@angular/core';
import { Header } from '../shared/components/header/header';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../shared/components/footer/footer';

@Component({
  selector: 'app-pages',
  imports: [Header, RouterOutlet, Footer],
  templateUrl: './pages.html',
  styleUrl: './pages.css',
})
export class Pages {}
