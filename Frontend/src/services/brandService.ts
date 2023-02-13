import { BrandDto } from 'models';
import { apiRoutes } from '../constants';
import api from './apiGateway';

export const brandService = {
	async getBrands(): Promise<BrandDto[] | undefined> {
		var result = await api.get(`${apiRoutes.BRANDS}`);
		return result?.data;
	}
};
