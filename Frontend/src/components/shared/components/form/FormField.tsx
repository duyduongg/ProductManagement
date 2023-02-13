import { FormControl, TextField } from '@mui/material';
import { HTMLInputTypeAttribute, InputHTMLAttributes } from 'react';
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form';
export interface PmFormFieldProps extends InputHTMLAttributes<HTMLInputTypeAttribute> {
	id: string;
	label: string;
	registeredValue: string;
	options?: RegisterOptions;
	value?: string | number;
	disabled?: boolean;
}

export const PmFormField = ({ label, id, registeredValue, value, disabled }: PmFormFieldProps) => {
	const {
		control,
		formState: { errors }
	} = useFormContext();

	return (
		<Controller
			name={registeredValue}
			defaultValue={value ?? ''}
			control={control}
			render={({ field }) => (
				<FormControl variant="outlined" sx={{ m: 1, minWidth: 280 }}>
					<TextField
						id={id}
						label={label}
						{...field}
						error={!!errors[`${registeredValue}`]}
						helperText={errors[`${registeredValue}`]?.message?.toString() ?? ''}
						disabled={disabled}
					/>
				</FormControl>
			)}
		/>
	);
};
