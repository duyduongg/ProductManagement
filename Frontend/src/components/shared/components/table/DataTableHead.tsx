import { Box, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { Order, ProductDto } from 'models';
import React from 'react';
import { headCells } from '../../../../constants';

interface DataTableHeadProps {
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof ProductDto) => void;
	order: Order;
	orderBy: string;
}

export const DataTableHead = ({ onRequestSort, order, orderBy }: DataTableHeadProps) => {
	const labelOrder = order === 1 ? 'asc' : 'desc';
	const createSortHandler = (property: keyof ProductDto) => (event: React.MouseEvent<unknown>) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'right' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sortDirection={orderBy === headCell.id ? labelOrder : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? labelOrder : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{labelOrder === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
				<TableCell width={20}></TableCell>
			</TableRow>
		</TableHead>
	);
};
