import { Category } from "src/categories/entities/category.entity";

export interface ProductResponse {
  
  id: number;

  name: string;

  createdAt: Date;

  description: string;

  imagen: string;

  price: number;

  categories: Category[];

}