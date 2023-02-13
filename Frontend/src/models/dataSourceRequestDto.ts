import { Sort } from '.';

export interface DataSourceRequestDto {
	take: number;
	skip: number;
	sorts: Sort[];
}
