import { FormControl, TextField } from '@mui/material';
import { forwardRef, HTMLInputTypeAttribute, InputHTMLAttributes } from 'react';
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
export interface PmFormCurrencyFieldProps extends InputHTMLAttributes<HTMLInputTypeAttribute> {
	id: string;
	label: string;
	registeredValue: string;
	options?: RegisterOptions;
	value?: string | number;
}

export const PmFormCurrencyField = forwardRef(
	({ label, id, registeredValue, value }: PmFormCurrencyFieldProps, ref) => {
		const {
			control,
			formState: { errors }
		} = useFormContext();
		return (
			<Controller
				name={registeredValue}
				defaultValue={value ?? 0}
				control={control}
				render={({ field: { name, onBlur, onChange, value } }) => (
					<FormControl variant="outlined" sx={{ m: 1, minWidth: 280 }}>
						<NumericFormat
							customInput={TextField}
							id={id}
							label={label}
							name={name}
							onBlur={onBlur}
							value={value}
							thousandSeparator={true}
							suffix="đ"
							error={!!errors[`${registeredValue}`]}
							helperText={errors[`${registeredValue}`]?.message?.toString() ?? ''}
							valueIsNumericString={true}
							onValueChange={(values) => onChange(values.value)}
						/>
					</FormControl>
				)}
			/>
		);
	}
);
