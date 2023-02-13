export const formValidationMessages: Record<string, string> = {
	required: 'This field is required',
	nameDuplicated: 'This name has been used',
	priceTypeError: 'Price of product must be a number',
	priceError: 'Price of product should be a positive number',
	warrantyMonthLimitError: 'Warranty month should be less than 120 months',
	warrantyMonthTypeError: 'Warranty month must be a number',
	stockTypeError: 'Stock must be a number',
	stockLimitError: 'Stock should be less than 500'
};
