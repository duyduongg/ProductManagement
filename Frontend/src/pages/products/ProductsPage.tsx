import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hook';
import { requestFetchingBrands } from 'app/reducers/brandSlice';
import { requestFetchingCategories } from 'app/reducers/categorySlice';
import { requestFetchingProducts } from 'app/reducers/productSlice';
import { PmProductForm } from 'components/product/Form';
import { PmDataTable, PmDialog, PmSnackbar } from 'components/shared/components';
import { useSnackbar } from 'hooks/index';
import { useDialog } from 'hooks/useDialog';
import { ProductDto, Request } from 'models/index';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ROLE } from '../../constants/index';
import classes from './ProductsPage.module.scss';

export interface ISearchInput {
	value: string;
}

const ProductsPage = () => {
	const { open, handleClick, handleClose } = useDialog();
	const dispatch = useAppDispatch();
	const { openSnackbar, message, handleOpenSnackbar, handleCloseSnackbar } = useSnackbar();
	const { register, handleSubmit, watch, setValue } = useForm<ISearchInput>({ defaultValues: { value: '' } });
	const { t } = useTranslation();

	const isLoggedIn = useAppSelector((state) => state.authState.isAuthenticated);
	const { isError, createdOrUpdatedProductName } = useAppSelector((state) => state.productDetailState);
	const requestFilterDto: Request<ProductDto> = useAppSelector((state) => state.productState.request);
	const userRole = useAppSelector((state) => state.userState.user.role);

	useEffect(() => {
		if (isLoggedIn) {
			dispatch(requestFetchingProducts());
			dispatch(requestFetchingBrands());
			dispatch(requestFetchingCategories());
		}
	}, [dispatch]);

	const performPostApiCall = () => {
		handleOpenSnackbar(
			isError
				? t('createProductFailure', { productName: createdOrUpdatedProductName })
				: t('createProductSuccess', { productName: createdOrUpdatedProductName })
		);
		handleClose();
	};

	const handleSearchProducts: SubmitHandler<ISearchInput> = (data: ISearchInput) => {
		console.log(data.value);
		const request = {
			dataSourceRequest: requestFilterDto.dataSourceRequest,
			filter: {
				...requestFilterDto.filter,
				name: data.value
			}
		} as Request<ProductDto>;
		dispatch(requestFetchingProducts(request));
	};

	const handleClearButtonVisibility = () => {
		return watch('value') !== '' ? 'visible' : 'hidden';
	};

	const handleClearInputValue = () => {
		setValue('value', '');
	};

	const { result } = useAppSelector((state) => state.productState);
	return (
		<Box sx={{ overflowY: 'hidden', display: 'grid', flexDirection: 'column' }}>
			<Box sx={{ display: 'flex', flexDirection: 'row', justifySelf: 'end', marginTop: '2rem', marginRight: '10rem' }}>
				<form onSubmit={handleSubmit(handleSearchProducts)}>
					<TextField
						sx={{ m: 1, width: '50ch' }}
						{...register('value')}
						className={classes['search-box']}
						variant="standard"
						autoComplete="on"
						inputRef={(input) => input && input.focus()}
						placeholder={t('search') || ''}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<Tooltip title="Clear" placeholder="bottom" arrow sx={{ visibility: handleClearButtonVisibility }}>
										<IconButton className={classes['form-action-button']} onClick={handleClearInputValue}>
											<ClearIcon />
										</IconButton>
									</Tooltip>
									<Tooltip title={t('searchHint')} placement="bottom" arrow>
										<IconButton onClick={handleSubmit(handleSearchProducts)} className={classes['form-action-button']}>
											<SearchIcon />
										</IconButton>
									</Tooltip>
								</InputAdornment>
							)
						}}
					></TextField>
				</form>

				<Button
					variant="contained"
					onClick={handleClick}
					className={classes['create-button']}
					startIcon={<AddIcon />}
					sx={
						userRole.includes(ROLE.MANAGER) || userRole.includes(ROLE.ADMIN) === false ? { visibility: 'hidden' } : {}
					}
				>
					{t('create')}
				</Button>
			</Box>

			{result?.data && (
				<PmDataTable data={result?.data} total={result?.total} labelRowsPerPage={t('tableRowsPerPage')}></PmDataTable>
			)}
			<PmDialog onClose={handleClose} open={open} title={t('createProductTitle')} style={{ padding: '1rem 1.5rem' }}>
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
