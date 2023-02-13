import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

export interface FormSelectProps<T extends { id: string; name: string }> {
	id: string;
	label: string;
	value: string | undefined;
	registeredValue: string;
	valueArray: T[];
}

export const PmFormSelect = <T extends { id: string; name: string }>({
	id,
	label,
	value,
	registeredValue,
	valueArray
}: FormSelectProps<T>) => {
	const { control } = useFormContext();
	return (
		<Controller
			name={registeredValue}
			defaultValue={value}
			control={control}
			render={({ field }) => (
				<FormControl variant="outlined" sx={{ m: 1, minWidth: 220 }}>
					<InputLabel id="pm-form-select">{label}</InputLabel>
					<Select labelId="pm-form-select" id={id} {...field} label={label}>
						{valueArray.map((value) => (
							<MenuItem key={value.id} value={value.id}>
								{value.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			)}
		/>
	);
};
