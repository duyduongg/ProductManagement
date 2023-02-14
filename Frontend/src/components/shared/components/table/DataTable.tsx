import {
	Box,
	Button,
	DialogActions,
	DialogContent,
	DialogContentText,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableFooter,
	TablePagination,
	TableRow,
	Tooltip,
	CircularProgress,
	Checkbox
} from '@mui/material';
import { getSortableField } from 'app/helpers/isSortable';
import { useAppDispatch, useAppSelector } from 'app/hook';
import { requestFetchingProducts } from 'app/reducers/productSlice';
import { pageRoutes } from 'constants/apiRoutes';
import { ProductDto } from 'models';
import React, { ChangeEvent, ReactNode, useCallback, useEffect, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router';
import { productTableColumns, tableRowsPerPage } from '../../../../constants';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import classes from './DataTable.module.scss';
import { DataTableHead } from './DataTableHead';
import { TablePaginationActions } from './TablePaginationActions';
import { PmProductForm } from 'components/product/Form';
import { useDialog, useSnackbar } from 'hooks';
import { PmSnackbar } from 'components/shared/components';
import { productDetailActions } from 'app/reducers/productDetailSlice';
import { PmDialog } from '../dialog/Dialog';
import { ROLE } from '../../../../constants';
export interface TableProps {
	data: ProductDto[];
	total: number;
	children?: ReactNode;
}

export const PmDataTable = ({ data, total, children }: TableProps) => {
	const request = useAppSelector((state) => state.productState.request);
	const isLoading = useAppSelector((state) => state.productState.isLoading);
	const [selected, setSelected] = useState<readonly string[]>([]);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [emptyRows, setEmptyRows] = useState(0);
	const [sorts, setSorts] = useState(request.dataSourceRequest.sorts);
	const { open, handleClick, handleClose } = useDialog();
	const {
		open: openRemoveDialog,
		handleClick: handleClickRemoveDialog,
		handleClose: handleCloseRemoveDialog
	} = useDialog();
	const [selectedProduct, setSelectedProduct] = useState<ProductDto>();
	const { isError, createdOrUpdatedProductName } = useAppSelector((state) => state.productDetailState);
	const { openSnackbar, message, handleOpenSnackbar, handleCloseSnackbar } = useSnackbar();
	const userRole: string[] = useAppSelector((state) => state.userState.user.role);
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

	const performPostApiCall = () => {
		handleOpenSnackbar(
			isError
				? `An error occured when update product name ${createdOrUpdatedProductName}`
				: `Successfully updated product name ${createdOrUpdatedProductName}`
		);
		handleClose();
	};

	const isSelected = (id: string) => selected.indexOf(id) !== -1;

	const handleRemoveProduct = () => {
		dispatch(productDetailActions.requestRemovingProduct(selectedProduct!.id));
		handleOpenSnackbar(
			isError
				? `An error occur when remove product name ${selectedProduct?.name}`
				: `${selectedProduct?.name} has been removed from list`
		);
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
								className={classes.product_name}
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
					<Tooltip title="Update" placement="bottom" arrow>
						<IconButton size="small" onClick={() => handleOpenDialog(item)}>
							<CreateIcon fontSize="inherit" />
						</IconButton>
					</Tooltip>
					<Tooltip title="Delete" placement="bottom" arrow>
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
		<>
			{isLoading && <CircularProgress />}
			{!isLoading && (
				<Box sx={{ overflow: 'hidden' }}>
					<TableContainer className={classes.container}>
						{children}
						<Table stickyHeader sx={{ minWidth: 500 }}>
							<DataTableHead
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
										colSpan={productTableColumns.length + 1}
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
						<PmDialog onClose={handleClose} open={open} title="Update product" style={{ padding: '1rem 1.5rem' }}>
							<PmProductForm
								data={selectedProduct}
								formState={false}
								handleClose={handleClose}
								performPostApiCall={performPostApiCall}
							/>
						</PmDialog>
						<PmDialog
							onClose={handleCloseRemoveDialog}
							open={openRemoveDialog}
							title="Delete product"
							style={{ padding: '1rem 1rem' }}
						>
							<DialogContent>
								<DialogContentText id="dialog-content-text" className={classes['dialog-content']}>
									Are you sure you want to delete this product?
								</DialogContentText>
							</DialogContent>
							<DialogActions>
								<Button onClick={handleCloseRemoveDialog} className={classes['action-buttons']}>
									No
								</Button>
								<Button onClick={handleRemoveProduct} className={classes['action-buttons']}>
									Yes
								</Button>
							</DialogActions>
						</PmDialog>
					</TableContainer>
					<PmSnackbar
						handleClose={handleCloseSnackbar}
						open={openSnackbar}
						severity={isError ? 'error' : 'success'}
						message={message}
					/>
				</Box>
			)}
		</>
	);
};
