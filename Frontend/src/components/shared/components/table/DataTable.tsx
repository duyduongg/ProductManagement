import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import {
	Box,
	Checkbox,
	CircularProgress,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableFooter,
	TablePagination,
	TableRow,
	Tooltip
} from '@mui/material';
import { getSortableField } from 'app/helpers/isSortable';
import { useAppDispatch, useAppSelector } from 'app/hook';
import { productActions, requestFetchingProducts } from 'app/reducers/productSlice';
import { PmProductForm } from 'components/product/Form';
import { PmSnackbar } from 'components/shared/components';
import { pageRoutes } from 'constants/apiRoutes';
import { useDialog, useSnackbar } from 'hooks';
import { ProductDto } from 'models';
import React, { ChangeEvent, MouseEvent, ReactNode, Suspense, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { productTableColumns, ROLE, tableRowsPerPage } from '../../../../constants';
import { PmDialog } from '../dialog/Dialog';
import { PmRemoveDialog } from '../dialog/RemoveDialog';
import classes from './DataTable.module.scss';
import { PmDataTableHead } from './DataTableHead';
import { PmDataTableToolbar } from './DataTableToolbar';
import { TablePaginationActions } from './TablePaginationActions';
export interface TableProps {
	data: ProductDto[];
	total: number;
	children?: ReactNode;
	labelRowsPerPage: string;
}

export const PmDataTable = ({ data, total, children, labelRowsPerPage }: TableProps) => {
	const request = useAppSelector((state) => state.productState.request);
	const { t } = useTranslation();
	const { isError, createdOrUpdatedProductName } = useAppSelector((state) => state.productDetailState);
	const userRole: string[] = useAppSelector((state) => state.userState.user.role);

	const [selected, setSelected] = useState<readonly string[]>([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [emptyRows, setEmptyRows] = useState(0);
	const [sorts, setSorts] = useState(request.dataSourceRequest.sorts);
	const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null);

	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { open, handleClick, handleClose } = useDialog();
	const {
		open: openRemoveDialog,
		handleClick: handleClickRemoveDialog,
		handleClose: handleCloseRemoveDialog
	} = useDialog();
	const { openSnackbar, message, handleOpenSnackbar, handleCloseSnackbar } = useSnackbar();

	const calculateEmptyRows = useCallback(() => {
		const totalPages = Math.ceil(total / rowsPerPage);
		setEmptyRows(page === totalPages - 1 ? rowsPerPage - data.length : 0);
	}, [page, rowsPerPage, data.length, total]);

	useEffect(() => {
		const filter = request.filter;
		dispatch(
			requestFetchingProducts({
				dataSourceRequest: {
					skip: rowsPerPage * page,
					take: rowsPerPage,
					sorts
				},
				filter
			})
		);
		calculateEmptyRows();
	}, [page, dispatch, request.filter, rowsPerPage, calculateEmptyRows, sorts]);

	const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
		setPage(newPage);
	};

	const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof ProductDto) => {
		const formattedProperty = property.charAt(0).toUpperCase() + property.substring(1, property.length);
		const isCurrentAsc = sorts[0].field === formattedProperty && sorts[0].order === 1;

		setSorts([{ order: isCurrentAsc ? -1 : 1, field: getSortableField(formattedProperty) }]);
	};

	const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) {
			const newSelected = data.map((d) => d.id);
			setSelected(newSelected);
			return;
		}

		setSelected([]);
	};

	const navigateToProductDetailPage = (id: string) => {
		navigate(`/${pageRoutes.PRODUCT}/${id}`);
	};

	const handleOpenDialog = (product: ProductDto) => {
		setSelectedProduct(product);
		handleClick();
	};

	const handleOpenRemoveDialog = (product: ProductDto) => {
		setSelectedProduct(product);
		handleClickRemoveDialog();
	};

	const handleOpenRemoveMultiProductDialog = () => {
		handleClickRemoveDialog();
	};

	const performPostApiCall = () => {
		handleOpenSnackbar(
			isError
				? t('updateProductFailure', { productName: createdOrUpdatedProductName })
				: t('updateProductSuccess', { productName: createdOrUpdatedProductName })
		);
		handleClose();
	};

	const isSelected = (id: string) => selected.indexOf(id) !== -1;

	const handleRemoveProduct = () => {
		dispatch(productActions.requestRemovingProduct([selectedProduct?.id] as string[]));
		handleOpenSnackbar(
			isError
				? t('removeProductFailure', { productName: selectedProduct?.name })
				: t('removeProductSuccess', { productName: selectedProduct?.name })
		);
		handleCloseRemoveDialog();
	};

	const handleRemoveMultipleProducts = () => {
		dispatch(productActions.requestRemovingProduct(selected as string[]));
		handleCloseRemoveDialog();
	};

	const handleSelectItemClick = (event: MouseEvent<unknown>, id: string) => {
		const selectedIdx = selected.indexOf(id);
		let newSelected: readonly string[] = [];

		if (selectedIdx === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIdx === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIdx === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIdx > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIdx), selected.slice(selectedIdx + 1));
		}

		setSelected(newSelected);
	};

	const renderItem = (item: ProductDto) => {
		const isItemSelected = isSelected(item.id);
		return (
			<TableRow key={item.id}>
				<TableCell padding="checkbox">
					<Checkbox
						color="primary"
						checked={isItemSelected}
						onClick={(event) => handleSelectItemClick(event, item.id)}
					/>
				</TableCell>
				{productTableColumns.map((column) => {
					const value = item[column.id];
					if (column.id === 'name') {
						return (
							<TableCell
								key={column.id}
								align={column.align}
								width={column.minWidth}
								onClick={() => navigateToProductDetailPage(item.id)}
								className={classes['product-name']}
							>
								{value}
							</TableCell>
						);
					}
					return (
						<TableCell key={column.id} align={column.align} width={column.minWidth}>
							{column.format && typeof value === 'number' ? column.format(value) : value}
						</TableCell>
					);
				})}
				<TableCell id={item.id} width={20} align="center">
					<Tooltip title={t('update')} placement="bottom" arrow>
						<IconButton size="small" onClick={() => handleOpenDialog(item)}>
							<CreateIcon fontSize="inherit" />
						</IconButton>
					</Tooltip>
					<Tooltip title={t('delete')} placement="bottom" arrow>
						<IconButton
							size="small"
							onClick={() => handleOpenRemoveDialog(item)}
							sx={userRole.includes(ROLE.ADMIN) === true ? { visibility: 'visible' } : {}}
						>
							<DeleteIcon fontSize="inherit" />
						</IconButton>
					</Tooltip>
				</TableCell>
			</TableRow>
		);
	};

	return (
		<Suspense fallback={<CircularProgress className={classes['progress']} />}>
			<Box sx={{ overflow: 'hidden' }}>
				<TableContainer className={classes.container}>
					<PmDataTableToolbar
						numSelected={selected.length}
						openConfirmDialogHandler={handleOpenRemoveMultiProductDialog}
					/>
					<Table stickyHeader sx={{ minWidth: 500 }}>
						<PmDataTableHead
							rowCount={data.length}
							numSelect={selected.length}
							onSelectAllClick={handleSelectAllClick}
							order={sorts[0].order}
							orderBy={sorts[0].field.toLowerCase()}
							onRequestSort={handleRequestSort}
						/>
						<TableBody>
							{data.map((item) => renderItem(item))}
							{emptyRows > 0 && (
								<TableRow style={{ height: 53 * emptyRows }}>
									<TableCell colSpan={productTableColumns.length} />
								</TableRow>
							)}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TablePagination
									className={classes.pagination}
									rowsPerPageOptions={tableRowsPerPage}
									labelRowsPerPage={labelRowsPerPage}
									colSpan={productTableColumns.length + 2}
									count={total}
									rowsPerPage={rowsPerPage}
									page={page}
									SelectProps={{
										inputProps: {
											'aria-label': 'rows-per-page'
										},
										native: true
									}}
									onPageChange={handlePageChange}
									onRowsPerPageChange={handleRowsPerPageChange}
									ActionsComponent={TablePaginationActions}
								/>
							</TableRow>
						</TableFooter>
					</Table>
					<PmDialog
						onClose={handleClose}
						open={open}
						title={t('updateProductTitle')}
						style={{ padding: '1rem 1.5rem' }}
					>
						<PmProductForm
							data={selectedProduct!!}
							formState={false}
							handleClose={handleClose}
							performPostApiCall={performPostApiCall}
						/>
					</PmDialog>
					<PmRemoveDialog
						closeHandler={handleCloseRemoveDialog}
						isOpen={openRemoveDialog}
						title={t('removeProductTitle')}
						confirmHandler={selectedProduct === null ? handleRemoveMultipleProducts : handleRemoveProduct}
						actionAccept={t('confirmDeleteAccept')}
						actionRefuse={t('confirmDeleteRefuse')}
						contentText={t('productDeleteConfirmation')}
					/>
				</TableContainer>
				<PmSnackbar
					handleClose={handleCloseSnackbar}
					open={openSnackbar}
					severity={isError ? 'error' : 'success'}
					message={message}
				/>
			</Box>
		</Suspense>
	);
};
