import { useState } from 'react';

export const useDialog = () => {
	const [open, setOpen] = useState(false);
	const handleClick = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};

	return { open, handleClick, handleClose };
};
