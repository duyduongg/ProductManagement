import { IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
export interface PmDataTableToolbarProps {
	numSelected: number;
	openConfirmDialogHandler: () => void;
}

export const PmDataTableToolbar = ({ numSelected, openConfirmDialogHandler }: PmDataTableToolbarProps) => {
	return (
		<Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, ...(numSelected > 0 && { bgcolor: '#d4d4d4' }) }}>
			{numSelected > 0 ? (
				<Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
					{numSelected} selected
				</Typography>
			) : (
				<Typography sx={{ flex: '1 1 100%' }} variant="h6" component="div">
					Products
				</Typography>
			)}
			{numSelected > 0 ? (
				<Tooltip title="Delete">
					<IconButton onClick={openConfirmDialogHandler}>
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			) : (
				<></>
			)}
		</Toolbar>
	);
};
