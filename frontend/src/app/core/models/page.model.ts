export interface IPage {
  _id: string;
  pageSlug: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IPageResponse {
  message: string;
  data: IPage;
}

export interface IPagesResponse {
  message: string;
  data: IPage[];
}

export interface IPageCreateRequest {
  pageSlug: string;
  title: string;
  content: string;
}

export interface IPageUpdateRequest {
  title?: string;
  content?: string;
  isActive?: boolean;
}
