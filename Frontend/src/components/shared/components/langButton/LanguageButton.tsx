import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import TranslateIcon from '@mui/icons-material/Translate';
import classes from './LanguageButton.module.scss';
export const PmLanguageButton = () => {
	const { t, i18n } = useTranslation();

	const handleChangeLanguage = () => {
		// i18n.changeLanguage();
	};
	return (
		<Button className={classes['lang-button']} onClick={handleChangeLanguage}>
			<TranslateIcon />
			{i18n.language.toUpperCase()}
		</Button>
	);
};
