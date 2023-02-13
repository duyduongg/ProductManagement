import AddIcon from '@mui/icons-material/Add';
import { Box, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hook';
import { requestFetchingBrands } from 'app/reducers/brandSlice';
import { requestFetchingCategories } from 'app/reducers/categorySlice';
import { requestFetchingProducts } from 'app/reducers/productSlice';
import { PmProductForm } from 'components/product/Form';
import { PmDataTable, PmDialog, PmSnackbar } from 'components/shared/components';
import { useSnackbar } from 'hooks/index';
import { useDialog } from 'hooks/useDialog';
import { useEffect } from 'react';
import classes from './ProductsPage.module.scss';
const ProductsPage = () => {
	const { open, handleClick, handleClose } = useDialog();
	const dispatch = useAppDispatch();
	const { openSnackbar, message, handleOpenSnackbar, handleCloseSnackbar } = useSnackbar();
	const { isError, createdOrUpdatedProductName } = useAppSelector((state) => state.productDetailState);
	useEffect(() => {
		dispatch(requestFetchingProducts());
		dispatch(requestFetchingBrands());
		dispatch(requestFetchingCategories());
	}, [dispatch]);

	const performPostApiCall = () => {
		handleOpenSnackbar(
			isError
				? `An error occured when create product name ${createdOrUpdatedProductName}`
				: `Successfully update product name ${createdOrUpdatedProductName}`
		);
		handleClose();
	};

	const { result } = useAppSelector((state) => state.productState);
	return (
		<Box sx={{ overflowY: 'hidden', display: 'grid', flexDirection: 'column' }}>
			<Button variant="contained" onClick={handleClick} className={classes['create-button']} startIcon={<AddIcon />}>
				Create
			</Button>
			{result?.data && <PmDataTable data={result?.data} total={result?.total}></PmDataTable>}
			<PmDialog onClose={handleClose} open={open} title="Create product" style={{ padding: '1rem 1.5rem' }}>
				<PmProductForm formState={true} handleClose={handleClose} performPostApiCall={performPostApiCall} />
			</PmDialog>
			<PmSnackbar
				handleClose={handleCloseSnackbar}
				open={openSnackbar}
				severity={isError ? 'error' : 'success'}
				message={message}
			/>
		</Box>
	);
};

export default ProductsPage;
