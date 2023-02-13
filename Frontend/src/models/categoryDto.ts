import { BaseDto } from './baseDto';
import { ProductDto } from './productDto';

export interface CategoryDto extends BaseDto {
	products: ProductDto[];
}
