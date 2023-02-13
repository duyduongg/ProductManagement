import { IconButton, Slide, SlideProps, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import React from 'react';
export interface IPmSnackBarProps {
	open: boolean;
	handleClose: () => void;
	message: string;
	severity: 'error' | 'success';
}
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const TransitionComponent = (props: SlideProps) => {
	return <Slide {...props} direction="up" />;
};

export const PmSnackbar = ({ open, handleClose, message, severity }: IPmSnackBarProps) => {
	const action = (
		<div>
			<Alert severity={severity}>
				{message}
				<IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
					<CloseIcon fontSize="small" />
				</IconButton>
			</Alert>
		</div>
	);
	return (
		<Snackbar
			open={open}
			autoHideDuration={3000}
			onClose={handleClose}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			TransitionComponent={TransitionComponent}
		>
			{action}
		</Snackbar>
	);
};
