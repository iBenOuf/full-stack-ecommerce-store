import { ICategory } from './category.model';

export interface ISubcategory {
  _id: string;
  name: string;
  slug: string;
  category: string | ICategory;
  image: string;
  isDeleted?: boolean;
}

export interface ISubcategoriesResponse {
  message: string;
  data: ISubcategory[];
}

export interface ISubcategoryResponse {
  message: string;
  data: ISubcategory;
}
