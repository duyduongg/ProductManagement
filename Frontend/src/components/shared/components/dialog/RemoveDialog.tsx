import { Button, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { PmDialog } from './Dialog';
import classes from './RemoveDialog.module.scss';
export interface PmRemoveDialogProps {
	closeHandler: () => void;
	isOpen: boolean;
	confirmHandler: () => void;
}

export const PmRemoveDialog = ({ closeHandler, isOpen, confirmHandler }: PmRemoveDialogProps) => {
	return (
		<PmDialog onClose={closeHandler} open={isOpen} title="Delete product" style={{ padding: '1rem 1rem' }}>
			<DialogContent>
				<DialogContentText id="dialog-content-text" className={classes['dialog-content']}>
					Are you sure you want to delete this product?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={closeHandler} className={classes['action-buttons']}>
					No
				</Button>
				<Button onClick={confirmHandler} className={classes['action-buttons']}>
					Yes
				</Button>
			</DialogActions>
		</PmDialog>
	);
};
