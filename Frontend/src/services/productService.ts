import { NewProductDto, ProductDetailDto, ProductDto, Request, ResponseResult, StockDto } from 'models';
import { apiRoutes } from '../constants';
import api from './apiGateway';

export const productService = {
	async getProducts(request: Request<ProductDto>): Promise<ResponseResult<ProductDto> | undefined> {
		const response = await api.post(`${apiRoutes.PRODUCTS}`, request);
		return response?.data as ResponseResult<ProductDto>;
	},
	async getProductDetail(productId: string): Promise<ProductDto | undefined> {
		const response = await api.get(`${apiRoutes.PRODUCTS}?productId=${productId}`);
		return response?.data as ProductDto;
	},
	async removeProductAsync(productsId: string[]): Promise<void> {
		await api.post(`${apiRoutes.PRODUCTS}/${apiRoutes.REMOVE}`, productsId);
	},
	async createOrUpdateProductAsync(request: NewProductDto): Promise<void> {
		await api.put(`${apiRoutes.PRODUCTS}/${apiRoutes.NEW}`, request);
	},
	async stockProductAsync(request: StockDto): Promise<ProductDetailDto> {
		const response = await api.patch(`${apiRoutes.PRODUCTS}/${apiRoutes.STOCK}`, request);
		return response?.data as ProductDetailDto;
	},
	async checkProductNameDuplicationAsync(productName: string): Promise<boolean> {
		const response = await api.get(`${apiRoutes.PRODUCTS}/${apiRoutes.NAME}/Duplicate?name=${productName}`);
		return response?.data as boolean;
	}
};
