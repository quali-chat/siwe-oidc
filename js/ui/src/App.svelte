<script lang="ts">
	import { onMount } from 'svelte';
	import { createAppKit, type Metadata } from '@reown/appkit';
	import { ApiController } from '@reown/appkit-core';
	import { excludedRdns, featuredWalletIds } from './wallets';
	import { mainnet, sepolia } from '@reown/appkit/networks';
	import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
	import { getAccount, reconnect, signMessage } from '@wagmi/core';
	import { SiweMessage } from 'siwe';
	import Cookies from 'js-cookie';

	// main.ts will parse the params from the server
	/* 	export let domain: string; */
	export let nonce: string | null;
	export let redirect: string | null;
	export let state: string | null;
	export let oidc_nonce: string | null;
	export let client_id: string | null;

	// Get a project ID at https://cloud.reown.com
	const projectId = import.meta.env.VITE_PROJECT_ID;
	// 11_155_111 is the network id for sepolia, 1 is the network id for mainnet
	const networkId: any = import.meta.env.VITE_NETWORK_ID || 11155111;

	const networks: any = [mainnet, sepolia].filter((chain) => `${chain.id}` === `${networkId}`);

	const wagmiAdapter = new WagmiAdapter({
		projectId,
		networks,
	});

	const metadata: Metadata = {
		name: 'quali.chat',
		description: 'All your token-gated chats in one quality dApp',
		url: window.location.origin,
		icons: ['https://avatars.githubusercontent.com/u/167457066?s=200&v=4'],
	};

	const modal = createAppKit({
		adapters: [wagmiAdapter],
		networks,
		metadata,
		projectId,
		features: {
			analytics: false,
			email: false,
			socials: false,
		},
		enableCoinbase: false,
		allWallets: 'HIDE',
		featuredWalletIds,
		// excludeWalletIds,
		themeMode: 'dark',
		themeVariables: {
			'--w3m-accent': '#9baff7',
		},
	});

	// temporary fix, connectors are not synced properly on appkit
	wagmiAdapter.syncConnectors(modal.options, modal);

	reconnect(wagmiAdapter.wagmiConfig);

	// temporary fix, until excluded wallets are properly handled on appkit
	ApiController.state.excludedRDNS = excludedRdns;

	let client_metadata = {};
	onMount(async () => {
		try {
			client_metadata = fetch(`${window.location.origin}/client/${client_id}`).then((response) => response.json());
		} catch (e) {
			console.error(e);
		}
	});

	modal.subscribeState(async (newState) => {
		const account = getAccount(wagmiAdapter.wagmiConfig);

		if (account.isConnected) {
			try {
				const expirationTime = new Date(
					new Date().getTime() + 2 * 24 * 60 * 60 * 1000, // 48h
				);

				const msgToSign = new SiweMessage({
					domain: window.location.host,
					address: account.address,
					chainId: account.chainId,
					expirationTime: expirationTime.toISOString(),
					uri: window.location.origin,
					version: '1',
					statement: `You are signing-in to ${window.location.host}.`,
					nonce: nonce as any,
					resources: [redirect as any],
				});

				const preparedMessage = msgToSign.prepareMessage();

				await new Promise((resolve) => setTimeout(resolve, 1000));

				const signature = await signMessage(wagmiAdapter.wagmiConfig, {
					message: preparedMessage,
				});

				const session = {
					message: new SiweMessage(preparedMessage),
					raw: msgToSign,
					signature,
				};
				Cookies.set('siwe', JSON.stringify(session), {
					expires: expirationTime,
				});

				window.location.replace(
					`/sign_in?redirect_uri=${encodeURI(redirect as any)}&state=${encodeURI(state as any)}&client_id=${encodeURI(
						client_id as any,
					)}${encodeURI(oidc_nonce_param)}`,
				);
				return;
			} catch (e) {
				console.error(e);
			}
		}
	});

	let oidc_nonce_param = '';
	if (oidc_nonce != null && oidc_nonce != '') {
		oidc_nonce_param = `&oidc_nonce=${oidc_nonce}`;
	}
</script>

<div
	class="bg-no-repeat bg-cover bg-center font-nunito flex-grow w-full h-screen flex flex-col items-center eclipse-background md:bg-cover md:bg-center md:bg-no-repeat"
>
	<header class="flex flex-col items-center md:flex-row w-full">
		<aside class="pl-6 pt-6 pr-6 pb-2 flex">
			<img src="img/quali.chat-desktop-logo.svg" alt="Quali chat logo" class="icon self-center hidden sm:block" />
			<img src="img/quali.chat-mobile-logo.svg" alt="Quali chat logo" class="icon self-center block sm:hidden" />
		</aside>
	</header>
	<div class="h-full flex items-center justify-center">
		<div
			class="text-center bg-transparent text-white flex flex-col px-12 py-6 md:w-[811px] max-w-[900px] h-[596px] flex-shrink-0 md:border border-white md:bg-[#08090B] rounded-none"
		>
			<!--   {#if client_metadata.logo_uri}
		<div class="flex justify-evenly items-stretch">
		  <img height="72" width="72" class="self-center mb-8" src="img/modal_icon.png" alt="Ethereum logo" />
		  <img height="72" width="72" class="self-center mb-8" src={client_metadata.logo_uri} alt="Client logo" />
		</div>
		{:else}
		-->
			<img class="self-center mb-8 ethereum-image" src="img/ethereum.png" alt="Ethereum" />
			<!--   {/if} -->
			<h5 style="color: #FCA780">WELCOME!</h5>
			<!--   <span class="text-xs">
		Sign-In with Ethereum to continue to {client_metadata.client_name ? client_metadata.client_name : domain}
	  </span> -->
			<button
				class="h-10 w-64 rounded-20 bg-white text-black justify-evenly flex items-center self-center mt-8 mb-8"
				on:click={() => {
					modal.open();
				}}
			>
				Sign-in with Ethereum
			</button>
			<div class="w-56 self-center text-center text-[14px] font-sans font-normal leading-normal">
				By using this service you agree to the
				<a href="https://quali.chat/terms/" class="text-[#FCA780] !text-[#FCA780]">Terms of Use</a>
				and
				<a href="https://quali.chat/privacy/" class="text-[#FCA780] !text-[#FCA780]">Privacy Policy</a>.
			</div>
			{#if client_metadata.client_uri}
				<span class="text-xs mt-4">Request linked to {client_metadata.client_uri}</span>
			{/if}
		</div>
	</div>
</div>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

	html,
	body {
		position: relative;
		width: 100vw;
		height: 100vh;
		margin: 0px;
		padding: 0px;
		font-size: 18px;
		background: #000;
		display: flex;
		flex-direction: column;
		overflow-x: hidden;
		@apply font-nunito;
	}

	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		@apply font-extrabold;
		@apply font-nunito;
	}

	h1 {
		font-size: 76px;
		line-height: 129px;
		letter-spacing: -4.5%;
	}

	h2 {
		font-size: 66px;
		line-height: 101px;
		letter-spacing: -3%;
	}

	h3 {
		font-size: 52px;
		line-height: 80px;
		letter-spacing: -1.5%;
	}

	h4 {
		font-size: 48px;
		line-height: 63px;
		letter-spacing: -1%;
	}

	h5 {
		font-size: 32px;
		line-height: 49px;
		letter-spacing: -0.5%;
	}

	h6 {
		font-size: 24px;
		line-height: 37px;
		letter-spacing: -0.5%;
	}

	body {
		color: #222222;
	}

	a {
		text-decoration: none;
		color: #fca780;
	}

	td,
	th {
		font-weight: 400;
	}

	pre {
		white-space: pre-wrap; /* Since CSS 2.1 */
		white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
		white-space: -pre-wrap; /* Opera 4-6 */
		white-space: -o-pre-wrap; /* Opera 7 */
		word-wrap: break-word; /* Internet Explorer 5.5+ */
	}

	/* TODO: remove inline svg and import file */
	@layer utilities {
		@screen md {
			.eclipse-background {
				background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="1461" height="1200" viewBox="0 0 1461 1200" fill="none"><circle cx="961" cy="431" r="500" fill="url(%23paint0_radial_1254_2)"/><circle cx="500" cy="796" r="500" fill="url(%23paint1_radial_1254_2)"/><defs><radialGradient id="paint0_radial_1254_2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(961 431) rotate(90) scale(500)"><stop stop-color="%239BAFF7"/><stop offset="1" stop-color="%23737373" stop-opacity="0"/></radialGradient><radialGradient id="paint1_radial_1254_2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(500 796) rotate(90) scale(500)"><stop stop-color="%23FCA780"/><stop offset="1" stop-color="%23737373" stop-opacity="0"/></radialGradient></defs></svg>');
				background-repeat: no-repeat;
				background-size: cover;
				background-position: center;
			}
		}
	}

	.ethereum-image {
		max-width: 270px;
	}
</style>
