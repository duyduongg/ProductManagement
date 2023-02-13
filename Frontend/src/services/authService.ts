import { pageRoutes } from 'constants/apiRoutes';
import { CLIENT_ID, IDENTITY_CONFIG } from 'constants/index';
import { Log, User, UserManager, UserManagerSettings, WebStorageStateStore } from 'oidc-client';
export default class AuthService {
	private userManager: UserManager;

	constructor() {
		this.userManager = new UserManager({
			...IDENTITY_CONFIG,
			userStore: new WebStorageStateStore({ store: window.sessionStorage })
		} as UserManagerSettings);
		Log.logger = console;
		Log.level = Log.DEBUG;
		this.userManager.events.addAccessTokenExpiring(() => {
			Log.info('Access token expiring');
		});

		this.userManager.events.addAccessTokenExpired(() => {
			Log.info('Access token expired');
		});

		this.userManager.events.addUserLoaded((user: User) => {
			Log.info('Write user data to storage)');
			// sessionStorage.setItem('access_token', user.access_token);
			// sessionStorage.setItem('id_token', user.id_token);
			if (window.location.href.indexOf('signin-oidc') === -1) {
				this.navigateToScreen();
			}
		});
	}

	navigateToScreen = () => {
		window.location.replace(`/${pageRoutes.PRODUCT}`);
	};

	getUser = async () => {
		let user: User | null = await this.userManager.getUser();
		if (!user) {
			this.signinRedirectCallback();
			user = await this.userManager.getUser();
		}
		return user;
	};

	signinRedirect = () => {
		this.userManager.signinRedirect({});
	};

	signinRedirectCallback = () => {
		this.userManager
			.signinRedirectCallback()
			.then((user: User) => {
				// localStorage.setItem('user', user.toStorageString());
			})
			.catch((err) => {
				this.signinRedirect();
			});
	};

	signinSilent = () => {
		this.userManager
			.signinSilent()
			.then((user: User) => {
				console.log('signed in', user);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	signinSilentCallback = () => {
		this.userManager.signinSilentCallback();
	};

	isAuthenticated = () => {
		let data = sessionStorage.getItem(`oidc.user:${process.env.REACT_APP_AUTHORITY_HOST}:${CLIENT_ID}`);
		if (data !== null) {
			const oidcStorage = JSON.parse(data);
			return !!oidcStorage && !!oidcStorage.access_token;
		}
		return false;
	};

	signout = () => {
		this.userManager.signoutRedirect({
			id_token_hint: localStorage.getItem('id_token')
		});
		this.userManager.clearStaleState();
	};

	signoutRedirectCallback = () => {
		this.userManager.signoutRedirectCallback().then(() => {
			localStorage.clear();
		});
		this.userManager.clearStaleState();
	};

	static getAccessToken = () => {
		return sessionStorage.getItem('access_token');
	};
}
