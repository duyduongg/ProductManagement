import { type ProductDto } from './productDto';
import { type ProductDetailDto } from './productDetailDto';
import { type BrandDto } from './brandDto';
import { type CategoryDto } from './categoryDto';
import { type StockDto } from './stockDto';
import { type DataSourceRequestDto } from './dataSourceRequestDto';
import { type NewProductDto } from './newProductDto';

export const SORT_FIELD = ['Name', 'Brand', 'Category', 'Price'] as const;
export type SortBy = typeof SORT_FIELD[number];
export type Order = 1 | -1;
export type Sort = {
	field: SortBy;
	order: Order;
};

export interface Request<T> {
	dataSourceRequest: DataSourceRequestDto;
	filter?: T;
}

export interface ResponseResult<T> {
	data: T[];
	total: number;
}

export { ProductDto, ProductDetailDto, BrandDto, CategoryDto, StockDto, DataSourceRequestDto, NewProductDto };
