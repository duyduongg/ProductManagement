import { ProductDto } from 'models';

interface ProductTableColumns {
	id: 'name' | 'brand' | 'category' | 'price' | 'stock';
	label: string;
	minWidth?: number;
	align?: 'right';
	format?: (value: number) => string;
}

export const productTableColumns: readonly ProductTableColumns[] = [
	{ id: 'name', label: 'Name', minWidth: 220 },
	{ id: 'brand', label: 'Brand', minWidth: 60 },
	{ id: 'category', label: 'Category', minWidth: 60 },
	{
		id: 'price',
		label: 'Price',
		minWidth: 60,
		align: 'right',
		format: (value: number) => value.toLocaleString('en-US')
	},
	{
		id: 'stock',
		label: 'Stock',
		minWidth: 60,
		align: 'right',
		format: (value: number) => value.toLocaleString('en-US')
	}
];

export const tableRowsPerPage: number[] = [5, 10, 15];

export interface ProductTableHeadCell {
	disablePadding: boolean;
	id: keyof ProductDto;
	label: string;
	numeric: boolean;
}

export const headCells: readonly ProductTableHeadCell[] = [
	{ id: 'name', numeric: false, disablePadding: true, label: 'Name' },
	{ id: 'brand', numeric: false, disablePadding: false, label: 'Brand' },
	{ id: 'category', numeric: false, disablePadding: false, label: 'Category' },
	{ id: 'price', numeric: true, disablePadding: false, label: 'Price' },
	{ id: 'stock', numeric: true, disablePadding: false, label: 'Stock' }
];
