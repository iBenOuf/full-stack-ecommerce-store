import { IUser } from './user.model';

export type TestimonialStatus = 'pending' | 'approved' | 'rejected';

export interface ITestimonial {
  _id: string;
  user: IUser | string;
  rating: number;
  comment: string;
  status: TestimonialStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ITestimonialResponse {
  message: string;
  data: ITestimonial;
}

export interface ITestimonialsResponse {
  message: string;
  data: ITestimonial[];
}

export interface ICreateTestimonialRequest {
  rating: number;
  comment: string;
}

export interface IUpdateTestimonialStatusRequest {
  status: TestimonialStatus;
}
