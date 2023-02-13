import { formValidationMessages } from 'constants/index';
import { productService } from 'services/productService';
import * as yup from 'yup';

const isCreating = yup.boolean().test((value) => value || !value);

const nameDuplicateSchema = yup
	.string()
	.test('is-duplicated', formValidationMessages['nameDuplicated'], async (value) => {
		if (!value) {
			return false;
		}
		return !(await productService.checkProductNameDuplicationAsync(value!));
	});

const nameSchema = yup.string().required(formValidationMessages['required']);

const priceSchema = yup
	.number()
	.required(formValidationMessages['required'])
	.typeError(formValidationMessages['priceTypeNumber'])
	.moreThan(0, formValidationMessages['priceError']);

const warrantyMonthSchema = yup
	.number()
	.required(formValidationMessages['required'])
	.typeError(formValidationMessages['warrantyMonthTypeError'])
	.positive()
	.integer()
	.lessThan(120, formValidationMessages['warrantyMonthLimitError']);

const stockSchema = yup
	.number()
	.required(formValidationMessages['required'])
	.typeError(formValidationMessages['stockTypeError'])
	.positive()
	.integer()
	.lessThan(120, formValidationMessages['stockLimitError']);

export const productFormSchema = yup.object().shape({
	isCreating: isCreating,
	name: nameSchema.when('isCreating', {
		is: false,
		then: nameDuplicateSchema
	}),
	price: priceSchema,
	warrantyMonth: warrantyMonthSchema,
	stock: stockSchema
});
