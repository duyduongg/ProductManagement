import { BaseDto } from './baseDto';
import { ProductDto } from './productDto';

export interface BrandDto extends BaseDto {
	products: ProductDto[];
}
