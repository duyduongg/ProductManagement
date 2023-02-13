import { CategoryDto } from 'models';
import { apiRoutes } from '../constants';
import api from './apiGateway';

export const categoryService = {
	async getCategories(): Promise<CategoryDto[] | undefined> {
		var result = await api.get(`${apiRoutes.CATEGORIES}`);
		return result?.data;
	}
};
