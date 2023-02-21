import { Button, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { PmDialog } from './Dialog';
import classes from './RemoveDialog.module.scss';
export interface PmRemoveDialogProps {
	closeHandler: () => void;
	isOpen: boolean;
	confirmHandler: () => void;
	title: string;
	contentText: string;
	actionAccept: string;
	actionRefuse: string;
}

export const PmRemoveDialog = ({
	closeHandler,
	isOpen,
	confirmHandler,
	title,
	contentText,
	actionAccept,
	actionRefuse
}: PmRemoveDialogProps) => {
	return (
		<PmDialog onClose={closeHandler} open={isOpen} title={title} style={{ padding: '1rem 1rem' }}>
			<DialogContent>
				<DialogContentText id="dialog-content-text" className={classes['dialog-content']}>
					{contentText}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={closeHandler} className={classes['action-buttons']}>
					{actionRefuse}
				</Button>
				<Button onClick={confirmHandler} className={classes['action-buttons']}>
					{actionAccept}
				</Button>
			</DialogActions>
		</PmDialog>
	);
};
