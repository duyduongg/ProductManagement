import { BaseDto } from './baseDto';

export interface ProductDetailDto extends BaseDto {
	rating: number;
	numberRating: number;
	price: number;
	warrantyMonth: number;
	images: string[];
	brand: string;
	category: string;
}
