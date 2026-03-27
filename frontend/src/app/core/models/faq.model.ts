export interface IFAQ {
  _id: string;
  question: string;
  answer: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface IFAQResponse {
  message: string;
  data: IFAQ;
}

export interface IFAQsResponse {
  message: string;
  data: IFAQ[];
}

export interface IFAQRequest {
  question: string;
  answer: string;
  order?: number;
  isActive?: boolean;
}
