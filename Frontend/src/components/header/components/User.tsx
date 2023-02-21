import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Avatar, Box, Divider, IconButton, ListItemIcon, MenuItem, Tooltip } from '@mui/material';
import { deepOrange, deepPurple, green } from '@mui/material/colors';
import { PmMenu } from 'components/shared/components';
import { useMenu } from 'hooks/index';
import { UserDto } from 'models/userDto';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import classes from './User.module.scss';
export interface UserProps {
	user: UserDto;
}

const backgroundColor = [deepOrange[500], green[500], deepPurple[500]];

const pickBgColor = () => {
	return backgroundColor[Math.floor(Math.random() * 3)];
};

const bgColor = pickBgColor();

export const User = ({ user }: UserProps) => {
	const { t } = useTranslation();
	const { anchorEl, open, handleClick, handleClose } = useMenu();

	const displayFirstCharacterOfFirstName = () => {
		return Object.keys(user).length !== 0 ? user.fullName.split(' ')[0].charAt(0) : 'U';
	};

	const displayTooltipAsFullName = () => {
		return Object.keys(user).length !== 0 ? user.fullName : 'Fullname';
	};
	return (
		<Fragment>
			<Box className={classes['container']}>
				<Tooltip title={displayTooltipAsFullName()} arrow>
					<Avatar sx={{ bgcolor: bgColor, width: 32, height: 32 }} className={classes['user-avatar']}>
						{displayFirstCharacterOfFirstName()}
					</Avatar>
				</Tooltip>
				<IconButton
					onClick={handleClick}
					size="small"
					aria-controls={open ? 'account-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
				>
					<ExpandMoreIcon fontSize="small" />
				</IconButton>
			</Box>
			<PmMenu anchorEl={anchorEl} open={open} handleClose={handleClose}>
				<MenuItem>
					{t('loginAs')} <br /> {user?.userName ?? 'Username'}
				</MenuItem>
				<Divider />
				<MenuItem onClick={handleClose}>
					<ListItemIcon>
						<CloseIcon fontSize="small" sx={{ marginRight: '5px', marginTop: '2px' }} /> {t('close')}
					</ListItemIcon>
				</MenuItem>
			</PmMenu>
		</Fragment>
	);
};
