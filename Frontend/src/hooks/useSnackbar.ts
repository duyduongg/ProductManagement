import { useState } from 'react';

export const useSnackbar = () => {
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [message, setMessage] = useState('');
	const handleOpenSnackbar = (message: string) => {
		setOpenSnackbar(true);
		setMessage(message);
	};
	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	return { openSnackbar, message, handleOpenSnackbar, handleCloseSnackbar };
};
