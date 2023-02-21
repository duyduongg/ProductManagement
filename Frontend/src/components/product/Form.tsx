import classes from './Form.module.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import CreateIcon from '@mui/icons-material/Create';
import SaveIcon from '@mui/icons-material/Save';
import { Box, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hook';
import { productDetailActions } from 'app/reducers/productDetailSlice';
import { productFormSchema } from 'helpers/index';
import { BrandDto, CategoryDto, NewProductDto, ProductDto } from 'models/index';
import { useEffect, useRef } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { PmFormCurrencyField } from '../shared/components/form/FormCurrencyField';
import { PmFormField } from '../shared/components/form/FormField';
import { PmFormSelect } from '../shared/components/form/FormSelect';
import { useTranslation } from 'react-i18next';

export interface IFormInput {
	isCreate: boolean;
	name: string;
	price: number;
	warrantyMonth: number;
	stock: number;
	brandId: string;
	categoryId: string;
}

export interface PmProductFormProps {
	data?: ProductDto;
	formState: boolean; // true = Create | false = Update
	handleClose: () => void;
	performPostApiCall: () => void;
}

export const PmProductForm = ({ data, formState, handleClose, performPostApiCall }: PmProductFormProps) => {
	const brands: BrandDto[] = useAppSelector((state) => state.brandState.data);
	const categories: CategoryDto[] = useAppSelector((state) => state.categoryState.data);
	const ref = useRef();
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const methods = useForm<IFormInput>({ resolver: yupResolver(productFormSchema) });
	useEffect(() => {
		methods.setValue('isCreate', formState);
	}, [formState, methods]);
	const onSubmitHandler: SubmitHandler<IFormInput> = (data: IFormInput) => {
		const product: NewProductDto = {
			name: data.name,
			price: data.price,
			warrantyMonth: data.warrantyMonth,
			stock: data.stock,
			brandId: data.brandId,
			categoryId: data.categoryId
		};
		dispatch(productDetailActions.requestCreatingOrUpdatingProduct(product));
		performPostApiCall();
	};

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmitHandler)}>
				<div className={classes['form']}>
					<div className={classes['form-fields']}>
						<PmFormField
							id="name"
							label={t('name')}
							registeredValue="name"
							value={data?.name}
							disabled={data?.name ? true : false}
						/>
						<PmFormCurrencyField ref={ref} id="price" label="Price" registeredValue="price" value={data?.price} />
						<PmFormField
							id="warrantyMonth"
							label={t('warrantyMonth')}
							registeredValue="warrantyMonth"
							value={data?.warrantyMonth}
						/>
					</div>
					<div className={classes['form-fields']}>
						<PmFormField id="stock" label={t('stock')} registeredValue="stock" value={data?.stock} />
						<PmFormSelect
							id="brand"
							label={t('brand')}
							registeredValue="brandId"
							valueArray={brands}
							value={data?.brandId ? data?.brandId : brands[0].id}
						/>
						<PmFormSelect
							id="category"
							label={t('brand')}
							registeredValue="categoryId"
							valueArray={categories}
							value={data?.category ? data?.categoryId : categories[0].id}
						/>
					</div>
				</div>
				<Box sx={{ marginY: '1rem', float: 'right' }}>
					<Button
						onClick={handleClose}
						variant="contained"
						className={classes['action-button']}
						startIcon={<CloseIcon />}
					>
						{t('confirmCreateUpdateRefuse')}
					</Button>
					<Button
						type="submit"
						variant="contained"
						className={classes['action-button']}
						startIcon={formState ? <CreateIcon /> : <SaveIcon />}
					>
						{t(formState ? 'confirmCreateAccept' : 'confirmUpdateAccept')}
					</Button>
				</Box>
			</form>
		</FormProvider>
	);
};
