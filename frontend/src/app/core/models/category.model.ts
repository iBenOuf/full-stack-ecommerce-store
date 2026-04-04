export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface ICategoriesResponse {
  message: string;
  data: ICategory[];
}

export interface ICategoryResponse {
  message: string;
  data: ICategory;
}
