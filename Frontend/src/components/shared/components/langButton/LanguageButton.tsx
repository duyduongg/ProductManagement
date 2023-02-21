import TranslateIcon from '@mui/icons-material/Translate';
import { IconButton, MenuItem, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { useMenu } from 'hooks/index';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PmMenu } from '../menu/Menu';
import classes from './LanguageButton.module.scss';

export interface Language {
	short: string;
	long: string;
}

export const PmLanguageButton = () => {
	const { anchorEl, open, handleClick, handleClose } = useMenu();
	const { t, i18n, ready } = useTranslation();
	const [formattedLanguages, setFormattedLanguages] = useState<Language[]>([]);
	const availableLangs = t('lang', { returnObjects: true }) as string[];
	useEffect(() => {
		if (ready) {
			const langShort = Object.keys(i18n.options.resources!);
			for (let i = 0; i < langShort.length; i++) {
				setFormattedLanguages((lang) => [...lang, { short: langShort[i], long: availableLangs[i] }]);
			}
		}
	}, [ready]);

	const handleLanguageChange = (lang: string) => {
		const chosenLanguage = formattedLanguages.find((obj) => obj.long === lang);
		if (chosenLanguage?.short === i18n.language) {
			handleClose();
			return;
		}
		i18n.changeLanguage(chosenLanguage?.short);
		handleClose();
	};

	return (
		<Fragment>
			<Box>
				<Tooltip title={t('language')} arrow placement="bottom">
					<IconButton className={classes['lang-button']} onClick={handleClick} size="small">
						<TranslateIcon />
						{i18n.language.toUpperCase()}
					</IconButton>
				</Tooltip>
			</Box>
			<PmMenu anchorEl={anchorEl} handleClose={handleClose} open={open}>
				{availableLangs.map((lang) => (
					<MenuItem key={lang} onClick={() => handleLanguageChange(lang)}>
						{lang}
					</MenuItem>
				))}
			</PmMenu>
		</Fragment>
	);
};
