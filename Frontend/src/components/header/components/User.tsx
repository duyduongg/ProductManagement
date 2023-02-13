import { Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material';
import { deepOrange, deepPurple, green } from '@mui/material/colors';
import { UserDto } from 'models/userDto';
import { Fragment, MouseEvent, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

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
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: 'visible',
						filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
						mt: 1.5,
						'& .MuiAvatar-root': {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1
						},
						'&:before': {
							content: '""',
							display: 'block',
							position: 'absolute',
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgcolor: 'background.paper',
							transform: 'translateY(-50%) rotate(45deg)',
							zIndex: 0
						}
					}
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
				className={classes['menu']}
			>
				<MenuItem>
					Login as: <br /> {user?.userName ?? 'Username'}
				</MenuItem>
				<Divider />
				<MenuItem onClick={handleClose}>
					<ListItemIcon>
						<CloseIcon fontSize="small" sx={{ marginRight: '5px', marginTop: '2px' }} /> Close
					</ListItemIcon>
				</MenuItem>
			</Menu>
		</Fragment>
	);
};
