import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/en/translation.json';
import translationVI from './locales/vi/translation.json';
export const defaultNS = 'translation';
export const resources = {
	en: { translation: translationEN },
	vi: { translation: translationVI }
};
i18n
	.use(Backend)
	.use(initReactI18next)
	.init({
		resources,
		defaultNS,
		returnNull: false,
		initImmediate: false,
		lng: 'vi',
		// fallbackLng: defaultNS,
		ns: defaultNS,
		debug: true,
		interpolation: {
			escapeValue: false // no need for react. it escapes by default
		}
	})
	.then(() => console.log('Initialized'));

export default i18n;
