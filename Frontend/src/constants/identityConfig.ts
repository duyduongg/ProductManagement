import { UserManagerSettings, WebStorageStateStore } from 'oidc-client';
export const IDENTITY_CONFIG: UserManagerSettings = {
	authority: process.env.REACT_APP_AUTHORITY_HOST,
	client_id: 'pm-frontend',
	redirect_uri: window.location.origin,
	post_logout_redirect_uri: `${process.env.REACT_APP_AUTHORITY_HOST}/.well-known/openid-configuration`,
	response_type: 'id_token token',
	loadUserInfo: false,
	automaticSilentRenew: true,
	scope: 'openid profile product',
	userStore: new WebStorageStateStore({ store: window.sessionStorage })
} as UserManagerSettings;

export const CLIENT_ID = 'pm-frontend';
