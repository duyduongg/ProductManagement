import { BaseDto } from './baseDto';
export interface ProductDto extends BaseDto {
	price: number;
	stock: number;
	thumbnail: string;
	categoryId?: string;
	brandId?: string;
	category?: string;
	brand?: string;
	warrantyMonth: number;
}
