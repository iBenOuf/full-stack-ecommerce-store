import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IProduct } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() product!: IProduct;
}
