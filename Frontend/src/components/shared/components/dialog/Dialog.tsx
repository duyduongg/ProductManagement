import { Dialog, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { CSSProperties, ReactNode } from 'react';
import classes from './Dialog.module.scss';
export interface DialogProps {
	title: string;
	children?: ReactNode;
	open: boolean;
	onClose: () => void;
	style?: CSSProperties;
}
export const PmDialog = ({ title, children, open, onClose, style }: DialogProps) => {
	const handleClose = () => {
		onClose();
	};
	return (
		<Dialog onClose={handleClose} open={open} maxWidth="md">
			<DialogTitle style={{ backgroundColor: '#d4d4d4', color: 'black' }} className={classes['title']}>
				{title}
				{onClose ? (
					<IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
						<CloseIcon />
					</IconButton>
				) : null}
			</DialogTitle>
			<div style={style}>{children}</div>
		</Dialog>
	);
};
