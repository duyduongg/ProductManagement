import { Box, Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { Order, ProductDto } from 'models';
import React, { ChangeEvent } from 'react';
import { headCells } from '../../../../constants';

interface PmDataTableHeadProps {
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof ProductDto) => void;
	order: Order;
	orderBy: string;
	numSelect: number;
	rowCount: number;
	onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const PmDataTableHead = ({
	onRequestSort,
	order,
	orderBy,
	numSelect,
	rowCount,
	onSelectAllClick
}: PmDataTableHeadProps) => {
	const labelOrder = order === 1 ? 'asc' : 'desc';
	const createSortHandler = (property: keyof ProductDto) => (event: React.MouseEvent<unknown>) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox">
					<Checkbox
						color="primary"
						indeterminate={numSelect > 0 && numSelect < rowCount}
						checked={rowCount > 0 && numSelect === rowCount}
						onChange={onSelectAllClick}
					/>
				</TableCell>
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
