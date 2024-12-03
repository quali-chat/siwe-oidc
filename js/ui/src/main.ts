import './global.css';
import App from './App.svelte';
import { mount } from 'svelte';

const params = new URLSearchParams(window.location.search);

const app = mount(App, {
	target: document.getElementById('app')!,
	props: {
		// domain: params.get('domain'),
		nonce: params.get('nonce'),
		redirect: params.get('redirect_uri'),
		state: params.get('state'),
		oidc_nonce: params.get('oidc_nonce'),
		client_id: params.get('client_id'),
	},
});

export default app;
