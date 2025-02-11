import { CoreHelperUtil } from '@reown/appkit-core';

console.log(CoreHelperUtil.isMobile());

export const featuredWalletIds = [
	// Metamask
	'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
	// Trust Wallet
	'4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
	// Rainbow
	'1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369',
	// Uniswap
	'c03dfee351b6fcc421b4494ea33b9d4b92a984f87aa76d1663bb28705e95034a',
	// Safepal
	'0b415a746fb9ee99cce155c2ceca0c6f6061b1dbca2d722b3ba16381d0562150',
	// Binance
	...(CoreHelperUtil.isMobile() ? ['8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4'] : [])
];

export const excludedRdns = [
	'com.okex.wallet',
	'com.bybit',
	'pro.tokenpocket',
	'io.zerion.wallet',
	'com.robinhood.wallet',
	'com.crypto.wallet',
	'io.magiceden.wallet',
	'com.coinbase.wallet',
	'app.backpack',
	'app.phantom',
	'com.roninchain.wallet',
	'xyz.frontier.wallet',
	'com.coin98',
	'io.rabby',
	'io.loopring.wallet',
	'app.keplr',
	'com.brave.wallet',
	'com.coolbitx.cwsapp',
	'com.bifrostwallet',
	'so.onekey.app.wallet',
	'com.brave.wallet',
	'io.xdefi',
	'com.flowfoundation.wallet',
	'app.subwallet',
	'app.zeal',
	'xyz.roam.wallet',
	'com.meld.app',
	'com.moongate.one',
	'com.cryptokara',
	'com.blanqlabs.wallet',
	'tech.levain',
	'com.enkrypt',
	'com.scramble',
	'com.fastex.wallet',
	'com.dextrade',
	'com.hashpack.wallet',
	'com.mpcvault.broswerplugin',
	'one.mixin.messenger',
	'io.finoa',
	'xyz.nestwallet',
	'inc.tomo',
	'me.komet.app',
	'com.cryptnox',
	'com.elrond.maiar.wallet',
	'com.zypto',
	'com.walletconnect.com',
	'io.leapwallet.CompassWallet',
	'app.nightly',
	'nl.greenhood.wallet',
	'com.blazpay.wallet',
	'com.companyname.swaptobe',
	'io.getjoin.prd',
	'xyz.talisman',
	'co.family.wallet',
	'eu.flashsoft.clear-wallet',
];
