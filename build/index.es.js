import { configureChains, useQuery, useAccount, useNetwork, useSignMessage, useSwitchNetwork, useConnect as useConnect$1, useEnsAddress, useEnsName, useEnsAvatar, useDisconnect, useBalance } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { SafeConnector } from 'wagmi/connectors/safe';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import React, { useRef, useState, useEffect, useLayoutEffect, createContext, createElement, useContext as useContext$1, useMemo, useCallback } from 'react';
import { Buffer } from 'buffer';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import styled$1, { css, keyframes, ThemeProvider } from 'styled-components';
import { createPortal } from 'react-dom';
import { detect } from 'detect-browser';
import { useTransition } from 'react-transition-state';
import { getAddress } from 'viem';
import useMeasure from 'react-use-measure';
import ResizeObserver from 'resize-observer-polyfill';
import QRCodeUtil from 'qrcode';

var types = /*#__PURE__*/Object.freeze({
  __proto__: null
});

let globalAppName;
let globalAppIcon;
const getAppName = () => globalAppName;
const getAppIcon = () => globalAppIcon;
const defaultChains = [mainnet, polygon, optimism, arbitrum];
const getDefaultConnectors = ({ chains, app, walletConnectProjectId, }) => {
    const hasAllAppData = app.name && app.icon && app.description && app.url;
    const shouldUseSafeConnector = !(typeof window === 'undefined') && (window === null || window === void 0 ? void 0 : window.parent) !== window;
    let connectors = [];
    // If we're in an iframe, include the SafeConnector
    if (shouldUseSafeConnector) {
        connectors = [
            ...connectors,
            new SafeConnector({
                chains,
                options: {
                    allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
                    debug: false,
                },
            }),
        ];
    }
    // Add the rest of the connectors
    connectors = [
        ...connectors,
        new MetaMaskConnector({
            chains,
            options: {
                shimDisconnect: true,
                UNSTABLE_shimOnConnectSelectAccount: true,
            },
        }),
        new CoinbaseWalletConnector({
            chains,
            options: {
                appName: app.name,
                headlessMode: true,
            },
        }),
        walletConnectProjectId
            ? new WalletConnectConnector({
                chains,
                options: {
                    showQrModal: false,
                    projectId: walletConnectProjectId,
                    metadata: hasAllAppData
                        ? {
                            name: app.name,
                            description: app.description,
                            url: app.url,
                            icons: [app.icon],
                        }
                        : undefined,
                },
            })
            : new WalletConnectLegacyConnector({
                chains,
                options: {
                    qrcode: false,
                },
            }),
        new InjectedConnector({
            chains,
            options: {
                shimDisconnect: true,
                name: (detectedName) => `Injected (${typeof detectedName === 'string'
                    ? detectedName
                    : detectedName.join(', ')})`,
            },
        }),
    ];
    return connectors;
};
const defaultConfig = ({ autoConnect = true, appName = 'ConnectKit', appIcon, appDescription, appUrl, chains = defaultChains, alchemyId, infuraId, connectors, publicClient, stallTimeout, webSocketPublicClient, enableWebSocketPublicClient, walletConnectProjectId, }) => {
    globalAppName = appName;
    if (appIcon)
        globalAppIcon = appIcon;
    const providers = [];
    if (alchemyId) {
        providers.push(alchemyProvider({ apiKey: alchemyId }));
    }
    if (infuraId) {
        providers.push(infuraProvider({ apiKey: infuraId }));
    }
    providers.push(jsonRpcProvider({
        rpc: (c) => {
            return { http: c.rpcUrls.default.http[0] };
        },
    }));
    providers.push(publicProvider());
    const { publicClient: configuredPublicClient, chains: configuredChains, webSocketPublicClient: configuredWebSocketPublicClient, } = configureChains(chains, providers, { stallTimeout });
    const connectKitClient = {
        autoConnect,
        connectors: connectors !== null && connectors !== void 0 ? connectors : getDefaultConnectors({
            chains: configuredChains,
            app: {
                name: appName,
                icon: appIcon,
                description: appDescription,
                url: appUrl,
            },
            walletConnectProjectId,
        }),
        publicClient: publicClient !== null && publicClient !== void 0 ? publicClient : configuredPublicClient,
        webSocketPublicClient: enableWebSocketPublicClient // Removed by default, breaks if used in Next.js – "unhandledRejection: Error: could not detect network"
            ? webSocketPublicClient !== null && webSocketPublicClient !== void 0 ? webSocketPublicClient : configuredWebSocketPublicClient
            : undefined,
    };
    return { ...connectKitClient };
};

const defaultLightTheme = {
    font: {
        family: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, 'Apple Color Emoji', Arial, sans-serif, 'Segoe UI Emoji'`,
    },
    text: {
        primary: {
            color: '#373737',
        },
        secondary: {
            color: '#999999',
            hover: {
                color: '#111111',
            },
        },
        error: '#FC6464',
        valid: '#32D74B',
    },
    buttons: {
        primary: {
            borderRadius: 16,
            color: '#000373737000',
            background: '#FFFFFF',
            border: '#F0F0F0',
            hover: {
                color: '#000000',
                border: '#1A88F8',
            },
        },
        secondary: {
            borderRadius: 16,
            background: '#F6F7F9',
            color: '#000000',
        },
    },
    navigation: {
        color: '#999999',
    },
    modal: {
        background: '#ffffff',
        divider: '#f7f6f8',
    },
    tooltips: {
        color: '#999999',
        background: '#ffffff',
        hover: {
            background: '#f6f7f9',
        },
    },
    overlay: {
        background: 'rgba(0, 0, 0, 0.06)',
    },
    qrCode: {
        accentColor: '#F7F6F8',
    },
};
// parse into css variables so we can use p3 colors
const parseTheme = (theme) => {
    return theme;
};
const userPrefersDarkMode = () => {
    if (typeof window === 'undefined')
        return false;
    return (window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    /*
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        userPrefersDarkMode = event.matches;
      });
      */
};
userPrefersDarkMode();
const defaultTheme$1 = {
    connectKit: {
        options: {
            iconStyle: 'light',
        },
        //theme: parseTheme(defaultLightTheme),
        theme: {
            preferred: 'dark',
            light: parseTheme(defaultLightTheme),
            dark: parseTheme(defaultLightTheme),
        },
    },
};

/**
 *
 * IMPORTANT NOTE: This file is a workaround for the following issue:
 *
 * When using rollup with styled-components to build into an ES module, styled components decides to move all of it’s DOM elements into "styled.default" rather than just within "styled"
 *
 * We're unsure as to why this issue occurs, if you have any ideas or a better solution please let us know by opening a discussion on our GitHub repo:
 * https://github.com/family/connectkit/discussions/new
 *
 */
var styled = typeof styled$1.div === 'function' ? styled$1 : styled$1['default'];

const hexToP3 = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result == null)
        return hex;
    const values = {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    };
    return `color(display-p3 ${values.r / 255} ${values.g / 255} ${values.b / 255})`;
};

var base = {
    light: {
        /** Connect Wallet Button */
        '--ck-connectbutton-font-size': '15px',
        '--ck-connectbutton-color': '#373737',
        '--ck-connectbutton-background': '#F6F7F9',
        '--ck-connectbutton-background-secondary': '#FFFFFF',
        '--ck-connectbutton-hover-color': '#373737',
        '--ck-connectbutton-hover-background': '#F0F2F5',
        '--ck-connectbutton-active-color': '#373737',
        '--ck-connectbutton-active-background': '#EAECF1',
        '--ck-connectbutton-balance-color': '#373737',
        '--ck-connectbutton-balance-background': '#fff',
        '--ck-connectbutton-balance-box-shadow': 'inset 0 0 0 1px var(--ck-connectbutton-background)',
        '--ck-connectbutton-balance-hover-background': '#F6F7F9',
        '--ck-connectbutton-balance-hover-box-shadow': 'inset 0 0 0 1px var(--ck-connectbutton-hover-background)',
        '--ck-connectbutton-balance-active-background': '#F0F2F5',
        '--ck-connectbutton-balance-active-box-shadow': 'inset 0 0 0 1px var(--ck-connectbutton-active-background)',
        /** Primary Button */
        '--ck-primary-button-border-radius': '16px',
        '--ck-primary-button-color': '#373737',
        '--ck-primary-button-background': '#F6F7F9',
        //'--ck-primary-button-box-shadow': 'inset 0 0 0 1px #F0F0F0',
        '--ck-primary-button-font-weight': '600',
        '--ck-primary-button-hover-color': '#373737',
        '--ck-primary-button-hover-background': '#F0F2F5',
        //'--ck-primary-button-hover-box-shadow': 'inset 0 0 0 2px var(--ck-focus-color)',
        //'--ck-primary-button-active-background': '#EAECF1',
        /** Secondary Button */
        '--ck-secondary-button-border-radius': '16px',
        '--ck-secondary-button-color': '#373737',
        '--ck-secondary-button-background': '#F6F7F9',
        //'--ck-secondary-button-box-shadow': '',
        //'--ck-secondary-button-font-weight': '',
        /** Tertiary Button */
        '--ck-tertiary-button-background': '#FFFFFF',
        '--ck-secondary-button-hover-background': '#e0e4eb',
        /** Modal */
        '--ck-modal-box-shadow': '0px 2px 4px rgba(0, 0, 0, 0.02)',
        '--ck-overlay-background': 'rgba(71, 88, 107, 0.24)',
        '--ck-body-color': '#373737',
        '--ck-body-color-muted': '#999999',
        '--ck-body-color-muted-hover': '#111111',
        '--ck-body-background': '#ffffff',
        '--ck-body-background-transparent': 'rgba(255,255,255,0)',
        '--ck-body-background-secondary': '#f6f7f9',
        '--ck-body-background-secondary-hover-background': '#e0e4eb',
        '--ck-body-background-secondary-hover-outline': '#4282FF',
        '--ck-body-background-tertiary': '#F3F4F7',
        '--ck-body-action-color': '#999999',
        '--ck-body-divider': '#f7f6f8',
        '--ck-body-color-danger': '#FF4E4E',
        '--ck-body-color-valid': '#32D74B',
        '--ck-siwe-border': '#F0F0F0',
        /** Disclaimer */
        //'--ck-body-disclaimer-background': '#E3D6C9',
        //'--ck-body-disclaimer-box-shadow': 'none',
        '--ck-body-disclaimer-color': '#AAAAAB',
        '--ck-body-disclaimer-link-color': '#838485',
        '--ck-body-disclaimer-link-hover-color': '#000000',
        /** Tooltips */
        '--ck-tooltip-background': '#ffffff',
        '--ck-tooltip-background-secondary': '#ffffff',
        '--ck-tooltip-color': '#999999',
        '--ck-tooltip-shadow': '0px 2px 10px rgba(0, 0, 0, 0.08)',
        /** Network dropdown */
        '--ck-dropdown-button-color': '#999999',
        '--ck-dropdown-button-box-shadow': '0 0 0 1px rgba(0,0,0,0.01), 0px 0px 7px rgba(0, 0, 0, 0.05)',
        '--ck-dropdown-button-background': '#fff',
        '--ck-dropdown-button-hover-color': '#8B8B8B',
        '--ck-dropdown-button-hover-background': '#F5F7F9',
        /** QR Code */
        '--ck-qr-dot-color': '#000000',
        '--ck-qr-border-color': '#f7f6f8',
        /** Misc. */
        '--ck-focus-color': '#1A88F8',
        '--ck-spinner-color': 'var(--ck-focus-color)',
        '--ck-copytoclipboard-stroke': '#CCCCCC',
    },
    dark: {
        '--ck-connectbutton-font-size': '15px',
        '--ck-connectbutton-color': '#ffffff',
        '--ck-connectbutton-background': '#383838',
        '--ck-connectbutton-background-secondary': '#282828',
        '--ck-connectbutton-hover-background': '#404040',
        '--ck-connectbutton-active-background': '#4D4D4D',
        '--ck-connectbutton-balance-color': '#fff',
        '--ck-connectbutton-balance-background': '#282828',
        '--ck-connectbutton-balance-box-shadow': 'inset 0 0 0 1px var(--ck-connectbutton-background)',
        '--ck-connectbutton-balance-hover-background': '#383838',
        '--ck-connectbutton-balance-hover-box-shadow': 'inset 0 0 0 1px var(--ck-connectbutton-hover-background)',
        '--ck-connectbutton-balance-active-background': '#404040',
        '--ck-connectbutton-balance-active-box-shadow': 'inset 0 0 0 1px var(--ck-connectbutton-active-background)',
        '--ck-primary-button-color': '#ffffff',
        '--ck-primary-button-background': '#383838',
        //'--ck-primary-button-box-shadow': 'inset 0 0 0 1px #3D3D3D',
        '--ck-primary-button-border-radius': '16px',
        '--ck-primary-button-font-weight': '600',
        '--ck-primary-button-hover-background': '#404040',
        //'--ck-primary-button-hover-box-shadow': 'inset 0 0 0 2px rgba(255, 255, 255, 0.4)',
        //'--ck-primary-button-active-background': '#4D4D4D',
        '--ck-primary-button-active-border-radius': '16px',
        '--ck-secondary-button-color': '#ffffff',
        '--ck-secondary-button-background': '#333333',
        '--ck-secondary-button-hover-background': '#4D4D4D',
        /** Tertiary Button */
        '--ck-tertiary-button-background': '#424242',
        '--ck-focus-color': '#1A88F8',
        '--ck-overlay-background': 'rgba(0,0,0,0.4)',
        '--ck-body-color': '#ffffff',
        '--ck-body-color-muted': 'rgba(255, 255, 255, 0.4)',
        '--ck-body-color-muted-hover': 'rgba(255, 255, 255, 0.8)',
        '--ck-body-background': '#2B2B2B',
        '--ck-body-background-transparent': 'rgba(0,0,0,0)',
        '--ck-body-background-secondary': '#333333',
        '--ck-body-background-secondary-hover-background': '#4D4D4D',
        '--ck-body-background-secondary-hover-outline': '#ffffff',
        '--ck-body-background-tertiary': '#333333',
        '--ck-body-action-color': '#808080',
        '--ck-body-divider': '#383838',
        '--ck-body-color-danger': '#FF4E4E',
        '--ck-body-disclaimer-color': '#858585',
        '--ck-body-disclaimer-link-color': '#ADADAD',
        '--ck-body-disclaimer-link-hover-color': '#FFFFFF',
        '--ck-modal-box-shadow': '0px 2px 4px rgba(0, 0, 0, 0.02)',
        '--ck-copytoclipboard-stroke': '#555555',
        '--ck-tooltip-background': '#2B2B2B',
        '--ck-tooltip-background-secondary': '#333333',
        '--ck-tooltip-color': '#999999',
        '--ck-tooltip-shadow': '0px 2px 10px rgba(0, 0, 0, 0.08)',
        /** Network dropdown */
        '--ck-dropdown-button-color': '#6C7381',
        '--ck-spinner-color': 'var(--ck-focus-color)',
        '--ck-qr-dot-color': '#ffffff',
        '--ck-qr-border-color': '#3d3d3d',
    },
};

var web95 = {
    '--ck-font-family': 'Lato',
    '--ck-border-radius': '0px',
    '--ck-connectbutton-color': '#373737',
    '--ck-connectbutton-background': 'linear-gradient(180deg, #F0F0EA 0%, #FFFFFF 50%, #F0F0EA 100%) 100% 100% / 200% 200%, #F5F5F1',
    '--ck-connectbutton-box-shadow': ' 0 0 0 1px #003C74, 2px 2px 0px rgba(255, 255, 255, 0.75), -2px -2px 0px rgba(0, 0, 0, 0.05), inset 0px 0px 0px 0px #97B9EC, inset -1px -2px 2px rgba(0, 0, 0, 0.2)',
    '--ck-connectbutton-border-radius': '4.5px',
    '--ck-connectbutton-hover-color': '#373737',
    '--ck-connectbutton-hover-background': 'linear-gradient(180deg, #F0F0EA 0%, #FFFFFF 50%, #F0F0EA 100%) 100% 0% / 200% 200%, #F5F5F1',
    '--ck-connectbutton-active-background': 'linear-gradient(180deg, #F0F0EA 0%, #FFFFFF 50%, #F0F0EA 100%) 100% 100% / 200% 200%, #F5F5F1',
    '--ck-connectbutton-balance-color': '#373737',
    '--ck-connectbutton-balance-background': '#fff',
    '--ck-connectbutton-balance-box-shadow': '0 0 0 1px #E4E7E7',
    '--ck-connectbutton-balance-hover-box-shadow': '0 0 0 1px #d7dbdb',
    '--ck-connectbutton-balance-active-box-shadow': '0 0 0 1px #bbc0c0',
    '--ck-focus-color': '#1A88F8',
    '--ck-overlay-background': 'rgba(0, 127,  128, 0.8)',
    '--ck-body-color': '#373737',
    '--ck-body-color-muted': '#808080',
    '--ck-body-color-muted-hover': '#111111',
    '--ck-body-background': '#F0EDE2',
    '--ck-body-background-transparent': 'rgba(255,255,255,0)',
    '--ck-body-background-secondary-hover-background': '#FAFAFA',
    '--ck-body-background-secondary-hover-outline': '#4282FF',
    '--ck-body-action-color': '#373737',
    '--ck-body-color-danger': '#FC6464',
    '--ck-body-color-valid': '#32D74B',
    '--ck-body-divider': '#919B9C',
    '--ck-body-divider-box-shadow': '0px 1px 0px #FBFBF8',
    // Primary button
    '--ck-primary-button-background': 'linear-gradient(180deg, #FFFFFF 0%, #F0F0EA 100%), #F5F5F1',
    '--ck-primary-button-box-shadow': 'inset 0 0 0 1px #003C74, 1px 1px 0px rgba(255, 255, 255, 0.75), -1px -1px 0px rgba(0, 0, 0, 0.05), inset 0px 0px 0px 0px #97B9EC, inset -1px -2px 2px rgba(0, 0, 0, 0.2)',
    '--ck-primary-button-border-radius': '6px',
    // Primary button hover
    '--ck-primary-button-hover-box-shadow': 'inset 0 0 0 1px #003C74, 1px 1px 0px rgba(255, 255, 255, 0.75), -1px -1px 0px rgba(0, 0, 0, 0.05), inset 0px 0px 0px 5px #97B9EC, inset -1px -2px 2px rgba(0, 0, 0, 0.2)',
    '--ck-primary-button-hover-border-radius': '6px',
    // Modal
    '--ck-modal-heading-font-weight': 400,
    '--ck-modal-box-shadow': `
    inset 0px -3px 0px #0F37A9,
    inset -2px 0px 0px #0F37A9,
    inset 0px -4px 0px #0D5DDF,
    inset -4px 0px 0px #0D5DDF,
    inset 2px 0px 0px #0453DD,
    inset 0px 2px 0px #044FD1,
    inset 4px 0px 0px #4283EB,
    inset 0px 4px 0px #4283EB
  `,
    '--ck-modal-h1-font-weight': 400,
    // Secondary button
    '--ck-secondary-button-color': '#373737',
    '--ck-secondary-button-border-radius': '6px',
    '--ck-secondary-button-box-shadow': 'inset 0 0 0 1px #003C74, 1px 1px 0px rgba(255, 255, 255, 0.75), -1px -1px 0px rgba(0, 0, 0, 0.05), inset 0px 0px 0px 0px #97B9EC, inset -1px -2px 2px rgba(0, 0, 0, 0.2)',
    '--ck-secondary-button-background': 'linear-gradient(180deg, #FFFFFF 0%, #F0F0EA 100%), #F5F5F1',
    // Secondary button hover
    '--ck-secondary-button-hover-box-shadow': 'inset 0 0 0 1px #003C74, 1px 1px 0px rgba(255, 255, 255, 0.75), -1px -1px 0px rgba(0, 0, 0, 0.05), inset 0px 0px 0px 4px #97B9EC, inset -1px -2px 2px rgba(0, 0, 0, 0.2)',
    '--ck-body-background-secondary': 'rgba(0, 0, 0, 0.1)',
    '--ck-body-background-tertiary': 'linear-gradient(180deg, #FBFBFB 0%, #EFEFEE 100%)',
    '--ck-tertiary-border-radius': '0px',
    '--ck-tertiary-box-shadow': 'inset 0 0 0 1px #919B9C, 1px 1px 2px rgba(0, 0, 0, 0.15), inset -2px -2px 0px #FFFFFF',
    '--ck-body-button-text-align': 'left',
    '--ck-body-button-box-shadow': '0 2px 4px rgba(0, 0, 0, 0.05 )',
    '--ck-body-disclaimer-background': 'linear-gradient(180deg, #FBFBFB 0%, #EFEFEE 100%)',
    '--ck-body-disclaimer-box-shadow': `
    inset 0px -3px 0px #0F37A9,
    inset -2px 0px 0px #0F37A9,
    inset 0px -4px 0px #0D5DDF,
    inset -4px 0px 0px #0D5DDF,
    inset 2px 0px 0px #0453DD,
    inset 4px 0px 0px #4283EB,
    inset 0 1px 0 0 #919B9C`,
    '--ck-body-disclaimer-font-size': '14px',
    '--ck-body-disclaimer-color': '#959594',
    '--ck-body-disclaimer-link-color': '#626262',
    '--ck-body-disclaimer-link-hover-color': '#000000',
    '--ck-qr-dot-color': '#000000',
    '--ck-qr-border-color': '#919B9C',
    '--ck-qr-border-radius': '0',
    '--ck-qr-background': '#FFFFFF',
    '--ck-copytoclipboard-stroke': 'rgba(55, 55, 55, 0.4)',
    '--ck-tooltip-background': 'linear-gradient(270deg, #F7F3E6 7.69%, #F5F7DA 100%)',
    '--ck-tooltip-background-secondary': '#f6f7f9',
    '--ck-tooltip-color': '#000000',
    '--ck-tooltip-shadow': ' 0 0 0 1.5px #2b2622, 0px 2px 10px rgba(0, 0, 0, 0.08)',
    '--ck-spinner-color': 'var(--ck-focus-color)',
    '--ck-dropdown-button-color': '#999999',
    '--ck-dropdown-button-box-shadow': '0 0 0 1px #A0A0A0, 1px 1px 0px rgba(255, 255, 255, 0.75), -1px -1px 0px rgba(0, 0, 0, 0.05), inset -1px -2px 2px rgba(0, 0, 0, 0.2)',
    '--ck-dropdown-button-background': 'linear-gradient(180deg, #FFFFFF 0%, #F0F0EA 100%), #F5F5F1',
    '--ck-dropdown-button-hover-background': 'linear-gradient(0deg, #FFFFFF 0%, #F0F0EA 100%), #F5F5F1',
    '--ck-dropdown-pending-color': '#ACA899',
    '--ck-dropdown-active-color': '#FFFFFF',
    '--ck-dropdown-active-static-color': '#ACA899',
    '--ck-dropdown-active-background': '#3F69BF',
    '--ck-dropdown-active-border-radius': '0',
    '--ck-dropdown-active-inset': '-12px',
    '--ck-dropdown-color': '#ACA899',
    '--ck-dropdown-background': '#FFFFFF',
    '--ck-dropdown-box-shadow': 'inset 0 0 0 1px #ACA899, 2px 2px 7px rgba(0, 0, 0, 0.15)',
    '--ck-dropdown-border-radius': '0',
    '--ck-alert-color': '#ACA899',
    '--ck-alert-background': 'linear-gradient(180deg, #FBFBFB 0%, #EFEFEE 100%)',
    '--ck-alert-box-shadow': 'inset 0 0 0 1px #919B9C, 1px 1px 2px rgba(0, 0, 0, 0.15), inset -2px -2px 0px #FFFFFF',
    '--ck-alert-border-radius': '0',
    '--ck-recent-badge-border-radius': '32px',
    '--ck-recent-badge-top-offset': '0px',
    /** Graphics options for our themes, not to be exposed to devs */
    '--ck-graphic-primary-color': '#333333',
    '--ck-graphic-primary-background': '#FFFFFF',
    /*
    '--ck-graphic-secondary-color': '#7D7D7D',
    '--ck-graphic-secondary-background':
      'linear-gradient(180deg, #FFFFFF 0%, #F0F0EA 100%), #F5F5F1',
    '--ck-graphic-secondary-box-shadow':
      'inset 0 0 0 1px #003C74, 1px 1px 0px rgba(255, 255, 255, 0.75), -1px -1px 0px rgba(0, 0, 0, 0.05), inset 0px 0px 0px 0px #97B9EC, inset -1px -2px 2px rgba(0, 0, 0, 0.2)',
  
    '--ck-graphic-compass-color': '#7D7D7D',
    */
    '--ck-graphic-compass-background': '#FFFFFF',
    /*
    '--ck-graphic-compass-box-shadow':
      'inset 0 0 0 1px #003C74, 1px 1px 0px rgba(255, 255, 255, 0.75), -1px -1px 0px rgba(0, 0, 0, 0.05), inset 0px 0px 0px 0px #97B9EC, inset -1px -2px 2px rgba(0, 0, 0, 0.2)',
  
    '--ck-graphic-globe-background': '#ffffff',
    '--ck-graphic-globe-lines': '#808080',
    '--ck-graphic-globe-box-shadow':
      ' 0 0 0 1px #999A9E, 1px 1px 0px rgba(255, 255, 255, 0.75), -1px -1px 0px rgba(0, 0, 0, 0.05), inset 0px 0px 0px 0px #97B9EC',
      */
    '--ck-siwe-border': '#919B9C',
};

var retro = {
    '--ck-font-family': '"SF Pro Rounded",ui-rounded,"Nunito",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol"',
    '--ck-border-radius': '8px',
    '--ck-connectbutton-font-size': '17px',
    '--ck-connectbutton-color': '#000000',
    '--ck-connectbutton-background': '#ffffff',
    '--ck-connectbutton-box-shadow': '-4px 4px 0px #000000, inset 0 0 0 2px #000000',
    '--ck-connectbutton-border-radius': '8px',
    '--ck-connectbutton-hover-background': '#F3EDE8',
    '--ck-connectbutton-active-box-shadow': '0 0 0 0 #000000, inset 0 0 0 2px #000000',
    '--ck-connectbutton-balance-color': '#000000',
    '--ck-connectbutton-balance-background': '#F3EDE8',
    '--ck-connectbutton-balance-box-shadow': '-4px 4px 0px #000000, inset 0 0 0 2px #000000',
    '--ck-connectbutton-balance-hover-background': '#eee5dd',
    '--ck-connectbutton-balance-connectbutton-box-shadow': '-4px 8px 0px -4px #000000, inset 0 0 0 2px #000000',
    '--ck-connectbutton-balance-connectbutton-border-radius': '0px 8px 8px 0',
    '--ck-primary-button-color': '#373737',
    '--ck-primary-button-background': '#ffffff',
    '--ck-primary-button-box-shadow': 'inset 0 0 0 2px #000000, -4px 4px 0 0 #000000',
    '--ck-primary-button-border-radius': '8px',
    '--ck-primary-button-hover-background': '#F3EDE8',
    '--ck-primary-button-hover-box-shadow': 'inset 0 0 0 2px #000000, -0px 0px 0 0 #000000',
    '--ck-secondary-button-border-radius': '8px',
    '--ck-secondary-button-color': '#373737',
    '--ck-secondary-button-background': '#ffffff',
    '--ck-secondary-button-box-shadow': '-4px 4px 0 0 #000000, inset 0 0 0 2px #000000',
    '--ck-secondary-button-hover-background': '#F3EDE8',
    '--ck-secondary-button-hover-box-shadow': '0 0 0 0 #000000, inset 0 0 0 2px #000000',
    '--ck-focus-color': '#3B99FC',
    '--ck-overlay-background': 'rgba(133, 120, 122, 0.8)',
    '--ck-body-color': '#373737',
    '--ck-body-color-muted': 'rgba(0, 0, 0, 0.5)',
    '--ck-body-color-muted-hover': '#000000',
    '--ck-body-background': '#EBE1D8',
    '--ck-body-background-transparent': 'rgba(255,255,255,0)',
    '--ck-body-background-secondary': 'rgba(0,0,0,0.1)',
    '--ck-body-background-secondary-hover-background': '#4D4D4D',
    '--ck-body-background-secondary-hover-outline': '#373737',
    '--ck-body-background-tertiary': '#ffffff',
    '--ck-tertiary-border-radius': '8px',
    '--ck-tertiary-box-shadow': '-4px 4px 0 0 #000000, inset 0 0 0 2px #000000',
    '--ck-body-action-color': '#373737',
    '--ck-body-divider': '#373737',
    '--ck-body-color-danger': '#FF4E4E',
    '--ck-body-disclaimer-background': '#E3D6C9',
    '--ck-body-disclaimer-box-shadow': '-4px 4px 0 0 #000000, inset 2px 0 0 0 #000000, inset -2px 0 0 0 #000000, inset 0 -2px 0 0 #000000',
    '--ck-body-disclaimer-font-weight': '500',
    '--ck-body-disclaimer-color': '#888079',
    '--ck-body-disclaimer-link-color': '#5B5650',
    '--ck-body-disclaimer-link-hover-color': '#000000',
    '--ck-modal-box-shadow': '-10px 10px 0px #000000, inset 0 0 0 2px #000000',
    '--ck-copytoclipboard-stroke': '#555555',
    '--ck-tooltip-border-radius': '8px',
    '--ck-tooltip-color': '#373737',
    '--ck-tooltip-background': '#ffffff',
    '--ck-tooltip-background-secondary': '#EBE1D8',
    '--ck-tooltip-shadow': '-6px 6px 0 0 #000000, 0 0 0 2px #000000',
    '--ck-spinner-color': '#1A88F8',
    '--ck-dropdown-button-color': '#000',
    '--ck-dropdown-button-box-shadow': '-2px 2px 0 2px #000000,  0 0 0 2px #000000',
    '--ck-dropdown-button-background': '#ffffff',
    '--ck-dropdown-button-hover-background': '#F3EDE8',
    '--ck-dropdown-button-hover-box-shadow': '-2px 2px 0 0 #000000,  0 0 0 2px #000000',
    '--ck-dropdown-pending-color': 'rgba(0, 0, 0, 0.5)',
    '--ck-dropdown-active-color': '#FFFFFF',
    '--ck-dropdown-active-static-color': 'rgba(0, 0, 0, 0.5)',
    '--ck-dropdown-active-background': '#3B99FC',
    '--ck-dropdown-active-box-shadow': 'inset 0 0 0 2px #000000',
    '--ck-dropdown-active-border-radius': '8px',
    '--ck-dropdown-color': 'rgba(0, 0, 0, 0.5)',
    '--ck-dropdown-background': '#FFFFFF',
    '--ck-dropdown-box-shadow': '-4px 4px 0 0 #000000, inset 0 0 0 2px #000000',
    '--ck-dropdown-border-radius': '8px',
    '--ck-alert-color': 'rgba(0, 0, 0, 0.5)',
    '--ck-alert-background': ' #F5F5F5',
    '--ck-alert-border-radius': '8px',
    '--ck-qr-border-radius': '8px',
    '--ck-qr-dot-color': '#000000',
    '--ck-qr-border-color': '#000000',
    '--ck-qr-background': '#ffffff',
    '--ck-recent-badge-border-radius': '32px',
    '--ck-recent-badge-box-shadow': 'inset 0 0 0 2px currentColor',
    /** Graphics options for our themes, not to be exposed to devs */
    '--ck-graphic-primary-color': '#000000',
    '--ck-graphic-primary-background': '#ffffff',
    /*
    '--ck-graphic-secondary-color': '#ffffff',
    '--ck-graphic-secondary-background': '#808080',
    '--ck-graphic-secondary-box-shadow':
      '-4px 4px 0 2px #000000, 0 0 0 2px #000000',
  
    '--ck-graphic-compass-color': '#ffffff',*/
    '--ck-graphic-compass-background': '#FFFFFF',
    /*
    '--ck-graphic-compass-box-shadow':
      '-4px 4px 0 0 #000000, inset 0 0 0 2px #000000',
  
    '--ck-graphic-globe-background': '#ffffff',
    '--ck-graphic-globe-lines': '#808080',
    '--ck-graphic-globe-box-shadow': '6px -6px 0 2px #000000, 0 0 0 2px #000000',
    */
    '--ck-siwe-border': '#8E8985',
};

var soft = {
    '--ck-border-radius': '12px',
    '--ck-connectbutton-font-size': '17px',
    '--ck-connectbutton-border-radius': '12px',
    '--ck-connectbutton-color': '#414451',
    '--ck-connectbutton-background': '#ffffff',
    '--ck-connectbutton-box-shadow': 'inset 0 0 0 1px #E9EAEC, 0px 2px 4px rgba(0, 0, 0, 0.02)',
    '--ck-connectbutton-hover-background': '#F6F7F9',
    '--ck-connectbutton-hover-box-shadow': 'inset 0 0 0 1px #E9EAEC, 0px 2px 4px rgba(0, 0, 0, 0.02)',
    '--ck-connectbutton-balance-color': '#373737',
    '--ck-connectbutton-balance-background': '#F6F7F9',
    '--ck-connectbutton-balance-box-shadow': 'none',
    '--ck-connectbutton-balance-hover-background': '#f1f1f3',
    '--ck-primary-button-border-radius': '12px',
    '--ck-primary-button-color': '#414451',
    '--ck-primary-button-background': '#ffffff',
    '--ck-primary-button-box-shadow': '0 0 0 1px #E9EAEC, 0px 2px 4px rgba(0, 0, 0, 0.02)',
    '--ck-primary-button-hover-background': '#F6F7F9',
    '--ck-primary-button-hover-box-shadow': '0 0 0 1px #D9DBDD, 0px 0 0 rgba(0, 0, 0, 0.02)',
    '--ck-secondary-button-border-radius': '12px',
    '--ck-secondary-button-color': '#414451',
    '--ck-secondary-button-background': '#ffffff',
    '--ck-secondary-button-box-shadow': '0 0 0 1px #E9EAEC, 0px 2px 4px rgba(0, 0, 0, 0.02)',
    '--ck-secondary-button-hover-background': '#F6F7F9',
    '--ck-secondary-button-hover-box-shadow': '0 0 0 1px #D9DBDD, 0px 0 0 rgba(0, 0, 0, 0.02)',
    '--ck-focus-color': '#1A88F8',
    '--ck-modal-box-shadow': `0px 3px 16px rgba(0, 0, 0, 0.08)`,
    '--ck-body-color': '#414451',
    '--ck-body-color-muted': '#9196A1',
    '--ck-body-color-muted-hover': '#000000',
    '--ck-body-background': '#ffffff',
    '--ck-body-background-transparent': 'rgba(255,255,255,0)',
    '--ck-body-background-secondary': '#f6f7f9',
    '--ck-body-background-secondary-hover-background': '#e0e4eb',
    '--ck-body-background-secondary-hover-outline': '#4282FF',
    '--ck-body-background-tertiary': '#F6F8FA',
    '--ck-tertiary-border-radius': '13px',
    '--ck-tertiary-box-shadow': 'inset 0 0 0 1px rgba(0, 0, 0, 0.04)',
    '--ck-body-action-color': '#999999',
    '--ck-body-divider': '#f7f6f8',
    '--ck-body-color-danger': '#FF4E4E',
    '--ck-body-color-valid': '#32D74B',
    '--ck-body-disclaimer-background': '#F9FAFA',
    '--ck-body-disclaimer-color': '#AFB1B6',
    '--ck-body-disclaimer-link-color': '#787B84',
    '--ck-body-disclaimer-link-hover-color': '#000000',
    '--ck-copytoclipboard-stroke': '#CCCCCC',
    '--ck-tooltip-background': '#ffffff',
    '--ck-tooltip-background-secondary': '#ffffff',
    '--ck-tooltip-color': '#999999',
    '--ck-tooltip-shadow': '0px 2px 10px rgba(0, 0, 0, 0.08)',
    '--ck-spinner-color': 'var(--ck-focus-color)',
    '--ck-dropdown-button-color': '#999999',
    '--ck-dropdown-button-box-shadow': '0 0 0 1px rgba(0, 0, 0, 0.01), 0px 0px 7px rgba(0, 0, 0, 0.05)',
    '--ck-dropdown-button-background': '#fff',
    '--ck-dropdown-button-hover-color': '#8B8B8B',
    '--ck-dropdown-button-hover-background': '#E7E7E7',
    '--ck-dropdown-color': 'rgba(55, 55, 55, 0.4)',
    '--ck-dropdown-box-shadow': '0px 2px 15px rgba(0, 0, 0, 0.15)',
    '--ck-alert-color': '#9196A1',
    '--ck-alert-background': '#F6F8FA',
    '--ck-alert-box-shadow': 'inset 0 0 0 1px rgba(0, 0, 0, 0.04)',
    '--ck-alert-border-radius': '8px',
    '--ck-qr-border-radius': '12px',
    '--ck-qr-dot-color': '#2E3138',
    '--ck-qr-border-color': '#E9EAEC',
    '--ck-siwe-border': '#EAEBED',
};

var midnight = {
    '--ck-font-family': '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol"',
    '--ck-border-radius': '10px',
    '--ck-connectbutton-font-size': '17px',
    '--ck-connectbutton-border-radius': '8px',
    '--ck-connectbutton-color': '#ffffff',
    '--ck-connectbutton-background': '#313235',
    '--ck-connectbutton-box-shadow': 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
    '--ck-connectbutton-hover-background': '#414144',
    '--ck-connectbutton-active-background': '#4C4D4F',
    '--ck-connectbutton-balance-color': '#ffffff',
    '--ck-connectbutton-balance-background': '#1F2023',
    '--ck-connectbutton-balance-box-shadow': 'inset 0 0 0 1px #313235',
    '--ck-connectbutton-balance-hover-background': '#313235',
    '--ck-connectbutton-balance-active-background': '#414144',
    '--ck-primary-button-border-radius': '8px',
    '--ck-primary-button-color': '#ffffff',
    '--ck-primary-button-background': 'rgba(255, 255, 255, 0.08)',
    '--ck-primary-button-box-shadow': 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
    '--ck-primary-button-hover-background': 'rgba(255, 255, 255, 0.2)',
    '--ck-secondary-button-border-radius': '8px',
    '--ck-secondary-button-color': '#ffffff',
    '--ck-secondary-button-background': '#363638',
    '--ck-secondary-button-box-shadow': 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
    '--ck-secondary-button-hover-background': '#3c3c3e',
    '--ck-overlay-background': 'rgba(0,0,0,0.4)',
    '--ck-modal-box-shadow': `inset 0 0 0 1px #38393C, 0px 2px 4px rgba(0, 0, 0, 0.02)`,
    '--ck-focus-color': '#1A88F8',
    '--ck-body-color': '#ffffff',
    '--ck-body-color-muted': '#8B8F97',
    '--ck-body-color-muted-hover': '#ffffff',
    '--ck-body-background': '#1F2023',
    '--ck-body-background-transparent': 'rgba(31, 32, 35, 0)',
    '--ck-body-background-secondary': '#313235',
    '--ck-body-background-secondary-hover-background': '#e0e4eb',
    '--ck-body-background-secondary-hover-outline': 'rgba(255, 255, 255, 0.02)',
    '--ck-body-background-tertiary': '#313235',
    '--ck-tertiary-border-radius': '12px',
    '--ck-tertiary-box-shadow': 'inset 0 0 0 1px rgba(255, 255, 255, 0.02)',
    '--ck-body-action-color': '#8B8F97',
    '--ck-body-divider': 'rgba(255,255,255,0.1)',
    '--ck-body-color-danger': '#FF4E4E',
    '--ck-body-color-valid': '#32D74B',
    '--ck-body-disclaimer-background': '#2B2D31',
    '--ck-body-disclaimer-box-shadow': 'none',
    '--ck-body-disclaimer-color': '#808183',
    '--ck-body-disclaimer-link-color': '#AAABAD',
    '--ck-body-disclaimer-link-hover-color': '#ffffff',
    '--ck-copytoclipboard-stroke': '#CCCCCC',
    '--ck-tooltip-background': '#1F2023',
    '--ck-tooltip-background-secondary': '#1F2023',
    '--ck-tooltip-color': '#ffffff',
    '--ck-tooltip-shadow': ' 0 0 0 1px rgba(255, 255, 255, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.02)',
    '--ck-spinner-color': 'var(--ck-focus-color)',
    '--ck-dropdown-button-color': '#6C7381',
    '--ck-dropdown-button-box-shadow': 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
    '--ck-dropdown-button-background': '#313235',
    '--ck-dropdown-pending-color': '#8B8F97',
    '--ck-dropdown-active-color': '#FFF',
    '--ck-dropdown-active-static-color': '#FFF',
    '--ck-dropdown-active-background': 'rgba(255, 255, 255, 0.07)',
    '--ck-dropdown-color': '#8B8F97',
    '--ck-dropdown-background': '#313235',
    '--ck-dropdown-box-shadow': 'inset 0 0 0 1px rgba(255, 255, 255, 0.03)',
    '--ck-dropdown-border-radius': '8px',
    '--ck-alert-color': '#8B8F97',
    '--ck-alert-background': '#404145',
    '--ck-alert-box-shadow': 'inset 0 0 0 1px rgba(255, 255, 255, 0.02)',
    '--ck-qr-border-radius': '12px',
    '--ck-qr-dot-color': '#ffffff',
    '--ck-qr-border-color': 'rgba(255,255,255,0.1)',
    '--ck-recent-badge-border-radius': '32px',
};

var minimal = {
    '--ck-font-family': '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol"',
    '--ck-border-radius': '0px',
    '--ck-connectbutton-font-size': '17px',
    '--ck-connectbutton-border-radius': '0px',
    '--ck-connectbutton-color': '#414451',
    '--ck-connectbutton-background': '#ffffff',
    '--ck-connectbutton-box-shadow': 'inset 0 0 0 1px #EBEBEB',
    '--ck-connectbutton-hover-color': '#111',
    '--ck-connectbutton-hover-box-shadow': 'inset 0 0 0 1px #111',
    '--ck-connectbutton-balance-color': '#111111',
    '--ck-connectbutton-balance-background': '#F7F7F7',
    '--ck-connectbutton-balance-box-shadow': 'inset 0 0 0 1px #F7F7F7',
    '--ck-connectbutton-balance-hover-background': '#f1f1f3',
    '--ck-connectbutton-balance-hover-box-shadow': 'inset 0 0 0 1px #111',
    '--ck-primary-button-border-radius': '0px',
    '--ck-primary-button-color': '#111111',
    '--ck-primary-button-background': '#ffffff',
    '--ck-primary-button-box-shadow': 'inset 0 0 0 1px #EBEBEB',
    '--ck-primary-button-hover-box-shadow': 'inset 0 0 0 1px #111111',
    '--ck-secondary-button-border-radius': '0px',
    '--ck-secondary-button-color': '#111111',
    '--ck-secondary-button-background': '#ffffff',
    '--ck-secondary-button-box-shadow': 'inset 0 0 0 1px #EBEBEB',
    '--ck-secondary-button-hover-box-shadow': 'inset 0 0 0 1px #111111',
    '--ck-dropdown-button-color': '#999999',
    '--ck-dropdown-button-box-shadow': '0 0 0 1px rgba(0, 0, 0, 0.01), 0px 0px 7px rgba(0, 0, 0, 0.05)',
    '--ck-dropdown-button-background': '#fff',
    '--ck-dropdown-button-hover-color': '#8B8B8B',
    '--ck-dropdown-button-hover-background': '#E7E7E7',
    '--ck-focus-color': '#1A88F8',
    '--ck-modal-box-shadow': `0px 3px 16px rgba(0, 0, 0, 0.08)`,
    '--ck-body-color': '#111111',
    '--ck-body-color-muted': '#A0A0A0',
    '--ck-body-color-muted-hover': '#000000',
    '--ck-body-background': '#ffffff',
    '--ck-body-background-transparent': 'rgba(255,255,255,0)',
    '--ck-body-background-secondary': '#f6f7f9',
    '--ck-body-background-secondary-hover-background': '#e0e4eb',
    '--ck-body-background-secondary-hover-outline': '#4282FF',
    '--ck-body-background-tertiary': '#ffffff',
    '--ck-tertiary-border-radius': '0px',
    '--ck-tertiary-box-shadow': 'inset 0 0 0 1px rgba(0, 0, 0, 0.04)',
    '--ck-body-action-color': '#A0A0A0',
    '--ck-body-divider': '#EBEBEB',
    '--ck-body-color-danger': '#FF4E4E',
    '--ck-body-color-valid': '#32D74B',
    '--ck-body-disclaimer-background': '#FAFAFA',
    '--ck-body-disclaimer-box-shadow': 'inset 0 1px 0 0 #ECECEC',
    '--ck-body-disclaimer-color': '#9D9D9D',
    '--ck-body-disclaimer-link-color': '#6E6E6E',
    '--ck-body-disclaimer-link-hover-color': '#000000',
    '--ck-copytoclipboard-stroke': '#CCCCCC',
    '--ck-tooltip-border-radius': '0px',
    '--ck-tooltip-background': '#ffffff',
    '--ck-tooltip-background-secondary': '#ffffff',
    '--ck-tooltip-color': '#999999',
    '--ck-tooltip-shadow': '0px 2px 10px rgba(0, 0, 0, 0.08)',
    '--ck-spinner-color': 'var(--ck-focus-color)',
    '--ck-dropdown-active-border-radius': '0',
    '--ck-dropdown-box-shadow': '0px 2px 15px rgba(0, 0, 0, 0.15)',
    '--ck-dropdown-border-radius': '0',
    '--ck-alert-color': 'rgba(17, 17, 17, 0.4)',
    '--ck-alert-background': '#fff',
    '--ck-alert-box-shadow': 'inset 0 0 0 1px #EBEBEB',
    '--ck-alert-border-radius': '0',
    '--ck-qr-border-radius': '0px',
    '--ck-qr-dot-color': '#111111',
    '--ck-qr-border-color': '#EBEBEB',
    '--ck-modal-h1-font-weight': '400',
    '--ck-modal-heading-font-weight': '400',
    '--ck-primary-button-font-weight': '400',
    '--ck-recent-badge-top-offset': '0px',
    /** Graphics options for our themes, not to be exposed to devs */
    /**
    '--ck-graphic-primary-color': '#111111',
    '--ck-graphic-primary-background': '#ffffff',
    '--ck-graphic-primary-box-shadow': 'inset 0 0 0 1px #EBEBEB',
  
    '--ck-graphic-secondary-color': '#DCDDDE',
    '--ck-graphic-secondary-background': '#ffffff',
    '--ck-graphic-secondary-box-shadow': 'inset 0 0 0 1px #EBEBEB',
  
    '--ck-graphic-compass-color': '#111111',
    '--ck-graphic-compass-background': '#ffffff',
    '--ck-graphic-compass-box-shadow': 'inset 0 0 0 1px #EBEBEB',
  
    '--ck-graphic-globe-background': '#D9D9D9',
    '--ck-graphic-globe-lines': '#ffffff',
    '--ck-graphic-globe-box-shadow': 'inset 0 0 0 1px #EBEBEB',
    */
    '--ck-siwe-border': '#EBEBEB',
};

var rounded = {
    '--ck-font-family': '"Nunito",ui-rounded,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol"',
    '--ck-border-radius': '24px',
    '--ck-connectbutton-font-size': '17px',
    '--ck-connectbutton-font-weight': '700',
    '--ck-connectbutton-border-radius': '14px',
    '--ck-connectbutton-color': '#000000',
    '--ck-connectbutton-background': '#ffffff',
    '--ck-connectbutton-box-shadow': 'inset 0 0 0 2px #DFE4EC, 0 2px 0 0 #DFE4EC, 0px 2px 4px rgba(0, 0, 0, 0.02)',
    '--ck-connectbutton-hover-background': '#F9FAFB',
    '--ck-connectbutton-balance-color': '#414451',
    '--ck-connectbutton-balance-background': '#F9FAFB',
    '--ck-connectbutton-balance-box-shadow': '0 2px 0 0 #DFE4EC, 0px 2px 4px rgba(0, 0, 0, 0.02)',
    '--ck-connectbutton-balance-hover-background': '#F5F7F9',
    '--ck-connectbutton-balance-hover-box-shadow': '0 2px 0 0 #DFE4EC, 0px 2px 4px rgba(0, 0, 0, 0.02)',
    '--ck-connectbutton-balance-active-box-shadow': '0 0 0 0 #DFE4EC, 0px 2px 4px rgba(0, 0, 0, 0.02)',
    '--ck-connectbutton-active-background': '#F5F7F9',
    '--ck-connectbutton-active-box-shadow': 'inset 0 0 0 2px #CFD7E2, 0 0px 0 0 #CFD7E2, 0px 2px 4px rgba(0, 0, 0, 0.02)',
    '--ck-primary-button-border-radius': '18px',
    '--ck-primary-button-color': '#000000',
    '--ck-primary-button-background': '#ffffff',
    '--ck-primary-button-box-shadow': 'inset 0 0 0 2px #DFE4EC, inset  0 -4px 0 0 #DFE4EC, 0px 2px 4px rgba(0, 0, 0, 0.02)',
    '--ck-primary-button-hover-background': '#F5F7F9',
    '--ck-primary-button-hover-box-shadow': 'inset 0 0 0 2px #DFE4EC, inset  0 -2px 0 0 #DFE4EC, 0px 2px 4px rgba(0, 0, 0, 0.02)',
    '--ck-secondary-button-border-radius': '16px',
    '--ck-secondary-button-color': '#000000',
    '--ck-secondary-button-background': '#ffffff',
    '--ck-secondary-button-box-shadow': 'inset 0 0 0 2px #DFE4EC, inset  0 -4px 0 0 #DFE4EC, 0px 2px 4px rgba(0, 0, 0, 0.02)',
    '--ck-secondary-button-hover-background': '#F5F7F9',
    '--ck-secondary-button-hover-box-shadow': 'inset 0 0 0 2px #DFE4EC, inset  0 -2px 0 0 #DFE4EC, 0px 2px 4px rgba(0, 0, 0, 0.02)',
    '--ck-focus-color': '#1A88F8',
    '--ck-modal-box-shadow': `0px 3px 16px rgba(0, 0, 0, 0.08)`,
    '--ck-body-color': '#000000',
    '--ck-body-color-muted': '#93989F',
    '--ck-body-color-muted-hover': '#000000',
    '--ck-body-background': '#ffffff',
    '--ck-body-background-transparent': 'rgba(255,255,255,0)',
    '--ck-body-background-secondary': '#f6f7f9',
    '--ck-body-background-secondary-hover-background': '#e0e4eb',
    '--ck-body-background-secondary-hover-outline': '#4282FF',
    '--ck-body-background-tertiary': '#ffffff',
    '--ck-tertiary-border-radius': '22px',
    '--ck-tertiary-box-shadow': 'inset 0 0 0 2px #DFE4EC, 0px 2px 4px rgba(0, 0, 0, 0.02)',
    '--ck-body-action-color': '#93989F',
    '--ck-body-divider': '#DFE4EC',
    '--ck-body-color-danger': '#FF4E4E',
    '--ck-body-color-valid': '#32D74B',
    '--ck-body-disclaimer-background': '#F9FAFB',
    '--ck-body-disclaimer-font-size': '14px',
    '--ck-body-disclaimer-font-weight': '700',
    '--ck-body-disclaimer-color': '#959697',
    '--ck-body-disclaimer-link-color': '#646464',
    '--ck-body-disclaimer-link-hover-color': '#000000',
    '--ck-copytoclipboard-stroke': '#CCCCCC',
    '--ck-tooltip-background': '#ffffff',
    '--ck-tooltip-background-secondary': '#ffffff',
    '--ck-tooltip-color': '#999999',
    '--ck-tooltip-shadow': ' 0 0 0 2px #DFE4EC, 0px 2px 4px rgba(0, 0, 0, 0.02)',
    '--ck-spinner-color': 'var(--ck-focus-color)',
    '--ck-dropdown-button-color': '#999999',
    '--ck-dropdown-button-box-shadow': '0 0 0 2px #DFE4EC,  0 2px 0 2px #DFE4EC, 0px 2px 4px rgba(0, 0, 0, 0.02)',
    '--ck-dropdown-button-background': '#fff',
    '--ck-dropdown-button-hover-color': '#8B8B8B',
    '--ck-dropdown-button-hover-background': '#F5F7F9',
    '--ck-dropdown-pending-color': '#848D9A',
    '--ck-dropdown-active-color': '#000000',
    '--ck-dropdown-active-static-color': '#848D9A',
    '--ck-dropdown-active-background': '#F5F7F9',
    '--ck-dropdown-color': '#848D9A',
    '--ck-dropdown-background': '#FFFFFF',
    '--ck-dropdown-box-shadow': '0px 2px 15px rgba(0, 0, 0, 0.15)',
    '--ck-dropdown-border-radius': '16px',
    '--ck-alert-color': '#848D9A',
    '--ck-alert-background': '#F5F7F9',
    '--ck-qr-border-radius': '24px',
    '--ck-qr-dot-color': '#111111',
    '--ck-qr-border-color': '#DFE4EC',
    '--ck-modal-h1-font-weight': '700',
    '--ck-modal-heading-font-weight': '700',
    '--ck-primary-button-font-weight': '700',
    '--ck-recent-badge-box-shadow': 'inset 0 0 0 2px currentColor',
    '--ck-recent-badge-top-offset': '0px',
    /** Graphics options for our themes, not to be exposed to devs */
    /*
    '--ck-graphic-primary-color': '#6C7381',
    '--ck-graphic-primary-background': '#ffffff',
    '--ck-graphic-primary-box-shadow': 'inset 0 0 0 2px #DFE4EC',
  
    '--ck-graphic-secondary-color': '#DFE4EC',
    '--ck-graphic-secondary-background': '#ffffff',
    '--ck-graphic-secondary-box-shadow': 'inset 0 0 0 2px #DFE4EC',
  
    '--ck-graphic-compass-color': '#ffffff',
    '--ck-graphic-compass-background': '#6C7381',
    '--ck-graphic-compass-box-shadow': 'inset 0 0 0 2px rgba(0,0,0,0.1)',
  
    '--ck-graphic-globe-background':
      'radial-gradient(84.37% 84.37% at 50% 15.63%, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(180deg, #DFE4EC 0%, #DFE4EC 114.06%), #DFE4EC',
    '--ck-graphic-globe-lines': '#ffffff',
    '--ck-graphic-globe-box-shadow': 'inset 0 0 0 2px #DFE4EC',
    */
    '--ck-siwe-border': '#DFE4EC',
};

var nouns = {
    '--ck-font-family': '"PT Root UI",ui-rounded,"Nunito",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol"',
    '--ck-border-radius': '24px',
    '--ck-connectbutton-font-size': '16px',
    '--ck-connectbutton-font-weight': '700',
    '--ck-connectbutton-border-radius': '10px',
    '--ck-connectbutton-color': '#151C3B',
    '--ck-connectbutton-background': '#ffffff',
    '--ck-connectbutton-box-shadow': 'inset 0 0 0 1px #D6D8E1',
    '--ck-connectbutton-hover-background': '#E9EBF3',
    '--ck-connectbutton-hover-box-shadow': 'inset 0 0 0 1px #D4D8E8',
    '--ck-connectbutton-active-background': '#D4D8E8',
    '--ck-connectbutton-active-box-shadow': 'inset 0 0 0 1px #D4D8E8',
    '--ck-connectbutton-balance-color': '#373737',
    '--ck-connectbutton-balance-background': '#F6F7F9',
    '--ck-connectbutton-balance-box-shadow': 'none',
    '--ck-connectbutton-balance-hover-background': '#f1f1f3',
    '--ck-primary-button-border-radius': '16px',
    '--ck-primary-button-color': '#151C3B',
    '--ck-primary-button-background': '#ffffff',
    '--ck-primary-button-font-weight': '700',
    '--ck-primary-button-hover-background': '#DEE1ED',
    '--ck-secondary-button-border-radius': '16px',
    '--ck-secondary-button-color': '#151C3B',
    '--ck-secondary-button-background': '#ffffff',
    '--ck-secondary-button-font-weight': '700',
    '--ck-secondary-button-hover-background': '#DEE1ED',
    '--ck-focus-color': '#1A88F8',
    '--ck-modal-box-shadow': `0px 2px 4px rgba(0, 0, 0, 0.02)`,
    '--ck-overlay-background': 'rgba(213, 215, 225, 0.8)',
    '--ck-overlay-backdrop-filter': 'blur(6px)',
    '--ck-body-color': '#151C3B',
    '--ck-body-color-muted': '#757A8E',
    '--ck-body-color-muted-hover': '#000000',
    '--ck-body-background': '#F4F4F8',
    '--ck-body-background-transparent': 'rgba(255,255,255,0)',
    '--ck-body-background-secondary': '#E9E9F1',
    '--ck-body-background-secondary-hover-background': '#e0e4eb',
    '--ck-body-background-tertiary': '#E9E9F1',
    '--ck-tertiary-border-radius': '24px',
    '--ck-body-action-color': '#79809C',
    '--ck-body-divider': '#D9DBE3',
    '--ck-body-color-danger': '#FF4E4E',
    '--ck-body-color-valid': '#32D74B',
    '--ck-body-disclaimer-background': '#F9FAFA',
    '--ck-body-disclaimer-color': '#AFB1B6',
    '--ck-body-disclaimer-link-color': '#787B84',
    '--ck-body-disclaimer-link-hover-color': '#000000',
    '--ck-copytoclipboard-stroke': '#79809C',
    '--ck-tooltip-background': '#ffffff',
    '--ck-tooltip-background-secondary': '#ffffff',
    '--ck-tooltip-color': '#999999',
    '--ck-tooltip-shadow': '0px 2px 10px rgba(0, 0, 0, 0.08)',
    '--ck-spinner-color': 'var(--ck-focus-color)',
    '--ck-dropdown-button-color': '#999999',
    '--ck-dropdown-button-box-shadow': '0 0 0 1px rgba(0, 0, 0, 0.01), 0px 0px 7px rgba(0, 0, 0, 0.05)',
    '--ck-dropdown-button-background': '#fff',
    '--ck-dropdown-button-hover-color': '#8B8B8B',
    '--ck-dropdown-button-hover-background': '#DEE1ED',
    '--ck-dropdown-button-hover-box-shadow': '0px 0px 7px rgba(0, 0, 0, 0.05)',
    '--ck-dropdown-color': '#757A8E',
    '--ck-dropdown-box-shadow': '0 0 0 1px rgba(0, 0, 0, 0.01), 0px 0px 7px rgba(0, 0, 0, 0.05)',
    '--ck-alert-color': '#9196A1',
    '--ck-alert-background': '#F6F8FA',
    '--ck-alert-box-shadow': 'inset 0 0 0 1px rgba(0, 0, 0, 0.04)',
    '--ck-alert-border-radius': '8px',
    '--ck-qr-border-radius': '24px',
    '--ck-qr-dot-color': '#000000',
    '--ck-qr-background': '#ffffff',
    '--ck-recent-badge-color': '#79809C',
    '--ck-recent-badge-background': '#F4F4F8',
    '--ck-recent-badge-box-shadow': 'none',
    '--ck-siwe-border': '#DFE4EC',
    '--ck-graphic-primary-background': '#fff',
    '--ck-graphic-compass-background': '#fff',
    '--ck-graphic-primary-box-shadow': '0px 2.94737px 14.7368px rgba(0, 0, 0, 0.1)',
    '--ck-graphic-compass-box-shadow': '0px 2px 9px rgba(0, 0, 0, 0.15)',
};

var predefinedThemes = { base, web95, retro, soft, midnight, minimal, rounded, nouns };

/**
 * Theme variables for the modal
 */
const themeGlobals = {
    default: {
        '--ck-font-family': `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica,
    'Apple Color Emoji', Arial, sans-serif, 'Segoe UI Emoji',
    'Segoe UI Symbol'`,
        '--ck-border-radius': '20px',
        '--ck-secondary-button-border-radius': '16px',
    },
    graphics: {
        light: {
            '--ck-graphic-wave-stop-01': '#E8F17D',
            '--ck-graphic-wave-stop-02': '#A8ECDE',
            '--ck-graphic-wave-stop-03': '#7AA1F2',
            '--ck-graphic-wave-stop-04': '#DEA1E8',
            '--ck-graphic-wave-stop-05': '#F46D98',
            '--ck-graphic-scaniconwithlogos-01': '#4E4E4E',
            '--ck-graphic-scaniconwithlogos-02': '#272727',
            '--ck-graphic-scaniconwithlogos-03': '#F8D74A',
            '--ck-graphic-scaniconwithlogos-04': '#F6F7F9',
            '--ck-chain-ethereum-01': '#25292E',
            '--ck-chain-ethereum-02': '#fff',
            '--ck-chain-ethereum-03': '#DFE0E0',
        },
        dark: {
            '--ck-graphic-wave-stop-01': '#E8F17D',
            '--ck-graphic-wave-stop-02': '#A8ECDE',
            '--ck-graphic-wave-stop-03': '#7AA1F2',
            '--ck-graphic-wave-stop-04': '#DEA1E8',
            '--ck-graphic-wave-stop-05': '#F46D98',
            '--ck-graphic-scaniconwithlogos-01': '#AFAFAF',
            '--ck-graphic-scaniconwithlogos-02': '#696969',
            '--ck-graphic-scaniconwithlogos-03': '#F8D74A',
            '--ck-graphic-scaniconwithlogos-04': '#3D3D3D',
            //'--ck-chain-ethereum-01': '#fff',
            //'--ck-chain-ethereum-02': '#000',
            //'--ck-chain-ethereum-03': '#000',
        },
    },
    ens: {
        light: {
            '--ck-ens-01-start': '#FF3B30',
            '--ck-ens-01-stop': '#FF9500',
            '--ck-ens-02-start': '#FF9500',
            '--ck-ens-02-stop': '#FFCC00',
            '--ck-ens-03-start': '#FFCC00',
            '--ck-ens-03-stop': '#34C759',
            '--ck-ens-04-start': '#5856D6',
            '--ck-ens-04-stop': '#AF52DE',
            '--ck-ens-05-start': '#5AC8FA',
            '--ck-ens-05-stop': '#007AFF',
            '--ck-ens-06-start': '#007AFF',
            '--ck-ens-06-stop': '#5856D6',
            '--ck-ens-07-start': '#5856D6',
            '--ck-ens-07-stop': '#AF52DE',
            '--ck-ens-08-start': '#AF52DE',
            '--ck-ens-08-stop': '#FF2D55',
        },
        dark: {
            '--ck-ens-01-start': '#FF453A',
            '--ck-ens-01-stop': '#FF9F0A',
            '--ck-ens-02-start': '#FF9F0A',
            '--ck-ens-02-stop': '#FFD60A',
            '--ck-ens-03-start': '#FFD60A',
            '--ck-ens-03-stop': '#32D74B',
            '--ck-ens-04-start': '#32D74B',
            '--ck-ens-04-stop': '#64D2FF',
            '--ck-ens-05-start': '#64D2FF',
            '--ck-ens-05-stop': '#0A84FF',
            '--ck-ens-06-start': '#0A84FF',
            '--ck-ens-06-stop': '#5E5CE6',
            '--ck-ens-07-start': '#5E5CE6',
            '--ck-ens-07-stop': '#BF5AF2',
            '--ck-ens-08-start': '#BF5AF2',
            '--ck-ens-08-stop': '#FF2D55',
        },
    },
    brand: {
        '--ck-family-brand': '#1A88F8',
        '--ck-brand-walletConnect': '#3B99FC',
        '--ck-brand-coinbaseWallet': '#0052FF',
        '--ck-brand-metamask': '#f6851b',
        '--ck-brand-metamask-01': '#F6851B',
        '--ck-brand-metamask-02': '#E2761B',
        '--ck-brand-metamask-03': '#CD6116',
        '--ck-brand-metamask-04': '#161616',
        '--ck-brand-metamask-05': '#763D16',
        '--ck-brand-metamask-06': '#D7C1B3',
        '--ck-brand-metamask-07': '#C0AD9E',
        '--ck-brand-metamask-08': '#E4761B',
        '--ck-brand-metamask-09': '#233447',
        '--ck-brand-metamask-10': '#E4751F',
        '--ck-brand-metamask-11': '#FEF5E7',
        '--ck-brand-metamask-12': '#E3C8AB',
        '--ck-brand-trust-01': '#3375BB',
        '--ck-brand-trust-02': '#ffffff',
        '--ck-brand-trust-01b': '#ffffff',
        '--ck-brand-trust-02b': '#3375BB',
        '--ck-brand-argent': '#f36a3d',
        '--ck-brand-imtoken-01': '#11C4D1',
        '--ck-brand-imtoken-02': '#0062AD',
        '--ck-brand-gnosisSafe': '#12FF80',
        '--ck-brand-dawn': '#000000',
    },
};
const themeColors = {
    light: predefinedThemes.base.light,
    dark: predefinedThemes.base.dark,
    web95: predefinedThemes.web95,
    retro: predefinedThemes.retro,
    soft: predefinedThemes.soft,
    midnight: predefinedThemes.midnight,
    minimal: predefinedThemes.minimal,
    rounded: predefinedThemes.rounded,
    nouns: predefinedThemes.nouns,
};
/**
 *  Automatically use p3 if available
 */
//  TODO: Don't use :any type
const createCssVars = (scheme, important) => {
    return css `
    ${Object.keys(scheme).map((key) => {
        const value = scheme[key];
        return value && `${key}:${value};`;
    })}
  `;
};
const createCssColors = (scheme, override) => {
    const important = override ? ' !important' : '';
    return css `
    ${Object.keys(scheme).map((key) => {
        const value = scheme[key];
        return value && `${key}:${value}${important};`;
    })}
    @supports (color: color(display-p3 1 1 1)) {
      ${Object.keys(scheme).map((key) => {
        const value = scheme[key];
        return `${key}:${hexToP3(value)}${important};`;
    })}
    }
  `;
};
const themes = {
    default: createCssVars(themeGlobals.default),
    light: createCssColors(themeColors.light),
    dark: createCssColors(themeColors.dark),
    web95: createCssColors(themeColors.web95),
    retro: createCssColors(themeColors.retro),
    soft: createCssColors(themeColors.soft),
    midnight: createCssColors(themeColors.midnight),
    minimal: createCssColors(themeColors.minimal),
    rounded: createCssColors(themeColors.rounded),
    nouns: createCssColors(themeColors.nouns),
};
const globals = {
    brand: createCssVars(themeGlobals.brand),
    ensLight: createCssVars(themeGlobals.ens.light),
    ensDark: createCssVars(themeGlobals.ens.dark),
    graphicsLight: createCssVars(themeGlobals.graphics.light),
    graphicsDark: createCssVars(themeGlobals.graphics.dark),
};
const globalsLight = css `
  ${globals.brand}
  ${globals.ensLight}
  ${globals.graphicsLight}
`;
const globalsDark = css `
  ${globals.brand}
  ${globals.ensDark}
  ${globals.graphicsDark}
`;
/*
 *  Reset stylings to avoid conflicting with the parent websites styling
 * Automatically apply theme based on system theme
 */
// TODO: Think more about how to reset our components as to not be affected by external stylings
// TODO: Merge theme objects instead of overriding
let mode = 'auto';
const ResetContainer = styled(motion.div) `
  ${themes.default}

  ${(props) => {
    switch (props.$useTheme) {
        case 'web95':
            mode = 'light';
            return themes.web95;
        case 'retro':
            mode = 'light';
            return themes.retro;
        case 'soft':
            mode = 'light';
            return themes.soft;
        case 'midnight':
            mode = 'dark';
            return themes.midnight;
        case 'minimal':
            mode = 'light';
            return themes.minimal;
        case 'rounded':
            mode = 'light';
            return themes.rounded;
        case 'nouns':
            mode = 'light';
            return themes.nouns;
        default:
            if (props.$useMode === 'light') {
                mode = 'light';
                return themes.light;
            }
            else if (props.$useMode === 'dark') {
                mode = 'dark';
                return themes.dark;
            }
            else {
                return css `
            @media (prefers-color-scheme: light) {
              ${themes.light}
            }
            @media (prefers-color-scheme: dark) {
              ${themes.dark}
            }
          `;
            }
    }
}}

  ${(props) => {
    switch (mode) {
        case 'light':
            return globalsLight;
        case 'dark':
            return globalsDark;
        default:
            return css `
          ${globalsLight}
          @media (prefers-color-scheme: dark) {
            ${globalsDark}
          }
        `;
    }
}}


  ${(props) => {
    var _a;
    if (props.$customTheme &&
        props.$customTheme['--ck-accent-color'] &&
        ['light', 'dark', 'auto', '', undefined].includes(props.$useTheme)) {
        const accentColor = props.$customTheme['--ck-accent-color'];
        const accentTextColor = (_a = props.$customTheme['--ck-accent-text-color']) !== null && _a !== void 0 ? _a : '#ffffff';
        return {
            '--ck-accent-color': accentColor,
            '--ck-accent-text-color': accentTextColor,
            // '--ck-connectbutton-color': accentTextColor,
            // '--ck-connectbutton-background': accentColor,
            // '--ck-connectbutton-background-hover': accentColor,
            // '--ck-connectbutton-background-active': LightenDarkenColor(
            // accentColor,
            // 20
            // ),
            '--ck-secondary-button-background': accentColor,
            '--ck-secondary-button-hover-background': accentColor,
            '--ck-secondary-button-color': accentTextColor,
            '--ck-button-primary-color': accentTextColor,
            '--ck-focus-color': accentColor,
        };
    }
    if (props.$customTheme) {
        return createCssColors(props.$customTheme, true);
    }
}}

  all: initial;
  text-align: left;
  text-direction: ltr;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-text-stroke: 0.001px transparent;
  text-size-adjust: none;
  font-size: 16px;

  button {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-text-stroke: 0.001px transparent;
  }

  &,
  * {
    font-family: var(--ck-font-family);
    box-sizing: border-box;
    outline: none;
    border: none;
  }
  /*
  @media (prefers-reduced-motion) {
    * {
      animation-duration: 60ms !important;
      transition-duration: 60ms !important;
    }
  }
  */
  img,
  svg {
    max-width: 100%;
  }
  strong {
    font-weight: 600;
  }
  a:focus-visible,
  button:focus-visible {
    outline: 2px solid var(--ck-focus-color);
  }
`;

const Portal = (props) => {
    props = {
        selector: '__CONNECTKIT__',
        ...props,
    };
    const { selector, children } = props;
    const ref = useRef(null);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const selectorPrefixed = '#' + selector.replace(/^#/, '');
        ref.current = document.querySelector(selectorPrefixed);
        if (!ref.current) {
            const div = document.createElement('div');
            div.setAttribute('id', selector);
            document.body.appendChild(div);
            ref.current = div;
        }
        setMounted(true);
    }, [selector]);
    if (!ref.current)
        return null;
    return mounted ? createPortal(children, ref.current) : null;
};

const Injected = ({ ...props }) => (jsx("svg", { ...props, "aria-hidden": "true", width: "32", height: "32", viewBox: "0 0 32 32", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M15.6505 3.64041C15.6501 3.64062 15.6497 3.64083 15.6493 3.64103L6.05165 8.43985L16.2501 13.5391L26.4484 8.43987L16.8508 3.64103C16.8504 3.64083 16.85 3.64063 16.8496 3.64043C16.6632 3.54806 16.458 3.5 16.25 3.5C16.042 3.5 15.8369 3.54806 15.6505 3.64041ZM28 10.4592L17.5001 15.7091L17.5 28.5205L27.248 23.6465L27.2508 23.6452C27.4757 23.5334 27.665 23.3611 27.7973 23.1477C27.9297 22.9342 27.9999 22.6881 28 22.4369V10.4592ZM15 28.527L15.0001 15.7091L4.50006 10.4591V22.4333C4.49831 22.6849 4.56687 22.9319 4.69807 23.1466C4.82896 23.3608 5.01696 23.5342 5.24095 23.6475C5.24148 23.6477 5.242 23.648 5.24253 23.6483L15 28.527ZM14.5207 31.0824L4.12104 25.8826L4.11759 25.8809C3.47681 25.558 2.93902 25.0625 2.56486 24.4502C2.19154 23.8394 1.99597 23.1365 2.00006 22.4207V10.0486C2.00044 9.33234 2.20062 8.62972 2.5781 8.021C2.95529 7.41274 3.49457 6.92167 4.13537 6.60291C4.13585 6.60267 4.13633 6.60243 4.13681 6.60219L14.534 1.40359L14.5368 1.40221C15.0692 1.13767 15.6556 1 16.25 1C16.8445 1 17.4309 1.13767 17.9633 1.40221L17.966 1.40358L28.3633 6.60219C28.3638 6.60245 28.3643 6.6027 28.3648 6.60295C29.0055 6.92171 29.5448 7.41276 29.922 8.021C30.2994 8.62973 30.4996 9.33168 30.5 10.0479V22.4376C30.4996 23.1538 30.2994 23.8565 29.922 24.4652C29.5448 25.0734 29.0056 25.5644 28.365 25.8831C28.3644 25.8834 28.3638 25.8837 28.3633 25.884L17.9664 31.0824C17.9663 31.0825 17.9665 31.0824 17.9664 31.0824C17.4316 31.3499 16.8415 31.4894 16.2435 31.4894C15.6455 31.4894 15.0554 31.3499 14.5207 31.0824C14.5205 31.0824 14.5208 31.0825 14.5207 31.0824Z", fill: "#CCCCCC" }) }));
const WalletConnect = ({ background = false, ...props }) => (jsx("svg", { ...props, "aria-hidden": "true", width: "32", height: "32", viewBox: "0 0 32 32", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: background ? { background: 'var(--ck-brand-walletConnect)' } : undefined, children: jsx("path", { d: "M9.58818 11.8556C13.1293 8.31442 18.8706 8.31442 22.4117 11.8556L22.8379 12.2818C23.015 12.4588 23.015 12.7459 22.8379 12.9229L21.3801 14.3808C21.2915 14.4693 21.148 14.4693 21.0595 14.3808L20.473 13.7943C18.0026 11.3239 13.9973 11.3239 11.5269 13.7943L10.8989 14.4223C10.8104 14.5109 10.6668 14.5109 10.5783 14.4223L9.12041 12.9645C8.94336 12.7875 8.94336 12.5004 9.12041 12.3234L9.58818 11.8556ZM25.4268 14.8706L26.7243 16.1682C26.9013 16.3452 26.9013 16.6323 26.7243 16.8093L20.8737 22.6599C20.6966 22.8371 20.4096 22.8371 20.2325 22.6599L16.0802 18.5076C16.0359 18.4634 15.9641 18.4634 15.9199 18.5076L11.7675 22.6599C11.5905 22.8371 11.3034 22.8371 11.1264 22.66C11.1264 22.66 11.1264 22.6599 11.1264 22.6599L5.27561 16.8092C5.09856 16.6322 5.09856 16.3451 5.27561 16.168L6.57313 14.8706C6.75019 14.6934 7.03726 14.6934 7.21431 14.8706L11.3668 19.023C11.411 19.0672 11.4828 19.0672 11.5271 19.023L15.6793 14.8706C15.8563 14.6934 16.1434 14.6934 16.3205 14.8706L20.473 19.023C20.5172 19.0672 20.589 19.0672 20.6332 19.023L24.7856 14.8706C24.9627 14.6935 25.2498 14.6935 25.4268 14.8706Z", fill: background ? 'white' : 'var(--ck-brand-walletConnect)' }) }));
const WalletConnectLegacy = ({ background = false, ...props }) => WalletConnect({ background, ...props });
const MetaMask = ({ background = false, ...props }) => (jsxs("svg", { ...props, "aria-hidden": "true", style: background
        ? {
            background: 'linear-gradient(0deg, var(--ck-brand-metamask-12), var(--ck-brand-metamask-11))',
            borderRadius: '27.5%',
        }
        : undefined, width: "32", height: "32", viewBox: "0 0 32 32", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("path", { d: "M27.2684 4.03027L17.5018 11.2841L19.3079 7.00442L27.2684 4.03027Z", fill: "var(--ck-brand-metamask-02)", stroke: "var(--ck-brand-metamask-02)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M4.7218 4.03027L14.4099 11.3528L12.6921 7.00442L4.7218 4.03027Z", fill: "var(--ck-brand-metamask-08)", stroke: "var(--ck-brand-metamask-08)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M23.7544 20.8438L21.1532 24.8289L26.7187 26.3602L28.3187 20.9321L23.7544 20.8438Z", fill: "var(--ck-brand-metamask-08)", stroke: "var(--ck-brand-metamask-08)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M3.69104 20.9321L5.28117 26.3602L10.8467 24.8289L8.24551 20.8438L3.69104 20.9321Z", fill: "var(--ck-brand-metamask-08)", stroke: "var(--ck-brand-metamask-08)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M10.5327 14.1108L8.98181 16.4568L14.5081 16.7022L14.3117 10.7637L10.5327 14.1108Z", fill: "var(--ck-brand-metamask-08)", stroke: "var(--ck-brand-metamask-08)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M21.4576 14.1111L17.6295 10.6953L17.5018 16.7025L23.0182 16.4571L21.4576 14.1111Z", fill: "var(--ck-brand-metamask-08)", stroke: "var(--ck-brand-metamask-08)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M10.8469 24.8292L14.1647 23.2096L11.2984 20.9717L10.8469 24.8292Z", fill: "var(--ck-brand-metamask-08)", stroke: "var(--ck-brand-metamask-08)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M17.8257 23.2096L21.1531 24.8292L20.6918 20.9717L17.8257 23.2096Z", fill: "var(--ck-brand-metamask-08)", stroke: "var(--ck-brand-metamask-08)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M21.1531 24.8296L17.8257 23.21L18.0906 25.3793L18.0612 26.2921L21.1531 24.8296Z", fill: "var(--ck-brand-metamask-06)", stroke: "var(--ck-brand-metamask-06)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M10.8469 24.8296L13.9388 26.2921L13.9192 25.3793L14.1647 23.21L10.8469 24.8296Z", fill: "var(--ck-brand-metamask-06)", stroke: "var(--ck-brand-metamask-06)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M13.9877 19.5389L11.2196 18.7242L13.1729 17.8311L13.9877 19.5389Z", fill: "var(--ck-brand-metamask-09)", stroke: "var(--ck-brand-metamask-09)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M18.0023 19.5389L18.8171 17.8311L20.7802 18.7242L18.0023 19.5389Z", fill: "var(--ck-brand-metamask-09)", stroke: "var(--ck-brand-metamask-09)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M10.8468 24.8289L11.3179 20.8438L8.24561 20.9321L10.8468 24.8289Z", fill: "var(--ck-brand-metamask-03)", stroke: "var(--ck-brand-metamask-03)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M20.6821 20.8438L21.1532 24.8289L23.7544 20.9321L20.6821 20.8438Z", fill: "var(--ck-brand-metamask-03)", stroke: "var(--ck-brand-metamask-03)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M23.0182 16.4565L17.5018 16.7019L18.0122 19.5387L18.827 17.8308L20.7902 18.7239L23.0182 16.4565Z", fill: "var(--ck-brand-metamask-03)", stroke: "var(--ck-brand-metamask-03)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M11.2198 18.7239L13.1829 17.8308L13.9878 19.5387L14.5081 16.7019L8.98181 16.4565L11.2198 18.7239Z", fill: "var(--ck-brand-metamask-03)", stroke: "var(--ck-brand-metamask-03)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M8.98181 16.4565L11.2983 20.9718L11.2198 18.7239L8.98181 16.4565Z", fill: "var(--ck-brand-metamask-10)", stroke: "var(--ck-brand-metamask-10)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M20.7901 18.7239L20.6919 20.9718L23.0181 16.4565L20.7901 18.7239Z", fill: "var(--ck-brand-metamask-10)", stroke: "var(--ck-brand-metamask-10)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M14.508 16.7021L13.9878 19.5389L14.6356 22.886L14.7828 18.4788L14.508 16.7021Z", fill: "var(--ck-brand-metamask-10)", stroke: "var(--ck-brand-metamask-10)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M17.5017 16.7021L17.2367 18.4689L17.3545 22.886L18.0121 19.5389L17.5017 16.7021Z", fill: "var(--ck-brand-metamask-10)", stroke: "var(--ck-brand-metamask-10)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M18.0121 19.5388L17.3545 22.886L17.8257 23.2099L20.6918 20.972L20.79 18.7241L18.0121 19.5388Z", fill: "var(--ck-brand-metamask-01)", stroke: "var(--ck-brand-metamask-01)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M11.2196 18.7241L11.2981 20.972L14.1644 23.2099L14.6355 22.886L13.9877 19.5388L11.2196 18.7241Z", fill: "var(--ck-brand-metamask-01)", stroke: "var(--ck-brand-metamask-01)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M18.0615 26.2917L18.0908 25.3788L17.8455 25.1628H14.145L13.9192 25.3788L13.9388 26.2917L10.8469 24.8291L11.9267 25.7126L14.1155 27.234H17.875L20.0736 25.7126L21.1533 24.8291L18.0615 26.2917Z", fill: "var(--ck-brand-metamask-07)", stroke: "var(--ck-brand-metamask-07)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M17.8258 23.2096L17.3546 22.8857H14.6357L14.1646 23.2096L13.9191 25.379L14.1449 25.163H17.8454L18.0907 25.379L17.8258 23.2096Z", fill: "var(--ck-brand-metamask-04)", stroke: "var(--ck-brand-metamask-04)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M27.6806 11.7552L28.5149 7.75041L27.2683 4.03027L17.8257 11.0387L21.4575 14.1109L26.591 15.6128L27.7296 14.2876L27.2389 13.9342L28.0241 13.2178L27.4156 12.7465L28.2007 12.1478L27.6806 11.7552Z", fill: "var(--ck-brand-metamask-05)", stroke: "var(--ck-brand-metamask-05)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M3.48486 7.75041L4.3192 11.7552L3.78916 12.1478L4.57441 12.7465L3.97566 13.2178L4.7609 13.9342L4.27012 14.2876L5.39892 15.6128L10.5325 14.1109L14.1644 11.0387L4.72164 4.03027L3.48486 7.75041Z", fill: "var(--ck-brand-metamask-05)", stroke: "var(--ck-brand-metamask-05)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M26.591 15.6122L21.4575 14.1104L23.0181 16.4564L20.6919 20.9716L23.7544 20.9323H28.3186L26.591 15.6122Z", fill: "var(--ck-brand-metamask-01)", stroke: "var(--ck-brand-metamask-01)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M10.5326 14.1104L5.39897 15.6122L3.69104 20.9323H8.24551L11.2982 20.9716L8.98168 16.4564L10.5326 14.1104Z", fill: "var(--ck-brand-metamask-01)", stroke: "var(--ck-brand-metamask-01)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M17.5018 16.7018L17.8258 11.0381L19.3177 7.00391H12.6921L14.1645 11.0381L14.5081 16.7018L14.6258 18.4883L14.6356 22.8856H17.3546L17.3742 18.4883L17.5018 16.7018Z", fill: "var(--ck-brand-metamask-01)", stroke: "var(--ck-brand-metamask-01)", strokeWidth: "0.269931", strokeLinecap: "round", strokeLinejoin: "round" })] }));
const Coinbase = ({ background = false, ...props }) => (jsxs("svg", { ...props, "aria-hidden": "true", width: "20", height: "20", viewBox: "0 0 20 20", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("circle", { cx: "10", cy: "10", r: "10", fill: "var(--ck-brand-coinbaseWallet)" }), background && (jsx("rect", { rx: "27%", width: "20", height: "20", fill: "var(--ck-brand-coinbaseWallet)" })), jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M10.0001 17C13.8661 17 17.0001 13.866 17.0001 10C17.0001 6.13401 13.8661 3 10.0001 3C6.13413 3 3.00012 6.13401 3.00012 10C3.00012 13.866 6.13413 17 10.0001 17ZM8.25012 7.71429C7.95427 7.71429 7.71441 7.95414 7.71441 8.25V11.75C7.71441 12.0459 7.95427 12.2857 8.25012 12.2857H11.7501C12.046 12.2857 12.2858 12.0459 12.2858 11.75V8.25C12.2858 7.95414 12.046 7.71429 11.7501 7.71429H8.25012Z", fill: "white" })] }));
const Family = ({ ...props }) => {
    const img = 'data:image/png;base64,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';
    return (jsx("svg", { ...props, "aria-hidden": "true", width: "120", height: "120", viewBox: "0 0 120 120", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: {
            backgroundSize: '100% 100%',
            backgroundImage: `url("${img}")`,
        } }));
};
const Trust = ({ theme = 'light', ...props }) => (jsxs("svg", { ...props, "aria-hidden": "true", width: "44", height: "44", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("rect", { width: "44", height: "44", fill: theme === 'light'
                ? 'var(--ck-brand-trust-02)'
                : 'var(--ck-brand-trust-02b)' }), jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M33.0246 11.8662C33.4096 11.8662 33.774 12.0243 34.0421 12.2925C34.3102 12.5675 34.4615 12.9387 34.4546 13.3168C34.3859 17.4143 34.2277 20.5493 33.9321 23.0312C33.6433 25.5131 33.2102 27.3556 32.5571 28.8475C32.1171 29.8443 31.574 30.6693 30.9346 31.3706C30.0752 32.2987 29.0921 32.9725 28.0196 33.6119C27.561 33.8861 27.0843 34.1568 26.5842 34.4408C25.5172 35.0468 24.3441 35.713 23.0146 36.6025C22.5333 36.9256 21.9077 36.9256 21.4265 36.6025C20.0766 35.7026 18.8879 35.0281 17.8112 34.4173C17.5718 34.2815 17.3379 34.1488 17.109 34.0175C15.8509 33.2887 14.7165 32.5943 13.7265 31.5906C13.0665 30.9306 12.4959 30.1262 12.0421 29.1706C11.4234 27.8918 11.004 26.345 10.6946 24.3443C10.2821 21.67 10.0759 18.1706 10.0002 13.3168C9.99336 12.9387 10.1377 12.5675 10.4059 12.2925C10.674 12.0243 11.0452 11.8662 11.4302 11.8662H12.0215C13.8433 11.8731 17.8652 11.6943 21.344 8.98559C21.8596 8.58683 22.5815 8.58683 23.0971 8.98559C26.5759 11.6943 30.5977 11.8731 32.4265 11.8662H33.0246ZM29.8277 27.9331C30.2746 27.0118 30.6459 25.74 30.9277 23.9112C31.2646 21.725 31.4709 18.755 31.5671 14.7125C29.4221 14.6506 25.7371 14.2381 22.224 11.8731C18.7109 14.2312 15.0259 14.6437 12.8877 14.7125C12.9633 18.0537 13.1146 20.6525 13.3552 22.6943C13.6302 25.0181 14.0221 26.5925 14.5102 27.6993C14.8333 28.435 15.1909 28.9643 15.6171 29.4318C16.1877 30.0575 16.9096 30.5731 17.8927 31.1643C18.3005 31.409 18.7502 31.6635 19.2396 31.9406C20.1116 32.4341 21.1099 32.9991 22.224 33.7081C23.3175 33.0107 24.3014 32.4515 25.1633 31.9616C25.4231 31.8139 25.6717 31.6725 25.909 31.5356C27.119 30.8412 28.0127 30.2637 28.6796 29.59C29.1265 29.1293 29.4909 28.6275 29.8277 27.9331Z", fill: theme === 'light'
                ? 'var(--ck-brand-trust-01)'
                : 'var(--ck-brand-trust-01b)' })] }));
const Argent = ({ ...props }) => (jsxs("svg", { ...props, "aria-hidden": "true", width: "32", height: "32", viewBox: "0 0 32 32", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("rect", { width: "32", height: "32", fill: "white" }), jsx("path", { d: "M18.3242 7.63647H13.6516C13.4955 7.63647 13.3704 7.76611 13.367 7.92726C13.2726 12.4568 10.9768 16.7559 7.02532 19.8009C6.89986 19.8976 6.87128 20.0792 6.963 20.21L9.69685 24.112C9.78986 24.2448 9.97107 24.2747 10.0986 24.1772C12.5694 22.2856 14.5567 20.0038 15.9879 17.4746C17.4191 20.0038 19.4065 22.2856 21.8773 24.1772C22.0047 24.2747 22.186 24.2448 22.2791 24.112L25.013 20.21C25.1045 20.0792 25.0759 19.8976 24.9506 19.8009C20.999 16.7559 18.7033 12.4568 18.609 7.92726C18.6056 7.76611 18.4803 7.63647 18.3242 7.63647Z", fill: "var(--ck-brand-argent)" })] }));
const ImToken = ({ ...props }) => (jsx("svg", { ...props, "aria-hidden": "true", width: "32", height: "32", viewBox: "0 0 32 32", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: {
        background: `linear-gradient(
      180deg,
      var(--ck-brand-imtoken-01) 0%,
      var(--ck-brand-imtoken-02) 100%
    )`,
    }, children: jsx("path", { d: "M26.8543 9.96509C27.5498 19.3857 21.4942 23.8384 16.0655 24.3132C11.0184 24.7546 6.26765 21.6534 5.85087 16.8885C5.50707 12.952 7.94004 11.2761 9.8516 11.109C11.8177 10.9367 13.4698 12.2925 13.6132 13.9342C13.7512 15.5125 12.7664 16.2308 12.0815 16.2906C11.5398 16.3381 10.8584 16.0093 10.7968 15.3032C10.7441 14.6965 10.9744 14.6138 10.9182 13.9693C10.8179 12.8219 9.81731 12.6882 9.26951 12.7357C8.60654 12.7937 7.40368 13.5675 7.5725 15.4949C7.7422 17.439 9.60628 18.9751 12.0498 18.7614C14.6868 18.531 16.5227 16.4779 16.6608 13.5983C16.6595 13.4458 16.6916 13.2948 16.7548 13.156L16.7557 13.1525C16.7841 13.0922 16.8174 13.0342 16.8551 12.9793C16.9113 12.8949 16.9835 12.8016 17.0767 12.6997C17.0775 12.697 17.0775 12.697 17.0793 12.697C17.147 12.6205 17.2288 12.5379 17.3211 12.4491C18.473 11.3623 22.6214 8.79916 26.5448 9.61074C26.6277 9.62851 26.7026 9.67262 26.7584 9.73649C26.8142 9.80035 26.8478 9.88054 26.8543 9.96509", fill: "white" }) }));
const Frame = ({ ...props }) => (jsx("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", width: "32", height: "32", viewBox: "0 0 153.4 152.9", children: jsx("path", { fill: "rgb(0, 210, 190)", d: "M145.1,75.6v-58c0-5.1-4.2-9.3-9.3-9.3h0H77.7c-0.6,0-1.1-0.2-1.6-0.6l-7-7c-0.4-0.4-1-0.7-1.6-0.7H9.3 C4.2,0,0,4.1,0,9.3c0,0,0,0,0,0l0,0v58c0,0.6,0.2,1.1,0.6,1.6l7,7c0.4,0.4,0.7,1,0.7,1.6v58c0,5.1,4.2,9.3,9.3,9.3c0,0,0,0,0,0h58.2 c0.6,0,1.1,0.2,1.6,0.6l7,7c0.4,0.4,1,0.6,1.6,0.6h58.2c5.1,0,9.3-4.1,9.3-9.3c0,0,0,0,0,0l0,0v-58c0-0.6-0.2-1.1-0.6-1.6l-7-7 C145.4,76.7,145.1,76.2,145.1,75.6z M105.6,106.6H47.9c-0.7,0-1.3-0.6-1.3-1.3V47.7c0-0.7,0.6-1.3,1.3-1.3h57.7 c0.7,0,1.3,0.6,1.3,1.3v57.6C107,106,106.4,106.6,105.6,106.6z" }) }));
const Rainbow = ({ ...props }) => {
    // Here we're using a base64 of an svg because the gradients in this logo do not play nicely on mobile devices
    /*
    const withoutBackground = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxtYXNrIGlkPSJtYXNrMF8xXzIwIiBzdHlsZT0ibWFzay10eXBlOmFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIyMCIgeT0iMjAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+CjxwYXRoIGQ9Ik0yMCA2MlYyNkMyMCAyMi42ODYzIDIyLjY4NjMgMjAgMjYgMjBDNjYuODY5MSAyMCAxMDAgNTMuMTMwOSAxMDAgOTRDMTAwIDk3LjMxMzcgOTcuMzEzNyAxMDAgOTQgMTAwSDU4QzU0LjY4NjMgMTAwIDUyIDk3LjMxMzcgNTIgOTRDNTIgNzkuNjQwNiA0MC4zNTk0IDY4IDI2IDY4QzIyLjY4NjMgNjggMjAgNjUuMzEzNyAyMCA2MloiIGZpbGw9IiNDNEM0QzQiLz4KPC9tYXNrPgo8ZyBtYXNrPSJ1cmwoI21hc2swXzFfMjApIj4KPG1hc2sgaWQ9Im1hc2sxXzFfMjAiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjIwIiB5PSIyMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIj4KPHBhdGggZD0iTTIwLjAwMDEgMzhWMjBIMTAwVjEwMEg4Mi4wMDAxVjk0QzgyLjAwMDEgNjMuMDcyMSA1Ni45MjggMzggMjYuMDAwMSAzOEgyMC4wMDAxWiIgZmlsbD0iI0M0QzRDNCIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazFfMV8yMCkiPgo8cGF0aCBkPSJNMCAwSDEyMFYxMjBIMFYwWiIgZmlsbD0iIzY3NTlGRiIvPgo8ZyBmaWx0ZXI9InVybCgjZmlsdGVyMF9mXzFfMjApIj4KPHBhdGggZD0iTTAgMjZIMjZDNjMuNTU1NCAyNiA5NCA1Ni40NDQ2IDk0IDk0VjEyMEgwVjI2WiIgZmlsbD0iI0ZGNDAwMCIvPgo8L2c+CjwvZz4KPG1hc2sgaWQ9Im1hc2syXzFfMjAiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjIwIiB5PSIzNiIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0Ij4KPHBhdGggZD0iTTIwIDU0VjM2SDI2QzU4LjAzMjUgMzYgODQgNjEuOTY3NSA4NCA5NFYxMDBINjZWOTRDNjYgNzEuOTA4NiA0OC4wOTE0IDU0IDI2IDU0SDIwWiIgZmlsbD0iI0M0QzRDNCIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazJfMV8yMCkiPgo8cGF0aCBkPSJNMCAzNkg4NFYxMjBIMFYzNloiIGZpbGw9IiNGRjdGMDAiLz4KPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjFfZl8xXzIwKSI+CjxwYXRoIGQ9Ik0wIDQySDI2QzU0LjcxODggNDIgNzggNjUuMjgxMiA3OCA5NFYxMjBIMFY0MloiIGZpbGw9IiNGRkZGMDAiLz4KPC9nPgo8L2c+CjxtYXNrIGlkPSJtYXNrM18xXzIwIiBzdHlsZT0ibWFzay10eXBlOmFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIyMCIgeT0iNTIiIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCI+CjxwYXRoIGQ9Ik0yMCA2MlY1MkgyNkM0OS4xOTYgNTIgNjggNzAuODA0IDY4IDk0VjEwMEg1OEM1NC42ODYzIDEwMCA1MiA5Ny4zMTM3IDUyIDk0QzUyIDc5LjY0MDYgNDAuMzU5NCA2OCAyNiA2OEMyMi42ODYzIDY4IDIwIDY1LjMxMzcgMjAgNjJaIiBmaWxsPSIjQzRDNEM0Ii8+CjwvbWFzaz4KPGcgbWFzaz0idXJsKCNtYXNrM18xXzIwKSI+CjxwYXRoIGQ9Ik0wIDUySDI2QzQ5LjE5NiA1MiA2OCA3MC44MDQgNjggOTRWMTIwSDBWNTJaIiBmaWxsPSIjMDBFNTEzIi8+CjwvZz4KPG1hc2sgaWQ9Im1hc2s0XzFfMjAiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjIwIiB5PSI1MiIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4Ij4KPHBhdGggZD0iTTIwIDEwMFY1MkgyNkM0OS4xOTYgNTIgNjggNzAuODA0IDY4IDk0VjEwMEgyMFoiIGZpbGw9IiNDNEM0QzQiLz4KPC9tYXNrPgo8ZyBtYXNrPSJ1cmwoI21hc2s0XzFfMjApIj4KPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjJfZl8xXzIwKSI+CjxwYXRoIGQ9Ik0wIDU4SDI2QzQ1Ljg4MjIgNTggNjIgNzQuMTE3NyA2MiA5NFYxMjBIMFY1OFoiIGZpbGw9IiMwMEFBRkYiLz4KPC9nPgo8L2c+CjwvZz4KPGRlZnM+CjxmaWx0ZXIgaWQ9ImZpbHRlcjBfZl8xXzIwIiB4PSItMTgiIHk9IjgiIHdpZHRoPSIxMzAiIGhlaWdodD0iMTMwIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9InNoYXBlIi8+CjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjkiIHJlc3VsdD0iZWZmZWN0MV9mb3JlZ3JvdW5kQmx1cl8xXzIwIi8+CjwvZmlsdGVyPgo8ZmlsdGVyIGlkPSJmaWx0ZXIxX2ZfMV8yMCIgeD0iLTE4IiB5PSIyNCIgd2lkdGg9IjExNCIgaGVpZ2h0PSIxMTQiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0ic2hhcGUiLz4KPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iOSIgcmVzdWx0PSJlZmZlY3QxX2ZvcmVncm91bmRCbHVyXzFfMjAiLz4KPC9maWx0ZXI+CjxmaWx0ZXIgaWQ9ImZpbHRlcjJfZl8xXzIwIiB4PSItMTgiIHk9IjQwIiB3aWR0aD0iOTgiIGhlaWdodD0iOTgiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0ic2hhcGUiLz4KPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iOSIgcmVzdWx0PSJlZmZlY3QxX2ZvcmVncm91bmRCbHVyXzFfMjAiLz4KPC9maWx0ZXI+CjwvZGVmcz4KPC9zdmc+Cg==';
    */
    const withBackground = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfNjJfMzI5KSIvPgo8cGF0aCBkPSJNMjAgMzhIMjZDNTYuOTI3OSAzOCA4MiA2My4wNzIxIDgyIDk0VjEwMEg5NEM5Ny4zMTM3IDEwMCAxMDAgOTcuMzEzNyAxMDAgOTRDMTAwIDUzLjEzMDkgNjYuODY5MSAyMCAyNiAyMEMyMi42ODYzIDIwIDIwIDIyLjY4NjMgMjAgMjZWMzhaIiBmaWxsPSJ1cmwoI3BhaW50MV9yYWRpYWxfNjJfMzI5KSIvPgo8cGF0aCBkPSJNODQgOTRIMTAwQzEwMCA5Ny4zMTM3IDk3LjMxMzcgMTAwIDk0IDEwMEg4NFY5NFoiIGZpbGw9InVybCgjcGFpbnQyX2xpbmVhcl82Ml8zMjkpIi8+CjxwYXRoIGQ9Ik0yNiAyMEwyNiAzNkgyMEwyMCAyNkMyMCAyMi42ODYzIDIyLjY4NjMgMjAgMjYgMjBaIiBmaWxsPSJ1cmwoI3BhaW50M19saW5lYXJfNjJfMzI5KSIvPgo8cGF0aCBkPSJNMjAgMzZIMjZDNTguMDMyNSAzNiA4NCA2MS45Njc1IDg0IDk0VjEwMEg2NlY5NEM2NiA3MS45MDg2IDQ4LjA5MTQgNTQgMjYgNTRIMjBWMzZaIiBmaWxsPSJ1cmwoI3BhaW50NF9yYWRpYWxfNjJfMzI5KSIvPgo8cGF0aCBkPSJNNjggOTRIODRWMTAwSDY4Vjk0WiIgZmlsbD0idXJsKCNwYWludDVfbGluZWFyXzYyXzMyOSkiLz4KPHBhdGggZD0iTTIwIDUyTDIwIDM2TDI2IDM2TDI2IDUySDIwWiIgZmlsbD0idXJsKCNwYWludDZfbGluZWFyXzYyXzMyOSkiLz4KPHBhdGggZD0iTTIwIDYyQzIwIDY1LjMxMzcgMjIuNjg2MyA2OCAyNiA2OEM0MC4zNTk0IDY4IDUyIDc5LjY0MDYgNTIgOTRDNTIgOTcuMzEzNyA1NC42ODYzIDEwMCA1OCAxMDBINjhWOTRDNjggNzAuODA0IDQ5LjE5NiA1MiAyNiA1MkgyMFY2MloiIGZpbGw9InVybCgjcGFpbnQ3X3JhZGlhbF82Ml8zMjkpIi8+CjxwYXRoIGQ9Ik01MiA5NEg2OFYxMDBINThDNTQuNjg2MyAxMDAgNTIgOTcuMzEzNyA1MiA5NFoiIGZpbGw9InVybCgjcGFpbnQ4X3JhZGlhbF82Ml8zMjkpIi8+CjxwYXRoIGQ9Ik0yNiA2OEMyMi42ODYzIDY4IDIwIDY1LjMxMzcgMjAgNjJMMjAgNTJMMjYgNTJMMjYgNjhaIiBmaWxsPSJ1cmwoI3BhaW50OV9yYWRpYWxfNjJfMzI5KSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzYyXzMyOSIgeDE9IjYwIiB5MT0iMCIgeDI9IjYwIiB5Mj0iMTIwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiMxNzQyOTkiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDAxRTU5Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQxX3JhZGlhbF82Ml8zMjkiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjYgOTQpIHJvdGF0ZSgtOTApIHNjYWxlKDc0KSI+CjxzdG9wIG9mZnNldD0iMC43NzAyNzciIHN0b3AtY29sb3I9IiNGRjQwMDAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjODc1NEM5Ii8+CjwvcmFkaWFsR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQyX2xpbmVhcl82Ml8zMjkiIHgxPSI4MyIgeTE9Ijk3IiB4Mj0iMTAwIiB5Mj0iOTciIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0ZGNDAwMCIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4NzU0QzkiLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDNfbGluZWFyXzYyXzMyOSIgeDE9IjIzIiB5MT0iMjAiIHgyPSIyMyIgeTI9IjM3IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM4NzU0QzkiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY0MDAwIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQ0X3JhZGlhbF82Ml8zMjkiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjYgOTQpIHJvdGF0ZSgtOTApIHNjYWxlKDU4KSI+CjxzdG9wIG9mZnNldD0iMC43MjM5MjkiIHN0b3AtY29sb3I9IiNGRkY3MDAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY5OTAxIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQ1X2xpbmVhcl82Ml8zMjkiIHgxPSI2OCIgeTE9Ijk3IiB4Mj0iODQiIHkyPSI5NyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRkZGNzAwIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGOTkwMSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50Nl9saW5lYXJfNjJfMzI5IiB4MT0iMjMiIHkxPSI1MiIgeDI9IjIzIiB5Mj0iMzYiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0ZGRjcwMCIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGRjk5MDEiLz4KPC9saW5lYXJHcmFkaWVudD4KPHJhZGlhbEdyYWRpZW50IGlkPSJwYWludDdfcmFkaWFsXzYyXzMyOSIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgyNiA5NCkgcm90YXRlKC05MCkgc2NhbGUoNDIpIj4KPHN0b3Agb2Zmc2V0PSIwLjU5NTEzIiBzdG9wLWNvbG9yPSIjMDBBQUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAxREE0MCIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50OF9yYWRpYWxfNjJfMzI5IiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDUxIDk3KSBzY2FsZSgxNyA0NS4zMzMzKSI+CjxzdG9wIHN0b3AtY29sb3I9IiMwMEFBRkYiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDFEQTQwIi8+CjwvcmFkaWFsR3JhZGllbnQ+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQ5X3JhZGlhbF82Ml8zMjkiIGN4PSIwIiBjeT0iMCIgcj0iMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjMgNjkpIHJvdGF0ZSgtOTApIHNjYWxlKDE3IDMyMi4zNykiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDBBQUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAxREE0MCIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=';
    return (jsx("svg", { ...props, "aria-hidden": "true", width: "120", height: "120", viewBox: "0 0 120 120", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: {
            backgroundSize: '100% 100%',
            backgroundImage: `url("${withBackground}")`,
        } }));
};
const Brave$1 = ({ ...props }) => (jsxs("svg", { ...props, "aria-hidden": "true", width: "88", height: "88", viewBox: "0 0 88 88", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("rect", { rx: "27%", width: "88", height: "88", fill: "white" }), jsx("path", { d: "M69.0892 28.2123L70.5781 24.5643L66.3594 20.1967C64.0763 17.9136 59.2123 19.2537 59.2123 19.2537L53.7031 13H34.2721L28.7381 19.2785C28.7381 19.2785 23.8741 17.9632 21.591 20.1967L17.3722 24.5395L18.8612 28.1875L17 33.5974L23.204 57.2472C24.4945 62.3097 25.3631 64.2702 29.011 66.8511L40.352 74.5441C41.4439 75.2142 42.784 76.3805 44 76.3805C45.216 76.3805 46.5561 75.2142 47.648 74.5441L58.989 66.8511C62.6369 64.2702 63.5055 62.3097 64.796 57.2472L71 33.5974L69.0892 28.2123Z", fill: "url(#paint0_linear_2183_5890)" }), jsx("path", { d: "M57.6737 23.2739C57.6737 23.2739 64.796 31.8851 64.796 33.6967C64.796 35.5579 63.9026 36.0294 63.0092 36.9972L57.6737 42.705C57.1774 43.2013 56.1103 44.045 56.7307 45.5092C57.3511 46.9982 58.2197 48.8346 57.227 50.7206C56.2344 52.6314 54.4972 53.8971 53.3805 53.6985C51.7195 53.1594 50.1348 52.4088 48.6654 51.4651C47.7224 50.8447 44.6949 48.3382 44.6949 47.3704C44.6949 46.4026 47.8217 44.6406 48.4173 44.2932C48.9881 43.8961 51.6434 42.3575 51.693 41.7619C51.7427 41.1664 51.7427 41.0175 50.9485 39.5285C50.1544 38.0395 48.7647 36.0542 48.9632 34.7638C49.2114 33.4733 51.4449 32.7785 53.1075 32.1581L58.2445 30.2224C58.6415 30.0239 58.5423 29.8502 57.3511 29.7261C56.1599 29.6268 52.8097 29.1801 51.296 29.602C49.7822 30.0239 47.2509 30.6691 47.0028 31.0165C46.8042 31.364 46.6057 31.364 46.829 32.5551L48.2684 40.3722C48.3677 41.3649 48.5662 42.0349 47.5239 42.2831C46.432 42.5313 44.6204 42.9531 44 42.9531C43.3796 42.9531 41.5432 42.5313 40.4761 42.2831C39.409 42.0349 39.6075 41.3649 39.7316 40.3722C39.8309 39.3796 40.9228 33.7215 41.1461 32.5551C41.3943 31.364 41.171 31.364 40.9724 31.0165C40.7243 30.6691 38.1682 30.0239 36.6544 29.602C35.1654 29.1801 31.7904 29.6268 30.5993 29.7509C29.4081 29.8502 29.3088 29.9991 29.7059 30.2472L34.8428 32.1581C36.4807 32.7785 38.7638 33.4733 38.9871 34.7638C39.2353 36.079 37.8208 38.0395 37.0018 39.5285C36.1829 41.0175 36.2077 41.1664 36.2574 41.7619C36.307 42.3575 38.9871 43.8961 39.5331 44.2932C40.1287 44.6654 43.2555 46.4026 43.2555 47.3704C43.2555 48.3382 40.3024 50.8447 39.3097 51.4651C37.8404 52.4088 36.2557 53.1594 34.5947 53.6985C33.4779 53.8971 31.7408 52.6314 30.7233 50.7206C29.7307 48.8346 30.6241 46.9982 31.2197 45.5092C31.8401 44.0202 30.7978 43.2261 30.2767 42.705L24.9412 36.9972C24.0726 36.079 23.1792 35.5827 23.1792 33.7463C23.1792 31.9099 30.3015 23.3235 30.3015 23.3235L37.0763 24.4154C37.8704 24.4154 39.6324 23.7454 41.2454 23.1746C42.8585 22.6783 43.9752 22.6287 43.9752 22.6287C43.9752 22.6287 45.0671 22.6287 46.705 23.1746C48.3428 23.7206 50.08 24.4154 50.8741 24.4154C51.693 24.4154 57.6985 23.2491 57.6985 23.2491L57.6737 23.2739ZM52.3382 56.2298C52.7849 56.4779 52.512 57.0239 52.0901 57.3217L45.7868 62.2353C45.2904 62.7316 44.4963 63.4761 43.9752 63.4761C43.454 63.4761 42.6847 62.7316 42.1636 62.2353C40.0743 60.5717 37.9648 58.9337 35.8355 57.3217C35.4384 57.0239 35.1654 56.5028 35.5873 56.2298L39.3097 54.2445C40.7894 53.4618 42.3551 52.8539 43.9752 52.4329C44.3474 52.4329 46.705 53.2767 48.6158 54.2445L52.3382 56.2298Z", fill: "white" }), jsx("path", { d: "M59.262 19.2785L53.7032 13H34.2721L28.7381 19.2785C28.7381 19.2785 23.8741 17.9632 21.591 20.1967C21.591 20.1967 28.0432 19.6259 30.2767 23.2491L37.126 24.4154C37.9201 24.4154 39.682 23.7454 41.2951 23.1746C42.9081 22.6783 44.0249 22.6287 44.0249 22.6287C44.0249 22.6287 45.1168 22.6287 46.7546 23.1746C48.3925 23.7206 50.1296 24.4154 50.9238 24.4154C51.7427 24.4154 57.7482 23.2491 57.7482 23.2491C59.9817 19.6259 66.4339 20.1967 66.4339 20.1967C64.1508 17.9136 59.2868 19.2537 59.2868 19.2537", fill: "url(#paint1_linear_2183_5890)" }), jsxs("defs", { children: [jsxs("linearGradient", { id: "paint0_linear_2183_5890", x1: "17", y1: "45.3241", x2: "71", y2: "45.3241", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { offset: "0.4", stopColor: "#FF5500" }), jsx("stop", { offset: "0.6", stopColor: "#FF2000" })] }), jsxs("linearGradient", { id: "paint1_linear_2183_5890", x1: "22.4879", y1: "18.8219", x2: "66.4339", y2: "18.8219", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { stopColor: "#FF452A" }), jsx("stop", { offset: "1", stopColor: "#FF2000" })] })] })] }));
const Crypto = ({ ...props }) => (jsxs("svg", { ...props, "aria-hidden": "true", width: "88", height: "88", viewBox: "0 0 88 88", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: { background: 'white' }, children: [jsx("mask", { id: "mask0_2091_4394", style: { maskType: 'alpha' }, maskUnits: "userSpaceOnUse", x: "13", y: "9", width: "62", height: "71", children: jsx("path", { d: "M44 9L13 26.75V62.25L44 80L75 62.25V26.75L44 9ZM31.7577 24.3492H56.1513L59.0935 36.684H28.9307L31.7577 24.3492ZM41.5613 61.2993L36.2955 66.161H31.8427L20.6924 46.9369L28.8701 40.9079L36.0953 45.4627V53.6578L41.5552 58.8504V61.2993H41.5613ZM37.9759 53.1584L38.7888 45.4326L36.1256 38.5432H51.9229L49.3204 45.4326L50.0787 53.1283L44 53.1584H37.9759ZM56.2059 66.1069H51.8076L46.5419 61.2993V58.8564L52.0018 53.6638V45.4627L59.1421 40.8537L67.2955 46.9369L56.2059 66.1069Z", fill: "#002D74" }) }), jsxs("g", { mask: "url(#mask0_2091_4394)", children: [jsx("rect", { y: "8", width: "44", height: "72", fill: "url(#paint0_linear_2091_4394)" }), jsx("rect", { x: "88", y: "80", width: "44", height: "72", transform: "rotate(-180 88 80)", fill: "url(#paint1_linear_2091_4394)" })] }), jsxs("defs", { children: [jsxs("linearGradient", { id: "paint0_linear_2091_4394", x1: "22", y1: "8", x2: "22", y2: "80", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { stopColor: "#010935" }), jsx("stop", { offset: "1", stopColor: "#142C70" })] }), jsxs("linearGradient", { id: "paint1_linear_2091_4394", x1: "110", y1: "80", x2: "110", y2: "152", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { stopColor: "#010935" }), jsx("stop", { offset: "1", stopColor: "#142C70" })] })] })] }));
const Ledger = ({ ...props }) => (jsx("svg", { ...props, "aria-hidden": "true", width: "88", height: "88", viewBox: "0 0 88 88", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: { background: 'black' }, children: jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M37.2106 16H16V29.4577H19.2182V19.2182L37.2106 19.1011V16ZM37.3568 33.4073V54.6179H50.8146V51.3997H40.575L40.458 33.4073H37.3568ZM16 72.1714H37.2106V69.0703L19.2182 68.9533V58.7137H16V72.1714ZM50.9609 16H72.1714V29.4577H68.9533V19.2182L50.9609 19.1011V16ZM72.1714 72.1714H50.9609V69.0703L68.9533 68.9533V58.7137H72.1714V72.1714Z", fill: "white" }) }));
const Steak = ({ ...props }) => (jsxs("svg", { ...props, "aria-hidden": "true", width: "600", height: "600", viewBox: "0 0 600 600", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: { background: 'black' }, children: [jsx("path", { d: "M470.747 209.191C462.305 192.354 448.646 178.695 431.808 170.253C413.337 161 389.233 161 341.006 161C331.236 161 307.916 161 300 161C292.084 161 268.728 161 258.994 161C210.856 161 186.662 161 168.191 170.253C151.354 178.69 137.7 192.35 129.27 209.191C119.999 227.662 120 251.767 120 299.976C120 348.185 119.999 372.308 129.27 390.778C137.7 407.619 151.354 421.279 168.191 429.716C186.662 438.97 210.784 438.97 258.994 438.97C268.764 438.97 292.084 438.97 300 438.97C307.916 438.97 331.272 438.97 341.006 438.97C389.144 438.97 413.337 438.97 431.808 429.716C448.646 421.274 462.305 407.616 470.747 390.778C480 372.308 480 348.203 480 299.976C480 251.749 480 227.662 470.747 209.191Z", fill: "#FFCEAA" }), jsx("path", { d: "M218.557 350.342C216.323 345.957 212.922 342.274 208.729 339.698C204.536 337.121 199.713 335.752 194.791 335.741H166.747C163.876 335.755 161.041 336.37 158.422 337.548C155.804 338.725 153.462 340.439 151.547 342.577C149.632 344.716 148.186 347.232 147.303 349.964C146.42 352.696 146.12 355.582 146.422 358.437C147.385 367.476 148.954 374.34 151.575 379.564C157.629 391.573 167.378 401.323 179.388 407.377C188.195 411.798 201.674 413.26 222.444 413.742C225.415 413.812 228.353 413.109 230.97 411.702C233.587 410.295 235.793 408.232 237.373 405.715C238.953 403.199 239.852 400.315 239.982 397.346C240.113 394.378 239.47 391.427 238.116 388.781L218.557 350.342Z", fill: "#FF3B9A" }), jsx("path", { d: "M180.618 312.563C189.852 312.562 198.95 310.335 207.14 306.071C215.33 301.806 222.371 295.63 227.668 288.066L254.856 249.253C259.761 242.25 262.839 234.134 263.81 225.64C264.782 217.146 263.616 208.545 260.419 200.616V200.384C258.913 196.555 256.409 193.2 253.167 190.666C249.925 188.133 246.064 186.514 241.985 185.978C209.732 186.085 190.726 186.887 179.405 192.575C167.37 198.586 157.611 208.339 151.592 220.37C146.725 230.247 145.227 258.007 144.87 280.507C144.797 284.698 145.56 288.862 147.114 292.754C148.668 296.647 150.983 300.191 153.923 303.179C156.863 306.167 160.369 308.539 164.236 310.156C168.103 311.774 172.254 312.604 176.445 312.599L180.618 312.563Z", fill: "#FF3B9A" }), jsx("path", { d: "M449.702 220.356C443.655 208.365 433.909 198.639 421.906 192.614C409.89 186.588 389.262 186.053 353.337 186C304.664 186 289.528 242 279.134 256.834L248.556 300.497C243.645 307.51 240.729 315.725 240.12 324.266C239.511 332.806 241.231 341.352 245.098 348.991L267.758 393.813C270.842 399.931 275.578 405.063 281.43 408.627C287.282 412.191 294.016 414.045 300.867 413.978H301.49C309.495 413.978 334.171 413.978 342.283 413.978C385.072 413.978 408.713 413.977 421.906 407.381C433.914 401.331 443.66 391.58 449.702 379.568C456.317 366.374 456.316 342.787 456.316 299.944C456.316 257.101 456.317 233.621 449.702 220.356Z", fill: "#FF3B9A" })] }));
const Unstoppable = ({ ...props }) => (jsx("svg", { ...props, "aria-hidden": "true", width: "88", height: "88", viewBox: "0 0 88 88", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: { background: 'linear-gradient(180deg, #FED812 0%, #FFAF00 100%)' }, children: jsx("path", { d: "M47.4 43.7163C47.4 45.6251 45.8781 47.1714 44.0001 47.1714C42.1219 47.1714 40.6 45.6251 40.6 43.7163L40.6 -7H27L27 43.7163C27 53.2612 34.6106 61 44.0001 61C53.3882 61 61 53.2612 61 43.7163V-7H47.4V43.7163Z", fill: "#1F2129" }) }));
const ONTO = ({ ...props }) => (jsx("svg", { ...props, "aria-hidden": "true", width: "88", height: "88", viewBox: "0 0 88 88", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: { background: 'white' }, children: jsx("path", { d: "M20 16L28.675 24.677C32.1885 21.8644 36.4154 20.0873 40.8816 19.545C45.348 19.0026 49.8769 19.7164 53.9604 21.6063C58.0438 23.4963 61.5207 26.4876 64.0005 30.2447C66.4804 34.0019 67.8653 38.3763 68 42.8772V43.5854V72L59.3367 63.3231C55.8263 66.1389 51.6014 67.9196 47.1361 68.4655C42.6708 69.0112 38.1419 68.3007 34.0577 66.4135C29.9734 64.5262 26.4956 61.537 24.0144 57.7813C21.5333 54.0255 20.1472 49.6521 20.0115 45.1515V44.4433L20 16ZM25.931 30.3311V44.4146C25.9323 47.7294 26.8335 50.9817 28.5384 53.8236C30.2432 56.6655 32.6875 58.9902 35.6101 60.5497C38.5328 62.1089 41.8238 62.8439 45.1313 62.6764C48.439 62.5087 51.639 61.4445 54.3894 59.5978L54.8611 59.2754L27.0873 31.4884L25.931 30.3311ZM33.6223 28.4022L33.1505 28.7304L60.9186 56.5117L62.069 57.6632V43.5854C62.0683 40.2717 61.1679 37.0204 59.464 34.179C57.7603 31.3377 55.3171 29.0132 52.3957 27.4539C49.4742 25.8946 46.1844 25.1592 42.8777 25.3262C39.5712 25.4933 36.372 26.5565 33.6223 28.4022Z", fill: "#23262F" }) }));
const Slope = ({ ...props }) => (jsxs("svg", { ...props, "aria-hidden": "true", width: "88", height: "88", viewBox: "0 0 88 88", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: { background: '#6C67F1' }, children: [jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M50.6667 24.3696L34.8872 40.1864L24.0001 37.7402L37.3334 24.3696L48.4438 13.3798C49.268 12.5646 50.6667 13.1484 50.6667 14.3077V24.3696ZM37.3339 51.0358L50.6672 37.74V24.3694L35.2001 39.8737L37.3339 51.0358Z", fill: "url(#paint0_linear_2593_6077)" }), jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M37.3337 64.2947V50.9617L50.667 37.6284L55.7849 45.8435L55.9822 45.6463L64 50.9616L39.5582 75.2343C38.7347 76.0521 37.3336 75.4687 37.3336 74.3082V64.2949L37.3337 64.2947Z", fill: "url(#paint1_linear_2593_6077)" }), jsx("path", { d: "M24 37.7405H32.573C35.202 37.7405 37.3333 39.8718 37.3333 42.5009V51.0359H28.7602C26.1313 51.0359 24 48.9046 24 46.2757V37.7405Z", fill: "#F1F0FF" }), jsx("path", { d: "M50.6667 37.7405H59.2398C61.8688 37.7405 64 39.8718 64 42.5009V51.0359H55.4271C52.798 51.0359 50.6667 48.9046 50.6667 46.2757V37.7405Z", fill: "#F1F0FF" }), jsxs("defs", { children: [jsxs("linearGradient", { id: "paint0_linear_2593_6077", x1: "37.3336", y1: "13", x2: "37.3336", y2: "51.0358", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { stopColor: "#A8ADFF" }), jsx("stop", { offset: "0.648556", stopColor: "white" })] }), jsxs("linearGradient", { id: "paint1_linear_2593_6077", x1: "50.6668", y1: "37.6284", x2: "50.6668", y2: "75.616", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { offset: "0.260784", stopColor: "#B6BAFF" }), jsx("stop", { offset: "1", stopColor: "#E4E2FF" })] })] })] }));
const GnosisSafe = ({ background = false, ...props }) => (jsxs("svg", { ...props, "aria-hidden": "true", width: "88", height: "88", viewBox: "0 0 88 88", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: background ? { background: 'var(--ck-brand-gnosisSafe)' } : undefined, children: [jsx("path", { d: "M68.7186 44H62.6472C60.8339 44 59.3646 45.4686 59.3646 47.281V56.0888C59.3646 57.9012 57.8952 59.3697 56.0819 59.3697H31.9278C30.1145 59.3697 28.6452 60.8383 28.6452 62.6507V68.719C28.6452 70.5314 30.1145 72 31.9278 72H57.48C59.2933 72 60.7417 70.5314 60.7417 68.719V63.8504C60.7417 62.038 62.2111 60.7524 64.0244 60.7524H68.7174C70.5307 60.7524 72 59.2838 72 57.4714V47.2429C72 45.4305 70.5307 44 68.7174 44H68.7186Z", fill: "#121312" }), jsx("path", { d: "M28.6406 31.9308C28.6406 30.1162 30.1104 28.6458 31.9243 28.6458H56.0712C57.8851 28.6458 59.3548 27.1754 59.3548 25.3608V19.285C59.3548 17.4704 57.8851 16 56.0712 16H30.5245C28.7107 16 27.2409 17.4704 27.2409 19.285V23.9666C27.2409 25.7813 25.7711 27.2516 23.9572 27.2516H19.2837C17.4698 27.2516 16 28.722 16 30.5366V40.7888C16 42.6034 17.4759 44 19.2898 44H25.3631C27.177 44 28.6468 42.5296 28.6468 40.715L28.6406 31.932V31.9308Z", fill: "#121312" }), jsx("path", { d: "M41.1004 37.6774H46.8995C48.7894 37.6774 50.3226 39.2117 50.3226 41.1004V46.8995C50.3226 48.7894 48.7882 50.3225 46.8995 50.3225H41.1004C39.2106 50.3225 37.6774 48.7882 37.6774 46.8995V41.1004C37.6774 39.2105 39.2118 37.6774 41.1004 37.6774V37.6774Z", fill: "#121312" })] }));
const Frontier = ({ ...props }) => (jsx("svg", { ...props, "aria-hidden": "true", width: "88", height: "88", viewBox: "0 0 88 88", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: { background: '#CC703C' }, children: jsx("path", { d: "M63.6429 20L63.3645 20.7254L62.4521 23.0445L61.8461 24.5395C57.2427 35.7491 53.6629 41.0688 49.8557 41.0688C48.8938 41.0936 47.9371 40.9212 47.0465 40.5625C46.156 40.2038 45.3512 39.6667 44.6834 38.9852L44.1979 38.5518C42.9885 37.4538 42.4799 37.1831 41.3154 37.1832C40.7094 37.1832 39.6238 37.9435 38.2521 39.7303C36.4147 42.2912 34.8522 45.0327 33.59 47.9106L33.4353 48.2482L49.7645 48.2483L47.7312 52.4075H32.4845L32.4843 69.44L28 69.44L28.0001 20L63.6429 20ZM57.2889 24.1518L32.4843 24.1518L32.4843 40.6262C35.4564 35.5545 38.2816 33.0086 41.32 33.0086C42.3421 32.9765 43.3595 33.1534 44.3082 33.5284C45.2569 33.9034 46.1159 34.468 46.8311 35.1865L47.3323 35.6335C48.4611 36.6585 48.8956 36.8941 49.8604 36.8941C50.9211 36.8957 53.7433 32.4855 57.2889 24.1518Z", fill: "white" }) }));
const Zerion = ({ ...props }) => (jsxs("svg", { ...props, "aria-hidden": "true", width: "88", height: "88", viewBox: "0 0 88 88", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: {
        background: 'linear-gradient(120.22deg, #2962EF 0%, #255CE5 100%)',
    }, children: [jsx("path", { d: "M19.0864 22C17.5783 22 16.9973 23.8648 18.2628 24.6438L49.9199 43.732C50.709 44.2178 51.7614 44.0258 52.3048 43.2969L66.2236 25.024C67.17 23.7545 66.2138 22 64.5757 22H19.0864Z", fill: "white" }), jsx("path", { d: "M68.8425 66C70.3503 66 70.9466 64.1252 69.6814 63.3464L38.015 44.2605C37.2259 43.7748 36.1989 43.991 35.6558 44.7198L21.7099 62.9891C20.7639 64.2582 21.7499 66 23.3877 66H68.8425Z", fill: "white" })] }));
const Phantom = () => (jsxs("svg", { width: "128", height: "128", viewBox: "0 0 128 128", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsxs("g", { "clip-path": "url(#clip0_51_1414)", children: [jsx("circle", { cx: "64", cy: "64", r: "64", fill: "url(#paint0_linear_51_1414)" }), jsx("g", { filter: "url(#filter0_d_51_1414)", children: jsx("path", { d: "M110.584 64.9142H99.1422C99.1422 41.7651 80.1732 23 56.7725 23C33.6614 23 14.8718 41.3057 14.412 64.0583C13.9362 87.577 36.2412 108 60.0188 108H63.0096C83.9725 108 112.069 91.7667 116.459 71.9874C117.27 68.3413 114.359 64.9142 110.584 64.9142ZM39.769 65.9454C39.769 69.0411 37.2097 71.5729 34.0804 71.5729C30.9511 71.5729 28.3917 69.0399 28.3917 65.9454V56.8414C28.3917 53.7457 30.9511 51.2139 34.0804 51.2139C37.2097 51.2139 39.769 53.7457 39.769 56.8414V65.9454ZM59.5226 65.9454C59.5226 69.0411 56.9633 71.5729 53.834 71.5729C50.7046 71.5729 48.1453 69.0399 48.1453 65.9454V56.8414C48.1453 53.7457 50.7058 51.2139 53.834 51.2139C56.9633 51.2139 59.5226 53.7457 59.5226 56.8414V65.9454Z", fill: "url(#paint1_linear_51_1414)" }) })] }), jsxs("defs", { children: [jsxs("filter", { id: "filter0_d_51_1414", x: "6.76403", y: "15.3596", width: "117.472", height: "100.281", filterUnits: "userSpaceOnUse", "color-interpolation-filters": "sRGB", children: [jsx("feFlood", { "flood-opacity": "0", result: "BackgroundImageFix" }), jsx("feColorMatrix", { in: "SourceAlpha", type: "matrix", values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0", result: "hardAlpha" }), jsx("feOffset", {}), jsx("feGaussianBlur", { stdDeviation: "3.82022" }), jsx("feColorMatrix", { type: "matrix", values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" }), jsx("feBlend", { mode: "normal", in2: "BackgroundImageFix", result: "effect1_dropShadow_51_1414" }), jsx("feBlend", { mode: "normal", in: "SourceGraphic", in2: "effect1_dropShadow_51_1414", result: "shape" })] }), jsxs("linearGradient", { id: "paint0_linear_51_1414", x1: "64", y1: "0", x2: "64", y2: "128", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { "stop-color": "#534BB1" }), jsx("stop", { offset: "1", "stop-color": "#551BF9" })] }), jsxs("linearGradient", { id: "paint1_linear_51_1414", x1: "65.5", y1: "23", x2: "65.5", y2: "108", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { "stop-color": "white" }), jsx("stop", { offset: "1", "stop-color": "white", "stop-opacity": "0.82" })] }), jsx("clipPath", { id: "clip0_51_1414", children: jsx("rect", { width: "128", height: "128", fill: "white" }) })] })] }));
const PlaceHolder = () => {
    return jsx("div", { style: { width: 80, height: 80, background: '#555' } });
};
const Dawn = ({ ...props }) => (jsxs("svg", { ...props, width: "88px", height: "88px", viewBox: "0 0 192 192", version: "1.1", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", children: [jsxs("defs", { children: [jsxs("linearGradient", { x1: "50%", y1: "0%", x2: "50%", y2: "100%", id: "linearGradient-1", children: [jsx("stop", { "stop-color": "#151515", offset: "0%" }), jsx("stop", { "stop-color": "#232323", offset: "100%" })] }), jsx("rect", { rx: "27%", id: "path-2", x: "0", y: "0", width: "192", height: "192" }), jsxs("linearGradient", { x1: "50%", y1: "0%", x2: "50%", y2: "99.7051532%", id: "linearGradient-3", children: [jsx("stop", { "stop-color": "#F3DC83", offset: "0%" }), jsx("stop", { "stop-color": "#F9EEC8", offset: "100%" })] })] }), jsx("g", { id: "Icons---Pixel-Fitted", stroke: "none", "stroke-width": "1", fill: "none", "fill-rule": "evenodd", children: jsxs("g", { id: "Group", children: [jsxs("g", { id: "Rectangle", children: [jsx("use", { fill: "#232323", xlinkHref: "#path-2" }), jsx("use", { fill: "url(#linearGradient-1)", xlinkHref: "#path-2" })] }), jsx("path", { d: "M123.748399,157.001808 C115.293464,160.853955 105.89735,163 96,163 C86.1026503,163 76.7065363,160.853955 68.2516012,157.001808 Z M146.526595,140.002206 C144.677242,142.123986 142.696426,144.128189 140.59684,146.002121 L51.4031598,146.002121 C49.3035743,144.128189 47.3227581,142.123986 45.4734054,140.002206 Z M157.337411,122.999613 C155.955969,126.133404 154.34141,129.141319 152.515704,132.001388 L39.484296,132.001388 C37.6585895,129.141319 36.0440306,126.133404 34.662589,122.999613 Z M96,29 C133.003078,29 163,58.9969218 163,96 C163,103.706309 161.69895,111.108742 159.304524,117.999626 L32.6954763,117.999626 C30.3010496,111.108742 29,103.706309 29,96 C29,58.9969218 58.9969218,29 96,29 Z", id: "Combined-Shape", fill: "url(#linearGradient-3)" })] }) })] }));
const Rabby = ({ ...props }) => (jsxs("svg", { ...props, width: "88", height: "88", viewBox: "0 0 88 88", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("rect", { width: "88", height: "88", rx: "20", fill: "#8697FF" }), jsx("path", { d: "M76.2062 48.0657C78.7621 42.356 66.1267 26.404 54.0555 19.7581C46.4467 14.6095 38.5183 15.3169 36.9125 17.5775C33.3886 22.5385 48.5814 26.7423 58.742 31.6478C56.5579 32.5964 54.4996 34.2987 53.2893 36.4758C49.5013 32.3404 41.1872 28.7791 31.4315 31.6478C24.8574 33.5809 19.3937 38.1382 17.2821 45.0216C16.7689 44.7936 16.2009 44.6669 15.6032 44.6669C13.3176 44.6669 11.4648 46.5197 11.4648 48.8052C11.4648 51.0908 13.3176 52.9435 15.6032 52.9435C16.0268 52.9435 17.3514 52.6594 17.3514 52.6594L38.5183 52.8128C30.0532 66.2418 23.3634 68.2049 23.3634 70.5314C23.3634 72.8579 29.7643 72.2274 32.1678 71.3602C43.6732 67.2088 56.0306 54.2706 58.1511 50.5462C67.056 51.6572 74.5397 51.7886 76.2062 48.0657Z", fill: "url(#paint0_linear_60607_36577)" }), jsx("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M58.65 31.6053C58.682 31.6193 58.7139 31.6332 58.7458 31.6471C59.2168 31.4616 59.1406 30.766 59.0113 30.2198C58.714 28.9643 53.5856 23.9001 48.7696 21.6318C42.1984 18.5367 37.3618 18.7007 36.6582 20.1307C37.9975 22.8695 44.1927 25.441 50.663 28.1266C53.3909 29.2589 56.1676 30.4114 58.65 31.6053Z", fill: "url(#paint1_linear_60607_36577)" }), jsx("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M50.4154 59.2247C49.0895 58.7182 47.592 58.2536 45.8898 57.8319C47.707 54.5801 48.0884 49.7663 46.3721 46.7226C43.9635 42.4512 40.9399 40.1777 33.9139 40.1777C30.0495 40.1777 19.6451 41.4794 19.4603 50.1648C19.441 51.0763 19.4599 51.9118 19.5259 52.68L38.5175 52.8176C35.9568 56.8798 33.5586 59.8928 31.4589 62.1841C33.9831 62.8309 36.0657 63.3738 37.9775 63.8722C39.7885 64.3443 41.4462 64.7764 43.1809 65.2191C45.8007 63.3102 48.2635 61.2288 50.4154 59.2247Z", fill: "url(#paint2_linear_60607_36577)" }), jsx("path", { d: "M17.0296 51.7821C17.8058 58.38 21.5555 60.9657 29.2177 61.7309C36.8799 62.4961 41.2751 61.9828 47.1265 62.5151C52.0136 62.9598 56.3772 65.4502 57.996 64.5895C59.4529 63.815 58.6378 61.0167 56.6884 59.2214C54.1614 56.8943 50.6641 55.2763 44.5104 54.7021C45.7368 51.3443 45.3931 46.6362 43.4885 44.0748C40.7345 40.3711 35.6513 38.6967 29.2177 39.4282C22.4962 40.1926 16.0556 43.5018 17.0296 51.7821Z", fill: "url(#paint3_linear_60607_36577)" }), jsxs("defs", { children: [jsxs("linearGradient", { id: "paint0_linear_60607_36577", x1: "30.666", y1: "43.0094", x2: "75.6558", y2: "55.7677", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { "stop-color": "white" }), jsx("stop", { offset: "1", "stop-color": "white" })] }), jsxs("linearGradient", { id: "paint1_linear_60607_36577", x1: "68.0842", y1: "42.1521", x2: "35.6221", y2: "9.60636", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { "stop-color": "#7258DC" }), jsx("stop", { offset: "1", "stop-color": "#797DEA", "stop-opacity": "0" })] }), jsxs("linearGradient", { id: "paint2_linear_60607_36577", x1: "51.3184", y1: "60.3591", x2: "20.1383", y2: "42.4347", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { "stop-color": "#7461EA" }), jsx("stop", { offset: "1", "stop-color": "#BFC2FF", "stop-opacity": "0" })] }), jsxs("linearGradient", { id: "paint3_linear_60607_36577", x1: "33.3531", y1: "42.6732", x2: "54.4308", y2: "69.4547", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { "stop-color": "white" }), jsx("stop", { offset: "0.983895", "stop-color": "#D5CEFF" })] })] })] }));
const OtherWallets = ({ ...props }) => {
    const column = {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
    };
    const row = {
        position: 'relative',
        display: 'flex',
        gap: 2,
    };
    const cell = {
        width: '50%',
        overflow: 'hidden',
        borderRadius: '27.5%',
    };
    return (jsxs("div", { style: column, ...props, children: [jsxs("div", { style: row, children: [jsx("div", { style: cell, children: jsx(WalletConnect, { background: true }) }), jsx("div", { style: cell, children: jsx(Zerion, {}) })] }), jsxs("div", { style: row, children: [jsx("div", { style: cell, children: jsx(Rainbow, {}) }), jsx("div", { style: cell, children: jsx(ImToken, {}) })] })] }));
};
var Logos = {
    Injected,
    OtherWallets,
    WalletConnect,
    WalletConnectLegacy,
    MetaMask,
    Coinbase,
    Family,
    Trust,
    Argent,
    ImToken,
    Rainbow,
    Crypto,
    Ledger,
    Brave: Brave$1,
    Steak,
    Unstoppable,
    ONTO,
    Slope,
    GnosisSafe,
    Frontier,
    Zerion,
    Phantom,
    PlaceHolder,
    Frame,
    Dawn,
    Rabby,
};

let supportedConnectors = [];
if (typeof window != 'undefined') {
    const { ethereum } = window;
    supportedConnectors = [
        {
            id: 'injected',
            name: 'Browser Wallet',
            shortName: 'Browser',
            logos: {
                default: jsx(Logos.Injected, {}),
                mobile: (jsx("div", { style: {
                        padding: 5,
                        background: 'var(--ck-body-background-tertiary)',
                        borderRadius: '27%',
                        boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.02)',
                    }, children: jsx("div", { style: {
                            transform: 'scale(0.75)',
                            position: 'relative',
                            width: '100%',
                        }, children: jsx(Logos.Injected, {}) }) })),
                transparent: jsx(Logos.Injected, {}),
            },
            scannable: false,
            extensionIsInstalled: () => {
                return Boolean(ethereum);
            },
        },
        {
            id: 'walletConnect',
            name: 'Other Wallets',
            shortName: 'Other',
            logos: {
                default: jsx(Logos.WalletConnect, {}),
                mobile: (jsx("div", { style: {
                        padding: 5,
                        background: 'var(--ck-body-background-secondary)',
                        borderRadius: '21%',
                        boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.02)',
                    }, children: jsx(Logos.OtherWallets, {}) })),
                transparent: jsx(Logos.WalletConnect, { background: false }),
                connectorButton: jsx(Logos.OtherWallets, {}),
                qrCode: jsx(Logos.WalletConnect, { background: true }),
            },
            logoBackground: 'var(--ck-brand-walletConnect)',
            scannable: true,
            defaultConnect: () => { },
        },
        {
            id: 'walletConnectLegacy',
            name: 'Other Wallets',
            shortName: 'Other',
            logos: {
                default: jsx(Logos.WalletConnectLegacy, {}),
                mobile: (jsx("div", { style: {
                        padding: 5,
                        background: 'var(--ck-body-background-secondary)',
                        borderRadius: '21%',
                        boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.02)',
                    }, children: jsx(Logos.OtherWallets, {}) })),
                transparent: jsx(Logos.WalletConnectLegacy, { background: false }),
                connectorButton: jsx(Logos.OtherWallets, {}),
                qrCode: jsx(Logos.WalletConnectLegacy, { background: true }),
            },
            logoBackground: 'var(--ck-brand-walletConnect)',
            scannable: true,
            defaultConnect: () => { },
        },
        {
            id: 'metaMask',
            name: 'MetaMask',
            logos: {
                default: jsx(Logos.MetaMask, { background: true }),
                mobile: jsx(Logos.MetaMask, { background: true }),
                transparent: (jsx("div", { style: {
                        transform: 'scale(0.86)',
                        position: 'relative',
                        width: '100%',
                    }, children: jsx(Logos.MetaMask, {}) })),
                connectorButton: (jsx("div", { style: {
                        transform: 'scale(1.1)',
                    }, children: jsx(Logos.MetaMask, {}) })),
            },
            logoBackground: 'linear-gradient(0deg, var(--ck-brand-metamask-12), var(--ck-brand-metamask-11))',
            scannable: false,
            // defaultConnect:  () => {},
            extensions: {
                chrome: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
                firefox: 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/',
                brave: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
                edge: 'https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm',
            },
            appUrls: {
                download: 'https://connect.family.co/v0/download/metamask',
                website: 'https://metamask.io/download/',
                android: 'https://play.google.com/store/apps/details?id=io.metamask',
                ios: 'https://apps.apple.com/app/metamask/id1438144202',
            },
            extensionIsInstalled: () => {
                return isMetaMask();
            },
        },
        {
            id: 'coinbaseWallet',
            name: 'Coinbase Wallet',
            shortName: 'Coinbase',
            logos: {
                default: jsx(Logos.Coinbase, {}),
                mobile: jsx(Logos.Coinbase, { background: true }),
                transparent: jsx(Logos.Coinbase, { background: false }),
                appIcon: jsx(Logos.Coinbase, { background: false }),
                connectorButton: jsx(Logos.Coinbase, { background: true }),
                qrCode: jsx(Logos.Coinbase, { background: true }),
            },
            logoBackground: 'var(--ck-brand-coinbaseWallet)',
            scannable: true,
            //defaultConnect: () => {},
            extensions: {
                chrome: 'https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad',
            },
            appUrls: {
                download: 'https://connect.family.co/v0/download/coinbasewallet',
                website: 'https://www.coinbase.com/wallet/getting-started-extension',
                android: 'https://play.google.com/store/apps/details?id=org.toshi',
                ios: 'https://apps.apple.com/app/coinbase-wallet-store-crypto/id1278383455',
            },
            extensionIsInstalled: () => {
                return isCoinbaseWallet();
            },
        },
        {
            id: 'safe',
            name: 'Safe',
            shortName: 'Safe',
            logos: {
                default: jsx(Logos.GnosisSafe, {}),
                mobile: jsx(Logos.GnosisSafe, { background: true }),
                transparent: jsx(Logos.GnosisSafe, { background: false }),
                appIcon: jsx(Logos.GnosisSafe, { background: false }),
                connectorButton: jsx(Logos.GnosisSafe, { background: true }),
                qrCode: jsx(Logos.GnosisSafe, { background: true }),
            },
            logoBackground: 'var(--ck-brand-gnosisSafe)',
            scannable: false,
            //defaultConnect: () => {},
            appUrls: {
                download: 'https://connect.family.co/v0/download/safe',
                website: 'https://safe.global/wallet',
                android: 'https://play.google.com/store/apps/details?id=io.gnosis.safe',
                ios: 'https://apps.apple.com/app/id1515759131',
            },
            extensionIsInstalled: () => {
                return false;
            },
        },
    ];
}
var supportedConnectors$1 = supportedConnectors;

const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;
const truncateEthAddress = (address, separator = '••••') => {
    if (!address)
        return '';
    const match = address.match(truncateRegex);
    if (!match)
        return address;
    return `${match[1]}${separator}${match[2]}`;
};
const truncateENSAddress = (ensName, maxLength) => {
    if (ensName.length > maxLength) {
        return ensName.replace('.eth', '').slice(0, maxLength) + '...';
    }
    else {
        return ensName;
    }
};
const nFormatter = (num, digits = 2) => {
    if (num < 10000)
        return num.toFixed(2);
    const lookup = [
        { value: 1, symbol: '' },
        { value: 1e3, symbol: 'k' },
        { value: 1e6, symbol: 'm' },
        { value: 1e9, symbol: 'g' },
        { value: 1e12, symbol: 't' },
        { value: 1e15, symbol: 'p' },
        { value: 1e18, symbol: 'e' },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup
        .slice()
        .reverse()
        .find(function (item) {
        return num >= item.value;
    });
    return item
        ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
        : '0';
};
const detectBrowser = () => {
    var _a;
    const browser = detect();
    return (_a = browser === null || browser === void 0 ? void 0 : browser.name) !== null && _a !== void 0 ? _a : '';
};
const detectOS = () => {
    var _a;
    const browser = detect();
    return (_a = browser === null || browser === void 0 ? void 0 : browser.os) !== null && _a !== void 0 ? _a : '';
};
const isIOS = () => {
    const os = detectOS();
    return os.toLowerCase().includes('ios');
};
const isAndroid = () => {
    const os = detectOS();
    return os.toLowerCase().includes('android');
};
const isMobile = () => {
    return isAndroid() || isIOS();
};
const isMetaMask = () => {
    if (typeof window === 'undefined')
        return false;
    const { ethereum } = window;
    if (!ethereum)
        return false;
    const isMetaMask = Boolean(ethereum.isMetaMask);
    if (!isMetaMask)
        return false;
    const isBrave = Boolean(ethereum.isBraveWallet //&& !ethereum._events && !ethereum._state
    );
    if (isBrave)
        return false;
    const isDawn = Boolean(ethereum.isDawn);
    if (isDawn)
        return false;
    const isTokenary = Boolean(ethereum.isTokenary);
    if (isTokenary)
        return false;
    const isFrame = Boolean(ethereum.isFrame);
    if (isFrame)
        return false;
    const isRabby = Boolean(ethereum.isRabby);
    if (isRabby)
        return false;
    if (isPhantom())
        return false;
    return true;
};
const isDawn = () => {
    if (typeof window === 'undefined')
        return false;
    const { ethereum } = window;
    if (!ethereum)
        return false;
    const isDawn = Boolean(ethereum.isDawn);
    if (isDawn)
        return true;
};
const isCoinbaseWallet = () => {
    if (typeof window === 'undefined')
        return false;
    const { ethereum } = window;
    return !!((ethereum === null || ethereum === void 0 ? void 0 : ethereum.isCoinbaseWallet) ||
        ((ethereum === null || ethereum === void 0 ? void 0 : ethereum.providers) &&
            (ethereum === null || ethereum === void 0 ? void 0 : ethereum.providers.find((provider) => provider.isCoinbaseWallet))));
};
const isFrame = () => {
    if (typeof window === 'undefined')
        return false;
    const { ethereum } = window;
    return !!((ethereum === null || ethereum === void 0 ? void 0 : ethereum.isFrame) ||
        ((ethereum === null || ethereum === void 0 ? void 0 : ethereum.providers) &&
            (ethereum === null || ethereum === void 0 ? void 0 : ethereum.providers.find((provider) => provider.isFrame))));
};
const isPhantom = () => {
    var _a;
    if (typeof window === 'undefined')
        return false;
    const { phantom } = window;
    const isPhantom = Boolean((_a = phantom === null || phantom === void 0 ? void 0 : phantom.ethereum) === null || _a === void 0 ? void 0 : _a.isPhantom);
    if (isPhantom)
        return true;
    return false;
};
const isRabby = () => {
    if (typeof window === 'undefined')
        return false;
    const { ethereum } = window;
    return !!((ethereum === null || ethereum === void 0 ? void 0 : ethereum.isRabby) ||
        ((ethereum === null || ethereum === void 0 ? void 0 : ethereum.providers) &&
            (ethereum === null || ethereum === void 0 ? void 0 : ethereum.providers.find((provider) => provider.isRabby))));
};
function flattenChildren(children) {
    const childrenArray = React.Children.toArray(children);
    return childrenArray.reduce((flatChildren, child) => {
        if (child.type === React.Fragment) {
            return flatChildren.concat(flattenChildren(child.props.children));
        }
        flatChildren.push(child);
        return flatChildren;
    }, []);
}
const isWalletConnectConnector = (connectorId) => connectorId === 'walletConnect' || connectorId === 'walletConnectLegacy';
const isMetaMaskConnector = (connectorId) => connectorId === 'metaMask';
const isCoinbaseWalletConnector = (connectorId) => connectorId === 'coinbaseWallet';
const isSafeConnector = (connectorId) => connectorId === 'safe';
const isInjectedConnector = (connectorId) => connectorId === 'injected';

var defaultTheme = {
    mobileWidth: 560,
};

const ErrorMessage = styled(motion.div) `
  z-index: -1;
  pointer-events: auto;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: var(--width);
  top: 64px;
  color: #fff;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  background: var(--ck-body-color-danger);
  border-radius: 20px;
  padding: 24px 46px 82px 24px;
  transition: width var(--duration) var(--ease);
  a {
    font-weight: 700;
    text-decoration: underline;
  }
  code {
    font-size: 0.9em;
    display: inline-block;
    font-family: monospace;
    margin: 1px;
    padding: 0 4px;
    border-radius: 8px;
    font-weight: bold;
    background: rgba(255, 255, 255, 0.1);
  }
`;
const FadeIn = keyframes `
from { opacity: 0; }
  to { opacity: 1; }
`;
const FadeInScaleUp = keyframes `
from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
`;
const FadeInScaleDown = keyframes `
from { opacity: 0; transform: scale(1.1); }
  to { opacity: 1; transform: scale(1); }
`;
const FadeOut = keyframes `
from { opacity: 1; }
  to { opacity: 0; }
`;
const FadeOutScaleUp = keyframes `
from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(1.1); }
`;
const FadeOutScaleDown = keyframes `
from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.85); }
`;
const PageContent = styled(motion.div) `
  max-width: 100%;
  width: 295px;
  padding-top: 48px;
`;
const TextWithHr = styled(motion.div) `
  user-select: none;
  position: relative;
  display: block;
  text-align: center;
  color: var(--ck-body-color-muted);
  font-size: 15px;
  font-weight: 400;
  line-height: 21px;
  span {
    z-index: 2;
    position: relative;
    display: inline-block;
    user-select: none;
    pointer-events: none;
    padding: 0 14px;
    background: var(--ck-body-background);
    transition: background-color 200ms ease;
  }
  &:before {
    z-index: 2;
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    transform: translateY(-1px);
    background: var(--ck-body-divider);
    box-shadow: var(--ck-body-divider-box-shadow);
  }
`;
const ModalHeading = styled(motion.div) `
  z-index: 3;
  pointer-events: none;
  user-select: none;
  position: absolute;
  top: 25px;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  transform: translateX(-50%);
  width: var(--width);
  text-align: center;
  font-size: 17px;
  line-height: 20px;
  font-weight: var(--ck-modal-heading-font-weight, 600);
  color: var(--ck-body-color);
  span {
    display: inline-block;
  }
`;
const ModalContentContainer = styled(motion.div) `
  position: relative;
  padding: 0;
`;
const ModalContent = styled(motion.div) `
  left: 0;
  right: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 0 16px;

  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    display: block;
  }
`;
const ModalH1 = styled(motion.h1) `
  margin: 0;
  padding: 0;
  line-height: ${(props) => (props.$small ? 20 : 22)}px;
  font-size: ${(props) => (props.$small ? 17 : 19)}px;
  font-weight: var(--ck-modal-h1-font-weight, 600);
  color: ${(props) => {
    if (props.$error)
        return 'var(--ck-body-color-danger)';
    if (props.$valid)
        return 'var(--ck-body-color-valid)';
    return 'var(--ck-body-color)';
}};
  > svg {
    position: relative;
    top: -2px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 6px;
  }
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    margin-bottom: 6px;
    font-size: 17px;
  }
`;
const ModalBody = styled.div `
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  color: var(--ck-body-color-muted);
  strong {
    font-weight: 500;
    color: var(--ck-body-color);
  }
`;
styled.div `
  padding: 0 12px;
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
  color: var(--ck-body-color-muted);
  strong {
    font-weight: 500;
    color: var(--ck-body-color);
  }
`;
const BackgroundOverlay = styled(motion.div) `
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--ck-overlay-background, rgba(71, 88, 107, 0.24));
  backdrop-filter: ${(props) => props.$blur
    ? `blur(${props.$blur}px)`
    : 'var(--ck-overlay-backdrop-filter, none)'};
  opacity: 0;
  animation: ${(props) => (props.$active ? FadeIn : FadeOut)} 150ms ease-out
    both;
`;
const BoxIn = keyframes `
  from{ opacity: 0; transform: scale(0.97); }
  to{ opacity: 1; transform: scale(1); }
`;
const BoxOut = keyframes `
  from{ opacity: 1; transform: scale(1); }
  to{ opacity: 0; transform: scale(0.97); }
`;
const MobileBoxIn = keyframes `
  from { transform: translate3d(0, 100%, 0); }
  to { transform: translate3d(0, 0%, 0); }
`;
const MobileBoxOut = keyframes `
  from { opacity: 1; }
  to { opacity: 0; }
`;
const BoxContainer = styled(motion.div) `
  z-index: 2;
  position: relative;
  color: var(--ck-body-color);

  animation: 150ms ease both;
  animation-name: ${BoxOut};
  &.active {
    animation-name: ${BoxIn};
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: var(--width);
    height: var(--height);
    transform: translateX(-50%);
    backface-visibility: hidden;
    transition: all 200ms ease;
    border-radius: var(--ck-border-radius, 20px);
    background: var(--ck-body-background);
    box-shadow: var(--ck-modal-box-shadow);
  }

  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    animation-name: ${MobileBoxOut};
    animation-duration: 130ms;
    animation-timing-function: ease;

    &.active {
      animation-name: ${MobileBoxIn};
      animation-duration: 300ms;
      animation-delay: 32ms;
      animation-timing-function: cubic-bezier(0.15, 1.15, 0.6, 1);
    }

    &:before {
      width: 100%;
      transition: 0ms height cubic-bezier(0.15, 1.15, 0.6, 1);
      will-change: height;
    }
  }
`;
const ControllerContainer = styled(motion.div) `
  z-index: 3;
  position: absolute;
  top: 0;
  left: 50%;
  height: 64px;
  transform: translateX(-50%);
  backface-visibility: hidden;
  width: var(--width);
  transition: 0.2s ease width;
  pointer-events: auto;
  //border-bottom: 1px solid var(--ck-body-divider);
`;
const InnerContainer$1 = styled(motion.div) `
  position: relative;
  overflow: hidden;
  height: var(--height);
  transition: 0.2s ease height;
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    transition: 0ms height cubic-bezier(0.15, 1.15, 0.6, 1);
    /* animation-delay: 34ms; */
  }
`;
const PageContainer = styled(motion.div) `
  z-index: 2;
  position: relative;
  top: 0;
  left: 50%;
  margin-left: calc(var(--width) / -2);
  width: var(--width);
  /* left: 0; */
  /* width: 100%; */
  display: flex;
  justify-content: center;
  align-items: center;
  transform-origin: center center;
  animation: 200ms ease both;

  &.active {
    animation-name: ${FadeInScaleDown};
  }
  &.active-scale-up {
    animation-name: ${FadeInScaleUp};
  }
  &.exit-scale-down {
    z-index: 1;
    pointer-events: none;
    position: absolute;
    /* top: 0; */
    /* left: 0; */
    animation-name: ${FadeOutScaleDown};
  }
  &.exit {
    z-index: 1;
    pointer-events: none;
    position: absolute;
    /* top: 0; */
    /* left: 0; */
    /* left: 50%; */
    /* transform: translateX(-50%); */
    animation-name: ${FadeOutScaleUp};
    animation-delay: 16.6667ms;
  }
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    /* animation: 0ms ease both; */
    /* animation-delay: 35ms; */
    animation: 0ms cubic-bezier(0.15, 1.15, 0.6, 1) both;

    &.active {
      animation-name: ${FadeIn};
    }
    &.active-scale-up {
      animation-name: ${FadeIn};
    }
    &.exit-scale-down {
      z-index: 3;
      animation-name: ${FadeOut};
    }
    &.exit {
      z-index: 3;
      animation-name: ${FadeOut};
      animation-delay: 0ms;
    }
  }
`;
const PageContents = styled(motion.div) `
  margin: 0 auto;
  width: fit-content;
  padding: 29px 24px 24px;
  backface-visibility: hidden;
`;
const ModalContainer = styled.div `
  z-index: 2147483646; // z-index set one below max (2147483647) for if we wish to layer things ontop of the modal in a seperate Portal
  position: fixed;
  inset: 0;
`;
const CloseButton = styled(motion.button) `
  z-index: 3;
  cursor: pointer;
  position: absolute;
  top: 22px;
  right: 17px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  padding: 0;
  margin: 0;
  color: var(--ck-body-action-color);
  background: var(--ck-body-background);
  transition: background-color 200ms ease, transform 100ms ease;
  /* will-change: transform; */
  svg {
    display: block;
  }

  &:hover {
    background: var(--ck-body-background-secondary);
  }
  &:active {
    transform: scale(0.9);
  }
`;
const SiweButton = styled(motion.button) `
  z-index: 3;
  position: absolute;
  inset: 0;
  width: 100%; // FireFox fix
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  padding: 0;
  margin: 0;
  color: var(--ck-body-action-color);
  background: var(--ck-body-background);
  transition: background-color 200ms ease, transform 100ms ease;
  /* will-change: transform; */
  svg {
    display: block;
    position: relative;
  }

  &:enabled {
    cursor: pointer;
    &:hover {
      background: var(--ck-body-background-secondary);
    }
    &:active {
      transform: scale(0.9);
    }
  }
`;
const BackButton = styled(motion.button) `
  z-index: 3;
  position: absolute;
  inset: 0;
  width: 100%; // FireFox fix
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  padding: 0;
  margin: 0;
  color: var(--ck-body-action-color);
  background: var(--ck-body-background);
  transition: background-color 200ms ease, transform 100ms ease;
  /* will-change: transform; */
  svg {
    display: block;
    position: relative;
    left: -1px;
  }

  &:enabled {
    cursor: pointer;
    &:hover {
      background: var(--ck-body-background-secondary);
    }
    &:active {
      transform: scale(0.9);
    }
  }
`;
const InfoButton = styled(motion.button) `
  z-index: 3;
  position: absolute;
  inset: 0;
  width: 100%; // FireFox fix
  transform: translateX(-1px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  padding: 0;
  margin: 0;
  color: var(--ck-body-action-color);
  background: var(--ck-body-background);
  transition: background-color 200ms ease, transform 100ms ease;
  /* will-change: transform; */
  svg {
    display: block;
    position: relative;
  }
  &:enabled {
    cursor: pointer;
    &:hover {
      background: var(--ck-body-background-secondary);
    }
    &:active {
      transform: scale(0.9);
    }
  }
`;
const Container$7 = styled(motion.div) `
  --ease: cubic-bezier(0.25, 0.1, 0.25, 1);
  --duration: 200ms;
  --transition: height var(--duration) var(--ease),
    width var(--duration) var(--ease);
  z-index: 3;
  display: block;
  pointer-events: none;
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  transform: translate3d(-50%, -50%, 0);
  backface-visibility: hidden;
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    pointer-events: auto;
    left: 0;
    top: auto;
    bottom: -5px;
    transform: none;
    ${BoxContainer} {
      max-width: 448px;
      margin: 0 auto;
      &:before {
        width: 100%;
        border-radius: var(--ck-border-radius, 30px)
          var(--ck-border-radius, 30px) 0 0;
      }
    }
    ${PageContainer} {
      left: 0;
      right: 0;
      margin: 0 auto;
      width: auto;
    }
    ${PageContent} {
      margin: 0 auto;
      width: 100% !important;
    }
    ${ModalHeading} {
      top: 29px;
    }
    ${ModalContent} {
      gap: 12px;
    }
    ${ModalBody} {
      margin: 0 auto;
      max-width: 295px;
    }
    ${PageContents} {
      width: 100%;
      padding: 31px 24px;
    }
    ${ControllerContainer} {
      width: 100%;
      top: 4px;
      border-bottom: 0;
    }
    ${CloseButton} {
      right: 22px;
    }
    ${BackButton} {
      top: -1px;
      left: -3px;
    }
    ${InfoButton} {
      top: -1px;
      left: -3px;
      svg {
        width: 65%;
        height: auto;
      }
    }
    ${CloseButton},
    ${BackButton},
    ${InfoButton} {
      // Quick hack for bigger tappable area on mobile
      transform: scale(1.4) !important;
      background: transparent !important;
      svg {
        transform: scale(0.8) !important;
      }
    }
  }
`;
const Disclaimer = styled(motion.div) `
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px -24px -24px -24px;
  padding: 15px 40px 18px;
  font-size: var(--ck-body-disclaimer-font-size, 13px);
  font-weight: var(--ck-body-disclaimer-font-weight, 400);
  text-align: center;
  line-height: 19px;
  color: var(--ck-body-disclaimer-color, var(--ck-body-color-muted, inherit));

  & a {
    color: var(--ck-body-disclaimer-link-color, inherit);
    font-weight: var(--ck-body-disclaimer-font-weight, 400);
    text-decoration: none;
    transition: color 200ms ease;
    &:hover {
      color: var(--ck-body-disclaimer-link-hover-color, inherit);
    }
  }

  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    margin: 24px -24px -26px -24px;
    padding: 20px 42px 22px 42px;
  }
`;
const DisclaimerBackground = styled(motion.div) `
  pointer-events: all;
  z-index: 9;
  position: absolute;
  bottom: 0;
  left: 50%;
  width: var(--width);
  backface-visibility: hidden;
  transform: translateX(-50%);
  transform-origin: bottom center;

  border-radius: var(--ck-border-radius, 30px);
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  transition: width 200ms ease;

  background: var(
    --ck-body-disclaimer-background,
    var(--ck-body-background-secondary)
  );
  box-shadow: var(--ck-body-disclaimer-box-shadow);

  ${Disclaimer} {
    margin: 0 !important;
    /* visibility: hidden; */
  }

  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    border-radius: 0;
  }
`;
const SignInTooltip = styled(motion.div) `
  z-index: 2;
  position: absolute;
  top: 100%;
  white-space: nowrap;
  padding: 8px 16px;
  color: #fff;
  font-size: 13px;
  line-height: 1.5;
  background: #1a88f8;
  border-radius: calc(var(--ck-border-radius) * 0.75);
  transform: translateY(8px) translateX(-48px);
  box-shadow: var(--ck-modal-box-shadow);
  &:before {
    content: '';
    position: absolute;
    box-shadow: var(--shadow);
    width: 18px;
    height: 18px;
    transform: translate(215%, -75%) rotate(45deg);
    background: inherit;
    border-radius: 3px 0 0 0;
  }

  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    transform: translateY(8px) translateX(-16px);
    &:before {
      transform: translate(40%, -75%) rotate(45deg);
    }
  }
`;

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
function useLockBodyScroll(initialLocked) {
    const [locked, setLocked] = useState(initialLocked);
    const context = useContext();
    useIsomorphicLayoutEffect(() => {
        var _a;
        if (!locked)
            return;
        const original = {
            overflow: document.body.style.overflow,
            position: document.body.style.position,
            touchAction: document.body.style.touchAction,
            paddingRight: document.body.style.paddingRight,
            //htmlOverflow: document.documentElement.style.overflow,
        };
        const style = getComputedStyle(document.body);
        const offsetX = parseInt(style.marginRight) +
            parseInt(style.paddingRight) +
            parseInt(style.borderRight) +
            parseInt(style.marginLeft) +
            parseInt(style.paddingLeft) +
            parseInt(style.borderLeft);
        const scrollBarWidth = window.innerWidth - document.body.offsetWidth - offsetX;
        document.documentElement.style.setProperty('--ck-scrollbar-width', `${scrollBarWidth}px`);
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'relative';
        document.body.style.touchAction = 'none';
        //document.documentElement.style.overflow = 'hidden'; // overflow:hidden; on <html> breaks position:sticky;
        if ((_a = context.options) === null || _a === void 0 ? void 0 : _a.avoidLayoutShift) {
            document.body.style.paddingRight = `${scrollBarWidth}px`;
        }
        return () => {
            var _a;
            document.documentElement.style.removeProperty('--ck-scrollbar-width');
            document.body.style.overflow = original.overflow;
            document.body.style.position = original.position;
            document.body.style.touchAction = original.touchAction;
            //document.documentElement.style.overflow = original.htmlOverflow;
            if ((_a = context.options) === null || _a === void 0 ? void 0 : _a.avoidLayoutShift) {
                document.body.style.paddingRight = original.paddingRight;
            }
        };
    }, [locked]);
    useEffect(() => {
        if (locked !== initialLocked)
            setLocked(initialLocked);
    }, [initialLocked]);
    return [locked, setLocked];
}

const KEYCODE_TAB = 9;
function useFocusTrap() {
    const elRef = useRef(null);
    function handleFocus(e) {
        if (!elRef.current)
            return;
        var focusableEls = elRef.current.querySelectorAll(`
        a[href]:not(:disabled),
        button:not(:disabled),
        textarea:not(:disabled),
        input[type="text"]:not(:disabled),
        input[type="radio"]:not(:disabled),
        input[type="checkbox"]:not(:disabled),
        select:not(:disabled)
      `), firstFocusableEl = focusableEls[0], lastFocusableEl = focusableEls[focusableEls.length - 1];
        var isTabPressed = e.key === 'Tab' || e.keyCode === KEYCODE_TAB;
        if (!isTabPressed) {
            return;
        }
        if (e.shiftKey) {
            /* shift + tab */ if (document.activeElement === firstFocusableEl) {
                lastFocusableEl.focus();
                e.preventDefault();
            }
        } /* tab */
        else {
            if (document.activeElement === lastFocusableEl) {
                firstFocusableEl.focus();
                e.preventDefault();
            }
        }
    }
    useEffect(() => {
        if (elRef.current) {
            elRef.current.addEventListener('keydown', handleFocus);
            elRef.current.focus({ preventScroll: true });
        }
        return () => {
            if (elRef.current) {
                elRef.current.removeEventListener('keydown', handleFocus);
            }
        };
    }, []);
    return elRef;
}
function FocusTrap(props) {
    const elRef = useFocusTrap();
    useEffect(() => {
        if (!elRef.current)
            return;
        elRef.current.focus({ preventScroll: true });
    }, []);
    return (jsx("div", { ref: elRef, tabIndex: 0, children: props.children }));
}

function usePrevious(value, initial) {
    const ref = useRef({ target: value, previous: initial });
    if (ref.current.target !== value) {
        // The value changed.
        ref.current.previous = ref.current.target;
        ref.current.target = value;
    }
    return ref.current.previous;
}

const Context$1 = createContext(null);
const ConnectKitThemeProvider = ({ children, theme = 'auto', mode = 'auto', customTheme }) => {
    const value = {
        theme,
        mode,
        customTheme,
    };
    return createElement(Context$1.Provider, { value }, jsx(Fragment, { children: children }));
};
const useThemeContext = () => {
    const context = React.useContext(Context$1);
    if (!context)
        throw Error('ConnectKitThemeProvider must be inside a Provider.');
    return context;
};

const Scan = ({ ...props }) => (jsx("svg", { "aria-hidden": "true", width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M0 2.82561C0 1.26507 1.26507 0 2.82561 0H4.59161C6.15215 0 7.41722 1.26507 7.41722 2.82561V4.59161C7.41722 6.15215 6.15215 7.41722 4.59161 7.41722H2.82561C1.26507 7.41722 0 6.15215 0 4.59161V2.82561ZM2.82561 1.69536C2.20139 1.69536 1.69536 2.20139 1.69536 2.82561V4.59161C1.69536 5.21583 2.20139 5.72185 2.82561 5.72185H4.59161C5.21583 5.72185 5.72185 5.21583 5.72185 4.59161V2.82561C5.72185 2.20139 5.21583 1.69536 4.59161 1.69536H2.82561ZM0 11.4084C0 9.84791 1.26507 8.58284 2.82561 8.58284H4.59161C6.15215 8.58284 7.41722 9.8479 7.41722 11.4084V13.1744C7.41722 14.735 6.15215 16.0001 4.59161 16.0001H2.82561C1.26507 16.0001 0 14.735 0 13.1744V11.4084ZM2.82561 10.2782C2.20139 10.2782 1.69536 10.7842 1.69536 11.4084V13.1744C1.69536 13.7987 2.20139 14.3047 2.82561 14.3047H4.59161C5.21583 14.3047 5.72185 13.7987 5.72185 13.1744V11.4084C5.72185 10.7842 5.21583 10.2782 4.59161 10.2782H2.82561ZM11.4083 0C9.84779 0 8.58272 1.26507 8.58272 2.82561V4.59161C8.58272 6.15215 9.84779 7.41722 11.4083 7.41722H13.1743C14.7349 7.41722 15.9999 6.15215 15.9999 4.59161V2.82561C15.9999 1.26507 14.7349 0 13.1743 0H11.4083ZM10.2781 2.82561C10.2781 2.20139 10.7841 1.69536 11.4083 1.69536H13.1743C13.7985 1.69536 14.3046 2.20139 14.3046 2.82561V4.59161C14.3046 5.21583 13.7985 5.72185 13.1743 5.72185H11.4083C10.7841 5.72185 10.2781 5.21583 10.2781 4.59161V2.82561ZM15.7351 9.96026C15.7351 10.7795 15.0709 11.4437 14.2516 11.4437C13.4323 11.4437 12.7682 10.7795 12.7682 9.96026C12.7682 9.14098 13.4323 8.47682 14.2516 8.47682C15.0709 8.47682 15.7351 9.14098 15.7351 9.96026ZM9.96026 11.4437C10.7795 11.4437 11.4437 10.7795 11.4437 9.96026C11.4437 9.14098 10.7795 8.47682 9.96026 8.47682C9.14098 8.47682 8.47682 9.14098 8.47682 9.96026C8.47682 10.7795 9.14098 11.4437 9.96026 11.4437ZM15.7351 14.2517C15.7351 15.071 15.0709 15.7352 14.2516 15.7352C13.4323 15.7352 12.7682 15.071 12.7682 14.2517C12.7682 13.4325 13.4323 12.7683 14.2516 12.7683C15.0709 12.7683 15.7351 13.4325 15.7351 14.2517ZM9.96026 15.7352C10.7795 15.7352 11.4437 15.071 11.4437 14.2517C11.4437 13.4325 10.7795 12.7683 9.96026 12.7683C9.14098 12.7683 8.47682 13.4325 8.47682 14.2517C8.47682 15.071 9.14098 15.7352 9.96026 15.7352Z", fill: "currentColor", fillOpacity: "0.3" }) }));
const ExternalLinkIcon = ({ ...props }) => (jsxs("svg", { "aria-hidden": "true", width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: {
        left: 0,
        top: 0,
    }, ...props, children: [jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4 4C2.89543 4 2 4.89543 2 6V12C2 13.1046 2.89543 14 4 14H10C11.1046 14 12 13.1046 12 12V9.66667C12 9.11438 12.4477 8.66667 13 8.66667C13.5523 8.66667 14 9.11438 14 9.66667V12C14 14.2091 12.2091 16 10 16H4C1.79086 16 0 14.2091 0 12V6C0 3.79086 1.79086 2 4 2H6.33333C6.88562 2 7.33333 2.44772 7.33333 3C7.33333 3.55228 6.88562 4 6.33333 4H4Z", fill: "currentColor", fillOpacity: 0.3 }), jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M9.5 1C9.5 0.447715 9.94772 0 10.5 0H15C15.5523 0 16 0.447715 16 1V5.5C16 6.05228 15.5523 6.5 15 6.5C14.4477 6.5 14 6.05228 14 5.5V3.41421L8.70711 8.70711C8.31658 9.09763 7.68342 9.09763 7.29289 8.70711C6.90237 8.31658 6.90237 7.68342 7.29289 7.29289L12.5858 2H10.5C9.94772 2 9.5 1.55228 9.5 1Z", fill: "currentColor", fillOpacity: 0.3 })] }));
const AlertIcon = ({ ...props }) => {
    return (jsxs("svg", { "aria-hidden": "true", width: "19", height: "18", viewBox: "0 0 19 18", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props, children: [jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6.81753 1.60122C7.39283 0.530035 8.46953 0 9.50409 0C10.5507 0 11.6022 0.539558 12.1805 1.59767L18.6047 13.3334C18.882 13.8283 19 14.3568 19 14.8622C19 16.5296 17.7949 18 15.9149 18H3.08514C1.20508 18 0 16.5296 0 14.8622C0 14.3454 0.131445 13.8172 0.405555 13.3379L6.81753 1.60122ZM9.50409 2C9.13355 2 8.77256 2.18675 8.57866 2.54907L8.57458 2.5567L2.14992 14.3166L2.144 14.3268C2.04638 14.4959 2 14.6817 2 14.8622C2 15.5497 2.43032 16 3.08514 16H15.9149C16.5697 16 17 15.5497 17 14.8622C17 14.6681 16.9554 14.4805 16.8588 14.309L16.8529 14.2986L10.4259 2.55741C10.2191 2.1792 9.86395 2 9.50409 2Z", fill: "currentColor" }), jsx("path", { d: "M9.5 11.2297C9.01639 11.2297 8.7459 10.9419 8.72951 10.4186L8.60656 6.4157C8.59016 5.88372 8.95902 5.5 9.4918 5.5C10.0164 5.5 10.4016 5.89244 10.3852 6.42442L10.2623 10.4099C10.2377 10.9419 9.96721 11.2297 9.5 11.2297ZM9.5 14.5C8.95082 14.5 8.5 14.0901 8.5 13.5058C8.5 12.9215 8.95082 12.5116 9.5 12.5116C10.0492 12.5116 10.5 12.9128 10.5 13.5058C10.5 14.0988 10.041 14.5 9.5 14.5Z", fill: "currentColor" })] }));
};
const DisconnectIcon = ({ ...props }) => {
    return (jsx("svg", { "aria-hidden": "true", width: "15", height: "14", viewBox: "0 0 15 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: {
            left: 0,
            top: 0,
        }, ...props, children: jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4 0C1.79086 0 0 1.79086 0 4V10C0 12.2091 1.79086 14 4 14H6C6.55228 14 7 13.5523 7 13C7 12.4477 6.55228 12 6 12H4C2.89543 12 2 11.1046 2 10V4C2 2.89543 2.89543 2 4 2H6C6.55228 2 7 1.55228 7 1C7 0.447715 6.55228 0 6 0H4ZM11.7071 3.29289C11.3166 2.90237 10.6834 2.90237 10.2929 3.29289C9.90237 3.68342 9.90237 4.31658 10.2929 4.70711L11.5858 6H9.5H6C5.44772 6 5 6.44772 5 7C5 7.55228 5.44772 8 6 8H9.5H11.5858L10.2929 9.29289C9.90237 9.68342 9.90237 10.3166 10.2929 10.7071C10.6834 11.0976 11.3166 11.0976 11.7071 10.7071L14.7071 7.70711C15.0976 7.31658 15.0976 6.68342 14.7071 6.29289L11.7071 3.29289Z", fill: "currentColor", fillOpacity: "0.4" }) }));
};
const TickIcon = ({ ...props }) => {
    return (jsx("svg", { "aria-hidden": "true", width: "18", height: "18", viewBox: "0 0 18 18", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props, children: jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18ZM13.274 7.13324C13.6237 6.70579 13.5607 6.07577 13.1332 5.72604C12.7058 5.37632 12.0758 5.43932 11.726 5.86676L7.92576 10.5115L6.20711 8.79289C5.81658 8.40237 5.18342 8.40237 4.79289 8.79289C4.40237 9.18342 4.40237 9.81658 4.79289 10.2071L7.29289 12.7071C7.49267 12.9069 7.76764 13.0128 8.04981 12.9988C8.33199 12.9847 8.59505 12.8519 8.77396 12.6332L13.274 7.13324Z", fill: "currentColor" }) }));
};
const RetryIconCircle = ({ ...props }) => {
    return (jsx("svg", { "aria-hidden": "true", width: "32", height: "32", viewBox: "0 0 32 32", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props, children: jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16ZM24.5001 8.74263C25.0834 8.74263 25.5563 9.21551 25.5563 9.79883V14.5997C25.5563 15.183 25.0834 15.6559 24.5001 15.6559H19.6992C19.1159 15.6559 18.643 15.183 18.643 14.5997C18.643 14.0164 19.1159 13.5435 19.6992 13.5435H21.8378L20.071 11.8798C20.0632 11.8724 20.0555 11.865 20.048 11.8574C19.1061 10.915 17.8835 10.3042 16.5643 10.1171C15.2452 9.92999 13.9009 10.1767 12.7341 10.82C11.5674 11.4634 10.6413 12.4685 10.0955 13.684C9.54968 14.8994 9.41368 16.2593 9.70801 17.5588C10.0023 18.8583 10.711 20.0269 11.7273 20.8885C12.7436 21.7502 14.0124 22.2582 15.3425 22.336C16.6726 22.4138 17.9919 22.0572 19.1017 21.3199C19.5088 21.0495 19.8795 20.7333 20.2078 20.3793C20.6043 19.9515 21.2726 19.9262 21.7004 20.3228C22.1282 20.7194 22.1534 21.3876 21.7569 21.8154C21.3158 22.2912 20.8176 22.7161 20.2706 23.0795C18.7793 24.0702 17.0064 24.5493 15.2191 24.4448C13.4318 24.3402 11.7268 23.6576 10.3612 22.4998C8.9956 21.3419 8.0433 19.7716 7.6478 18.0254C7.2523 16.2793 7.43504 14.4519 8.16848 12.8186C8.90192 11.1854 10.1463 9.83471 11.7142 8.97021C13.282 8.10572 15.0884 7.77421 16.861 8.02565C18.6282 8.27631 20.2664 9.09278 21.5304 10.3525L23.4439 12.1544V9.79883C23.4439 9.21551 23.9168 8.74263 24.5001 8.74263Z", fill: "currentColor" }) }));
};
const RetryIcon = ({ ...props }) => (jsxs("svg", { "aria-hidden": "true", width: "16", height: "14", viewBox: "0 0 16 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props, children: [jsx("path", { d: "M14.5 2V6H10.5", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M14 5.66537L10.9899 2.75871C10.0931 1.83853 8.92897 1.24216 7.6729 1.05947C6.41683 0.876774 5.13688 1.11765 4.02592 1.7458C2.91497 2.37395 2.0332 3.35534 1.5135 4.54208C0.993792 5.72883 0.864305 7.05663 1.14455 8.3254C1.42479 9.59418 2.09958 10.7352 3.06724 11.5765C4.03489 12.4178 5.24298 12.9138 6.50946 12.9898C7.77594 13.0657 9.03219 12.7176 10.0889 11.9977C10.4765 11.7337 10.8295 11.4249 11.142 11.0792", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })] }));
const CopyToClipboardIcon$1 = ({ ...props }) => (jsxs("svg", { "aria-hidden": "true", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props, children: [jsx("path", { d: "M14 9.5V7C14 5.89543 13.1046 5 12 5H7C5.89543 5 5 5.89543 5 7V12C5 13.1046 5.89543 14 7 14H9.5", stroke: "var(--ck-body-color-muted)", strokeWidth: "2" }), jsx("rect", { x: "10", y: "10", width: "9", height: "9", rx: "2", stroke: "var(--ck-body-color-muted)", strokeWidth: "2" }), jsx("path", { d: "M1 3L3 5L7 1", stroke: "var(--ck-body-color)", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round" })] }));
const AuthIcon = ({ ...props }) => (jsx("div", { ...props, style: {
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        right: 0,
        background: '#34C759',
        borderRadius: 10,
        boxShadow: '0 0 0 1.5px var(--background)',
        width: 10,
        height: 10,
        ...props === null || props === void 0 ? void 0 : props.style,
    }, children: jsx("svg", { "aria-hidden": "true", width: "6", height: "6", viewBox: "0 0 6 6", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: jsx("path", { d: "M0.75 3L2.25 4.5L5.25 1.5", stroke: "white", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) }) }));

//import { useQuery } from 'wagmi';
var StatusState;
(function (StatusState) {
    StatusState["READY"] = "ready";
    StatusState["LOADING"] = "loading";
    StatusState["SUCCESS"] = "success";
    StatusState["REJECTED"] = "rejected";
    StatusState["ERROR"] = "error";
})(StatusState || (StatusState = {}));
const SIWEContext = createContext(null);

// Consumer-facing hook
const useSIWE = ({ onSignIn, onSignOut } = {}) => {
    const siweContextValue = useContext$1(SIWEContext);
    if (!siweContextValue) {
        // If we throw an error here then this will break non-SIWE apps, so best to just respond with not signed in.
        //throw new Error('useSIWE hook must be inside a SIWEProvider.');
        return {
            isSignedIn: false,
            data: undefined,
            status: StatusState.ERROR,
            error: new Error('useSIWE hook must be inside a SIWEProvider.'),
            isRejected: false,
            isError: true,
            isLoading: false,
            isSuccess: false,
            isReady: false,
            reset: () => { },
            signIn: () => Promise.reject(),
            signOut: () => Promise.reject(),
        };
    }
    const { session, nonce, status, signOut, signIn, resetStatus } = siweContextValue;
    const { address, chainId } = session.data || {};
    const currentStatus = address
        ? StatusState.SUCCESS
        : session.isLoading || nonce.isLoading
            ? StatusState.LOADING
            : status;
    const isLoading = currentStatus === StatusState.LOADING;
    const isSuccess = currentStatus === StatusState.SUCCESS;
    const isRejected = currentStatus === StatusState.REJECTED;
    const isError = currentStatus === StatusState.ERROR;
    const isReady = !address || nonce.isFetching || isLoading || isSuccess;
    const reset = () => resetStatus();
    const isSignedIn = !!address;
    return {
        isSignedIn,
        data: isSignedIn
            ? {
                address: address,
                chainId: chainId,
            }
            : undefined,
        status: currentStatus,
        error: session.error || nonce.error,
        isRejected,
        isError,
        isLoading,
        isSuccess,
        isReady,
        signIn: async () => {
            if (!isSignedIn) {
                const data = await signIn();
                if (data)
                    onSignIn === null || onSignIn === void 0 ? void 0 : onSignIn(data);
            }
        },
        signOut: async () => {
            if (isSignedIn) {
                await signOut();
                onSignOut === null || onSignOut === void 0 ? void 0 : onSignOut();
            }
        },
        reset,
    };
};

const SIWEProvider = ({ children, enabled = true, nonceRefetchInterval = 1000 * 60 * 5, sessionRefetchInterval = 1000 * 60 * 5, signOutOnDisconnect = true, signOutOnAccountChange = true, signOutOnNetworkChange = true, onSignIn, onSignOut, ...siweConfig }) => {
    const [status, setStatus] = useState(StatusState.READY);
    const resetStatus = () => setStatus(StatusState.READY);
    // Only allow for mounting SIWEProvider once, so we avoid weird global state
    // collisions.
    if (useContext$1(SIWEContext)) {
        throw new Error('Multiple, nested usages of SIWEProvider detected. Please use only one.');
    }
    // SIWEProvider must be wrapped outside of ConnectKitProvider so that the
    // ConnectKitButton and other UI can use SIWE context values.
    if (useContext$1(Context)) {
        throw new Error('ConnectKitProvider must be mounted inside SIWEProvider.');
    }
    const nonce = useQuery(['ckSiweNonce'], () => siweConfig.getNonce(), {
        initialData: null,
        refetchInterval: nonceRefetchInterval,
    });
    const session = useQuery(['ckSiweSession'], siweConfig.getSession, {
        initialData: null,
        refetchInterval: sessionRefetchInterval,
    });
    const sessionData = session.data;
    const signOutAndRefetch = async () => {
        if (!sessionData)
            return false; // No session to sign out of
        setStatus(StatusState.LOADING);
        if (!(await siweConfig.signOut())) {
            throw new Error('Failed to sign out.');
        }
        await Promise.all([session.refetch(), nonce.refetch()]);
        setStatus(StatusState.READY);
        onSignOut === null || onSignOut === void 0 ? void 0 : onSignOut();
        return true;
    };
    const { address: connectedAddress } = useAccount({
        onDisconnect: () => {
            if (signOutOnDisconnect) {
                // For security reasons we sign out the user when a wallet disconnects.
                signOutAndRefetch();
            }
        },
    });
    const { address } = useAccount();
    const { chain } = useNetwork();
    const { signMessageAsync } = useSignMessage();
    const onError = (error) => {
        console.error('signIn error', error.code, error.message);
        switch (error.code) {
            case -32000: // WalletConnect: user rejected
            case 4001: // MetaMask: user rejected
            case 'ACTION_REJECTED': // MetaMask: user rejected
                setStatus(StatusState.REJECTED);
                break;
            default:
                setStatus(StatusState.ERROR);
        }
    };
    const signIn = async () => {
        try {
            if (!siweConfig) {
                throw new Error('SIWE not configured');
            }
            const chainId = chain === null || chain === void 0 ? void 0 : chain.id;
            if (!address)
                throw new Error('No address found');
            if (!chainId)
                throw new Error('No chainId found');
            if (!nonce.data) {
                throw new Error('Could not fetch nonce');
            }
            setStatus(StatusState.LOADING);
            const message = siweConfig.createMessage({
                address,
                chainId,
                nonce: nonce === null || nonce === void 0 ? void 0 : nonce.data,
            });
            // Ask user to sign message with their wallet
            const signature = await signMessageAsync({
                message,
            });
            // Verify signature
            if (!(await siweConfig.verifyMessage({ message, signature }))) {
                throw new Error('Error verifying SIWE signature');
            }
            const data = await session.refetch().then((res) => {
                var _a;
                onSignIn === null || onSignIn === void 0 ? void 0 : onSignIn((_a = res === null || res === void 0 ? void 0 : res.data) !== null && _a !== void 0 ? _a : undefined);
                return res === null || res === void 0 ? void 0 : res.data;
            });
            setStatus(StatusState.READY);
            return data;
        }
        catch (error) {
            onError(error);
            return false;
        }
    };
    useEffect(() => {
        // Skip if we're still fetching session state from backend
        if (!sessionData || !sessionData.address || !sessionData.chainId)
            return;
        // Skip if wallet isn't connected (i.e. initial page load)
        if (!connectedAddress || !chain)
            return;
        // If SIWE session no longer matches connected account, sign out
        if (signOutOnAccountChange &&
            getAddress(sessionData.address) !== getAddress(connectedAddress)) {
            console.warn('Wallet account changed, signing out of SIWE session');
            signOutAndRefetch();
        }
        // The SIWE spec includes a chainId parameter for contract-based accounts,
        // so we're being extra cautious about keeping the SIWE session and the
        // connected account/network in sync. But this can be disabled when
        // configuring the SIWEProvider.
        else if (signOutOnNetworkChange && sessionData.chainId !== chain.id) {
            console.warn('Wallet network changed, signing out of SIWE session');
            signOutAndRefetch();
        }
    }, [sessionData, connectedAddress, chain]);
    return (jsx(SIWEContext.Provider, { value: {
            enabled,
            nonceRefetchInterval,
            sessionRefetchInterval,
            signOutOnDisconnect,
            signOutOnAccountChange,
            signOutOnNetworkChange,
            ...siweConfig,
            nonce,
            session,
            signIn,
            signOut: signOutAndRefetch,
            status,
            resetStatus,
        }, children: children }));
};

const enUS = {
    connectWallet: 'Connect Wallet',
    disconnect: 'Disconnect',
    connected: 'Connected',
    wrongNetwork: 'Wrong Network',
    switchNetworks: 'Switch Networks',
    chainNetwork: '{{ CHAIN }} Network',
    copyToClipboard: 'Copy to Clipboard',
    copyCode: 'Copy Code',
    moreInformation: 'More Information',
    back: 'Back',
    close: 'Close',
    or: 'or',
    more: 'More',
    tryAgain: 'Try Again',
    tryAgainQuestion: 'Try Again?',
    dontHaveTheApp: "Don't have the app?",
    scanTheQRCode: 'Scan the QR code',
    useWalletConnectModal: 'Use WalletConnect Modal',
    useModal: 'Use Modal',
    installTheExtension: 'Install the Extension',
    getWalletName: 'Get {{ CONNECTORNAME }}',
    otherWallets: 'Other Wallets',
    learnMore: 'Learn More',
    getWallet: 'Get a Wallet',
    approveInWallet: 'Approve in Wallet',
    confirmInWallet: 'Confirm in Wallet',
    awaitingConfirmation: 'Awaiting Confirmation',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    signedIn: 'Signed In',
    signedOut: 'Signed Out',
    walletNotConnected: 'Wallet Not Connected',
    warnings_walletSwitchingUnsupported: `Your wallet does not support switching networks from this app.`,
    warnings_walletSwitchingUnsupportedResolve: `Try switching networks from within your wallet instead.`,
    warnings_chainUnsupported: `This app does not support the current connected network.`,
    warnings_chainUnsupportedResolve: `Switch or disconnect to continue.`,
    onboardingScreen_heading: `Get a Wallet`,
    onboardingScreen_h1: `Start Exploring Web3`,
    onboardingScreen_p: `Your wallet is the gateway to all things Ethereum, the magical technology that makes it possible to explore web3.`,
    onboardingScreen_ctaText: `Choose Your First Wallet`,
    onboardingScreen_ctaUrl: `https://ethereum.org/en/wallets/find-wallet/`,
    aboutScreen_heading: `About Wallets`,
    aboutScreen_a_h1: `For your digital assets`,
    aboutScreen_a_p: `Wallets let you send, receive, store, and interact with digital assets like NFTs and other Ethereum tokens.`,
    aboutScreen_b_h1: `A better way to login`,
    aboutScreen_b_p: `With modern apps, your wallet can be used as an easy way to login, instead of having to remember a password.`,
    aboutScreen_c_h1: `Explore the world of web3`,
    aboutScreen_c_p: `Your wallet is an essential utility that lets you explore and participate in the fast evolving world of web3.`,
    aboutScreen_ctaText: `Learn More`,
    aboutScreen_ctaUrl: `https://ethereum.org/en/wallets/`,
    connectorsScreen_heading: `Connect Wallet`,
    connectorsScreen_newcomer: `I don’t have a wallet`,
    connectorsScreen_h1: `What is a wallet?`,
    connectorsScreen_p: `Wallets are used to send, receive, and store digital assets. Connecting a wallet lets you interact with apps.`,
    mobileConnectorsScreen_heading: `Choose Wallet`,
    scanScreen_heading: `Scan with Phone`,
    scanScreen_heading_withConnector: `Scan with {{ CONNECTORNAME }}`,
    scanScreen_tooltip_walletConnect: `Open a [WALLETCONNECTLOGO] WalletConnect \nsupported wallet to scan`,
    scanScreen_tooltip_default: `Open {{ CONNECTORNAME }} on \nyour mobile phone to scan`,
    downloadAppScreen_heading: `Get {{ CONNECTORNAME }}`,
    downloadAppScreen_iosAndroid: `Scan with your phone camera to download on iOS or Android.`,
    downloadAppScreen_ios: `Scan with your phone camera to download on iOS.`,
    downloadAppScreen_android: `Scan with your phone camera to download Android.`,
    injectionScreen_unavailable_h1: `Unsupported Browser`,
    injectionScreen_unavailable_p: `To connect your {{ CONNECTORSHORTNAME }} wallet,\ninstall the extension on {{ SUGGESTEDEXTENSIONBROWSER }}.`,
    injectionScreen_install_h1: `Install {{ CONNECTORNAME }}`,
    injectionScreen_install_p: `To connect your {{ CONNECTORSHORTNAME }} wallet,\ninstall the browser extension.`,
    injectionScreen_connecting_h1: `Requesting Connection`,
    injectionScreen_connecting_p: `Open the {{ CONNECTORSHORTNAME }} browser \nextension to connect your wallet.`,
    injectionScreen_connecting_injected_h1: `Requesting Connection`,
    injectionScreen_connecting_injected_p: `Accept the request through your wallet to connect to this app.`,
    injectionScreen_connected_h1: `Already Connected`,
    injectionScreen_connected_p: `It is now okay to close this popup`,
    injectionScreen_rejected_h1: `Request Cancelled`,
    injectionScreen_rejected_p: `You cancelled the request.\nClick above to try again.`,
    injectionScreen_failed_h1: `Connection Failed`,
    injectionScreen_failed_p: `Sorry, something went wrong.\nPlease try connecting again.`,
    injectionScreen_notconnected_h1: `Login to {{ CONNECTORNAME }}`,
    injectionScreen_notconnected_p: `To continue, please login to your {{ CONNECTORNAME }} extension.`,
    profileScreen_heading: 'Connected',
    switchNetworkScreen_heading: 'Switch Networks',
    signInWithEthereumScreen_tooltip: 'You’re not signed in to this app.\n**Sign In With Ethereum** to continue.',
    signInWithEthereumScreen_signedOut_heading: 'Sign In With Ethereum',
    signInWithEthereumScreen_signedOut_h1: 'This app would like to verify you \n as the owner of this wallet.',
    signInWithEthereumScreen_signedOut_p: `Please sign the message request \n in your wallet to continue.`,
    signInWithEthereumScreen_signedOut_button: 'Sign In',
    signInWithEthereumScreen_signedIn_heading: 'Signed In With Ethereum',
    signInWithEthereumScreen_signedIn_h1: 'You successfully verified yourself \n as the owner of this wallet.',
    signInWithEthereumScreen_signedIn_p: `Signing out will require you to \n authenticate again in the future.`,
    signInWithEthereumScreen_signedIn_button: 'Sign Out',
};

const esES = {
    connectWallet: 'Conecta una cartera',
    disconnect: 'Desconectar',
    connected: 'Conectado',
    wrongNetwork: 'Red incorrecta',
    switchNetworks: 'Cambio de red',
    chainNetwork: 'Red {{ CHAIN }}',
    copyToClipboard: 'Copiar al portapapeles',
    copyCode: 'Copiar código',
    moreInformation: 'Más información',
    back: 'Atrás',
    close: 'Cerrar',
    or: 'o',
    more: 'Más',
    tryAgain: 'Intentar de nuevo',
    tryAgainQuestion: '¿Intentar de nuevo?',
    dontHaveTheApp: '¿No tienes la aplicación?',
    scanTheQRCode: 'Escanea el código QR',
    useWalletConnectModal: 'Utilizar WalletConnect Modal',
    useModal: 'Utilizar Modal',
    installTheExtension: 'Instalar la extensión',
    getWalletName: 'Obtén {{ CONNECTORNAME }}',
    otherWallets: 'Otras carteras',
    learnMore: 'Más información',
    getWallet: 'Obtén una cartera',
    approveInWallet: 'Aprobar en la cartera',
    confirmInWallet: 'Confirmar en la cartera',
    awaitingConfirmation: 'A la espera de confirmación',
    signIn: 'Iniciar sesión',
    signOut: 'Cerrar sesión',
    signedIn: 'Sesión iniciada',
    signedOut: 'Sesión cerrada',
    walletNotConnected: 'Cartera no conectada',
    warnings_walletSwitchingUnsupported: `Tu cartera no permite cambiar de red desde esta aplicación.`,
    warnings_walletSwitchingUnsupportedResolve: `Prueba a cambiar de red desde tu cartera.`,
    warnings_chainUnsupported: `Esta aplicación no es compatible con la red conectada actualmente.`,
    warnings_chainUnsupportedResolve: `Cambia o desconecta para continuar.`,
    onboardingScreen_heading: `Obtén una cartera`,
    onboardingScreen_h1: `Comienza a explorar la Web3`,
    onboardingScreen_p: `Tu cartera es el portal de acceso a todo lo relacionado con Ethereum, la tecnología mágica que permite explorar la Web3.`,
    onboardingScreen_ctaText: `Elige tu primera cartera`,
    onboardingScreen_ctaUrl: `https://ethereum.org/es/wallets/find-wallet/`,
    aboutScreen_heading: `Acerca de las carteras`,
    aboutScreen_a_h1: `Para tus activos digitales`,
    aboutScreen_a_p: `Las carteras te permiten enviar, recibir, almacenar e interactuar con activos digitales como los NFT y otros tokens de Ethereum.`,
    aboutScreen_b_h1: `Una manera mejor de iniciar sesión`,
    aboutScreen_b_p: `Con las aplicaciones modernas, puedes utilizar tu cartera para iniciar sesión fácilmente, en vez de tener que recordar una contraseña.`,
    aboutScreen_c_h1: `Explora el mundo de la Web3`,
    aboutScreen_c_p: `Tu cartera es una herramienta esencial que te permite explorar y participar en el mundo en rápida evolución de la Web3.`,
    aboutScreen_ctaText: `Más información`,
    aboutScreen_ctaUrl: `https://ethereum.org/es/wallets/`,
    connectorsScreen_heading: `Conecta una cartera`,
    connectorsScreen_newcomer: `No tengo una cartera`,
    connectorsScreen_h1: `¿Qué es una cartera?`,
    connectorsScreen_p: `Las carteras se utilizan para enviar, recibir y almacenar activos digitales. Si conectas una cartera, podrás interactuar con las aplicaciones.`,
    mobileConnectorsScreen_heading: `Elige una cartera`,
    scanScreen_heading: `Escanea con el teléfono`,
    scanScreen_heading_withConnector: `Escanea con {{ CONNECTORNAME }}`,
    scanScreen_tooltip_walletConnect: `Abre una cartera compatible con WalletConnect [WALLETCONNECTLOGO] para escanear`,
    scanScreen_tooltip_default: `Abre {{ CONNECTORNAME }} en tu teléfono móvil para escanear`,
    downloadAppScreen_heading: `Obtén {{ CONNECTORNAME }}`,
    downloadAppScreen_iosAndroid: `Escanea con la cámara de tu teléfono para descargarla en iOS o Android.`,
    downloadAppScreen_ios: `Escanea con la cámara de tu teléfono para descargarla en iOS.`,
    downloadAppScreen_android: `Escanea con la cámara de tu teléfono para descargarla en Android.`,
    injectionScreen_unavailable_h1: `Navegador no compatible`,
    injectionScreen_unavailable_p: `Para conectar tu cartera de {{ CONNECTORSHORTNAME }}, instala la extensión en {{ SUGGESTEDEXTENSIONBROWSER }}.`,
    injectionScreen_install_h1: `Instala {{ CONNECTORNAME }}`,
    injectionScreen_install_p: `Para conectar tu cartera de {{ CONNECTORSHORTNAME }}, instala la extensión del navegador.`,
    injectionScreen_connecting_h1: `Solicitud de conexión`,
    injectionScreen_connecting_p: `Abre la extensión del navegador de {{ CONNECTORSHORTNAME }}  para conectar tu cartera.`,
    injectionScreen_connecting_injected_h1: `Solicitud de conexión`,
    injectionScreen_connecting_injected_p: `Acepta la solicitud a través de tu cartera para conectarte a esta aplicación.`,
    injectionScreen_connected_h1: `Ya conectada`,
    injectionScreen_connected_p: `Ya puedes cerrar esta ventana emergente`,
    injectionScreen_rejected_h1: `Solicitud cancelada`,
    injectionScreen_rejected_p: `Has cancelado la solicitud. Haz clic arriba para intentarlo de nuevo.`,
    injectionScreen_failed_h1: `Error de conexión`,
    injectionScreen_failed_p: `Lo sentimos, ha habido un problema. Intenta conectarte de nuevo.`,
    injectionScreen_notconnected_h1: `Inicia sesión en {{ CONNECTORNAME }}`,
    injectionScreen_notconnected_p: `Para continuar, inicia sesión en tu extensión de {{ CONNECTORNAME }}.`,
    profileScreen_heading: 'Conectado',
    switchNetworkScreen_heading: 'Cambio de red',
    signInWithEthereumScreen_tooltip: 'No has iniciado sesión en esta aplicación.\n**Inicia sesión con Ethereum** para continuar.',
    signInWithEthereumScreen_signedOut_heading: 'Inicia sesión con Ethereum',
    signInWithEthereumScreen_signedOut_h1: 'Esta aplicación desea verificar que eres el propietario de esta cartera.',
    signInWithEthereumScreen_signedOut_p: `Firma la solicitud de mensaje en tu cartera para continuar.`,
    signInWithEthereumScreen_signedOut_button: 'Iniciar sesión',
    signInWithEthereumScreen_signedIn_heading: 'Sesión iniciada con Ethereum',
    signInWithEthereumScreen_signedIn_h1: 'Te has verificado correctamente como propietario de esta cartera.',
    signInWithEthereumScreen_signedIn_p: `Si cierras la sesión, tendrás que volver a autenticarte más adelante.`,
    signInWithEthereumScreen_signedIn_button: 'Cerrar sesión',
};

const frFR = {
    connectWallet: 'Connecter le portefeuille',
    disconnect: 'Déconnecter',
    connected: 'Connecté',
    wrongNetwork: 'Réseau incorrect',
    switchNetworks: 'Changer de réseau',
    chainNetwork: 'Réseau {{ CHAIN }}',
    copyToClipboard: 'Copier dans le presse-papiers',
    copyCode: 'Copier le code',
    moreInformation: 'Plus d’informations',
    back: 'Retour',
    close: 'Fermer',
    or: 'ou',
    more: 'Plus',
    tryAgain: 'Réessayer',
    tryAgainQuestion: 'Réessayer ?',
    dontHaveTheApp: 'Vous n’avez pas l’application ?',
    scanTheQRCode: 'Scannez le code QR',
    useWalletConnectModal: 'Utiliser la modale WalletConnect',
    useModal: 'Utiliser la modale',
    installTheExtension: 'Installer l’extension',
    getWalletName: 'Obtenez {{ CONNECTORNAME }}',
    otherWallets: 'Autres portefeuilles',
    learnMore: 'En savoir plus',
    getWallet: 'Obtenir un portefeuille',
    approveInWallet: 'Approuver dans le portefeuille',
    confirmInWallet: 'Confirmer dans le portefeuille',
    awaitingConfirmation: 'En attente de confirmation',
    signIn: 'Se connecter',
    signOut: 'Se déconnecter',
    signedIn: 'Connecté',
    signedOut: 'Déconnecté',
    walletNotConnected: 'Portefeuille non connecté',
    warnings_walletSwitchingUnsupported: `Votre portefeuille ne prend pas en charge le changement de réseau à partir de cette application.`,
    warnings_walletSwitchingUnsupportedResolve: `Essayez plutôt de changer de réseau à partir de votre portefeuille.`,
    warnings_chainUnsupported: `Cette application ne prend pas en charge le réseau connecté actuel.`,
    warnings_chainUnsupportedResolve: `Changez ou déconnectez-vous pour continuer.`,
    onboardingScreen_heading: `Obtenez un portefeuille`,
    onboardingScreen_h1: `Commencez à explorer le Web3`,
    onboardingScreen_p: `Votre portefeuille est la porte d'entrée vers tout ce qui concerne l'Ethereum, la technologie magique qui permet d'explorer le Web3.`,
    onboardingScreen_ctaText: `Choisissez votre premier portefeuille`,
    onboardingScreen_ctaUrl: `https://ethereum.org/fr/wallets/find-wallet/`,
    aboutScreen_heading: `À propos des portefeuilles`,
    aboutScreen_a_h1: `Pour vos actifs numériques`,
    aboutScreen_a_p: `Les portefeuilles vous permettent d'envoyer, de recevoir, de stocker et d'interagir avec des actifs numériques tels que des NFT et d'autres jetons Ethereum.`,
    aboutScreen_b_h1: `Une meilleure façon de se connecter`,
    aboutScreen_b_p: `Avec les applications modernes, votre portefeuille peut s'utiliser pour vous connecter facilement, au lieu d'avoir à mémoriser un mot de passe.`,
    aboutScreen_c_h1: `Explorez le monde du Web3`,
    aboutScreen_c_p: `Votre portefeuille est un utilitaire essentiel qui vous permet d'explorer et de participer au monde en évolution rapide du Web3.`,
    aboutScreen_ctaText: `En savoir plus`,
    aboutScreen_ctaUrl: `https://ethereum.org/fr/wallets/`,
    connectorsScreen_heading: `Connectez le portefeuille`,
    connectorsScreen_newcomer: `Je n’ai pas de portefeuille`,
    connectorsScreen_h1: `Qu’est-ce qu’un portefeuille ?`,
    connectorsScreen_p: `Les portefeuilles s'utilisent pour envoyer, recevoir et stocker des actifs numériques. La connexion d'un portefeuille vous permet d'interagir avec les applications.`,
    mobileConnectorsScreen_heading: `Choisissez le portefeuille`,
    scanScreen_heading: `Scannez avec le téléphone`,
    scanScreen_heading_withConnector: `Scannez avec {{ CONNECTORNAME }}`,
    scanScreen_tooltip_walletConnect: `Ouvrez un portefeuille pris en charge par WalletConnect [WALLETCONNECTLOGO] pour scanner`,
    scanScreen_tooltip_default: `Ouvrez {{ CONNECTORNAME }} sur votre téléphone mobile pour scanner`,
    downloadAppScreen_heading: `Obtenez {{ CONNECTORNAME }}`,
    downloadAppScreen_iosAndroid: `Scannez avec l'appareil photo de votre téléphone pour le télécharger sur iOS ou Android.`,
    downloadAppScreen_ios: `Scannez avec l'appareil photo de votre téléphone pour le télécharger sur iOS.`,
    downloadAppScreen_android: `Scannez avec l'appareil photo de votre téléphone pour le télécharger sur Android.`,
    injectionScreen_unavailable_h1: `Navigateur non pris en charge`,
    injectionScreen_unavailable_p: `Pour connecter votre portefeuille {{ CONNECTORSHORTNAME }}, installez l’extension sur {{ SUGGESTEDEXTENSIONBROWSER }}.`,
    injectionScreen_install_h1: `Installez {{ CONNECTORNAME }}`,
    injectionScreen_install_p: `Pour connecter votre portefeuille {{ CONNECTORSHORTNAME }}, installez l’extension de navigateur.`,
    injectionScreen_connecting_h1: `Demande de connexion`,
    injectionScreen_connecting_p: `Ouvrez l’extension de navigateur {{ CONNECTORSHORTNAME }} pour connecter votre portefeuille.`,
    injectionScreen_connecting_injected_h1: `Demande de connexion`,
    injectionScreen_connecting_injected_p: `Acceptez la demande via votre portefeuille pour vous connecter à cette application.`,
    injectionScreen_connected_h1: `Déjà connecté`,
    injectionScreen_connected_p: `Vous pouvez maintenant fermer ce pop-up`,
    injectionScreen_rejected_h1: `Demande annulée`,
    injectionScreen_rejected_p: `Vous avez annulé la demande. Cliquez ci-dessus pour réessayer.`,
    injectionScreen_failed_h1: `Échec de la connexion`,
    injectionScreen_failed_p: `Malheureusement, un problème est survenu. Veuillez réessayer de vous connecter.`,
    injectionScreen_notconnected_h1: `Connectez-vous à {{ CONNECTORNAME }}`,
    injectionScreen_notconnected_p: `Pour continuer, veuillez vous connecter à votre extension {{ CONNECTORNAME }} .`,
    profileScreen_heading: 'Connecté',
    switchNetworkScreen_heading: 'Changer de réseau',
    signInWithEthereumScreen_tooltip: 'Vous n’êtes pas connecté à cette application.\n**Connectez-vous avec Ethereum** pour continuer.',
    signInWithEthereumScreen_signedOut_heading: 'Connectez-vous avec Ethereum',
    signInWithEthereumScreen_signedOut_h1: 'Cette application souhaite vérifier que vous êtes bien le propriétaire de ce portefeuille.',
    signInWithEthereumScreen_signedOut_p: `Veuillez signer la demande de message dans votre portefeuille pour continuer.`,
    signInWithEthereumScreen_signedOut_button: 'Se connecter',
    signInWithEthereumScreen_signedIn_heading: 'Connecté avec Ethereum',
    signInWithEthereumScreen_signedIn_h1: 'Vous avez réussi à vous identifier en tant que propriétaire de ce portefeuille.',
    signInWithEthereumScreen_signedIn_p: `La déconnexion vous obligera à vous authentifier à nouveau à l'avenir.`,
    signInWithEthereumScreen_signedIn_button: 'Se déconnecter',
};

var jaJP = {
    connectWallet: 'ウォレットの接続',
    disconnect: '切断',
    connected: '接続されました',
    wrongNetwork: '間違ったネットワーク',
    switchNetworks: 'ネットワークの切り替え',
    chainNetwork: '{{ CHAIN }} ネットワーク',
    copyToClipboard: 'クリップボードにコピー',
    copyCode: 'コードをコピー',
    moreInformation: '詳細情報',
    back: '戻る',
    close: '閉じる',
    or: 'または',
    more: 'その他',
    tryAgain: '再試行',
    tryAgainQuestion: 'もう一度試しますか？',
    dontHaveTheApp: 'アプリをお持ちではありませんか？',
    scanTheQRCode: 'QR コードをスキャン',
    useWalletConnectModal: 'WalletConnect モーダルを使用',
    useModal: 'モーダルを使用',
    installTheExtension: '拡張機能をインストール',
    getWalletName: '{{ CONNECTORNAME }} を取得',
    otherWallets: 'その他のウォレット',
    learnMore: '詳細情報',
    getWallet: 'ウォレットを入手',
    approveInWallet: 'ウォレットで承認',
    confirmInWallet: 'ウォレットで確認',
    awaitingConfirmation: '確認を待っています',
    signIn: 'サインイン',
    signOut: 'サインアウト',
    signedIn: 'サインインしました',
    signedOut: 'サインアウトしました',
    walletNotConnected: 'ウォレットが接続されていません',
    warnings_walletSwitchingUnsupported: `お使いのウォレットは、このアプリからのネットワークの切り替えをサポートしていません。`,
    warnings_walletSwitchingUnsupportedResolve: `代わりにウォレット内からネットワークを切り替えてみてください。`,
    warnings_chainUnsupported: `このアプリは、現在接続されているネットワークをサポートしていません。`,
    warnings_chainUnsupportedResolve: `切り替えるか切断して続行します。`,
    onboardingScreen_heading: `ウォレットを入手`,
    onboardingScreen_h1: `Web3 の探索を開始`,
    onboardingScreen_p: `ウォレットは、web3 の探索を可能にする魔法のテクノロジーであるイーサリアムのすべてへのゲートウェイです。`,
    onboardingScreen_ctaText: `最初のウォレットを選択してください`,
    onboardingScreen_ctaUrl: `https://ethereum.org/ja/wallets/find-wallet/`,
    aboutScreen_heading: `ウォレットについて`,
    aboutScreen_a_h1: `デジタル資産用`,
    aboutScreen_a_p: `ウォレットを使用すると、NFT やその他のイーサリアム トークンなどのデジタル資産を送信、受信、保存、および操作できます。`,
    aboutScreen_b_h1: `より良いログイン方法`,
    aboutScreen_b_p: `最新のアプリでは、パスワードを覚える必要がなく、ウォレットを簡単なログイン方法として使用できます。`,
    aboutScreen_c_h1: `web3 の世界を探索`,
    aboutScreen_c_p: `ウォレットは、急速に進化する web3 の世界を探索し、参加するために不可欠なユーティリティです。`,
    aboutScreen_ctaText: `詳細情報`,
    aboutScreen_ctaUrl: `https://ethereum.org/ja/wallets/`,
    connectorsScreen_heading: `ウォレットの接続`,
    connectorsScreen_newcomer: `ウォレットを持っていません`,
    connectorsScreen_h1: `ウォレットとは何ですか？`,
    connectorsScreen_p: `ウォレットは、デジタル資産の送信、受信、および保存に使用されます。 ウォレットを接続すると、アプリとやり取りできます。`,
    mobileConnectorsScreen_heading: `ウォレットを選択`,
    scanScreen_heading: `電話でスキャンする`,
    scanScreen_heading_withConnector: `{{ CONNECTORNAME }}でスキャンする`,
    scanScreen_tooltip_walletConnect: `[WALLETCONNECTLOGO] WalletConnect 対応の ウォレットを開いてスキャンします`,
    scanScreen_tooltip_default: `携帯電話で {{ CONNECTORNAME }} を 開いてスキャンします`,
    downloadAppScreen_heading: `{{ CONNECTORNAME }} を取得`,
    downloadAppScreen_iosAndroid: `携帯電話のカメラでスキャンして、iOS または Android にダウンロードします。`,
    downloadAppScreen_ios: `携帯電話のカメラでスキャンして、iOS にダウンロードします。`,
    downloadAppScreen_android: `携帯電話のカメラでスキャンして、Android にダウンロードします。`,
    injectionScreen_unavailable_h1: `サポートされていないブラウザ`,
    injectionScreen_unavailable_p: `{{ CONNECTORSHORTNAME }} ウォレットを接続するには、{{ SUGGESTEDEXTENSIONBROWSER }} に拡張機能をインストールします。`,
    injectionScreen_install_h1: `{{ CONNECTORNAME }} をインストール`,
    injectionScreen_install_p: `{{ CONNECTORSHORTNAME }} ウォレットを接続するには、ブラウザ拡張機能をインストールします。`,
    injectionScreen_connecting_h1: `接続を要求`,
    injectionScreen_connecting_p: `{{ CONNECTORSHORTNAME }} ブラウザ拡張機能を 開いて、ウォレットを接続します。`,
    injectionScreen_connecting_injected_h1: `接続を要求`,
    injectionScreen_connecting_injected_p: `このアプリに接続するには、ウォレットを介して要求を受け入れます。`,
    injectionScreen_connected_h1: `すでに接続済み`,
    injectionScreen_connected_p: `このポップアップを閉じてもかまいません`,
    injectionScreen_rejected_h1: `要求がキャンセルされました`,
    injectionScreen_rejected_p: `要求をキャンセルしました。上をクリックしてもう一度お試しください。`,
    injectionScreen_failed_h1: `接続に失敗しました`,
    injectionScreen_failed_p: `申し訳ありませんが、問題が発生しました。もう一度接続してみてください。`,
    injectionScreen_notconnected_h1: `{{ CONNECTORNAME }} にログイン`,
    injectionScreen_notconnected_p: `続行するには、 {{ CONNECTORNAME }} 拡張機能にログインしてください。`,
    profileScreen_heading: '接続されました',
    switchNetworkScreen_heading: 'ネットワークの切り替え',
    signInWithEthereumScreen_tooltip: 'このアプリにサインインしていません。\n続行するには、**イーサリアムでサインイン**してください。',
    signInWithEthereumScreen_signedOut_heading: 'イーサリアムでサインイン',
    signInWithEthereumScreen_signedOut_h1: 'このアプリは、あなたがこのウォレットの 所有者であることを確認しようとしています。',
    signInWithEthereumScreen_signedOut_p: `続行するには、ウォレットで メッセージ リクエストに署名してください。`,
    signInWithEthereumScreen_signedOut_button: 'サインイン',
    signInWithEthereumScreen_signedIn_heading: 'イーサリアムでサインインしました',
    signInWithEthereumScreen_signedIn_h1: 'このウォレットの所有者であることが 正常に確認されました。',
    signInWithEthereumScreen_signedIn_p: `サインアウトすると、今後 再度認証する必要があります。`,
    signInWithEthereumScreen_signedIn_button: 'サインアウト',
};

const ptBR = {
    connectWallet: 'Conectar carteira',
    disconnect: 'Desconectar',
    connected: 'Conectado',
    wrongNetwork: 'Rede incorreta',
    switchNetworks: 'Alternar rede',
    chainNetwork: 'Rede {{ CHAIN }}',
    copyToClipboard: 'Copiar para a área de transferência',
    copyCode: 'Copiar código',
    moreInformation: 'Mais informações',
    back: 'Voltar',
    close: 'Fechar',
    or: 'ou',
    more: 'Mais',
    tryAgain: 'Tentar novamente',
    tryAgainQuestion: 'Tentar novamente?',
    dontHaveTheApp: 'Não tem o aplicativo?',
    scanTheQRCode: 'Escaneie o código QR',
    useWalletConnectModal: 'Use o modal do WalletConnect',
    useModal: 'Usar modal',
    installTheExtension: 'Instale a extensão',
    getWalletName: 'Obter {{ CONNECTORNAME }}',
    otherWallets: 'Outras carteiras',
    learnMore: 'Saiba mais',
    getWallet: 'Obtenha uma carteira',
    approveInWallet: 'Aprovar na carteira',
    confirmInWallet: 'Confirmar na carteira',
    awaitingConfirmation: 'Aguardando confirmação',
    signIn: 'Entrar',
    signOut: 'Sair',
    signedIn: 'Conectado',
    signedOut: 'Desconectado',
    walletNotConnected: 'Carteira não conectada',
    warnings_walletSwitchingUnsupported: `A sua carteira não permite a troca de rede a partir deste aplicativo.`,
    warnings_walletSwitchingUnsupportedResolve: `Tente trocar de rede de dentro da sua carteira.`,
    warnings_chainUnsupported: `Este aplicativo não é compatível com a rede conectada.`,
    warnings_chainUnsupportedResolve: `Altere a rede ou desconecte para continuar.`,
    onboardingScreen_heading: `Obtenha uma carteira`,
    onboardingScreen_h1: `Comece a explorar a Web3`,
    onboardingScreen_p: `Sua carteira é a porta de entrada para todas as coisas Ethereum, a tecnologia mágica que torna possível explorar a web3.`,
    onboardingScreen_ctaText: `Escolha sua primeira carteira`,
    onboardingScreen_ctaUrl: `https://ethereum.org/pt-br/wallets/find-wallet/`,
    aboutScreen_heading: `Sobre as carteiras`,
    aboutScreen_a_h1: `Para seus ativos digitais`,
    aboutScreen_a_p: `As carteiras permitem que você envie, receba, armazene e interaja com ativos digitais como NFTs e outros tokens Ethereum.`,
    aboutScreen_b_h1: `Uma maneira melhor de fazer login`,
    aboutScreen_b_p: `Com aplicativos modernos, sua carteira pode ser usada como uma maneira fácil de fazer login, em vez de ter que lembrar uma senha.`,
    aboutScreen_c_h1: `Explore o mundo da Web3`,
    aboutScreen_c_p: `Sua carteira é uma utilidade essencial que permite explorar e participar do mundo em rápida evolução da Web3.`,
    aboutScreen_ctaText: `Saiba mais`,
    aboutScreen_ctaUrl: `https://ethereum.org/pt-br/wallets/`,
    connectorsScreen_heading: `Conectar carteira`,
    connectorsScreen_newcomer: `Eu não tenho uma carteira`,
    connectorsScreen_h1: `O que é uma carteira?`,
    connectorsScreen_p: `As carteiras são usadas para enviar, receber e armazenar ativos digitais. A conexão de uma carteira permite que você interaja com aplicativos.`,
    mobileConnectorsScreen_heading: `Escolha uma carteira`,
    scanScreen_heading: `Escanear com o celular`,
    scanScreen_heading_withConnector: `Escanear com o {{ CONNECTORNAME }}`,
    scanScreen_tooltip_walletConnect: `Abra uma carteira compatível \ncom o WalletConnect [WALLETCONNECTLOGO] para escanear`,
    scanScreen_tooltip_default: `Abra o {{ CONNECTORNAME }} no \nseu celular para escanear`,
    downloadAppScreen_heading: `Obter {{ CONNECTORNAME }}`,
    downloadAppScreen_iosAndroid: `Escaneie com a câmera do seu celular para baixar no iOS ou Android.`,
    downloadAppScreen_ios: `Escaneie com a câmera do seu celular para baixar no iOS.`,
    downloadAppScreen_android: `Escaneie com a câmera do seu celular para baixar no Android.`,
    injectionScreen_unavailable_h1: `Navegador não compatível`,
    injectionScreen_unavailable_p: `Para conectar sua carteira {{ CONNECTORSHORTNAME }},\ninstale a extensão no {{ SUGGESTEDEXTENSIONBROWSER }}.`,
    injectionScreen_install_h1: `Instalar {{ CONNECTORNAME }}`,
    injectionScreen_install_p: `Para conectar sua carteira {{ CONNECTORSHORTNAME }},\ninstale a extensão do navegador`,
    injectionScreen_connecting_h1: `Solicitando conexão`,
    injectionScreen_connecting_p: `Abra a extensão do navegador do {{ CONNECTORSHORTNAME }} \npara conectar a sua carteira.`,
    injectionScreen_connecting_injected_h1: `Solicitando conexão`,
    injectionScreen_connecting_injected_p: `Aceite a solicitação por meio de sua carteira para se conectar a este aplicativo.`,
    injectionScreen_connected_h1: `Já conectado`,
    injectionScreen_connected_p: `Agora você já pode fechar esta janela`,
    injectionScreen_rejected_h1: `Solicitação cancelada`,
    injectionScreen_rejected_p: `Você cancelou a solicitação.\nClique acima para tentar novamente.`,
    injectionScreen_failed_h1: `A conexão falhou`,
    injectionScreen_failed_p: `Desculpe, ocorreu um erro.\nPor favor, tente conectar novamente.`,
    injectionScreen_notconnected_h1: `Faça login no {{ CONNECTORNAME }}`,
    injectionScreen_notconnected_p: `Para continuar, faça login na sua extensão do {{ CONNECTORNAME }}.`,
    profileScreen_heading: 'Conectado',
    switchNetworkScreen_heading: 'Alternar rede',
    signInWithEthereumScreen_tooltip: 'Você não está conectado a este aplicativo.\n**Entre com Ethereum** para continuar.',
    signInWithEthereumScreen_signedOut_heading: 'Entrar com Ethereum',
    signInWithEthereumScreen_signedOut_h1: 'Este aplicativo gostaria de verificar você \n como o proprietário desta carteira.',
    signInWithEthereumScreen_signedOut_p: `Por favor, assine o pedido de mensagem \n em sua carteira para continuar.`,
    signInWithEthereumScreen_signedOut_button: 'Entrar',
    signInWithEthereumScreen_signedIn_heading: 'Conectado com Ethereum',
    signInWithEthereumScreen_signedIn_h1: 'Você se verificou com sucesso \n como o proprietário desta carteira',
    signInWithEthereumScreen_signedIn_p: `Se sair, será necessário que você \n autentique novamente no futuro.`,
    signInWithEthereumScreen_signedIn_button: 'Sair'
};

const zhCN = {
    connectWallet: '绑定钱包',
    disconnect: '解除绑定',
    connected: '已绑定',
    wrongNetwork: '错误网络',
    switchNetworks: '切换网络',
    chainNetwork: '{{ CHAIN }}网络',
    copyToClipboard: '复制到剪贴板',
    copyCode: '复制代码',
    moreInformation: '更多信息',
    back: '返回',
    close: '关闭',
    or: '或',
    more: '更多',
    tryAgain: '重试',
    tryAgainQuestion: '重试？',
    dontHaveTheApp: '没有该应用？',
    scanTheQRCode: '扫描二维码',
    useWalletConnectModal: '使用 WalletConnect 模态窗',
    useModal: '使用模态窗',
    installTheExtension: '安装扩展程序',
    getWalletName: '获取{{ CONNECTORNAME }}',
    otherWallets: '其他钱包',
    learnMore: '了解更多',
    getWallet: '获取钱包',
    approveInWallet: '在钱包中批准',
    confirmInWallet: '在钱包中确认',
    awaitingConfirmation: '等待确认',
    signIn: '登录',
    signOut: '登出',
    signedIn: '已登录',
    signedOut: '已登出',
    walletNotConnected: '钱包未绑定',
    warnings_walletSwitchingUnsupported: `您的钱包不支持从此应用切换网络。`,
    warnings_walletSwitchingUnsupportedResolve: `请尝试从钱包中切换网络。`,
    warnings_chainUnsupported: `此应用不支持当前连接的网络。`,
    warnings_chainUnsupportedResolve: `请切换网络或断开连接以继续。`,
    onboardingScreen_heading: `获取钱包`,
    onboardingScreen_h1: `开始探索 Web3`,
    onboardingScreen_p: `您的钱包是通往以太坊的一扇大门，而以太坊是探索 Web3 的一项神奇技术。`,
    onboardingScreen_ctaText: `选择您的第一钱包`,
    onboardingScreen_ctaUrl: `https://ethereum.org/zh/wallets/find-wallet/`,
    aboutScreen_heading: `关于钱包`,
    aboutScreen_a_h1: `对于您的数字资产`,
    aboutScreen_a_p: `有了钱包，您可以发送、接收、存储数字资产及使用数字资产进行交互，例如 NFT 和其他以太坊通证等。`,
    aboutScreen_b_h1: `更好的登录方式`,
    aboutScreen_b_p: `使用现代应用，您的钱包可以用作简便的登录方法，而不必记住密码。`,
    aboutScreen_c_h1: `探索 Web3 世界`,
    aboutScreen_c_p: `您的钱包是一个重要的工具，可以让您探索并参与到快速发展的 Web3 世界。`,
    aboutScreen_ctaText: `了解更多`,
    aboutScreen_ctaUrl: `https://ethereum.org/zh/wallets/`,
    connectorsScreen_heading: `绑定钱包`,
    connectorsScreen_newcomer: `我没有钱包`,
    connectorsScreen_h1: `什么是钱包？`,
    connectorsScreen_p: `钱包可用于发送、接收和存储数字资产。通过绑定钱包，您可以与应用进行交互。`,
    mobileConnectorsScreen_heading: `选择钱包`,
    scanScreen_heading: `手机扫描`,
    scanScreen_heading_withConnector: `手机扫描{{ CONNECTORNAME }}`,
    scanScreen_tooltip_walletConnect: `打开 [WALLETCONNECTLOGO] WalletConnect 支持的钱包进行扫描`,
    scanScreen_tooltip_default: `打开您手机上的{{ CONNECTORNAME }} 进行扫描`,
    downloadAppScreen_heading: `获取{{ CONNECTORNAME }}`,
    downloadAppScreen_iosAndroid: `使用手机相机扫描以下载 iOS 或 Android 应用。`,
    downloadAppScreen_ios: `使用手机相机扫描以下载 iOS 应用。`,
    downloadAppScreen_android: `使用手机相机扫描以下载 Android 应用。`,
    injectionScreen_unavailable_h1: `不支持的浏览器`,
    injectionScreen_unavailable_p: `要绑定您的{{ CONNECTORSHORTNAME }}钱包，请在{{ SUGGESTEDEXTENSIONBROWSER }}上安装此扩展程序。`,
    injectionScreen_install_h1: `安装{{ CONNECTORNAME }}`,
    injectionScreen_install_p: `要绑定您的{{ CONNECTORSHORTNAME }}钱包，请安装此浏览器扩展程序。`,
    injectionScreen_connecting_h1: `请求绑定`,
    injectionScreen_connecting_p: `打开{{ CONNECTORSHORTNAME }}浏览器 扩展程序以绑定您的钱包。`,
    injectionScreen_connecting_injected_h1: `请求绑定`,
    injectionScreen_connecting_injected_p: `通过您的钱包接受请求，以绑定到此应用。`,
    injectionScreen_connected_h1: `已绑定`,
    injectionScreen_connected_p: `现在可以关闭此弹窗`,
    injectionScreen_rejected_h1: `请求已取消`,
    injectionScreen_rejected_p: `您已取消请求。n点击上面可重试。`,
    injectionScreen_failed_h1: `绑定失败`,
    injectionScreen_failed_p: `抱歉，发生错误。请尝试重新绑定。`,
    injectionScreen_notconnected_h1: `登录{{ CONNECTORNAME }}`,
    injectionScreen_notconnected_p: `要继续，请登录到您的{{ CONNECTORNAME }}扩展程序。`,
    profileScreen_heading: '已绑定',
    switchNetworkScreen_heading: '切换网络',
    signInWithEthereumScreen_tooltip: '您尚未登录到此应用。\n请选择**使用以太坊登录**以继续。',
    signInWithEthereumScreen_signedOut_heading: '使用以太坊登录',
    signInWithEthereumScreen_signedOut_h1: '此应用希望验证您是 此钱包的所有者。',
    signInWithEthereumScreen_signedOut_p: `请签署钱包中的消息请求 以继续。`,
    signInWithEthereumScreen_signedOut_button: '登录',
    signInWithEthereumScreen_signedIn_heading: '已使用以太坊登录',
    signInWithEthereumScreen_signedIn_h1: '您已成功验证自己 是此钱包的所有者。',
    signInWithEthereumScreen_signedIn_p: `登出后，将来您还需要 再次进行身份验证。`,
    signInWithEthereumScreen_signedIn_button: '登出',
};

// TODO: tree-shaking
const getLocale = (lang) => {
    switch (lang) {
        case 'es-ES':
            return esES;
        case 'fr-FR':
            return frFR;
        case 'ja-JP':
            return jaJP;
        case 'pt-BR':
            return ptBR;
        case 'zh-CN':
            return zhCN;
        default:
            return enUS;
    }
};
/*
// Could be useful for locale files to use these keys rather than hard-coded into the objects
export const keys = {
  connectorName: '{{ CONNECTORNAME }}',
  connectorShortName: '{{ CONNECTORSHORTNAME }}',
  suggestedExtensionBrowser: '{{ SUGGESTEDEXTENSIONBROWSER }}',
  walletConnectLogo: '{{ WALLETCONNECTLOGO }}',
};
*/

function useLocales(replacements) {
    var _a, _b;
    const context = useContext();
    const language = (_b = (_a = context.options) === null || _a === void 0 ? void 0 : _a.language) !== null && _b !== void 0 ? _b : 'en-US';
    const translations = useMemo(() => {
        return getLocale(language);
    }, [language]);
    if (!translations) {
        console.error(`Missing translations for: ${language}`);
        return `Missing translations for: ${language}`;
    }
    const translated = {};
    Object.keys(translations).map((key) => {
        const string = translations[key];
        return (translated[key] = localize(string, replacements));
    });
    return translated;
}
const localize = (text, replacements) => {
    let parsedText = text;
    if (replacements) {
        Object.keys(replacements).forEach((key) => {
            // use `replace` instead of `replaceAll` to support Node 14
            parsedText = parsedText.replace(new RegExp(`({{ ${key} }})`, 'g'), replacements[key]);
        });
    }
    return replaceMarkdown(parsedText);
};
const replaceMarkdown = (markdownText) => {
    let text = markdownText;
    text = text.split('\n');
    text = text.map((t, i) => {
        return (jsxs(React.Fragment, { children: [wrapTags(t), i < text.length - 1 && jsx("br", {})] }, i));
    });
    return text;
};
const wrapTags = (text) => {
    // Bold markdown handling
    const textArray = text.split(/(\*\*[^\*]*\*\*)/g);
    let result = textArray.map((str, i) => {
        if (/(\*\*.*\*\*)/g.test(str)) {
            // use `replace` instead of `replaceAll` to support Node 14
            return jsx("strong", { children: str.replace(/\*\*/g, '') }, i);
        }
        return `${str}`;
    });
    // Replace text with logo
    return result.map((r) => {
        if (typeof r === 'string') {
            return r.split(/(\[WALLETCONNECTLOGO\])/g).map((s) => {
                if (s === '[WALLETCONNECTLOGO]') {
                    return (jsx("span", { className: "ck-tt-logo", children: jsx(Logos.WalletConnect, {}) }, s));
                }
                return s;
            });
        }
        return r;
    });
};

// https://github.com/saltycrane/use-fit-text
const LOG_LEVEL = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
    none: 100,
};
// Suppress `useLayoutEffect` warning when rendering on the server
// https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
const useIsoLayoutEffect = typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement !== undefined
    ? useLayoutEffect
    : useEffect;
const useFitText = ({ logLevel: logLevelOption = 'info', maxFontSize = 100, minFontSize = 20, onFinish, onStart, resolution = 5, } = {}) => {
    const logLevel = LOG_LEVEL[logLevelOption];
    const initState = useCallback(() => {
        return {
            calcKey: 0,
            fontSize: maxFontSize,
            fontSizePrev: minFontSize,
            fontSizeMax: maxFontSize,
            fontSizeMin: minFontSize,
        };
    }, [maxFontSize, minFontSize]);
    const ref = useRef(null);
    const innerHtmlPrevRef = useRef();
    const isCalculatingRef = useRef(false);
    const [state, setState] = useState(initState);
    const { calcKey, fontSize, fontSizeMax, fontSizeMin, fontSizePrev } = state;
    // Montior div size changes and recalculate on resize
    let animationFrameId = null;
    const [ro] = useState(() => new ResizeObserver(() => {
        animationFrameId = window.requestAnimationFrame(() => {
            if (isCalculatingRef.current) {
                return;
            }
            onStart && onStart();
            isCalculatingRef.current = true;
            // `calcKey` is used in the dependencies array of
            // `useIsoLayoutEffect` below. It is incremented so that the font size
            // will be recalculated even if the previous state didn't change (e.g.
            // when the text fit initially).
            setState({
                ...initState(),
                calcKey: calcKey + 1,
            });
        });
    }));
    useEffect(() => {
        if (ref.current) {
            ro.observe(ref.current);
        }
        return () => {
            animationFrameId && window.cancelAnimationFrame(animationFrameId);
            ro.disconnect();
        };
    }, [animationFrameId, ro]);
    // Recalculate when the div contents change
    const innerHtml = ref.current && ref.current.innerHTML;
    useEffect(() => {
        if (calcKey === 0 || isCalculatingRef.current)
            return;
        if (innerHtml !== innerHtmlPrevRef.current) {
            onStart && onStart();
            setState({
                ...initState(),
                calcKey: calcKey + 1,
            });
        }
        innerHtmlPrevRef.current = innerHtml;
    }, [calcKey, initState, innerHtml, onStart]);
    // Check overflow and resize font
    useIsoLayoutEffect(() => {
        // Don't start calculating font size until the `resizeKey` is incremented
        // above in the `ResizeObserver` callback. This avoids an extra resize
        // on initialization.
        if (calcKey === 0) {
            return;
        }
        const isWithinResolution = Math.abs(fontSize - fontSizePrev) <= resolution;
        const isOverflow = !!ref.current &&
            (ref.current.scrollHeight > ref.current.offsetHeight ||
                ref.current.scrollWidth > ref.current.offsetWidth);
        const isFailed = isOverflow && fontSize === fontSizePrev;
        const isAsc = fontSize > fontSizePrev;
        // Return if the font size has been adjusted "enough" (change within `resolution`)
        // reduce font size by one increment if it's overflowing.
        if (isWithinResolution) {
            if (isFailed) {
                isCalculatingRef.current = false;
                if (logLevel <= LOG_LEVEL.info) {
                    console.info(`[use-fit-text] reached \`minFontSize = ${minFontSize}\` without fitting text`);
                }
            }
            else if (isOverflow) {
                setState({
                    fontSize: isAsc ? fontSizePrev : fontSizeMin,
                    fontSizeMax,
                    fontSizeMin,
                    fontSizePrev,
                    calcKey,
                });
            }
            else {
                isCalculatingRef.current = false;
                onFinish && onFinish(fontSize);
            }
            return;
        }
        // Binary search to adjust font size
        let delta;
        let newMax = fontSizeMax;
        let newMin = fontSizeMin;
        if (isOverflow) {
            delta = isAsc ? fontSizePrev - fontSize : fontSizeMin - fontSize;
            newMax = Math.min(fontSizeMax, fontSize);
        }
        else {
            delta = isAsc ? fontSizeMax - fontSize : fontSizePrev - fontSize;
            newMin = Math.max(fontSizeMin, fontSize);
        }
        setState({
            calcKey,
            fontSize: fontSize + delta / 2,
            fontSizeMax: newMax,
            fontSizeMin: newMin,
            fontSizePrev: fontSize,
        });
    }, [
        calcKey,
        fontSize,
        fontSizeMax,
        fontSizeMin,
        fontSizePrev,
        onFinish,
        ref,
        resolution,
    ]);
    return { fontSize, ref };
};

const FitText = ({ children }) => {
    const [ready, setReady] = React.useState(false);
    const { fontSize, ref: textRef } = useFitText({
        logLevel: 'none',
        maxFontSize: 100,
        minFontSize: 70,
        onStart: () => setReady(true),
        onFinish: () => setReady(true),
    });
    return (jsx("div", { ref: textRef, style: {
            visibility: ready ? 'visible' : 'hidden',
            fontSize: `${fontSize}%`,
            maxHeight: '100%',
            maxWidth: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }, children: children }));
};
FitText.displayName = 'FitText';

const ProfileIcon = ({ isSignedIn }) => (jsxs("div", { style: { position: 'relative' }, children: [isSignedIn ? (jsx(AuthIcon, { style: {
                bottom: -1,
                right: -1,
            } })) : (jsx("div", { style: {
                zIndex: 2,
                position: 'absolute',
                top: -2,
                right: -2,
                background: '#1A88F8',
                borderRadius: 8,
                boxShadow: '0 0 0 2px var(--ck-body-background)',
                width: 8,
                height: 8,
            } })), jsxs("svg", { "aria-hidden": "true", width: "20", height: "20", viewBox: "0 0 20 20", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: { overflow: 'visible' }, children: [jsx("circle", { cx: "10", cy: "10", r: "9", stroke: "currentColor", strokeWidth: "2" }), jsx("path", { d: "M16.5 16.775C14.8618 15.0649 12.5552 14 10 14C7.44477 14 5.13825 15.0649 3.5 16.775", stroke: "currentColor", strokeWidth: "2" }), jsx("circle", { cx: "10", cy: "8", r: "3", stroke: "currentColor", strokeWidth: "2" })] })] }));
const InfoIcon = ({ ...props }) => (jsx("svg", { "aria-hidden": "true", width: "22", height: "22", viewBox: "0 0 22 22", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props, children: jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M20 11C20 15.9706 15.9706 20 11 20C6.02944 20 2 15.9706 2 11C2 6.02944 6.02944 2 11 2C15.9706 2 20 6.02944 20 11ZM22 11C22 17.0751 17.0751 22 11 22C4.92487 22 0 17.0751 0 11C0 4.92487 4.92487 0 11 0C17.0751 0 22 4.92487 22 11ZM11.6445 12.7051C11.6445 13.1348 11.3223 13.4678 10.7744 13.4678C10.2266 13.4678 9.92578 13.1885 9.92578 12.6191V12.4795C9.92578 11.4268 10.4951 10.8574 11.2686 10.3203C12.2031 9.67578 12.665 9.32129 12.665 8.59082C12.665 7.76367 12.0205 7.21582 11.043 7.21582C10.3232 7.21582 9.80762 7.57031 9.45312 8.16113C9.38282 8.24242 9.32286 8.32101 9.2667 8.39461C9.04826 8.68087 8.88747 8.8916 8.40039 8.8916C8.0459 8.8916 7.66992 8.62305 7.66992 8.15039C7.66992 7.96777 7.70215 7.7959 7.75586 7.61328C8.05664 6.625 9.27051 5.75488 11.1182 5.75488C12.9336 5.75488 14.5234 6.71094 14.5234 8.50488C14.5234 9.7832 13.7822 10.417 12.7402 11.1045C11.999 11.5986 11.6445 11.9746 11.6445 12.5762V12.7051ZM11.9131 15.5625C11.9131 16.1855 11.376 16.6797 10.7529 16.6797C10.1299 16.6797 9.59277 16.1748 9.59277 15.5625C9.59277 14.9395 10.1191 14.4453 10.7529 14.4453C11.3867 14.4453 11.9131 14.9287 11.9131 15.5625Z", fill: "currentColor" }) }));
const CloseIcon = ({ ...props }) => (jsx(motion.svg, { width: 14, height: 14, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props, children: jsx("path", { d: "M1 13L13 1M1 1L13 13", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) }));
const BackIcon = ({ ...props }) => (jsx(motion.svg, { width: 9, height: 16, viewBox: "0 0 9 16", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props, children: jsx("path", { d: "M8 1L1 8L8 15", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }));
const contentTransitionDuration = 0.22;
const contentVariants$2 = {
    initial: {
        //willChange: 'transform,opacity',
        zIndex: 2,
        opacity: 0,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: contentTransitionDuration * 0.75,
            delay: contentTransitionDuration * 0.25,
            ease: [0.26, 0.08, 0.25, 1],
        },
    },
    exit: {
        zIndex: 1,
        opacity: 0,
        pointerEvents: 'none',
        position: 'absolute',
        left: ['50%', '50%'],
        x: ['-50%', '-50%'],
        transition: {
            duration: contentTransitionDuration,
            ease: [0.26, 0.08, 0.25, 1],
        },
    },
};
const Modal = ({ open, pages, pageId, positionInside, inline, demo, onClose, onBack, onInfo, }) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const context = useContext();
    const themeContext = useThemeContext();
    const mobile = isMobile();
    const { isSignedIn, reset } = useSIWE();
    const connector = supportedConnectors$1.find((x) => x.id === context.connector);
    const locales = useLocales({
        CONNECTORNAME: connector === null || connector === void 0 ? void 0 : connector.name,
    });
    const [state, setOpen] = useTransition({
        timeout: mobile ? 160 : 160,
        preEnter: true,
        mountOnEnter: true,
        unmountOnExit: true,
    });
    const mounted = !(state === 'exited' || state === 'unmounted');
    const rendered = state === 'preEnter' || state !== 'exiting';
    const currentDepth = context.route === routes.CONNECTORS
        ? 0
        : context.route === routes.DOWNLOAD
            ? 2
            : 1;
    const prevDepth = usePrevious(currentDepth, currentDepth);
    if (!positionInside)
        useLockBodyScroll(mounted);
    usePrevious(pageId, pageId);
    useEffect(() => {
        setOpen(open);
        if (open)
            setInTransition(undefined);
    }, [open]);
    const [dimensions, setDimensions] = useState({
        width: undefined,
        height: undefined,
    });
    const [inTransition, setInTransition] = useState(undefined);
    // Calculate new content bounds
    const updateBounds = (node) => {
        const bounds = {
            width: node === null || node === void 0 ? void 0 : node.offsetWidth,
            height: node === null || node === void 0 ? void 0 : node.offsetHeight,
        };
        setDimensions({
            width: `${bounds === null || bounds === void 0 ? void 0 : bounds.width}px`,
            height: `${bounds === null || bounds === void 0 ? void 0 : bounds.height}px`,
        });
    };
    let blockTimeout;
    const contentRef = useCallback((node) => {
        if (!node)
            return;
        ref.current = node;
        // Avoid transition mixups
        setInTransition(inTransition === undefined ? false : true);
        clearTimeout(blockTimeout);
        blockTimeout = setTimeout(() => setInTransition(false), 360);
        // Calculate new content bounds
        updateBounds(node);
    }, [open, inTransition]);
    // Update layout on chain/network switch to avoid clipping
    const { chain } = useNetwork();
    const { switchNetwork } = useSwitchNetwork();
    const ref = useRef(null);
    useEffect(() => {
        if (ref.current)
            updateBounds(ref.current);
    }, [chain, switchNetwork, mobile, isSignedIn, context.options]);
    useEffect(() => {
        if (!mounted) {
            setDimensions({
                width: undefined,
                height: undefined,
            });
            return;
        }
        const listener = (e) => {
            if (e.key === 'Escape' && onClose)
                onClose();
        };
        document.addEventListener('keydown', listener);
        return () => {
            document.removeEventListener('keydown', listener);
        };
    }, [mounted, onClose]);
    const dimensionsCSS = {
        '--height': dimensions.height,
        '--width': dimensions.width,
    };
    function shouldUseQrcode() {
        const c = supportedConnectors$1.filter((x) => x.id === context.connector)[0];
        if (!c)
            return false; // Fail states are shown in the injector flow
        const hasExtensionInstalled = c.extensionIsInstalled && c.extensionIsInstalled();
        const useInjector = !c.scannable || hasExtensionInstalled;
        return !useInjector;
    }
    function getHeading() {
        switch (context.route) {
            case routes.ABOUT:
                return locales.aboutScreen_heading;
            case routes.CONNECT:
                if (shouldUseQrcode()) {
                    return isWalletConnectConnector(connector === null || connector === void 0 ? void 0 : connector.id)
                        ? locales.scanScreen_heading
                        : locales.scanScreen_heading_withConnector;
                }
                else {
                    return connector === null || connector === void 0 ? void 0 : connector.name;
                }
            case routes.CONNECTORS:
                return locales.connectorsScreen_heading;
            case routes.MOBILECONNECTORS:
                return locales.mobileConnectorsScreen_heading;
            case routes.DOWNLOAD:
                return locales.downloadAppScreen_heading;
            case routes.ONBOARDING:
                return locales.onboardingScreen_heading;
            case routes.PROFILE:
                return locales.profileScreen_heading;
            case routes.SWITCHNETWORKS:
                return locales.switchNetworkScreen_heading;
            case routes.SIGNINWITHETHEREUM:
                return isSignedIn
                    ? locales.signInWithEthereumScreen_signedIn_heading
                    : locales.signInWithEthereumScreen_signedOut_heading;
            default:
                return '';
        }
    }
    const Content = (jsx(ResetContainer, { "$useTheme": (_a = demo === null || demo === void 0 ? void 0 : demo.theme) !== null && _a !== void 0 ? _a : themeContext.theme, "$useMode": (_b = demo === null || demo === void 0 ? void 0 : demo.mode) !== null && _b !== void 0 ? _b : themeContext.mode, "$customTheme": (_c = demo === null || demo === void 0 ? void 0 : demo.customTheme) !== null && _c !== void 0 ? _c : themeContext.customTheme, children: jsxs(ModalContainer, { role: "dialog", style: {
                pointerEvents: rendered ? 'auto' : 'none',
                position: positionInside ? 'absolute' : undefined,
            }, children: [!inline && (jsx(BackgroundOverlay, { "$active": rendered, onClick: onClose, "$blur": (_d = context.options) === null || _d === void 0 ? void 0 : _d.overlayBlur })), jsxs(Container$7, { style: dimensionsCSS, initial: false, children: [jsx("div", { style: {
                                pointerEvents: inTransition ? 'all' : 'none',
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 'var(--width)',
                                zIndex: 9,
                                transition: 'width 200ms ease',
                            } }), jsxs(BoxContainer, { className: `${rendered && 'active'}`, children: [jsx(AnimatePresence, { initial: false, children: ((_e = context.options) === null || _e === void 0 ? void 0 : _e.disclaimer) &&
                                        context.route === routes.CONNECTORS && (jsx(DisclaimerBackground, { initial: {
                                            opacity: 0,
                                        }, animate: {
                                            opacity: 1,
                                        }, exit: { opacity: 0 }, transition: {
                                            delay: 0,
                                            duration: 0.2,
                                            ease: [0.25, 0.1, 0.25, 1.0],
                                        }, children: jsx(Disclaimer, { children: jsx("div", { children: (_f = context.options) === null || _f === void 0 ? void 0 : _f.disclaimer }) }) })) }), jsx(AnimatePresence, { initial: false, children: context.errorMessage && (jsxs(ErrorMessage, { initial: { y: '10%', x: '-50%' }, animate: { y: '-100%' }, exit: { y: '100%' }, transition: { duration: 0.2, ease: 'easeInOut' }, children: [jsx("span", { children: context.errorMessage }), jsx("div", { onClick: () => context.displayError(null), style: {
                                                    position: 'absolute',
                                                    right: 24,
                                                    top: 24,
                                                    cursor: 'pointer',
                                                }, children: jsx(CloseIcon, {}) })] })) }), jsxs(ControllerContainer, { children: [onClose && (jsx(CloseButton, { "aria-label": flattenChildren(locales.close).toString(), onClick: onClose, children: jsx(CloseIcon, {}) })), jsx("div", { style: {
                                                position: 'absolute',
                                                top: 23,
                                                left: 20,
                                                width: 32,
                                                height: 32,
                                            }, children: jsx(AnimatePresence, { children: onBack ? (jsx(BackButton, { disabled: inTransition, "aria-label": flattenChildren(locales.back).toString(), onClick: onBack, initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: {
                                                        duration: mobile ? 0 : 0.1,
                                                        delay: mobile ? 0.01 : 0,
                                                    }, children: jsx(BackIcon, {}) }, "backButton")) : context.route === routes.PROFILE &&
                                                    context.signInWithEthereum ? (jsxs(Fragment, { children: [!isSignedIn && (jsx(motion.div, { style: {
                                                                position: 'absolute',
                                                                inset: 0,
                                                                pointerEvents: 'none',
                                                            }, initial: { opacity: 0, scale: 0.8 }, animate: {
                                                                opacity: 1,
                                                                scale: 1,
                                                                transition: { delay: 0.5, duration: 0.2 },
                                                            }, exit: {
                                                                opacity: 0,
                                                                scale: 0.6,
                                                                transition: {
                                                                    delay: 0,
                                                                    duration: mobile ? 0 : 0.1,
                                                                },
                                                            }, children: jsx(SignInTooltip, { children: locales.signInWithEthereumScreen_tooltip }) })), jsx(SiweButton, { disabled: inTransition, "aria-label": locales.signInWithEthereumScreen_signedOut_heading, onClick: () => {
                                                                reset();
                                                                context.setRoute(routes.SIGNINWITHETHEREUM);
                                                            }, initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: {
                                                                duration: mobile ? 0 : 0.1,
                                                                delay: mobile ? 0.01 : 0,
                                                            }, children: jsx(ProfileIcon, { isSignedIn: isSignedIn }) }, "siweButton")] })) : (onInfo &&
                                                    !((_g = context.options) === null || _g === void 0 ? void 0 : _g.hideQuestionMarkCTA) && (jsx(InfoButton, { disabled: inTransition, "aria-label": flattenChildren(locales.moreInformation).toString(), onClick: onInfo, initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: {
                                                        duration: mobile ? 0 : 0.1,
                                                        delay: mobile ? 0.01 : 0,
                                                    }, children: jsx(InfoIcon, {}) }, "infoButton"))) }) })] }), jsx(ModalHeading, { children: jsx(AnimatePresence, { children: jsx(motion.div, { style: {
                                                position: 'absolute',
                                                top: 0,
                                                bottom: 0,
                                                left: 52,
                                                right: 52,
                                                display: 'flex',
                                                //alignItems: 'center',
                                                justifyContent: 'center',
                                            }, initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: {
                                                duration: mobile ? 0 : 0.17,
                                                delay: mobile ? 0.01 : 0,
                                            }, children: jsx(FitText, { children: getHeading() }) }, `${context.route}-${isSignedIn ? 'signedIn' : ''}`) }) }), jsx(InnerContainer$1, { children: Object.keys(pages).map((key) => {
                                        const page = pages[key];
                                        return (
                                        // TODO: We may need to use the follow check avoid unnecessary computations, but this causes a bug where the content flashes
                                        // (key === pageId || key === prevPage) && (
                                        jsx(Page, { open: key === pageId, initial: !positionInside && state !== 'entered', enterAnim: key === pageId
                                                ? currentDepth > prevDepth
                                                    ? 'active-scale-up'
                                                    : 'active'
                                                : '', exitAnim: key !== pageId
                                                ? currentDepth < prevDepth
                                                    ? 'exit-scale-down'
                                                    : 'exit'
                                                : '', children: jsx(PageContents, { ref: contentRef, style: {
                                                    pointerEvents: key === pageId && rendered ? 'auto' : 'none',
                                                }, children: page }, `inner-${key}`) }, key));
                                    }) })] })] })] }) }));
    return (jsx(Fragment, { children: mounted && (jsx(Fragment, { children: positionInside ? (Content) : (jsx(Fragment, { children: jsx(Portal, { children: jsx(FocusTrap, { children: Content }) }) })) })) }));
};
const Page = ({ children, open, initial, prevDepth, currentDepth, enterAnim, exitAnim, }) => {
    const [state, setOpen] = useTransition({
        timeout: 400,
        preEnter: true,
        initialEntered: open,
        mountOnEnter: true,
        unmountOnExit: true,
    });
    const mounted = !(state === 'exited' || state === 'unmounted');
    const rendered = state === 'preEnter' || state !== 'exiting';
    useEffect(() => {
        setOpen(open);
    }, [open]);
    if (!mounted)
        return null;
    return (jsx(PageContainer, { className: `${rendered ? enterAnim : exitAnim}`, style: {
            animationDuration: initial ? '0ms' : undefined,
            animationDelay: initial ? '0ms' : undefined,
        }, children: children }));
};
const OrDivider = ({ children }) => {
    const locales = useLocales();
    return (jsx(TextWithHr, { children: jsx("span", { children: children !== null && children !== void 0 ? children : locales.or }) }));
};

const Graphic = styled(motion.div) `
  position: relative;
  margin: 16px auto 20px;
  height: 190px;
  max-width: 295px;
  pointer-events: none;
  user-select: none;
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    height: 200px;
    max-width: 100%;
    margin-bottom: 32px;
  }
`;
const LogoGroup = styled(motion.div) `
  position: absolute;
  inset: 0;
  z-index: 2;
`;
const graphicIn = keyframes `
  0%{
    opacity:0;
    transform:scale(0.9);
  }
  100%{
    opacity:1;
    transform:none;
  }
`;
const GraphicBackground = styled(motion.div) `
  z-index: 1;
  position: absolute;
  inset: 0;
  top: -2px;
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--ck-body-background);
    background: radial-gradient(
      closest-side,
      var(--ck-body-background-transparent, transparent) 18.75%,
      var(--ck-body-background) 100%
    );
    background-size: 100%;
  }
  svg {
    display: block;
    width: 100%;
    height: auto;
  }
  animation: ${graphicIn} 1000ms 100ms ease both;
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    animation: none;
  }
`;
const logoIn = keyframes `
  0%{
    opacity:0;
    transform:scale(0) translateY(40%);
  }
  100%{
    opacity:1;
    transform:none;
  }
`;
const LogoPosition = styled(motion.div) `
  position: absolute;
  inset: 0;
  animation: cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite both;
  animation-delay: inherit;
`;
const LogoInner = styled(motion.div) `
  position: absolute;
`;
const LogoGraphic = styled(motion.div) `
  position: relative;
  overflow: hidden;
  height: 58px;
  width: 58px;
  border-radius: 13.84px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 20px 0 rgba(0, 0, 0, 0.03);

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;
const float = keyframes `
  0%,100%{ transform:none; }
  50%{ transform: translateY(-10%) }
`;
const FloatWrapper = styled(motion.div) `
  position: relative;
  animation: cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite both;
  animation-name: ${float};
  animation-duration: 3600ms;
`;
const rotate = keyframes `
  0%,100%{ transform:rotate(-3deg); }
  50%{ transform:rotate(3deg); }
`;
const RotateWrapper = styled(motion.div) `
  position: relative;
  animation: cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite both;
  animation-name: ${rotate};
  animation-duration: 3200ms;
`;
const Logo$1 = styled(motion.div) `
  position: absolute;
  inset: 0;

  animation: ${logoIn} 750ms cubic-bezier(0.19, 1, 0.22, 1) both;
  &:nth-child(1){ z-index:2; animation-delay:0ms;  }
  &:nth-child(2){ z-index:1; animation-delay:60ms; }
  &:nth-child(3){ z-index:1; animation-delay:30ms; }
  &:nth-child(4){ z-index:1; animation-delay:90ms; }
  &:nth-child(5){ z-index:1; animation-delay:120ms;}

  &:nth-child(1){ ${RotateWrapper}{ animation-delay:0ms; } }
  &:nth-child(2){ ${RotateWrapper}{ animation-delay:-600ms; } }
  &:nth-child(3){ ${RotateWrapper}{ animation-delay:-1200ms; } }
  &:nth-child(4){ ${RotateWrapper}{ animation-delay:-1800ms; } }
  &:nth-child(5){ ${RotateWrapper}{ animation-delay:-2400ms; } }

  &:nth-child(1){ ${FloatWrapper}{ animation-delay:-200ms; } }
  &:nth-child(2){ ${FloatWrapper}{ animation-delay:-600ms; } }
  &:nth-child(3){ ${FloatWrapper}{ animation-delay:-800ms; } }
  &:nth-child(4){ ${FloatWrapper}{ animation-delay:-300ms; } }
  &:nth-child(5){ ${FloatWrapper}{ animation-delay:-3200ms; } }

  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    animation: none !important;
    ${RotateWrapper},${FloatWrapper} {
      animation: none !important;
    }
  }

  ${LogoInner} {
    transform: translate(-50%, -50%);
  }

  &:nth-child(1) ${LogoPosition} {
    transform: translate(50%, 50%);
    ${LogoGraphic} {
      border-radius: 17.2px;
      width: 72px;
      height: 72px;
    }
  }
  &:nth-child(2) ${LogoPosition} {
    transform: translate(21%, 21.5%);
  }
  &:nth-child(3) ${LogoPosition} {
    transform: translate(78%, 14%);
  }
  &:nth-child(4) ${LogoPosition} {
    transform: translate(22.5%, 76%);
  }
  &:nth-child(5) ${LogoPosition} {
    transform: translate(76%, 80%);
  }
`;

var wave = (jsxs("svg", { "aria-hidden": "true", width: "298", height: "188", viewBox: "0 0 298 188", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("path", { d: "M1 55.2757L21.6438 46.0285C55.5896 30.8228 94.4104 30.8228 128.356 46.0286L169.644 64.5229C203.59 79.7287 242.41 79.7286 276.356 64.5229L297 55.2757M1 44.2118L21.6438 34.9646C55.5896 19.7589 94.4104 19.7589 128.356 34.9646L169.644 53.459C203.59 68.6647 242.41 68.6647 276.356 53.459L297 44.2118M1 33.1477L21.6438 23.9005C55.5896 8.69479 94.4104 8.69479 128.356 23.9005L169.644 42.3949C203.59 57.6006 242.41 57.6006 276.356 42.3949L297 33.1477M1 22.1477L21.6438 12.9005C55.5896 -2.30521 94.4104 -2.30521 128.356 12.9005L169.644 31.3949C203.59 46.6006 242.41 46.6006 276.356 31.3949L297 22.1477M1 66.3398L21.6438 57.0926C55.5896 41.8869 94.4104 41.8869 128.356 57.0926L169.644 75.587C203.59 90.7927 242.41 90.7927 276.356 75.587L297 66.3398M1 77.404L21.6438 68.1568C55.5896 52.9511 94.4104 52.9511 128.356 68.1569L169.644 86.6512C203.59 101.857 242.41 101.857 276.356 86.6512L297 77.404M1 88.4681L21.6438 79.2209C55.5896 64.0152 94.4104 64.0152 128.356 79.2209L169.644 97.7153C203.59 112.921 242.41 112.921 276.356 97.7153L297 88.4681M1 121.66L21.6438 112.413C55.5896 97.2075 94.4104 97.2075 128.356 112.413L169.644 130.908C203.59 146.113 242.41 146.113 276.356 130.908L297 121.66M1 110.596L21.6438 101.349C55.5896 86.1433 94.4104 86.1433 128.356 101.349L169.644 119.843C203.59 135.049 242.41 135.049 276.356 119.843L297 110.596M1 99.5321L21.6438 90.2849C55.5896 75.0792 94.4104 75.0792 128.356 90.2849L169.644 108.779C203.59 123.985 242.41 123.985 276.356 108.779L297 99.5321M1 132.724L21.6438 123.477C55.5896 108.271 94.4104 108.271 128.356 123.477L169.644 141.971C203.59 157.177 242.41 157.177 276.356 141.971L297 132.724M1 143.788L21.6438 134.541C55.5896 119.336 94.4104 119.336 128.356 134.541L169.644 153.036C203.59 168.241 242.41 168.241 276.356 153.036L297 143.788M1 154.853L21.6438 145.605C55.5896 130.4 94.4104 130.4 128.356 145.605L169.644 164.1C203.59 179.305 242.41 179.305 276.356 164.1L297 154.853M1 165.853L21.6438 156.605C55.5896 141.4 94.4104 141.4 128.356 156.605L169.644 175.1C203.59 190.305 242.41 190.305 276.356 175.1L297 165.853", stroke: "url(#paint0_linear_1094_2077)", strokeOpacity: "0.9", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("defs", { children: jsxs("linearGradient", { id: "paint0_linear_1094_2077", x1: "1", y1: "112.587", x2: "297.034", y2: "79.6111", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { stopColor: "var(--ck-graphic-wave-stop-01)" }), jsx("stop", { stopColor: "var(--ck-graphic-wave-stop-02)", offset: "0.239583" }), jsx("stop", { stopColor: "var(--ck-graphic-wave-stop-03)", offset: "0.515625" }), jsx("stop", { stopColor: "var(--ck-graphic-wave-stop-04)", offset: "0.739583" }), jsx("stop", { stopColor: "var(--ck-graphic-wave-stop-05)", offset: "1" })] }) })] }));

const SpinnerContainer$2 = styled(motion.div) `
  position: absolute;
  right: 16px;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Arrow = styled.svg `
  --x: -3px;
  --stroke-width: 2;
  position: relative;
  top: 1px;
  left: -0.5px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 9px;
  margin-right: 1px;
  transition: all 100ms ease;
  transform: translateX(var(--x, -3px));
  color: var(--ck-secondary-button-color, var(--ck-body-color));
  opacity: 0.4;
`;
const ArrowChevron = styled.path ``;
const ArrowLine = styled.line `
  transition: inherit;
  transition-property: transform;
  transform-origin: 90% 50%;
  transform: scaleX(0.1);
`;
const DownloadArrow = styled.div `
  display: inline-block;
  vertical-align: middle;
  position: relative;
  margin-right: 6px;
  color: var(--ck-secondary-button-color, var(--ck-body-color));
`;
const DownloadArrowInner = styled.div `
  transform: rotate(90deg);
  ${Arrow} {
    margin: 0 auto;
  }
`;
const ButtonContainerInner = styled(motion.div) `
  display: flex;
  align-items: center;
  justify-content: center;
  inset: 0;
  height: 100%;
`;
const ButtonContainer$1 = styled.button `

  ${({ disabled }) => disabled &&
    css `
      cursor: not-allowed;
      pointer-events: none;
      ${InnerContainer} {
        opacity: 0.4;
      }
    `}

  ${({ $variant }) => {
    if ($variant === 'primary') {
        return css `
        --color: var(--ck-primary-button-color, var(--ck-body-color));
        --background: var(
          --ck-primary-button-background,
          var(--ck-body-background-primary)
        );
        --box-shadow: var(--ck-primary-button-box-shadow);
        --border-radius: var(--ck-primary-button-border-radius);
        --font-weight: var(--ck-primary-button-font-weight, 500);

        --hover-color: var(--ck-button-primary-hover-color, var(--color));
        --hover-background: var(
          --ck-primary-button-hover-background,
          var(--background)
        );
        --hover-box-shadow: var(
          --ck-primary-button-hover-box-shadow,
          var(--box-shadow)
        );
        --hover-border-radius: var(
          --ck-primary-button-hover-border-radius,
          var(--border-radius)
        );
        --hover-font-weight: var(
          --ck-primary-button-font-weight,
          var(--font-weight)
        );
      `;
    }
    else if ($variant === 'secondary') {
        return css `
        --color: var(--ck-secondary-button-color, var(--ck-body-color));
        --background: var(
          --ck-secondary-button-background,
          var(--ck-body-background-secondary)
        );
        --box-shadow: var(--ck-secondary-button-box-shadow);
        --border-radius: var(--ck-secondary-button-border-radius);
        --font-weight: var(--ck-secondary-button-font-weight, 500);

        --hover-color: var(--ck-secondary-button-hover-color, var(--color));
        --hover-background: var(
          --ck-secondary-button-hover-background,
          var(--background)
        );
        --hover-box-shadow: var(
          --ck-secondary-button-hover-box-shadow,
          var(--box-shadow)
        );
        --hover-border-radius: var(
          --ck-secondary-button-hover-border-radius,
          var(--border-radius)
        );
        --hover-font-weight: var(
          --ck-secondary-button-font-weight,
          var(--font-weight)
        );
      `;
    }
    else if ($variant === 'tertiary') {
        return css `
        --color: var(
          --ck-tertiary-button-color,
          var(--ck-secondary-button-color)
        );
        --background: var(
          --ck-tertiary-button-background,
          var(--ck-secondary-button-background)
        );
        --box-shadow: var(
          --ck-tertiary-button-box-shadow,
          var(--ck-secondary-button-box-shadow)
        );
        --border-radius: var(
          --ck-tertiary-button-border-radius,
          var(--ck-secondary-button-border-radius)
        );
        --font-weight: var(
          --ck-tertiary-button-font-weight,
          var(--ck-secondary-button-font-weight)
        );

        --hover-color: var(
          --button-tertiary-hover-color,
          var(--ck-tertiary-button-color)
        );
        --hover-background: var(
          --ck-tertiary-button-hover-background,
          var(--ck-tertiary-button-background)
        );
        --hover-box-shadow: var(
          --ck-tertiary-button-hover-box-shadow,
          var(--ck-tertiary-button-box-shadow)
        );
        --hover-border-radius: var(
          --ck-tertiary-button-hover-border-radius,
          var(--ck-tertiary-button-border-radius, var(--border-radius))
        );
        --hover-font-weight: var(
          --ck-tertiary-button-font-weight,
          var(--ck-secondary-button-font-weight)
        );
      `;
    }
}}

  appearance: none;
  cursor: pointer;
  user-select: none;
  min-width: fit-content;
  width: 100%;
  display:block;
  text-align: center;
  height: 48px;
  margin: 12px 0 0;
  line-height: 48px;
  padding: 0 4px;
  font-size: 16px;
  font-weight: var(--font-weight,500);
  text-decoration: none;
  white-space: nowrap;
  transition: 100ms ease;
  transition-property: box-shadow, background-color;
  color: var(--color);
  background: var(--background);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  will-change: transform, box-shadow, background-color, color;

  ${DownloadArrow} {
    ${Arrow} {
      transform: translateX(0);
      ${ArrowLine} {
        transform: none;
      }
      ${ArrowChevron} {
      }
    }
  }
}

  @media only screen and (min-width: ${defaultTheme.mobileWidth + 1}px) {
    &:hover,
    &:focus-visible {
      color: var(--ck-accent-text-color, var(--hover-color));
      background: var(--ck-accent-color, var(--hover-background));
      border-radius: var(--hover-border-radius);
      box-shadow: var(--hover-box-shadow);

      ${Arrow} {
        transform: translateX(0);
        ${ArrowLine} {
          transform: none;
        }
        ${ArrowChevron} {
        }
      }
      ${DownloadArrow} {
        ${Arrow} {
          transform: translateX(var(--x));
          ${ArrowLine} {
            transform: scaleX(0.1);
          }
          ${ArrowChevron} {
          }
        }
      }
    }
    &:active {
      box-shadow: var(--ck-secondary-button-active-box-shadow, var(--hover-box-shadow));
    }
  }
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    transition: transform 100ms ease;
    transform: scale(1);
    font-size: 17px;
    &:active {
    }
  }
`;
const InnerContainer = styled.div `
  transform: translateZ(0); // Shifting fix
  position: relative;
  display: inline-block;
  vertical-align: middle;
  max-width: calc(100% - 42px);
  transition: opacity 300ms ease;
  /*
  overflow: hidden;
  text-overflow: ellipsis;
  */
`;
const IconContainer$4 = styled(motion.div) `
  position: relative;
  display: inline-block;
  vertical-align: middle;
  max-width: 20px;
  max-height: 20px;
  margin: 0 10px;
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
  ${(props) => {
    return (props.$rounded &&
        css `
        overflow: hidden;
        border-radius: 5px;
      `);
}}
  svg {
    display: block;
    position: relative;
    max-width: 100%;
    height: auto;
  }
`;

const Spin$1 = keyframes `
  0%{ transform: rotate(0deg); }
  100%{ transform: rotate(360deg); }
`;
const SpinnerContainer$1 = styled(motion.div) `
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${Spin$1} 1s linear infinite;
  svg {
    display: block;
    position: relative;
    animation: ${Spin$1} 1s ease-in-out infinite;
  }
`;

const transition$2 = {
    duration: 0.4,
    ease: [0.175, 0.885, 0.32, 0.98],
};
const Spinner$3 = () => (jsx(SpinnerContainer$1, { initial: { opacity: 0, rotate: 180 }, animate: {
        opacity: 1,
        rotate: 0,
    }, exit: {
        position: 'absolute',
        opacity: 0,
        rotate: -180,
        transition: {
            ...transition$2,
        },
    }, transition: {
        ...transition$2,
        delay: 0.2,
    }, children: jsxs("svg", { width: "18", height: "18", viewBox: "0 0 18 18", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("circle", { cx: "9", cy: "9", r: "7", stroke: "currentColor", strokeOpacity: "0.1", strokeWidth: "2.5" }), jsx("path", { d: "M16 9C16 5.13401 12.866 2 9 2", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round" })] }) }));

const transition$1 = {
    duration: 0.4,
    ease: [0.175, 0.885, 0.32, 0.98],
};
const Button = ({ children, variant = 'secondary', // unique aspect to how we're handling buttons
disabled, icon, iconPosition = 'left', roundedIcon, waiting, arrow, download, href, style, onClick, }) => {
    const key = typeof children === 'string'
        ? children
        : flattenChildren(children).join(''); // Need to generate a string for the key so we can automatically animate between content
    const hrefUrl = typeof href === 'string' ? href : flattenChildren(href).join(''); // Need to have a flat string for the href
    return (jsx(ButtonContainer$1, { as: href ? 'a' : undefined, onClick: (event) => {
            if (!disabled && onClick)
                onClick(event);
        }, href: hrefUrl, target: href && '_blank', rel: href && 'noopener noreferrer', disabled: disabled, "$variant": variant, style: style, children: jsxs(AnimatePresence, { initial: false, children: [jsxs(ButtonContainerInner, { initial: { opacity: 0, y: -10 }, animate: {
                        opacity: 1,
                        y: -1,
                    }, exit: {
                        position: 'absolute',
                        opacity: 0,
                        y: 10,
                        transition: {
                            ...transition$1,
                        },
                    }, transition: {
                        ...transition$1,
                        delay: 0.2,
                    }, children: [icon && iconPosition === 'left' && (jsx(IconContainer$4, { "$rounded": roundedIcon, children: icon })), download && (jsx(DownloadArrow, { children: jsx(DownloadArrowInner, { children: jsxs(Arrow, { width: "13", height: "12", viewBox: "0 0 13 12", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx(ArrowLine, { stroke: "currentColor", x1: "1", y1: "6", x2: "12", y2: "6", strokeWidth: "var(--stroke-width)", strokeLinecap: "round" }), jsx(ArrowChevron, { stroke: "currentColor", d: "M7.51431 1.5L11.757 5.74264M7.5 10.4858L11.7426 6.24314", strokeWidth: "var(--stroke-width)", strokeLinecap: "round" })] }) }) })), jsx(InnerContainer, { style: { paddingLeft: arrow ? 6 : 0 }, children: jsx(FitText, { children: children }) }), icon && iconPosition === 'right' && (jsx(IconContainer$4, { "$rounded": roundedIcon, children: icon })), arrow && (jsxs(Arrow, { width: "13", height: "12", viewBox: "0 0 13 12", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx(ArrowLine, { stroke: "currentColor", x1: "1", y1: "6", x2: "12", y2: "6", strokeWidth: "2", strokeLinecap: "round" }), jsx(ArrowChevron, { stroke: "currentColor", d: "M7.51431 1.5L11.757 5.74264M7.5 10.4858L11.7426 6.24314", strokeWidth: "2", strokeLinecap: "round" })] }))] }, key), waiting && (jsx(SpinnerContainer$2, { children: jsx(Spinner$3, {}) }))] }) }));
};

const Introduction = () => {
    var _a, _b;
    const context = useContext();
    const locales = useLocales({});
    const ctaUrl = (_b = (_a = context.options) === null || _a === void 0 ? void 0 : _a.walletOnboardingUrl) !== null && _b !== void 0 ? _b : locales.onboardingScreen_ctaUrl;
    return (jsxs(PageContent, { children: [jsxs(Graphic, { children: [jsxs(LogoGroup, { children: [jsx(Logo$1, { children: jsx(LogoPosition, { children: jsx(LogoInner, { children: jsx(FloatWrapper, { children: jsx(RotateWrapper, { children: jsx(LogoGraphic, { children: jsx(Logos.Coinbase, { background: true }) }) }) }) }) }) }), jsx(Logo$1, { children: jsx(LogoPosition, { children: jsx(LogoInner, { children: jsx(FloatWrapper, { children: jsx(RotateWrapper, { children: jsx(LogoGraphic, { children: jsx(Logos.MetaMask, { background: true }) }) }) }) }) }) }), jsx(Logo$1, { children: jsx(LogoPosition, { children: jsx(LogoInner, { children: jsx(FloatWrapper, { children: jsx(RotateWrapper, { children: jsx(LogoGraphic, { children: jsx(Logos.Trust, {}) }) }) }) }) }) }), jsx(Logo$1, { children: jsx(LogoPosition, { children: jsx(LogoInner, { children: jsx(FloatWrapper, { children: jsx(RotateWrapper, { children: jsx(LogoGraphic, { children: jsx(Logos.Argent, {}) }) }) }) }) }) }), jsx(Logo$1, { children: jsx(LogoPosition, { children: jsx(LogoInner, { children: jsx(FloatWrapper, { children: jsx(RotateWrapper, { children: jsx(LogoGraphic, { children: jsx(Logos.ImToken, {}) }) }) }) }) }) })] }), jsx(GraphicBackground, { children: wave })] }), jsxs(ModalContent, { style: { paddingBottom: 18 }, children: [jsx(ModalH1, { "$small": true, children: locales.onboardingScreen_h1 }), jsx(ModalBody, { children: locales.onboardingScreen_p })] }), jsx(Button, { href: ctaUrl, arrow: true, children: locales.onboardingScreen_ctaText })] }));
};

const imageHeight = 208;
const ImageContainer$1 = styled.div `
  pointer-events: none;
  user-select: none;
  height: ${imageHeight}px;
  padding: 0 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    display: block;
  }
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    display: none;
  }
`;
const ImageContainerInner = styled(motion.div) ``;
const MobileImageContainer = styled.div `
  pointer-events: none;
  user-select: none;
  height: ${imageHeight}px;
  padding: 0 0 12px;
  display: none;
  align-items: center;
  justify-content: center;
  svg {
    display: block;
  }
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    display: flex;
  }
`;
const Slides = styled.div `
  position: relative;
`;
const Slide = styled(motion.div) `
  scroll-snap-type: x mandatory;
  position: relative;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 0 4px 8px;
  /* will-change: transform, opacity; */
  transition: 400ms 50ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-property: transform, opacity;
  ${(props) => !props.$active &&
    css `
      pointer-events: none;
      position: absolute;
      opacity: 0;
      transform: scale(0.95);
      transition-duration: 300ms;
      transition-delay: 0ms;
    `}
`;
const Slider = styled.div `
  --background: var(--ck-body-background-secondary);
  --background-transparent: var(--ck-body-background-transparent, transparent);
  position: relative;
  padding: 0 0 4px;
  border-radius: 16px;
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    margin: 0 -24px;
    ${Slides} {
      position: relative;
      z-index: 3;
      display: flex;
      overflow: auto;
      scroll-behavior: smooth;
      scroll-snap-type: x mandatory;
      margin-top: -${imageHeight}px;
      padding-top: ${imageHeight}px;
      -ms-overflow-style: none; /* Internet Explorer 10+ */
      scrollbar-width: none; /* Firefox */
      &::-webkit-scrollbar {
        display: none; /* Safari and Chrome */
      }
    }
    ${Slide} {
      position: relative;
      opacity: 1;
      transform: none;
      flex-shrink: 0;
      scroll-snap-align: start;
    }
  }
`;
const Dots = styled.div `
  position: relative;
  top: -1px;
  display: flex;
  justify-content: center;
  pointer-events: auto;
`;
const Dot = styled.button `
  display: flex;
  align-items: center;
  height: 28px;
  padding: 2px;
  background: none;
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    padding: 4px;
    &:before {
      transform: none !important;
    }
  }
  &:before {
    content: '';
    display: block;
    width: 16px;
    height: 3px;
    opacity: 0.12;
    border-radius: 4px;
    background: var(--ck-accent-color, var(--ck-body-color));
    transition: transform 200ms ease, opacity 180ms ease;
  }
  ${(props) => props.$active
    ? css `
          cursor: default;
          &:before {
            opacity: 1;
          }
        `
    : !props.disabled &&
        css `
          cursor: pointer;
          &:hover:before {
            transform: scaleY(3.5);
          }
          &:active:before {
          }
        `}
`;

const pulseAnim = { scale: [0.9, 1.25, 1.6], opacity: [0, 0.11, 0] };
const pulseTransition = { ease: 'linear', duration: 2, repeat: Infinity };
const Center = styled.div `
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
`;
const spin = keyframes `
  from{ transform: rotate(0deg); }
  to{ transform: rotate(360deg); }
`;
const SpinContainer = styled(motion.div) `
  z-index: -1;
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 100%;
  animation: ${spin} 16s linear infinite;
`;
const BgLighten = styled(motion.div) `
  overflow: hidden;
  border-radius: inherit;
  z-index: 0;
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
`;
const MainCircle = styled(motion.div) `
  z-index: 2;
  position: relative;
  border-radius: 50%;
  background: var(--ck-body-background);
`;
const MainCircleInner = styled(motion.div) `
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`;
const Compass = (jsxs("svg", { width: "34", height: "34", viewBox: "0 0 34 34", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("path", { d: "M17 34C26.3 34 34 26.2833 34 17C34 7.7 26.2833 0 16.9833 0C7.7 0 0 7.7 0 17C0 26.2833 7.71667 34 17 34ZM9.83333 25.6833C8.68333 26.2333 7.8 25.3333 8.33333 24.2L13.1667 14.3333C13.45 13.75 13.8167 13.3833 14.35 13.1333L24.1833 8.33333C25.4 7.75 26.25 8.65 25.6833 9.81667L20.8833 19.6667C20.6167 20.2 20.2333 20.6 19.6833 20.85L9.83333 25.6833ZM17.0167 19.1333C18.1833 19.1333 19.1333 18.1833 19.1333 17.0167C19.1333 15.85 18.1833 14.9167 17.0167 14.9167C15.8667 14.9167 14.9167 15.85 14.9167 17.0167C14.9167 18.1833 15.8667 19.1333 17.0167 19.1333Z", fill: "var(--ck-graphic-compass-color, var(--ck-body-color))" }), jsx("path", { d: "M17 34C26.3 34 34 26.2833 34 17C34 7.7 26.2833 0 16.9833 0C7.7 0 0 7.7 0 17C0 26.2833 7.71667 34 17 34ZM9.83333 25.6833C8.68333 26.2333 7.8 25.3333 8.33333 24.2L13.1667 14.3333C13.45 13.75 13.8167 13.3833 14.35 13.1333L24.1833 8.33333C25.4 7.75 26.25 8.65 25.6833 9.81667L20.8833 19.6667C20.6167 20.2 20.2333 20.6 19.6833 20.85L9.83333 25.6833ZM17.0167 19.1333C18.1833 19.1333 19.1333 18.1833 19.1333 17.0167C19.1333 15.85 18.1833 14.9167 17.0167 14.9167C15.8667 14.9167 14.9167 15.85 14.9167 17.0167C14.9167 18.1833 15.8667 19.1333 17.0167 19.1333Z", fill: "url(#ck-compass-gradient)" }), jsx("defs", { children: jsxs("linearGradient", { id: "ck-compass-gradient", x1: "17", y1: "0", x2: "17", y2: "34", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { stopColor: "rgba(0,0,0,0)" }), jsx("stop", { offset: "1", stopColor: "rgba(0,0,0,0.05)" })] }) })] }));
const Wallet = ({ inverted = false }) => (jsxs("svg", { width: "58", height: "50", viewBox: "0 0 58 50", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M57.9332 20.3335V42.1113C57.9332 46.4069 54.451 49.8891 50.1555 49.8891H8.15546C3.85991 49.8891 0.377686 46.4069 0.377686 42.1113V25.0002V7.8891C0.377686 3.59355 3.85991 0.111328 8.15546 0.111328H47.0444C48.7626 0.111328 50.1555 1.50422 50.1555 3.22244C50.1555 4.94066 48.7626 6.33355 47.0443 6.33355H9.71102C7.9928 6.33355 6.59991 7.72644 6.59991 9.44466C6.59991 11.1629 7.9928 12.5558 9.71102 12.5558H50.1555C54.451 12.5558 57.9332 16.038 57.9332 20.3335ZM46.2667 34.3337C48.4145 34.3337 50.1556 32.5926 50.1556 30.4448C50.1556 28.297 48.4145 26.5559 46.2667 26.5559C44.1189 26.5559 42.3778 28.297 42.3778 30.4448C42.3778 32.5926 44.1189 34.3337 46.2667 34.3337Z", fill: inverted
                ? 'var(--ck-graphic-primary-color, var(--ck-body-background))'
                : 'var(--ck-graphic-primary-color, var(--ck-body-color))' }), jsx("defs", { children: jsxs("linearGradient", { id: "paint0_linear_2501_7732", x1: "29.1555", y1: "0.111328", x2: "29.1555", y2: "49.8891", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { stopColor: inverted
                            ? 'var(--ck-body-color-muted)'
                            : 'var(--ck-body-background-transparent, transparent)' }), jsx("stop", { offset: "1", stopColor: inverted ? 'var(--ck-body-color)' : 'var(--ck-body-background)' })] }) })] }));
const Send = (jsx("svg", { width: "41", height: "41", viewBox: "0 0 41 41", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: jsx("path", { d: "M35.4446 0.839914L2.14484 10.7065C0.0395033 11.3303 -0.632966 13.9786 0.919705 15.5313L7.9624 22.574C9.47585 24.0874 11.8661 24.273 13.5951 23.0114L25.2866 14.4797C25.5558 14.2832 25.9281 14.3121 26.1638 14.5478C26.3998 14.7838 26.4285 15.1567 26.2313 15.426L17.6874 27.0937C16.4213 28.8228 16.6052 31.2168 18.1206 32.7322L25.1811 39.7926C26.7337 41.3453 29.382 40.6728 30.0058 38.5675L39.8724 5.2677C40.6753 2.55794 38.1544 0.037024 35.4446 0.839914Z", fill: "var(--ck-graphic-secondary-color, white)" }) }));
const Receive = (jsx("svg", { width: "38", height: "44", viewBox: "0 0 38 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M19 0.875C21.4853 0.875 23.5 2.88972 23.5 5.375V27.761L30.068 21.193C31.8254 19.4357 34.6746 19.4357 36.432 21.193C38.1893 22.9504 38.1893 25.7996 36.432 27.557L22.182 41.807C20.4246 43.5643 17.5754 43.5643 15.818 41.807L1.56802 27.557C-0.18934 25.7996 -0.18934 22.9504 1.56802 21.193C3.32538 19.4357 6.17462 19.4357 7.93198 21.193L14.5 27.761V5.375C14.5 2.88972 16.5147 0.875 19 0.875Z", fill: "var(--ck-graphic-secondary-color, white)" }) }));
const Key = ({ ...props }) => {
    var _a;
    const id = (_a = props === null || props === void 0 ? void 0 : props.id) !== null && _a !== void 0 ? _a : '';
    return (jsxs("svg", { ...props, width: "81", height: "81", viewBox: "0 0 81 81", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M81 27C81 41.9117 68.9117 54 54 54C51.2722 54 48.6389 53.5955 46.1568 52.8432L36 63H27V72H18V81H4.5C2.01472 81 0 78.9853 0 76.5V64.864C0 63.6705 0.474103 62.5259 1.31802 61.682L28.1568 34.8432C27.4045 32.3611 27 29.7278 27 27C27 12.0883 39.0883 0 54 0C68.9117 0 81 12.0883 81 27ZM60.75 25.875C63.8566 25.875 66.375 23.3566 66.375 20.25C66.375 17.1434 63.8566 14.625 60.75 14.625C57.6434 14.625 55.125 17.1434 55.125 20.25C55.125 23.3566 57.6434 25.875 60.75 25.875Z", fill: `url(#${id}paint0_linear_2509_6177)` }), jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M81 27C81 41.9117 68.9117 54 54 54C51.2722 54 48.6389 53.5955 46.1568 52.8432L36 63H27V72H18V81H4.5C2.01472 81 0 78.9853 0 76.5V64.864C0 63.6705 0.474103 62.5259 1.31802 61.682L28.1568 34.8432C27.4045 32.3611 27 29.7278 27 27C27 12.0883 39.0883 0 54 0C68.9117 0 81 12.0883 81 27ZM60.75 25.875C63.8566 25.875 66.375 23.3566 66.375 20.25C66.375 17.1434 63.8566 14.625 60.75 14.625C57.6434 14.625 55.125 17.1434 55.125 20.25C55.125 23.3566 57.6434 25.875 60.75 25.875Z", fill: `url(#${id}paint1_radial_2509_6177)`, fillOpacity: "0.2" }), jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M44.5658 51.2522C45.1527 50.6653 46.0151 50.4492 46.8095 50.6899C49.0823 51.3788 51.4958 51.75 54 51.75C67.6691 51.75 78.75 40.669 78.75 27C78.75 13.331 67.6691 2.25 54 2.25C40.331 2.25 29.25 13.331 29.25 27C29.25 29.5042 29.6212 31.9177 30.3101 34.1905C30.5508 34.9849 30.3347 35.8473 29.7478 36.4342L2.90901 63.273C2.48705 63.6949 2.25 64.2672 2.25 64.864V76.5C2.25 77.7426 3.25736 78.75 4.5 78.75H15.75V72C15.75 70.7574 16.7574 69.75 18 69.75H24.75V63C24.75 61.7574 25.7574 60.75 27 60.75H35.068L44.5658 51.2522ZM36 63H27V72H18V81H4.5C2.01472 81 0 78.9853 0 76.5V64.864C0 63.6705 0.474103 62.5259 1.31802 61.682L28.1568 34.8432C27.4045 32.3611 27 29.7278 27 27C27 12.0883 39.0883 0 54 0C68.9117 0 81 12.0883 81 27C81 41.9117 68.9117 54 54 54C51.2722 54 48.6389 53.5955 46.1568 52.8432L36 63ZM68.625 20.25C68.625 24.5992 65.0992 28.125 60.75 28.125C56.4008 28.125 52.875 24.5992 52.875 20.25C52.875 15.9008 56.4008 12.375 60.75 12.375C65.0992 12.375 68.625 15.9008 68.625 20.25ZM66.375 20.25C66.375 23.3566 63.8566 25.875 60.75 25.875C57.6434 25.875 55.125 23.3566 55.125 20.25C55.125 17.1434 57.6434 14.625 60.75 14.625C63.8566 14.625 66.375 17.1434 66.375 20.25Z", fill: "black", fillOpacity: "0.1" }), jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M33.4205 47.5795C33.8598 48.0188 33.8598 48.7312 33.4205 49.1705L3.0455 79.5455C2.60616 79.9848 1.89384 79.9848 1.4545 79.5455C1.01517 79.1062 1.01517 78.3938 1.4545 77.9545L31.8295 47.5795C32.2688 47.1402 32.9812 47.1402 33.4205 47.5795Z", fill: "#A5A9AD" }), jsxs("defs", { children: [jsxs("linearGradient", { id: `${id}paint0_linear_2509_6177`, x1: "72", y1: "5.625", x2: "2.25", y2: "78.75", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { stopColor: "#D4DFE6" }), jsx("stop", { offset: "0.0967282", stopColor: "#C6CACD" }), jsx("stop", { offset: "0.526645", stopColor: "#BDBAC4" }), jsx("stop", { offset: "1", stopColor: "#939CA1" })] }), jsxs("radialGradient", { id: `${id}paint1_radial_2509_6177`, cx: "0", cy: "0", r: "1", gradientUnits: "userSpaceOnUse", gradientTransform: "translate(52.875 12.375) rotate(93.2705) scale(39.4392)", children: [jsx("stop", { stopColor: "white" }), jsx("stop", { offset: "1", stopColor: "white" })] })] })] }));
};
const VitalikAddress = (jsxs("svg", { width: "131", height: "14", viewBox: "0 0 131 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("path", { d: "M5.74805 13.2549C8.86816 13.2549 10.7227 10.6973 10.7227 6.63672C10.7227 2.57617 8.85059 0.0625 5.74805 0.0625C2.63672 0.0625 0.755859 2.59375 0.755859 6.64551C0.755859 10.7148 2.61914 13.2549 5.74805 13.2549ZM5.74805 11.4004C4.02539 11.4004 3.04102 9.64258 3.04102 6.63672C3.04102 3.68359 4.04297 1.91699 5.74805 1.91699C7.44434 1.91699 8.4375 3.6748 8.4375 6.64551C8.4375 9.65137 7.46191 11.4004 5.74805 11.4004Z", fill: "var(--ck-body-color)" }), jsx("path", { d: "M13.0869 13.1758C13.4561 13.1758 13.6934 13.0439 13.9658 12.6221L15.9697 9.66016H16.0137L18.0264 12.6572C18.2549 13.0088 18.4922 13.1758 18.8965 13.1758C19.4854 13.1758 19.9424 12.7891 19.9424 12.209C19.9424 11.9805 19.8633 11.7695 19.7051 11.541L17.376 8.28906L19.6963 5.16016C19.8896 4.90527 19.9688 4.68555 19.9688 4.43066C19.9688 3.88574 19.5381 3.49902 18.9229 3.49902C18.5361 3.49902 18.2988 3.6748 18.0176 4.10547L16.1191 6.95312H16.0752L14.1328 4.08789C13.8516 3.64844 13.6318 3.49902 13.2012 3.49902C12.6035 3.49902 12.1465 3.91211 12.1465 4.44824C12.1465 4.70312 12.2256 4.92285 12.3838 5.13379L14.7129 8.35059L12.3486 11.5498C12.1641 11.8135 12.0762 12.0156 12.0762 12.2705C12.0762 12.7979 12.498 13.1758 13.0869 13.1758Z", fill: "var(--ck-body-color)" }), jsx("path", { d: "M26.2441 13.2549C29.1445 13.2549 31.1924 11.7432 31.1924 9.57227C31.1924 7.9375 30.0146 6.68066 28.3184 6.3291V6.27637C29.7773 5.87207 30.7178 4.7998 30.7178 3.45508C30.7178 1.48633 28.8633 0.0625 26.2441 0.0625C23.625 0.0625 21.7617 1.49512 21.7617 3.44629C21.7617 4.80859 22.7109 5.88965 24.1699 6.27637V6.3291C22.4736 6.67188 21.3047 7.92871 21.3047 9.57227C21.3047 11.7344 23.335 13.2549 26.2441 13.2549ZM26.2441 5.55566C24.9258 5.55566 24.0029 4.78223 24.0029 3.6748C24.0029 2.55859 24.9258 1.77637 26.2441 1.77637C27.5537 1.77637 28.4854 2.5498 28.4854 3.6748C28.4854 4.78223 27.5537 5.55566 26.2441 5.55566ZM26.2441 11.5234C24.7236 11.5234 23.6514 10.6357 23.6514 9.40527C23.6514 8.1748 24.7236 7.28711 26.2441 7.28711C27.7646 7.28711 28.8369 8.16602 28.8369 9.40527C28.8369 10.6357 27.7646 11.5234 26.2441 11.5234Z", fill: "var(--ck-body-color)" }), jsx("path", { d: "M36.3164 13.1494C37.7578 13.1494 38.7598 12.4199 39.208 11.3477H39.252V12.0771C39.252 12.7891 39.7266 13.1758 40.3594 13.1758C40.9922 13.1758 41.4404 12.7803 41.4404 12.0771V1.29297C41.4404 0.554688 40.9834 0.141602 40.3418 0.141602C39.7002 0.141602 39.252 0.554688 39.252 1.29297V5.24805H39.1992C38.707 4.21973 37.6523 3.52539 36.3164 3.52539C33.9697 3.52539 32.4492 5.38867 32.4492 8.33301C32.4492 11.2949 33.9697 13.1494 36.3164 13.1494ZM36.9756 11.3564C35.5605 11.3564 34.6904 10.1963 34.6904 8.3418C34.6904 6.49609 35.5693 5.32715 36.9756 5.32715C38.3555 5.32715 39.2607 6.51367 39.2607 8.3418C39.2607 10.1875 38.3555 11.3564 36.9756 11.3564Z", fill: "var(--ck-body-color)" }), jsx("path", { d: "M44.0508 13.1494C44.6396 13.1494 44.9736 12.8594 45.1846 12.1738L46.0195 9.76562H50.7568L51.5918 12.1914C51.7939 12.8682 52.1367 13.1494 52.752 13.1494C53.4111 13.1494 53.8857 12.7188 53.8857 12.1035C53.8857 11.9014 53.8418 11.6992 53.7363 11.4092L50.0449 1.38965C49.7285 0.537109 49.2188 0.167969 48.3838 0.167969C47.5576 0.167969 47.0479 0.554688 46.7402 1.39844L43.0576 11.4092C42.9521 11.6816 42.9082 11.9277 42.9082 12.1035C42.9082 12.7451 43.3564 13.1494 44.0508 13.1494ZM46.5557 7.97266L48.3398 2.55859H48.4014L50.2031 7.97266H46.5557Z", fill: "var(--ck-body-color)" }), jsx("path", { d: "M60.1172 13.2549C62.8594 13.2549 64.8545 11.4004 64.8545 8.8252C64.8545 6.42578 63.1406 4.66797 60.6973 4.66797C58.9746 4.66797 57.709 5.54688 57.208 6.71582H57.1641V6.58398C57.208 3.66602 58.2275 1.89941 60.1436 1.89941C61.084 1.89941 61.7607 2.26855 62.3496 3.07715C62.7012 3.52539 62.9824 3.73633 63.4307 3.73633C64.0283 3.73633 64.3975 3.34082 64.3975 2.82227C64.3975 2.57617 64.3359 2.35645 64.1953 2.10156C63.5625 0.897461 62.0859 0.0537109 60.1523 0.0537109C56.9268 0.0537109 54.9932 2.57617 54.9932 6.80371C54.9932 8.24512 55.2305 9.45801 55.6963 10.4336C56.5752 12.2881 58.1396 13.2549 60.1172 13.2549ZM60.082 11.4092C58.667 11.4092 57.5508 10.293 57.5508 8.86914C57.5508 7.4541 58.6494 6.41699 60.1084 6.41699C61.5674 6.41699 62.6309 7.4541 62.6221 8.91309C62.6221 10.3018 61.4971 11.4092 60.082 11.4092Z", fill: "var(--ck-body-color)" }), jsx("path", { d: "M68.1328 8.83398C68.8447 8.83398 69.416 8.27148 69.416 7.55078C69.416 6.83008 68.8447 6.25879 68.1328 6.25879C67.4121 6.25879 66.8408 6.83008 66.8408 7.55078C66.8408 8.27148 67.4121 8.83398 68.1328 8.83398Z", fill: "var(--ck-body-color)" }), jsx("path", { d: "M73.3359 8.83398C74.0479 8.83398 74.6191 8.27148 74.6191 7.55078C74.6191 6.83008 74.0479 6.25879 73.3359 6.25879C72.6152 6.25879 72.0439 6.83008 72.0439 7.55078C72.0439 8.27148 72.6152 8.83398 73.3359 8.83398Z", fill: "var(--ck-body-color)" }), jsx("path", { d: "M78.5391 8.83398C79.251 8.83398 79.8223 8.27148 79.8223 7.55078C79.8223 6.83008 79.251 6.25879 78.5391 6.25879C77.8184 6.25879 77.2471 6.83008 77.2471 7.55078C77.2471 8.27148 77.8184 8.83398 78.5391 8.83398Z", fill: "var(--ck-body-color)" }), jsx("path", { d: "M83.7422 8.83398C84.4541 8.83398 85.0254 8.27148 85.0254 7.55078C85.0254 6.83008 84.4541 6.25879 83.7422 6.25879C83.0215 6.25879 82.4502 6.83008 82.4502 7.55078C82.4502 8.27148 83.0215 8.83398 83.7422 8.83398Z", fill: "var(--ck-body-color)" }), jsx("path", { d: "M92.2148 13.2549C94.957 13.2549 96.9521 11.4004 96.9521 8.8252C96.9521 6.42578 95.2383 4.66797 92.7949 4.66797C91.0723 4.66797 89.8066 5.54688 89.3057 6.71582H89.2617V6.58398C89.3057 3.66602 90.3252 1.89941 92.2412 1.89941C93.1816 1.89941 93.8584 2.26855 94.4473 3.07715C94.7988 3.52539 95.0801 3.73633 95.5283 3.73633C96.126 3.73633 96.4951 3.34082 96.4951 2.82227C96.4951 2.57617 96.4336 2.35645 96.293 2.10156C95.6602 0.897461 94.1836 0.0537109 92.25 0.0537109C89.0244 0.0537109 87.0908 2.57617 87.0908 6.80371C87.0908 8.24512 87.3281 9.45801 87.7939 10.4336C88.6729 12.2881 90.2373 13.2549 92.2148 13.2549ZM92.1797 11.4092C90.7646 11.4092 89.6484 10.293 89.6484 8.86914C89.6484 7.4541 90.7471 6.41699 92.2061 6.41699C93.665 6.41699 94.7285 7.4541 94.7197 8.91309C94.7197 10.3018 93.5947 11.4092 92.1797 11.4092Z", fill: "var(--ck-body-color)" }), jsx("path", { d: "M103.377 13.2549C106.497 13.2549 108.352 10.6973 108.352 6.63672C108.352 2.57617 106.479 0.0625 103.377 0.0625C100.266 0.0625 98.3848 2.59375 98.3848 6.64551C98.3848 10.7148 100.248 13.2549 103.377 13.2549ZM103.377 11.4004C101.654 11.4004 100.67 9.64258 100.67 6.63672C100.67 3.68359 101.672 1.91699 103.377 1.91699C105.073 1.91699 106.066 3.6748 106.066 6.64551C106.066 9.65137 105.091 11.4004 103.377 11.4004Z", fill: "var(--ck-body-color)" }), jsx("path", { d: "M117.167 13.1758C117.8 13.1758 118.248 12.7715 118.248 12.0596V10.5654H119.127C119.733 10.5654 120.094 10.1875 120.094 9.63379C120.094 9.08887 119.733 8.70215 119.136 8.70215H118.248V1.81152C118.248 0.756836 117.554 0.141602 116.385 0.141602C115.453 0.141602 114.899 0.52832 114.073 1.75879C112.553 3.99121 111.111 6.16211 110.224 7.75293C109.872 8.38574 109.731 8.79883 109.731 9.29102C109.731 10.0469 110.268 10.5654 111.085 10.5654H116.086V12.0596C116.086 12.7715 116.543 13.1758 117.167 13.1758ZM116.121 8.75488H111.788V8.69336C112.816 6.82129 114.073 4.92285 116.086 2.04004H116.121V8.75488Z", fill: "var(--ck-body-color)" }), jsx("path", { d: "M126.105 13.2549C128.918 13.2549 130.869 11.4355 130.869 8.78125C130.869 6.35547 129.138 4.6416 126.712 4.6416C125.438 4.6416 124.392 5.13379 123.855 5.9248H123.812L124.146 2.17188H129.27C129.85 2.17188 130.228 1.80273 130.228 1.24023C130.228 0.686523 129.85 0.317383 129.27 0.317383H123.803C122.81 0.317383 122.3 0.72168 122.221 1.72363L121.816 6.51367C121.808 6.56641 121.808 6.60156 121.808 6.6543C121.79 7.26953 122.15 7.78809 122.88 7.78809C123.398 7.78809 123.618 7.67383 124.146 7.14648C124.629 6.67188 125.323 6.34668 126.123 6.34668C127.617 6.34668 128.681 7.38379 128.681 8.84277C128.681 10.3457 127.617 11.4092 126.114 11.4092C124.893 11.4092 124.049 10.8027 123.618 9.77441C123.381 9.30859 123.091 9.12402 122.616 9.12402C122.019 9.12402 121.641 9.49316 121.641 10.082C121.641 10.4072 121.72 10.6709 121.843 10.9434C122.467 12.3232 124.154 13.2549 126.105 13.2549Z", fill: "var(--ck-body-color)" })] }));
const SlideOne = ({ layoutId }) => {
    return (jsxs("div", { style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }, children: [jsx(motion.div, { initial: { rotate: 90, scale: 0.2, x: '100%' }, animate: { rotate: 0, scale: 1, x: 0 }, exit: { rotate: 40, scale: 0.1, x: '70%' }, style: {
                    zIndex: 4,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 76,
                    height: 76,
                    background: 'var(--ck-graphic-secondary-background, #6366F1)',
                    borderRadius: '50%',
                    boxShadow: 'var(--ck-graphic-secondary-box-shadow, 0px 2px 10px rgba(99, 102, 241, 0.3))',
                }, children: Receive }), jsx(MainCircle, { layoutId: layoutId, style: {
                    position: 'relative',
                    zIndex: 10,
                    margin: '0 -8px',
                    width: 112,
                    height: 112,
                }, children: jsxs(MainCircleInner, { style: {
                        background: 'var(--ck-graphic-primary-background, var(--ck-body-background))',
                        boxShadow: 'var(--ck-graphic-primary-box-shadow, 0px 3px 15px rgba(0, 0, 0, 0.1))',
                    }, initial: {
                        opacity: 0,
                    }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: [jsx(BgLighten, {}), jsx(motion.div, { style: { zIndex: 2, position: 'relative' }, children: jsx(Wallet, {}) })] }, 'SlideOneInner') }, layoutId), jsx(motion.div, { initial: { rotate: -90, scale: 0.2, x: '-100%' }, animate: { rotate: 0, scale: 1, x: 0 }, exit: { rotate: -40, scale: 0.1, x: '-70%' }, style: {
                    zIndex: 4,
                    position: 'relative',
                    width: 76,
                    height: 76,
                    background: 'var(--ck-graphic-secondary-background, #3897FB)',
                    borderRadius: '50%',
                    boxShadow: 'var(--ck-graphic-secondary-box-shadow, 0px 2px 10px rgba(56, 151, 251, 0.3))',
                }, children: jsx(Center, { children: jsx("div", { style: { position: 'relative', left: -2, top: 3 }, children: Send }) }) })] }));
};
const SlideTwo = ({ layoutId }) => {
    return (jsx(Fragment, { children: jsxs("div", { style: {
                position: 'relative',
                left: -14,
            }, children: [jsx(MainCircle, { layoutId: layoutId, style: {
                        zIndex: 10,
                        position: 'absolute',
                        left: 15,
                        top: 12,
                        width: 32,
                        height: 32,
                    }, children: jsx(MainCircleInner, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, style: {
                            background: 'var(--ck-graphic-primary-background, var(--ck-body-background))',
                            boxShadow: 'var(--ck-graphic-primary-box-shadow, 0px 2px 5px rgba(37, 41, 46, 0.16))',
                        }, children: jsx(Center, { children: jsx(Wallet, {}) }) }, 'SlideTwoInner') }, layoutId), jsxs(motion.div, { initial: { scale: 0.2 }, animate: { scale: 1 }, exit: { scale: 0.2 }, style: {
                        zIndex: 7,
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '21px 56px',
                        paddingRight: 52,
                        background: 'var(--ck-graphic-primary-background, var(--ck-body-background))',
                        boxShadow: 'var(--ck-graphic-primary-box-shadow, 0px 2px 9px rgba(0, 0, 0, 0.07))',
                        borderRadius: 'var(--ck-border-radius, 16px)',
                    }, children: [jsx(BgLighten, {}), jsx("div", { style: { position: 'relative', zIndex: 2, top: 1, left: 1 }, children: VitalikAddress })] }), jsx(motion.div, { style: {
                        zIndex: 8,
                        position: 'absolute',
                        top: -16,
                        right: -28,
                    }, initial: { rotate: 90, x: -70, scale: 0.4 }, animate: { rotate: 0, x: 0, scale: 1 }, exit: { rotate: 0, x: -70, scale: 0.4 }, children: jsx(Key, { id: layoutId }) })] }) }));
};
const SlideThree = ({ layoutId }) => {
    const id = Math.random(); // TODO: Better unique ID handling
    return (jsx(Fragment, { children: jsxs(motion.div, { style: {
                position: 'relative',
            }, children: [jsxs(MainCircle, { layoutId: layoutId, initial: { rotate: 80 }, style: {
                        zIndex: 10,
                        position: 'relative',
                        width: 128,
                        height: 128,
                    }, children: [jsx(MainCircleInner, { initial: { opacity: 0, rotate: 100 }, animate: { opacity: 1 }, exit: { opacity: 0 }, style: {
                                overflow: 'hidden',
                                background: `var(--ck-graphic-globe-background, radial-gradient(
              82.42% 82.42% at 50% 86.72%,
              rgba(255, 255, 255, 0.2) 0%,
              rgba(0, 0, 0, 0) 100%
            ),
            linear-gradient(180deg, #3897FB 0%, #5004F1 100%))`,
                                boxShadow: 'var(--ck-graphic-globe-box-shadow, 0px -6px 20px rgba(56, 151, 251, 0.23))',
                            }, children: jsx(SpinContainer, { style: !Boolean(layoutId)
                                    ? {
                                        animationPlayState: 'paused',
                                    }
                                    : undefined, children: jsxs("svg", { width: "128", height: "128", viewBox: "0 0 128 128", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsxs("g", { children: [jsx("circle", { cx: "30", cy: "141", r: "64", stroke: `url(#networkRadialA-${id})`, strokeWidth: "3" }), jsx("circle", { cx: "78.8515", cy: "131.123", r: "54.1005", transform: "rotate(-37.4016 78.8515 131.123)", stroke: `url(#networkRadialB-${id})`, strokeWidth: "3" }), jsx("circle", { cx: "63.6053", cy: "2.12794", r: "50.8338", transform: "rotate(134.702 63.6053 2.12794)", stroke: `url(#networkRadialC-${id})`, strokeWidth: "3" }), jsx("circle", { cx: "126.658", cy: "56.6577", r: "50.3433", transform: "rotate(-105 126.658 56.6577)", stroke: `url(#networkRadialD-${id})`, strokeWidth: "3" }), jsx("circle", { cx: "13.6619", cy: "18.9603", r: "46.0247", transform: "rotate(107.362 13.6619 18.9603)", stroke: `url(#networkRadialE-${id})`, strokeWidth: "3" })] }), jsxs("defs", { children: [jsxs("radialGradient", { id: `networkRadialA-${id}`, cx: "0", cy: "0", r: "1", gradientUnits: "userSpaceOnUse", gradientTransform: "translate(60.5 84) rotate(104.668) scale(77.0097)", children: [jsx("stop", { stopColor: "var(--ck-graphic-globe-lines, white)" }), jsx("stop", { offset: "1", stopColor: "var(--ck-graphic-globe-lines, white)", stopOpacity: "0" })] }), jsxs("radialGradient", { id: `networkRadialB-${id}`, cx: "0", cy: "0", r: "1", gradientUnits: "userSpaceOnUse", gradientTransform: "translate(96.1805 81.6717) rotate(97.125) scale(64.7443)", children: [jsx("stop", { stopColor: "var(--ck-graphic-globe-lines, white)" }), jsx("stop", { offset: "1", stopColor: "var(--ck-graphic-globe-lines, white)", stopOpacity: "0" })] }), jsxs("radialGradient", { id: `networkRadialC-${id}`, cx: "0", cy: "0", r: "1", gradientUnits: "userSpaceOnUse", gradientTransform: "translate(96.3816 -36.4455) rotate(114.614) scale(57.7177)", children: [jsx("stop", { stopColor: "var(--ck-graphic-globe-lines, white)" }), jsx("stop", { offset: "1", stopColor: "var(--ck-graphic-globe-lines, white)", stopOpacity: "0" })] }), jsxs("radialGradient", { id: `networkRadialD-${id}`, cx: "0", cy: "0", r: "1", gradientUnits: "userSpaceOnUse", gradientTransform: "translate(137.86 7.73234) rotate(92.3288) scale(62.743)", children: [jsx("stop", { stopColor: "var(--ck-graphic-globe-lines, white)" }), jsx("stop", { offset: "1", stopColor: "var(--ck-graphic-globe-lines, white)", stopOpacity: "0" })] }), jsxs("radialGradient", { id: `networkRadialE-${id}`, cx: "0", cy: "0", r: "1", gradientUnits: "userSpaceOnUse", gradientTransform: "translate(35.3203 -21.566) rotate(104.513) scale(54.8617)", children: [jsx("stop", { stopColor: "var(--ck-graphic-globe-lines, white)" }), jsx("stop", { offset: "1", stopColor: "var(--ck-graphic-globe-lines, white)", stopOpacity: "0" })] })] })] }) }) }, 'SlideThreeInner'), jsxs(motion.div, { exit: { opacity: 0 }, children: [jsx(motion.div, { initial: !Boolean(layoutId) ? { scale: 1.1 } : undefined, animate: Boolean(layoutId) ? pulseAnim : undefined, transition: { ...pulseTransition }, style: {
                                        position: 'absolute',
                                        inset: 0,
                                        borderRadius: '50%',
                                        boxShadow: '0 0 0 2px var(--ck-graphic-globe-lines, rgba(126, 112, 243, 1))',
                                    } }, "pulseA"), jsx(motion.div, { initial: !Boolean(layoutId) ? { scale: 1.2, opacity: 0.25 } : undefined, animate: Boolean(layoutId) ? pulseAnim : undefined, transition: { ...pulseTransition, delay: 0.5 }, style: {
                                        position: 'absolute',
                                        inset: 0,
                                        borderRadius: '50%',
                                        boxShadow: '0 0 0 2px var(--ck-graphic-globe-lines, rgba(126, 112, 243, 1))',
                                    } }, "pulseB")] })] }, layoutId), jsxs(motion.div, { initial: { rotate: -20, scale: 0.1, y: -10, x: -10 }, animate: { rotate: 0, scale: 1, y: 0, x: 0 }, exit: { zIndex: 3, scale: 0.2, y: -25, x: 15 }, style: {
                        zIndex: 12,
                        borderRadius: '50%',
                        position: 'absolute',
                        bottom: -4,
                        right: -4,
                        width: 54,
                        height: 54,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 13,
                        background: 'var(--ck-graphic-compass-background, var(--ck-body-background))',
                        boxShadow: 'var(--ck-graphic-compass-box-shadow, 0px 2px 9px rgba(0, 0, 0, 0.15))',
                    }, children: [jsx(BgLighten, {}), jsx(motion.div, { style: { zIndex: 2, position: 'absolute' }, initial: { rotate: -170 }, animate: { rotate: 0 }, exit: {
                                rotate: -180,
                                transition: { duration: 0 }, // needed to avoid AnimatePresence taking too long to unmount the animation which causes issues on page close
                            }, transition: {
                                type: 'spring',
                                stiffness: 6,
                                damping: 0.9,
                                mass: 0.2,
                            }, children: Compass })] })] }, 'SlideThree') }));
};

const About = () => {
    var _a, _b;
    const locales = useLocales({
    //CONNECTORNAME: connector.name,
    });
    const context = useContext();
    const ctaUrl = (_b = (_a = context.options) === null || _a === void 0 ? void 0 : _a.ethereumOnboardingUrl) !== null && _b !== void 0 ? _b : locales.aboutScreen_ctaUrl;
    const [ready, setReady] = useState(true);
    const [slider, setSlider] = useState(0);
    const interacted = useRef(false);
    const scrollPos = useRef(0);
    const animationEase = [0.16, 1, 0.3, 1];
    const animationDuration = 600;
    let interval;
    useEffect(() => {
        //interval = setTimeout(nextSlide, autoplayDelay);
        return () => clearInterval(interval);
    }, []);
    const isSwipe = () => {
        if (sliderRef.current) {
            const { overflow } = getComputedStyle(sliderRef.current);
            return overflow !== 'visible';
        }
        return false;
    };
    const gotoSlide = (index) => {
        setReady(false);
        if (isSwipe()) {
            scrollToSlide(index);
        }
        else {
            setSlider(index);
        }
    };
    const scrollToSlide = (index) => {
        if (sliderRef.current) {
            const { offsetWidth: width } = sliderRef.current;
            sliderRef.current.scrollLeft = width * index;
            setTimeout(() => setSlider(index), 100);
        }
    };
    // This event should not fire on mobile
    const onScroll = () => {
        if (!sliderRef.current)
            return;
        const { offsetWidth: width, scrollLeft: x } = sliderRef.current;
        const prevScroll = scrollPos.current;
        scrollPos.current = x;
        // Limit when the slider should be set after swipe
        const threshold = 4;
        if (prevScroll - x > -threshold && prevScroll - x < threshold) {
            const currentSlide = Math.round(x / width);
            setSlider(currentSlide);
        }
    };
    const onTouchMove = () => {
        didInteract();
    };
    const onTouchEnd = () => {
        const { offsetWidth: width, scrollLeft: x } = sliderRef.current;
        const currentSlide = Math.round(x / width);
        setSlider(currentSlide);
    };
    const didInteract = () => {
        interacted.current = true;
        clearTimeout(interval);
    };
    const sliderRef = useRef(null);
    useEffect(() => {
        if (!sliderRef.current)
            return;
        sliderRef.current.addEventListener('scroll', onScroll);
        sliderRef.current.addEventListener('touchmove', onTouchMove);
        sliderRef.current.addEventListener('touchend', onTouchEnd);
        return () => {
            if (!sliderRef.current)
                return;
            sliderRef.current.removeEventListener('scroll', onScroll);
            sliderRef.current.removeEventListener('touchmove', onTouchMove);
            sliderRef.current.removeEventListener('touchend', onTouchEnd);
        };
    }, [sliderRef]);
    const graphics = [
        jsx(SlideOne, { layoutId: 'graphicCircle', duration: animationDuration, ease: animationEase }),
        jsx(SlideTwo, { layoutId: 'graphicCircle', duration: animationDuration, ease: animationEase }),
        jsx(SlideThree, { layoutId: 'graphicCircle', duration: animationDuration, ease: animationEase }),
    ];
    const mobileGraphics = [
        jsx(SlideOne, { duration: animationDuration, ease: animationEase }),
        jsx(SlideTwo, { duration: animationDuration, ease: animationEase }),
        jsx(SlideThree, { duration: animationDuration, ease: animationEase }),
    ];
    // Adjust height of ModalBody to fit content based on language
    const slideHeight = (() => {
        var _a;
        switch ((_a = context.options) === null || _a === void 0 ? void 0 : _a.language) {
            case 'en-US':
            case 'zh-CN':
                return 64;
            default:
                return 84;
        }
    })();
    const slides = [
        jsxs(Fragment, { children: [jsx(ModalH1, { style: { height: 24 }, "$small": true, children: jsx(FitText, { children: locales.aboutScreen_a_h1 }) }), jsx(ModalBody, { style: { height: slideHeight }, children: jsx(FitText, { children: locales.aboutScreen_a_p }) })] }),
        jsxs(Fragment, { children: [jsx(ModalH1, { style: { height: 24 }, "$small": true, children: jsx(FitText, { children: locales.aboutScreen_b_h1 }) }), jsx(ModalBody, { style: { height: slideHeight }, children: jsx(FitText, { children: locales.aboutScreen_b_p }) })] }),
        jsxs(Fragment, { children: [jsx(ModalH1, { style: { height: 24 }, "$small": true, children: jsx(FitText, { children: locales.aboutScreen_c_h1 }) }), jsx(ModalBody, { style: { height: slideHeight }, children: jsx(FitText, { children: locales.aboutScreen_c_p }) })] }),
    ];
    return (jsxs(PageContent, { children: [jsxs(Slider, { children: [jsx(ImageContainer$1, { children: jsx(MotionConfig, { transition: {
                                duration: animationDuration / 1000,
                                ease: animationEase,
                            }, children: jsx(AnimatePresence, { initial: false, onExitComplete: () => setReady(true), children: graphics.map((g, i) => slider === i && (jsx(ImageContainerInner, { style: { position: 'absolute' }, children: g }, i))) }) }) }), jsx(Slides, { ref: sliderRef, children: jsx(AnimatePresence, { children: slides.map((s, i) => (jsxs(Slide, { "$active": slider === i, children: [jsx(MobileImageContainer, { children: jsx(MotionConfig, { transition: {
                                                duration: 0,
                                            }, children: jsx(ImageContainerInner, { children: mobileGraphics[i] }) }) }), jsx(ModalContent, { style: { gap: 8, paddingBottom: 0 }, children: s })] }, i))) }) })] }), jsx(OrDivider, { children: jsx(Dots, { children: slides.map((s, i) => (jsx(Dot, { "$active": slider === i, onClick: () => {
                            didInteract();
                            gotoSlide(i);
                        } }, i))) }) }), jsx(Button, { href: ctaUrl, arrow: true, children: locales.aboutScreen_ctaText })] }));
};

/**
 * LocalStorage helper functions to save and retrieve data on a per-app basis
 * e.g recently connected wallets, transactions, etc.
 */
//import { randomUUID as randomID } from 'crypto';
const randomID = () => {
    // TODO: use randomUUID when it's supported in all browsers
    // https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID
    // Until then, use this fallback
    return (Date.now().toString(36) +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15));
};
const save = (storageKey, data) => {
    localStorage.setItem(storageKey, JSON.stringify(data));
    return get(storageKey);
};
const get = (storageKey) => {
    const data = localStorage.getItem(storageKey);
    try {
        if (data)
            return JSON.parse(data);
        return [];
    }
    catch (e) {
        // error parsing data, reset
        save(storageKey, []);
        return [];
    }
};
const add = (storageKey, item) => {
    const data = get(storageKey);
    const newData = [
        {
            ...item,
            ckStoreKey: randomID(),
            timestamp: new Date(),
        },
        ...data,
    ];
    save(storageKey, newData);
    return get(storageKey);
};
const remove = (storageKey, item) => {
    const data = get(storageKey);
    const newData = data.filter((i) => i.ckStoreKey !== item.ckStoreKey);
    save(storageKey, newData);
    return get(storageKey);
};

const useLocalStorage = (storageKey) => {
    const [data, setData] = useState(get(storageKey));
    const add$1 = (item) => {
        const newItems = add(storageKey, item);
        setData(newItems);
    };
    const update = (items) => {
        const newItems = save(storageKey, items);
        setData(newItems);
    };
    const remove$1 = (item) => {
        const newItems = remove(storageKey, item);
        setData(newItems);
    };
    const clear = () => {
        const newItems = save(storageKey, []);
        setData(newItems);
    };
    return { data, add: add$1, remove: remove$1, update, clear };
};

const useLastConnector = () => {
    const { data: lastConnectorId, add, update, clear, } = useLocalStorage('connectKit.lastConnectorId');
    const updateLastConnectorId = (id) => {
        if (lastConnectorId) {
            if (lastConnectorId === id)
                return;
            clear();
            update(id);
        }
        else {
            add(id);
        }
    };
    return {
        lastConnectorId,
        updateLastConnectorId,
    };
};

/**
 * This is a wrapper around wagmi's useConnect hook that adds some
 * additional functionality.
 */
function useConnect({ ...props } = {}) {
    var _a;
    const context = useContext();
    const connectProps = {
        chainId: (_a = context.options) === null || _a === void 0 ? void 0 : _a.initialChainId,
    };
    const { updateLastConnectorId } = useLastConnector();
    const { connect, connectAsync, connectors, ...rest } = useConnect$1({
        onError(err) {
            if (err.message) {
                if (err.message !== 'User rejected request') {
                    context.log(err.message, err);
                }
            }
            else {
                context.log(`Could not connect.`, err);
            }
        },
        onSuccess(data) {
            var _a, _b;
            updateLastConnectorId((_b = (_a = data === null || data === void 0 ? void 0 : data.connector) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : '');
        },
        ...props,
        /*
        onSuccess: (data) => {
          context.onConnect?.({
            address: data.account,
            //chainId: data.chain.id,
            connectorId: data.connector?.id,
          });
        },
        */
    });
    return {
        connect: ({ ...opts }) => {
            return connect({
                ...opts,
                ...connectProps,
            });
        },
        connectAsync: async ({ ...opts }) => {
            return await connectAsync({
                ...opts,
                ...connectProps,
            });
        },
        connectors,
        ...rest,
    };
}

var WalletIcon$1 = ({ ...props }) => {
    return (jsxs("svg", { "aria-hidden": "true", width: "20", height: "19", viewBox: "0 0 20 19", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props, children: [jsx("path", { d: "M1.57568 4.60616C1.57568 2.69827 3.12234 1.15161 5.03023 1.15161H15.3939C17.3018 1.15161 18.8484 2.69826 18.8484 4.60616V10.3637C18.8484 12.2716 17.3018 13.8183 15.3939 13.8183H5.03023C3.12234 13.8183 1.57568 12.2716 1.57568 10.3637V4.60616Z", stroke: "currentColor", strokeWidth: "2" }), jsx("path", { d: "M1 4.79293C1 2.435 3.31004 0.770014 5.54697 1.51566L12.4561 3.81869C13.8667 4.2889 14.8182 5.60901 14.8182 7.09596V13.6313C14.8182 15.9892 12.5081 17.6542 10.2712 16.9086L3.36212 14.6056C1.95149 14.1353 1 12.8152 1 11.3283V4.79293Z", fill: "var(--ck-body-background)", stroke: "currentColor", strokeWidth: "2" }), jsx("circle", { cx: "10.3863", cy: "10.1894", r: "1.32574", fill: "currentColor" })] }));
};

const Shimmer = keyframes `
  0%{ transform: translate(-100%) rotate(-45deg); }
  100%{ transform: translate(100%) rotate(-80deg); }
`;
const InfoBox = styled.div `
  padding: 24px 24px 28px;
  border-radius: var(--ck-tertiary-border-radius, 24px);
  box-shadow: var(--ck-tertiary-box-shadow, none);
  background: var(--ck-body-background-tertiary);
  ${ModalBody} {
    max-width: none;
  }
`;
const InfoBoxButtons = styled.div `
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 5px -8px -12px;
  button {
  }
`;
const LearnMoreContainer = styled(motion.div) `
  text-align: center;
  margin-bottom: -6px;
`;
const LearnMoreButton = styled(motion.button) `
  appearance: none;
  user-select: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 42px;
  padding: 0 16px;
  border-radius: 6px;
  background: none;
  color: var(--ck-body-color-muted);
  font-size: 15px;
  line-height: 18px;
  font-weight: 500;
  /* will-change: transform; */
  transition: color 200ms ease, transform 100ms ease;
  svg {
    transition: all 100ms ease-out;
    display: block;
    position: relative;
    top: 2px;
    left: 2px;
    transform: translateZ(0px);
    path,
    circle {
      transition: all 100ms ease-out;
    }
    path:last-of-type {
      transform-origin: 0 0;
      transform: scaleX(1.3) skewY(-12deg);
      opacity: 0;
    }
    circle {
      transform: translate(20%, -15%);
    }
  }
  &:hover {
    color: var(--ck-body-color-muted-hover);
    svg {
      path,
      circle {
        opacity: 1;
        transform: none;
      }
    }
  }
  &:active {
    transform: scale(0.96);
  }
`;
const ConnectorsContainer = styled(motion.div) `
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 0 16px;
`;
const ConnectorButton = styled(motion.button) `
  cursor: pointer;
  user-select: none;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 20px;
  width: 100%;
  height: 64px;
  font-size: 17px;
  font-weight: var(--ck-primary-button-font-weight, 500);
  line-height: 20px;
  text-align: var(--ck-body-button-text-align, left);
  transition: 180ms ease;
  transition-property: background, color, box-shadow, transform;
  will-change: transform, box-shadow, background-color, color;

  --fallback-color: var(--ck-primary-button-color);
  --fallback-background: var(--ck-primary-button-background);
  --fallback-box-shadow: var(--ck-primary-button-box-shadow);
  --fallback-border-radius: var(--ck-primary-button-border-radius);

  --color: var(--ck-primary-button-color, var(--fallback-color));
  --background: var(--ck-primary-button-background, var(--fallback-background));
  --box-shadow: var(--ck-primary-button-box-shadow, var(--fallback-box-shadow));
  --border-radius: var(
    --ck-primary-button-border-radius,
    var(--fallback-border-radius)
  );

  --hover-color: var(--ck-primary-button-hover-color, var(--color));
  --hover-background: var(
    --ck-primary-button-hover-background,
    var(--background)
  );
  --hover-box-shadow: var(
    --ck-primary-button-hover-box-shadow,
    var(--box-shadow)
  );
  --hover-border-radius: var(
    --ck-primary-button-hover-border-radius,
    var(--border-radius)
  );

  --active-color: var(--ck-primary-button-active-color, var(--hover-color));
  --active-background: var(
    --ck-primary-button-active-background,
    var(--hover-background)
  );
  --active-box-shadow: var(
    --ck-primary-button-active-box-shadow,
    var(--hover-box-shadow)
  );
  --active-border-radius: var(
    --ck-primary-button-active-border-radius,
    var(--hover-border-radius)
  );

  color: var(--color);
  background: var(--background);
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);

  &:disabled {
    transition: 180ms ease;
  }

  --bg: var(--background);
  &:not(:disabled) {
    &:hover {
      color: var(--hover-color);
      background: var(--hover-background);
      box-shadow: var(--hover-box-shadow);
      border-radius: var(--hover-border-radius);
      --bg: var(--hover-background, var(--background));
    }
    &:focus-visible {
      transition-duration: 100ms;
      color: var(--hover-color);
      background: var(--hover-background);
      box-shadow: var(--hover-box-shadow);
      border-radius: var(--hover-border-radius);
      --bg: var(--hover-background, var(--background));
    }
    &:active {
      color: var(--active-color);
      background: var(--active-background);
      box-shadow: var(--active-box-shadow);
      border-radius: var(--active-border-radius);
      --bg: var(--active-background, var(--background));
    }
  }
`;
const ConnectorRecentlyUsed = styled(motion.span) `
  position: relative;
  top: var(--ck-recent-badge-top-offset, 0.5px);
  display: inline-block;
  padding: 10px 7px;
  line-height: 0;
  font-size: 13px;
  font-weight: 400;
  border-radius: var(--ck-recent-badge-border-radius, var(--border-radius));
  color: var(
    --ck-recent-badge-color,
    var(--ck-accent-color, var(--ck-body-color-muted, currentColor))
  );
  background: var(--ck-recent-badge-background, transparent);
  overflow: hidden;
  span {
    display: inline-block;
    position: relative;
  }
  &:before {
    z-index: 1;
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.4;
    box-shadow: var(--ck-recent-badge-box-shadow, inset 0 0 0 1px currentColor);
    border-radius: inherit;
  }
  &:after {
    z-index: 2;
    content: '';
    position: absolute;
    inset: -10%;
    top: -110%;
    aspect-ratio: 1/1;
    opacity: 0.7;
    background: linear-gradient(
      170deg,
      transparent 10%,
      var(--ck-recent-badge-background, var(--bg)) 50%,
      transparent 90%
    );
    animation: ${Shimmer} 2s linear infinite;
  }
`;
const ConnectorLabel = styled(motion.span) `
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 2px 0;
  padding-right: 38px;
`;
const ConnectorIcon = styled(motion.div) `
  position: absolute;
  right: 20px;
  width: 32px;
  height: 32px;
  overflow: hidden;
  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;
const MobileConnectorsContainer = styled(motion.div) `
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  padding: 14px 0 28px;
  margin: 0 0;
`;
const MobileConnectorButton = styled(motion.button) `
  --background: var(--ck-body-background-secondary);
  cursor: pointer;
  user-select: none;
  position: relative;
  padding: 0;
  width: 100%;
  min-width: 25%;
  font-size: 13px;
  font-weight: 500;
  line-height: 13px;
  text-align: center;
  transition: transform 100ms ease;

  background: none;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  &:not(:disabled) {
    &:active {
      transform: scale(0.97);
    }
  }
`;
const MobileConnectorLabel = styled(motion.span) `
  display: block;
  padding: 10px 0 0;
  color: var(--ck-body-color);
  opacity: 0.75;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const MobileConnectorIcon = styled(motion.div) `
  margin: 0 auto;
  width: 60px;
  height: 60px;
  overflow: hidden;
  svg {
    border-radius: inherit;
    display: block;
    position: relative;
    transform: translate3d(0, 0, 0);
    width: 100%;
    height: 100%;
  }
`;

const injected = () => {
    const isInstalled = typeof window !== 'undefined' && Boolean(window.ethereum);
    const shouldUseWalletConnect = isMobile() && !isInstalled;
    return {
        id: 'injected',
        name: 'Browser Wallet',
        shortName: 'browser',
        scannable: false,
        logos: { default: jsx(Logos.Injected, {}) },
        installed: Boolean(!shouldUseWalletConnect ? isInstalled : false),
    };
};

const walletConnect = () => {
    return {
        id: 'walletConnect',
        name: 'Other Wallets',
        logos: {
            default: jsx(Logos.WalletConnect, {}),
            mobile: jsx(Logos.OtherWallets, {}),
            transparent: jsx(Logos.WalletConnect, { background: false }),
            connectorButton: jsx(Logos.OtherWallets, {}),
            qrCode: jsx(Logos.WalletConnect, { background: true }),
        },
        logoBackground: 'var(--ck-brand-walletConnect)',
        scannable: true,
        createUri: (uri) => uri,
    };
};

const metaMask = () => {
    const isInstalled = isMetaMask();
    const shouldUseWalletConnect = isMobile() && !isInstalled; // use walletconnect on mobile if not using metamask in-app browser
    return {
        id: 'metaMask',
        name: 'MetaMask',
        logos: {
            default: jsx(Logos.MetaMask, { background: true }),
            mobile: jsx(Logos.MetaMask, { background: true }),
            transparent: (jsx("div", { style: {
                    transform: 'scale(0.86)',
                    position: 'relative',
                    width: '100%',
                }, children: jsx(Logos.MetaMask, {}) })),
            connectorButton: (jsx("div", { style: {
                    transform: 'scale(1.1)',
                }, children: jsx(Logos.MetaMask, {}) })),
        },
        logoBackground: 'linear-gradient(0deg, var(--ck-brand-metamask-12), var(--ck-brand-metamask-11))',
        scannable: false,
        downloadUrls: {
            download: 'https://connect.family.co/v0/download/metamask',
            website: 'https://metamask.io/download/',
            android: 'https://play.google.com/store/apps/details?id=io.metamask',
            ios: 'https://apps.apple.com/app/metamask/id1438144202',
            chrome: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
            firefox: 'https://addons.mozilla.org/firefox/addon/ether-metamask/',
            brave: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
            edge: 'https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm',
        },
        installed: Boolean(!shouldUseWalletConnect ? isInstalled : false),
        createUri: (uri) => {
            return isAndroid()
                ? uri
                : `https://metamask.app.link/wc?uri=${encodeURIComponent(uri)}`;
        },
    };
};

const coinbaseWallet = () => {
    const isInstalled = isCoinbaseWallet();
    const shouldUseWalletConnect = isMobile() && !isInstalled;
    return {
        id: 'coinbaseWallet',
        name: 'Coinbase Wallet',
        shortName: 'Coinbase',
        logos: {
            default: jsx(Logos.Coinbase, {}),
            mobile: jsx(Logos.Coinbase, { background: true }),
            transparent: jsx(Logos.Coinbase, { background: false }),
            appIcon: jsx(Logos.Coinbase, { background: false }),
            connectorButton: jsx(Logos.Coinbase, { background: true }),
            qrCode: jsx(Logos.Coinbase, { background: true }),
        },
        logoBackground: 'var(--ck-brand-coinbaseWallet)',
        scannable: true,
        installed: Boolean(!shouldUseWalletConnect ? isInstalled : false),
        downloadUrls: {
            download: 'https://connect.family.co/v0/download/coinbasewallet',
            website: 'https://www.coinbase.com/wallet/getting-started-extension',
            android: 'https://play.google.com/store/apps/details?id=org.toshi',
            ios: 'https://apps.apple.com/app/coinbase-wallet-store-crypto/id1278383455',
            chrome: 'https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad',
        },
        createUri: (uri) => {
            return `https://go.cb-w.com/wc?uri=${encodeURIComponent(uri)}`;
        },
    };
};

const rainbow = () => {
    return {
        id: 'rainbow',
        name: 'Rainbow',
        logos: {
            default: jsx(Logos.Rainbow, {}),
        },
        logoBackground: '#174299',
        // gradient: 'linear-gradient(180deg, #174299 0%, #001E59 100%)',
        scannable: false,
        downloadUrls: {
            download: 'https://connect.family.co/v0/download/rainbow',
            website: 'https://rainbow.me',
            android: 'https://play.google.com/store/apps/details?id=me.rainbow',
            ios: 'https://apps.apple.com/app/rainbow-ethereum-wallet/id1457119021',
        },
        createUri: (uri) => {
            return isAndroid()
                ? uri
                : `https://rnbwapp.com/wc?uri=${encodeURIComponent(uri)}`;
        },
    };
};

const argent = () => {
    return {
        id: 'argent',
        name: 'Argent',
        logos: {
            default: jsx(Logos.Argent, {}),
        },
        logoBackground: '#fff',
        scannable: false,
        downloadUrls: {
            download: 'https://connect.family.co/v0/download/argent',
            android: 'https://play.google.com/store/apps/details?id=im.argent.contractwalletclient',
            ios: 'https://apps.apple.com/app/argent/id1358741926',
        },
        createUri: (uri) => {
            return isAndroid()
                ? uri
                : `https://argent.link/app/wc?uri=${encodeURIComponent(uri)}`;
        },
    };
};

const trust = () => {
    return {
        id: 'trust',
        name: 'Trust Wallet',
        shortName: 'Trust',
        logos: {
            default: jsx(Logos.Trust, {}),
        },
        logoBackground: '#fff',
        scannable: false,
        downloadUrls: {
            download: 'https://connect.family.co/v0/download/trust',
            android: 'https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp',
            ios: 'https://apps.apple.com/app/trust-crypto-bitcoin-wallet/id1288339409',
        },
        createUri: (uri) => {
            return isAndroid()
                ? uri
                : `https://link.trustwallet.com/wc?uri=${encodeURIComponent(uri)}`;
        },
    };
};

const ledger = () => {
    return {
        id: 'ledger',
        name: 'Ledger Live',
        shortName: 'Ledger',
        logos: {
            default: jsx(Logos.Ledger, {}),
        },
        logoBackground: '#000',
        scannable: false,
        downloadUrls: {
            website: 'https://www.ledger.com/ledger-live/download#download-device-2',
            download: 'https://connect.family.co/v0/download/ledger',
            android: 'https://play.google.com/store/apps/details?id=com.ledger.live',
            ios: 'https://apps.apple.com/app/ledger-live-web3-wallet/id1361671700',
        },
        createUri: (uri) => {
            return isAndroid()
                ? uri
                : `ledgerlive://wc?uri=${encodeURIComponent(uri)}`;
        },
    };
};

const imToken = () => {
    return {
        id: 'imToken',
        name: 'imToken',
        logos: {
            default: jsx(Logos.ImToken, {}),
        },
        logoBackground: '#098de6',
        scannable: false,
        downloadUrls: {
            //website: 'https://support.token.im/hc/en-us/categories/360000925393',
            download: 'https://connect.family.co/v0/download/imToken',
            android: 'https://play.google.com/store/apps/details?id=im.token.app',
            ios: 'https://itunes.apple.com/us/app/imtoken2/id1384798940',
        },
        createUri: (uri) => {
            return `imtokenv2://wc?uri=${encodeURIComponent(uri)}`;
        },
    };
};

const brave = () => {
    var _a;
    const isInstalled = typeof window !== 'undefined' && ((_a = window.ethereum) === null || _a === void 0 ? void 0 : _a.isBraveWallet) === true;
    return {
        id: 'brave',
        name: 'Brave Wallet',
        shortName: 'Brave',
        logos: {
            default: jsx(Logos.Brave, {}),
        },
        logoBackground: '#fff',
        scannable: false,
        downloadUrls: {},
        installed: isInstalled,
        createUri: (uri) => uri,
    };
};

const steak = () => {
    return {
        id: 'steak',
        name: 'Steak',
        logos: {
            default: jsx(Logos.Steak, {}),
        },
        logoBackground: '#000000',
        scannable: false,
        downloadUrls: {
            download: 'https://connect.family.co/v0/download/steak',
            android: 'https://play.google.com/store/apps/details?id=fi.steakwallet.app',
            ios: 'https://apps.apple.com/app/steakwallet/id1569375204',
            website: 'https://steakwallet.fi/download',
        },
        createUri: (uri) => {
            return isAndroid()
                ? uri
                : `https://links.steakwallet.fi/wc?uri=${encodeURIComponent(uri)}`;
        },
    };
};

const unstoppable = () => {
    return {
        id: 'unstoppable',
        name: 'Unstoppable',
        logos: {
            default: jsx(Logos.Unstoppable, {}),
        },
        logoBackground: 'linear-gradient(180deg, #FED812 0%, #FFAF00 100%)',
        scannable: false,
        downloadUrls: {
            download: 'https://connect.family.co/v0/download/unstoppable',
            ios: 'https://apps.apple.com/app/bank-bitcoin-wallet/id1447619907',
            android: 'https://play.google.com/store/apps/details?id=io.horizontalsystems.bankwallet',
        },
        createUri: (uri) => {
            return isAndroid()
                ? uri
                : `https://unstoppable.money/wc?uri=${encodeURIComponent(uri)}`;
        },
    };
};

const onto = () => {
    return {
        id: 'onto',
        name: 'ONTO',
        logos: {
            default: jsx(Logos.ONTO, {}),
        },
        logoBackground: '#ffffff',
        scannable: false,
        downloadUrls: {
            download: 'https://connect.family.co/v0/download/onto',
            ios: 'https://apps.apple.com/app/onto-an-ontology-dapp/id1436009823',
            android: 'https://play.google.com/store/apps/details?id=com.github.ontio.onto',
            website: 'https://onto.app/en/download/',
        },
        createUri: (uri) => {
            return isAndroid()
                ? uri
                : `https://onto.app/wc?uri=${encodeURIComponent(uri)}`;
        },
    };
};

const gnosisSafe = () => {
    return {
        id: 'gnosisSafe',
        name: 'Gnosis Safe',
        shortName: 'Safe',
        logos: {
            default: jsx(Logos.GnosisSafe, {}),
        },
        logoBackground: '#ffffff',
        scannable: false,
        installed: !(typeof window === 'undefined') && (window === null || window === void 0 ? void 0 : window.parent) !== window,
        downloadUrls: {
            download: 'https://connect.family.co/v0/download/gnosisSafe',
            ios: 'https://apps.apple.com/app/id1515759131',
            android: 'https://play.google.com/store/apps/details?id=io.gnosis.safe',
            website: 'https://gnosis-safe.io/',
        },
        createUri: (uri) => {
            return isAndroid()
                ? uri
                : `https://gnosis-safe.io/wc?uri=${encodeURIComponent(uri)}`;
        },
    };
};

const frontier = () => {
    return {
        id: 'frontier',
        name: 'Frontier',
        logos: {
            default: jsx(Logos.Frontier, {}),
        },
        logoBackground: '#CC703C',
        scannable: false,
        downloadUrls: {
            download: 'https://connect.family.co/v0/download/frontier',
            ios: 'https://apps.apple.com/app/frontier-crypto-defi-wallet/id1482380988',
            android: 'https://play.google.com/store/apps/details?id=com.frontierwallet',
            website: 'https://frontier.xyz/',
        },
        createUri: (uri) => {
            return isAndroid() ? uri : `frontier://wc?uri=${encodeURIComponent(uri)}`;
        },
    };
};

const zerion = () => {
    return {
        id: 'zerion',
        name: 'Zerion',
        logos: {
            default: jsx(Logos.Zerion, {}),
        },
        logoBackground: '#CC703C',
        scannable: false,
        downloadUrls: {
            download: 'https://connect.family.co/v0/download/zerion',
            ios: 'https://apps.apple.com/app/apple-store/id1456732565',
            android: 'https://play.google.com/store/apps/details?id=io.zerion.android',
            website: 'https://zerion.io/',
        },
        createUri: (uri) => {
            return isAndroid()
                ? uri
                : `https://app.zerion.io/wc?uri=${encodeURIComponent(uri)}`;
        },
    };
};

const family = () => {
    return {
        id: 'family',
        name: 'Family',
        logos: {
            default: jsx(Logos.Family, {}),
        },
        logoBackground: '#7DC4FF',
        scannable: true,
        downloadUrls: {
            download: 'https://connect.family.co/v0/download/family',
            ios: 'https://family.co/download',
            website: 'https://family.co',
        },
        createUri: (uri) => {
            return isAndroid()
                ? uri
                : `familywallet://wc?uri=${encodeURIComponent(uri)}`;
        },
    };
};

const frame = () => {
    const isInstalled = isFrame();
    return {
        id: 'frame',
        name: 'Frame',
        logos: {
            default: jsx(Logos.Frame, {}),
            transparent: jsx(Logos.Frame, {}),
            appIcon: jsx(Logos.Frame, {}),
            connectorButton: jsx(Logos.Frame, {}),
        },
        logoBackground: '#fff',
        scannable: false,
        downloadUrls: {
            download: 'https://connect.family.co/v0/download/frame',
            website: 'https://frame.sh',
            chrome: 'https://chrome.google.com/webstore/detail/frame-companion/ldcoohedfbjoobcadoglnnmmfbdlmmhf',
            firefox: 'https://addons.mozilla.org/en-US/firefox/addon/frame-extension',
            brave: 'https://chrome.google.com/webstore/detail/frame-companion/ldcoohedfbjoobcadoglnnmmfbdlmmhf',
        },
        installed: isInstalled,
        createUri: (uri) => uri,
    };
};

const phantom = () => {
    const isInstalled = isPhantom();
    return {
        id: 'phantom',
        name: 'Phantom',
        shortName: 'Phantom',
        scannable: false,
        logos: { default: jsx(Logos.Phantom, {}) },
        installed: Boolean(isInstalled),
    };
};

const dawn = () => {
    const isInstalled = isDawn();
    return {
        id: 'dawn',
        name: 'Dawn Wallet',
        shortName: 'Dawn',
        logos: {
            default: jsx(Logos.Dawn, {}),
        },
        logoBackground: '#000000',
        scannable: false,
        installed: Boolean(isInstalled),
        downloadUrls: {
            download: 'https://apps.apple.com/us/app/dawn-ethereum-wallet/id1673143782',
            website: 'https://www.dawnwallet.xyz/',
            ios: 'https://apps.apple.com/us/app/dawn-ethereum-wallet/id1673143782',
        },
    };
};

const rabby = () => {
    const isInstalled = isRabby();
    return {
        id: 'rabby',
        name: 'Rabby Wallet',
        logos: {
            default: jsx(Logos.Rabby, {}),
            transparent: jsx(Logos.Rabby, {}),
            appIcon: jsx(Logos.Rabby, {}),
            connectorButton: jsx(Logos.Rabby, {}),
        },
        logoBackground: '#8697FF',
        scannable: false,
        downloadUrls: {
            website: 'https://rabby.io',
            chrome: 'https://chrome.google.com/webstore/detail/rabby-wallet/acmacodkjbdgmoleebolmdjonilkdbch',
        },
        installed: isInstalled,
    };
};

const getWallets = () => {
    return [
        injected(),
        walletConnect(),
        metaMask(),
        coinbaseWallet(),
        argent(),
        trust(),
        ledger(),
        family(),
        imToken(),
        rainbow(),
        unstoppable(),
        onto(),
        steak(),
        frontier(),
        zerion(),
        //slope(),
        // injected
        brave(),
        gnosisSafe(),
        frame(),
        phantom(),
        dawn(),
        rabby(),
    ];
};

function useDefaultWallets() {
    const { connectors } = useConnect$1();
    let defaultWallets = [];
    // If missing metamask or coinbasewallet connector from wagmi config, add them to this list
    if (!connectors.find((c) => c.id === 'metaMask'))
        defaultWallets.push('metaMask');
    if (!connectors.find((c) => c.id === 'coinbaseWallet'))
        defaultWallets.push('coinbaseWallet');
    // define the order of the wallets
    defaultWallets.push('argent', 'trust', 'ledger', 'family', 'imToken', 'rainbow', 'unstoppable', 'onto', 'steak', 'frontier', 'zerion', 'gnosisSafe', 'brave', 
    //'slope',
    'frame', 'phantom', 'dawn', 'rabby');
    const wallets = getWallets();
    return wallets.filter((wallet) => defaultWallets.includes(wallet.id));
}

function useConnectors() {
    const { connectors } = useConnect$1();
    return connectors;
}
function useConnector(id) {
    const connectors = useConnectors();
    return connectors.find((c) => c.id === id);
}
function useWalletConnectConnector() {
    var _a;
    /*
    options: {
      qrcode: false,
      // or
      showQrModal: false,
    }
    */
    return (_a = useConnector('walletConnect')) !== null && _a !== void 0 ? _a : useConnector('walletConnectLegacy');
}
function useCoinbaseWalletConnector() {
    /*
    options: {
      headlessMode: true,
    }
    */
    return useConnector('coinbaseWallet');
}

function useWalletConnectUri({ enabled } = {
    enabled: true,
}) {
    const { log } = useContext();
    const [uri, setUri] = useState(undefined);
    const connector = useWalletConnectConnector();
    const isWalletConnectLegacy = (connector === null || connector === void 0 ? void 0 : connector.id) === 'walletConnectLegacy';
    const { isConnected } = useAccount();
    const { connectAsync } = useConnect();
    useEffect(() => {
        if (!enabled)
            return;
        async function handleMessage({ type, data }) {
            log('WC Message', type, data);
            if (isWalletConnectLegacy) {
                log('isWalletConnectLegacy');
                if (type === 'connecting') {
                    const p = await connector.getProvider();
                    setUri(p.connector.uri);
                    // User rejected, regenerate QR code
                    p.connector.on('disconnect', () => {
                        log('User rejected, regenerate QR code');
                        connectWalletConnect(connector);
                    });
                }
            }
            else {
                if (type === 'display_uri') {
                    setUri(data);
                }
                /*
                // This has the URI as well, but we're probably better off using the one in the display_uri event
                if (type === 'connecting') {
                  const p = await connector.getProvider();
                  const uri = p.signer.uri;
                  setConnectorUri(uri);
                }
                */
            }
        }
        async function handleChange(e) {
            log('WC Change', e);
        }
        async function handleDisconnect() {
            var _a;
            log('WC Disconnect');
            if (connector) {
                if (((_a = connector.options) === null || _a === void 0 ? void 0 : _a.version) === '1') {
                    connectWallet(connector);
                }
            }
        }
        async function handleConnect() {
            log('WC Connect');
        }
        async function handleError(e) {
            log('WC Error', e);
        }
        async function connectWallet(connector) {
            const result = await connectAsync({ connector });
            if (result)
                return result;
            return false;
        }
        async function connectWalletConnect(connector) {
            try {
                await connectWallet(connector);
            }
            catch (error) {
                log('catch error');
                log(error);
                if (error.code) {
                    switch (error.code) {
                        case 4001:
                            log('error.code - User rejected');
                            connectWalletConnect(connector); // Regenerate QR code
                            break;
                        default:
                            log('error.code - Unknown Error');
                            break;
                    }
                }
                else {
                    // Sometimes the error doesn't respond with a code
                    log('WalletConnect cannot connect.', error);
                }
            }
        }
        if (!connector || uri)
            return;
        if (connector && !isConnected) {
            connectWalletConnect(connector);
            log('add wc listeners');
            connector.on('message', handleMessage);
            connector.on('change', handleChange);
            connector.on('connect', handleConnect);
            connector.on('disconnect', handleDisconnect);
            connector.on('error', handleError);
            return () => {
                log('remove wc listeners');
                connector.off('message', handleMessage);
                connector.off('change', handleChange);
                connector.off('connect', handleConnect);
                connector.off('disconnect', handleDisconnect);
                connector.off('error', handleError);
            };
        }
    }, [enabled, connector, isConnected]);
    return {
        uri,
    };
}

const Wallets = () => {
    var _a, _b, _c, _d, _e, _f, _g;
    const context = useContext();
    const locales = useLocales({});
    const mobile = isMobile();
    const { uri: wcUri } = useWalletConnectUri({ enabled: mobile });
    const { connectAsync, connectors } = useConnect();
    const { lastConnectorId } = useLastConnector();
    const openDefaultConnect = async (connector) => {
        // @TODO: use the MetaMask config
        if (isMetaMaskConnector(connector.id) && mobile) {
            const uri = isAndroid()
                ? wcUri
                : `https://metamask.app.link/wc?uri=${encodeURIComponent(wcUri)}`;
            if (uri)
                window.location.href = uri;
        }
        else {
            try {
                await connectAsync({ connector: connector });
            }
            catch (err) {
                context.displayError('Async connect error. See console for more details.', err);
            }
        }
    };
    useEffect(() => { }, [mobile]);
    /**
     * Some injected connectors pretend to be metamask, this helps avoid that issue.
     */
    const shouldShowInjectedConnector = () => {
        // Only display if an injected connector is detected
        const { ethereum } = window;
        const needsInjectedWalletFallback = typeof window !== 'undefined' &&
            ethereum &&
            !isMetaMask() &&
            !isCoinbaseWallet();
        //!ethereum?.isBraveWallet; // TODO: Add this line when Brave is supported
        return needsInjectedWalletFallback;
    };
    const wallets = useDefaultWallets();
    const findInjectedConnectorInfo = (name) => {
        let walletList = name.split(/[(),]+/);
        walletList.shift(); // remove "Injected" from array
        walletList = walletList.map((x) => x.trim());
        const hasWalletLogo = walletList.filter((x) => {
            const a = wallets.map((wallet) => wallet.name).includes(x);
            if (a)
                return x;
            return null;
        });
        if (hasWalletLogo.length === 0)
            return null;
        const foundInjector = wallets.filter((wallet) => wallet.installed && wallet.name === hasWalletLogo[0])[0];
        return foundInjector;
    };
    return (jsx(PageContent, { style: { width: 312 }, children: mobile ? (jsxs(Fragment, { children: [jsx(MobileConnectorsContainer, { children: connectors.map((connector) => {
                        var _a, _b, _c, _d, _e, _f, _g;
                        const info = supportedConnectors$1.filter((c) => c.id === connector.id)[0];
                        if (!info)
                            return null;
                        let logos = info.logos;
                        let name = (_b = (_a = info.shortName) !== null && _a !== void 0 ? _a : info.name) !== null && _b !== void 0 ? _b : connector.name;
                        if (isInjectedConnector(info.id)) {
                            if (!shouldShowInjectedConnector())
                                return null;
                            const foundInjector = findInjectedConnectorInfo(connector.name);
                            if (foundInjector) {
                                logos = foundInjector.logos;
                                name = foundInjector.name.replace(' Wallet', '');
                            }
                        }
                        if (isWalletConnectConnector(info.id)) {
                            name =
                                (_d = (_c = context.options) === null || _c === void 0 ? void 0 : _c.walletConnectName) !== null && _d !== void 0 ? _d : locales.otherWallets;
                        }
                        return (jsxs(MobileConnectorButton, { 
                            //disabled={!connector.ready}
                            onClick: () => {
                                if (isInjectedConnector(info.id) ||
                                    (isMetaMaskConnector(info.id) && isMetaMask())) {
                                    context.setRoute(routes.CONNECT);
                                    context.setConnector(connector.id);
                                }
                                else if (isWalletConnectConnector(connector.id)) {
                                    context.setRoute(routes.MOBILECONNECTORS);
                                }
                                else {
                                    openDefaultConnect(connector);
                                }
                            }, children: [jsx(MobileConnectorIcon, { children: (_g = (_f = (_e = logos.mobile) !== null && _e !== void 0 ? _e : logos.appIcon) !== null && _f !== void 0 ? _f : logos.connectorButton) !== null && _g !== void 0 ? _g : logos.default }), jsx(MobileConnectorLabel, { children: name })] }, `m-${connector.id}`));
                    }) }), jsxs(InfoBox, { children: [jsxs(ModalContent, { style: { padding: 0, textAlign: 'left' }, children: [jsx(ModalH1, { "$small": true, children: locales.connectorsScreen_h1 }), jsx(ModalBody, { children: locales.connectorsScreen_p })] }), jsxs(InfoBoxButtons, { children: [!((_a = context.options) === null || _a === void 0 ? void 0 : _a.hideQuestionMarkCTA) && (jsx(Button, { variant: 'tertiary', onClick: () => context.setRoute(routes.ABOUT), children: locales.learnMore })), !((_b = context.options) === null || _b === void 0 ? void 0 : _b.hideNoWalletCTA) && (jsx(Button, { variant: 'tertiary', onClick: () => context.setRoute(routes.ONBOARDING), children: locales.getWallet }))] })] }), ((_c = context.options) === null || _c === void 0 ? void 0 : _c.disclaimer) && (jsx(Disclaimer, { style: { visibility: 'hidden', pointerEvents: 'none' }, children: jsx("div", { children: (_d = context.options) === null || _d === void 0 ? void 0 : _d.disclaimer }) }))] })) : (jsxs(Fragment, { children: [jsx(ConnectorsContainer, { children: connectors.map((connector) => {
                        var _a, _b, _c, _d, _e;
                        const info = supportedConnectors$1.filter((c) => c.id === connector.id)[0];
                        if (!info)
                            return null;
                        let logos = info.logos;
                        let name = (_a = info.name) !== null && _a !== void 0 ? _a : connector.name;
                        if (isWalletConnectConnector(info.id)) {
                            name =
                                (_c = (_b = context.options) === null || _b === void 0 ? void 0 : _b.walletConnectName) !== null && _c !== void 0 ? _c : locales.otherWallets;
                        }
                        if (isInjectedConnector(info.id)) {
                            if (!shouldShowInjectedConnector())
                                return null;
                            const foundInjector = findInjectedConnectorInfo(connector.name);
                            if (foundInjector) {
                                logos = foundInjector.logos;
                                name = foundInjector.name;
                            }
                        }
                        let logo = (_d = logos.connectorButton) !== null && _d !== void 0 ? _d : logos.default;
                        if (info.extensionIsInstalled && logos.appIcon) {
                            if (info.extensionIsInstalled()) {
                                logo = logos.appIcon;
                            }
                        }
                        return (jsxs(ConnectorButton, { disabled: context.route !== routes.CONNECTORS, onClick: () => {
                                context.setRoute(routes.CONNECT);
                                context.setConnector(connector.id);
                            }, children: [jsx(ConnectorIcon, { children: logo }), jsxs(ConnectorLabel, { children: [name, !((_e = context.options) === null || _e === void 0 ? void 0 : _e.hideRecentBadge) &&
                                            lastConnectorId === connector.id && (jsx(ConnectorRecentlyUsed, { children: jsx("span", { children: "Recent" }) }))] })] }, connector.id));
                    }) }), !((_e = context.options) === null || _e === void 0 ? void 0 : _e.hideNoWalletCTA) && (jsx(LearnMoreContainer, { children: jsxs(LearnMoreButton, { onClick: () => context.setRoute(routes.ONBOARDING), children: [jsx(WalletIcon$1, {}), " ", locales.connectorsScreen_newcomer] }) })), ((_f = context.options) === null || _f === void 0 ? void 0 : _f.disclaimer) && (jsx(Disclaimer, { style: { visibility: 'hidden', pointerEvents: 'none' }, children: jsx("div", { children: (_g = context.options) === null || _g === void 0 ? void 0 : _g.disclaimer }) }))] })) }));
};

const WalletItem = styled.div `
  text-align: center;
  transition: opacity 100ms ease;
  opacity: ${(props) => (props.$waiting ? 0.4 : 1)};
`;
const WalletIcon = styled.div `
  z-index: 9;
  position: relative;
  margin: 0 auto 10px;
  border-radius: 16px;
  width: 60px;
  height: 60px;
  overflow: hidden;
  ${(props) => props.$outline &&
    `
  &:before {
    content: '';
    z-index: 2;
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04);
  }`}
  svg {
    display: block;
    position: relative;
    width: 100%;
    height: auto;
  }
`;
const WalletLabel = styled.div `
  color: var(--ck-body-color);
  font-size: 13px;
  line-height: 15px;
  font-weight: 500;
  opacity: 0.75;
`;
const PulseKeyframes = keyframes `
  0%,100% { opacity:1; }
  50% { opacity:0.5; }
`;
const WalletList = styled.div `
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px 8px;
  margin: 0 -10px -20px;
  padding: 4px 0 0;
  transition: opacity 300ms ease;
  ${(props) => props.$disabled &&
    css `
      pointer-events: none;
      opacity: 0.4;
      ${WalletItem} {
        animation: ${PulseKeyframes} 1s infinite ease-in-out;
      }
    `}
`;
const Container$6 = styled.div ``;

function useWalletConnectModal() {
    const { log } = useContext();
    const { connectAsync, connectors } = useConnect();
    const [isOpen, setIsOpen] = useState(false);
    return {
        isOpen,
        open: async () => {
            //add modal styling because wagmi does not let you add styling to the modal
            const w3mcss = document.createElement('style');
            w3mcss.innerHTML = `w3m-modal{ --w3m-z-index: 2147483647; }`;
            document.head.appendChild(w3mcss);
            const clientConnector = connectors.find((c) => isWalletConnectConnector(c.id));
            if (clientConnector) {
                let connector;
                if (clientConnector.id === 'walletConnectLegacy') {
                    connector = new WalletConnectLegacyConnector({
                        ...clientConnector,
                        options: {
                            ...clientConnector.options,
                            qrcode: true,
                        },
                    });
                }
                else {
                    connector = new WalletConnectConnector({
                        ...clientConnector,
                        options: {
                            ...clientConnector.options,
                            showQrModal: true,
                        },
                    });
                }
                setIsOpen(true);
                try {
                    await connectAsync({ connector: connector });
                }
                catch (err) {
                    log('WalletConnect', err);
                }
                setIsOpen(false);
                // remove modal styling
                document.head.removeChild(w3mcss);
            }
            else {
                log('No WalletConnect connector available');
            }
        },
    };
}

const IconContainer$3 = styled(motion.div) `
  transition: all 220ms cubic-bezier(0.175, 0.885, 0.32, 1.1);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  svg {
    display: block;
  }
  svg,
  svg path,
  svg rect {
    transition: inherit;
  }
  svg path:first-child {
    transform-origin: 50% 50%;
    fill: var(--bg);
    stroke: var(--color);
  }
  svg rect {
    transform-origin: 53% 63%;
    fill: var(--bg);
    stroke: var(--color);
  }
  svg path:last-child {
    opacity: 0;
    stroke: var(--bg);
    transform: translate(11.75px, 10px) rotate(90deg) scale(0.6);
  }
  ${(props) => props.$clipboard
    ? css `
          --color: var(--ck-focus-color) !important;
          --bg: var(--ck-body-background);
          svg {
            transition-delay: 0ms;
            path:first-child {
              opacity: 0;
              transform: rotate(-90deg) scale(0.2);
            }
            rect {
              rx: 10px;
              fill: var(--color);
              transform: rotate(-90deg) scale(1.45);
            }
            path:last-child {
              transition-delay: 100ms;
              opacity: 1;
              transform: translate(7.75px, 9.5px);
            }
          }
        `
    : css `
          &:hover {
          }
          &:hover:active {
          }
        `}
`;
const CopyToClipboardIcon = ({ copied, small, }) => (jsx(IconContainer$3, { "$clipboard": copied, children: jsx(CopyToClipboardIcon$1, { style: {
            transform: small ? 'scale(1)' : 'translateX(3px) scale(1.5)',
            opacity: small || copied ? 1 : 0.3,
        } }) }));

const Container$5 = styled.div `
  --color: var(--ck-copytoclipboard-stroke);
  --bg: var(--ck-body-background);
  transition: all 220ms cubic-bezier(0.175, 0.885, 0.32, 1.1);

  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  ${(props) => props.$disabled
    ? css `
          cursor: not-allowed;
          opacity: 0.4;
        `
    : css `
          &:hover {
            --color: var(--ck-body-color-muted);
          }
        `}
`;
const OffsetContainer = styled.div `
  display: block;
  position: relative;
  transition: inherit;
  svg {
    position: absolute;
    left: 100%;
    display: block;
    top: -1px;
    margin: 0;
    margin-left: 4px;
  }
`;
const CopyToClipboard = ({ string, children, variant }) => {
    const [clipboard, setClipboard] = useState(false);
    let timeout;
    const onCopy = () => {
        if (!string)
            return;
        const str = string.trim();
        if (navigator.clipboard) {
            navigator.clipboard.writeText(str);
        }
        setClipboard(true);
        clearTimeout(timeout);
        timeout = setTimeout(() => setClipboard(false), 1000);
    };
    if (variant === 'button')
        return (jsx(Button, { disabled: !string, onClick: onCopy, icon: jsx(CopyToClipboardIcon, { copied: clipboard }), children: children }));
    return (jsx(Container$5, { onClick: onCopy, "$disabled": !string, children: jsxs(OffsetContainer, { children: [children, jsx(CopyToClipboardIcon, { copied: clipboard, small: true })] }) }));
};

const MoreIcon = (jsx("svg", { width: "60", height: "60", viewBox: "0 0 60 60", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: jsx("path", { d: "M30 42V19M19 30.5H42", stroke: "var(--ck-body-color-muted)", strokeWidth: "3", strokeLinecap: "round" }) }));
const MobileConnectors = () => {
    var _a;
    const context = useContext();
    const locales = useLocales();
    const { uri: wcUri } = useWalletConnectUri();
    const { open: openW3M, isOpen: isOpenW3M } = useWalletConnectModal();
    const wallets = useDefaultWallets().filter((wallet) => wallet.installed === undefined && // Do not show wallets that are injected connectors
        !isWalletConnectConnector(wallet.id) // Do not show WalletConnect
    );
    const connectWallet = (wallet) => {
        var _a;
        if (wallet.installed) {
            context.setRoute(routes.CONNECT);
            context.setConnector(wallet.id);
        }
        else {
            const uri = (_a = wallet.createUri) === null || _a === void 0 ? void 0 : _a.call(wallet, wcUri);
            if (uri)
                window.location.href = uri;
            //if (uri) window.open(uri, '_blank');
        }
    };
    return (jsx(PageContent, { style: { width: 312 }, children: jsxs(Container$6, { children: [jsx(ModalContent, { children: jsxs(WalletList, { "$disabled": !wcUri, children: [wallets.map((wallet, i) => {
                                var _a;
                                const { name, shortName, logos, logoBackground } = wallet;
                                return (jsxs(WalletItem, { onClick: () => connectWallet(wallet), style: {
                                        animationDelay: `${i * 50}ms`,
                                    }, children: [jsx(WalletIcon, { "$outline": true, style: logoBackground
                                                ? {
                                                    background: logoBackground,
                                                }
                                                : undefined, children: (_a = logos.mobile) !== null && _a !== void 0 ? _a : logos.default }), jsx(WalletLabel, { children: shortName !== null && shortName !== void 0 ? shortName : name })] }, i));
                            }), jsxs(WalletItem, { onClick: openW3M, "$waiting": isOpenW3M, children: [jsx(WalletIcon, { style: { background: 'var(--ck-body-background-secondary)' }, children: isOpenW3M ? (jsx("div", { style: {
                                                position: 'absolute',
                                                inset: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }, children: jsx("div", { style: {
                                                    width: '50%',
                                                }, children: jsx(Spinner$3, {}) }) })) : (MoreIcon) }), jsx(WalletLabel, { children: locales.more })] })] }) }), ((_a = context.options) === null || _a === void 0 ? void 0 : _a.walletConnectCTA) !== 'modal' && (jsx("div", { style: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 14,
                        paddingTop: 16,
                    }, children: jsx(CopyToClipboard, { variant: "button", string: wcUri, children: locales.copyToClipboard }) }))] }) }));
};

const Content = styled(motion.div) `
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  left: 0;
  right: 0;
  ${ModalContent} {
    padding: 0 8px 32px;
    gap: 12px;
  }
`;
const dist$1 = 2;
const shakeKeyframes = keyframes `
  0%{ transform:none; }
  25%{ transform:translateX(${dist$1}px); }
  50%{ transform:translateX(-${dist$1}px); }
  75%{ transform:translateX(${dist$1}px); }
  100%{ transform:none; }
`;
const outlineKeyframes = keyframes `
  0%{ opacity:1; }
  100%{ opacity:0; }
`;
const Container$4 = styled(motion.div) `
  /*
  background: var(
    --ck-body-background
  ); // To stop the overlay issue during transition for the squircle spinner
  */
`;
const ConnectingContainer = styled(motion.div) `
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px auto 16px;
  height: 120px;
  //transform: scale(1.001); // fixes shifting issue between states
`;
const ConnectingAnimation = styled(motion.div) `
  user-select: none;
  position: relative;
  --spinner-error-opacity: 0;
  &:before {
    content: '';
    position: absolute;
    inset: -5px;
    opacity: 0;
    background: var(--ck-body-color-danger);
    ${(props) => props.$circle &&
    css `
        border-radius: 50%;
        background: none;
        box-shadow: inset 0 0 0 3.5px var(--ck-body-color-danger);
      `}
  }
  ${(props) => props.$shake &&
    css `
      animation: ${shakeKeyframes} 220ms ease-out both;
      &:before {
        animation: ${outlineKeyframes} 220ms ease-out 750ms both;
      }
    `}
`;
const RetryButton = styled(motion.button) `
  z-index: 5;
  appearance: none;
  position: absolute;
  right: 2px;
  bottom: 2px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  cursor: pointer;
  overflow: hidden;
  background: none;

  color: var(--ck-body-background);
  transition: color 200ms ease;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);

  &:before {
    z-index: 3;
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 200ms ease;
    background: var(--ck-body-color);
  }

  &:hover:before {
    opacity: 0.1;
  }
`;
const RetryIconContainer = styled(motion.div) `
  position: absolute;
  inset: 0;

  &:before {
    z-index: 1;
    content: '';
    position: absolute;
    inset: 3px;
    border-radius: 16px;
    background: conic-gradient(
      from 90deg,
      currentColor 10%,
      var(--ck-body-color) 80%
    );
  }

  svg {
    z-index: 2;
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
  }
`;

const TooltipWindow = styled(motion.div) `
  z-index: 2147483647;
  position: fixed;
  inset: 0;
  pointer-events: none;
`;
const TooltipContainer = styled(motion.div) `
  --shadow: var(--ck-tooltip-shadow);
  z-index: 2147483647;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  gap: 8px;
  width: fit-content;
  align-items: center;
  justify-content: center;
  border-radius: var(
    --ck-tooltip-border-radius,
    ${(props) => (props.$size === 'small' ? 11 : 14)}px
  );
  border-radius: ;
  padding: 10px 16px 10px 12px;
  font-size: 14px;
  line-height: 19px;
  font-weight: 500;
  letter-spacing: -0.1px;
  color: var(--ck-tooltip-color);
  background: var(--ck-tooltip-background);
  box-shadow: var(--shadow);
  > span {
    z-index: 3;
    position: relative;
  }
  > div {
    margin: -4px 0; // offset for icon
  }
  strong {
    color: var(--ck-spinner-color);
  }

  .ck-tt-logo {
    display: inline-block;
    vertical-align: text-bottom;
    height: 1em;
    width: 1.25em;
    svg {
      display: block;
      height: 100%;
      transform: translate(0.5px, -1px) scale(1.75);
    }
  }
`;
const TooltipTail = styled(motion.div) `
  z-index: 2;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => (props.$size === 'small' ? 14 : 18)}px;
  right: 100%;
  top: 0;
  bottom: 0;
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    box-shadow: var(--shadow);
    width: ${(props) => (props.$size === 'small' ? 14 : 18)}px;
    height: ${(props) => (props.$size === 'small' ? 14 : 18)}px;
    transform: translate(75%, 0) rotate(45deg);
    background: var(--ck-tooltip-background);
    border-radius: ${(props) => (props.$size === 'small' ? 2 : 3)}px 0 0 0;
  }
`;

const Tooltip = ({ children, message, open, xOffset = 0, yOffset = 0, delay, }) => {
    var _a;
    const context = useContext();
    const themeContext = useThemeContext();
    if ((_a = context.options) === null || _a === void 0 ? void 0 : _a.hideTooltips)
        return jsx(Fragment, { children: children });
    const [isOpen, setIsOpen] = useState(false);
    const [outOfBounds, setOutOfBounds] = useState(false);
    const [size, setSize] = useState('small');
    const [ready, setReady] = useState(false);
    const [currentRoute] = useState(context.route);
    const targetRef = useRef(null);
    const [ref, bounds] = useMeasure({
        debounce: !ready ? 220 : 0,
        offsetSize: true,
        scroll: true,
    });
    const checkBounds = () => {
        let flag = false;
        const x = xOffset + bounds.left + bounds.width;
        const y = yOffset + bounds.top + bounds.height * 0.5;
        if (x > window.innerWidth || x < 0 || y > window.innerHeight || y < 0) {
            flag = true;
        }
        return flag;
    };
    const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
    const refreshLayout = () => {
        if (!targetRef.current ||
            bounds.top +
                bounds.bottom +
                bounds.left +
                bounds.right +
                bounds.height +
                bounds.width ===
                0)
            return;
        const x = xOffset + bounds.left + bounds.width;
        const y = yOffset + bounds.top + bounds.height * 0.5;
        if (!ready && x !== 0 && y !== 0)
            setReady(true);
        targetRef.current.style.left = `${x}px`;
        targetRef.current.style.top = `${y}px`;
        setSize(targetRef.current.offsetHeight <= 40 ? 'small' : 'large');
        setOutOfBounds(checkBounds());
    };
    useIsomorphicLayoutEffect(refreshLayout, [bounds, open, isOpen]);
    useEffect(() => {
        if (!context.open)
            setIsOpen(false);
    }, [context.open]);
    useEffect(() => {
        setIsOpen(!!open);
    }, [open]);
    return (jsxs(Fragment, { children: [jsx(motion.div, { ref: ref, style: open === undefined
                    ? {
                        cursor: 'help',
                    }
                    : {}, onHoverStart: () => setIsOpen(true), onHoverEnd: () => setIsOpen(false), onClick: () => setIsOpen(false), children: children }), jsx(Portal, { children: jsx(AnimatePresence, { children: currentRoute === context.route && !outOfBounds && isOpen && (jsx(ResetContainer, { "$useTheme": themeContext.theme, "$useMode": themeContext.mode, "$customTheme": themeContext.customTheme, children: jsx(TooltipWindow, { children: jsxs(TooltipContainer, { role: "tooltip", "$size": size, ref: targetRef, initial: 'collapsed', animate: ready ? 'open' : {}, exit: 'collapsed', variants: {
                                    collapsed: {
                                        transformOrigin: '20px 50%',
                                        opacity: 0,
                                        scale: 0.9,
                                        z: 0.01,
                                        y: '-50%',
                                        x: 20,
                                        transition: {
                                            duration: 0.1,
                                        },
                                    },
                                    open: {
                                        willChange: 'opacity,transform',
                                        opacity: 1,
                                        scale: 1,
                                        z: 0.01,
                                        y: '-50%',
                                        x: 20,
                                        transition: {
                                            ease: [0.76, 0, 0.24, 1],
                                            duration: 0.15,
                                            delay: delay ? delay : 0.5,
                                        },
                                    },
                                }, children: [message, jsx(TooltipTail, { "$size": size })] }) }) })) }) })] }));
};

const AlertContainer = styled(motion.div) `
  display: flex;
  gap: 8px;
  position: relative;
  border-radius: 9px;
  margin: 0 auto;
  padding: 10px;
  text-align: left;
  font-size: 14px;
  line-height: 17px;
  font-weight: 400;
  max-width: 260px;
  min-width: 100%;

  border-radius: var(--ck-alert-border-radius, 12px);
  color: var(--ck-alert-color, var(--ck-body-color-muted));
  background: var(--ck-alert-background, var(--ck-body-background-secondary));
  box-shadow: var(--ck-alert-box-shadow, var(--ck-body-box-shadow));

  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    padding: 16px;
    font-size: 16px;
    line-height: 21px;
    border-radius: 24px;
    text-align: center;
  }
`;
const IconContainer$2 = styled(motion.div) `
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    display: block;
    width: 100%;
    height: auto;
  }
`;

const Alert = ({ children, icon }) => {
    return (jsxs(AlertContainer, { children: [icon && jsx(IconContainer$2, { children: icon }), jsx("div", { children: children })] }));
};
Alert.displayName = 'Alert';

const LogoContainer$3 = styled(motion.div) `
  z-index: 4;
  position: relative;
  width: 100px;
  height: 100px;
  svg {
    z-index: 3;
    position: relative;
    display: block;
  }
`;
const Logo = styled(motion.div) `
  z-index: 2;
  position: absolute;
  //overflow: hidden;
  inset: 6px;
  border-radius: 50px;
  background: var(--ck-body-background);
  display: flex;
  align-items: center;
  justify-content: center;
  svg,
  img {
    pointer-events: none;
    display: block;
    margin: 0 auto;
    width: 100%;
    height: 100%;
    ${(props) => props.$small &&
    css `
        width: 60%;
        height: 60%;
      `}
  }
`;
const SpinnerContainer = styled(motion.div) `
  position: absolute;
  inset: -5px;
`;
const ExpiringSpinner = styled(motion.div) `
  pointer-events: none;
  user-select: none;
  z-index: 1;
  position: absolute;
  inset: -25%;
  background: var(--ck-body-background);
  div:first-child {
    position: absolute;
    left: 50%;
    right: 0;
    top: 0;
    bottom: 0;
    overflow: hidden;
    &:before {
      position: absolute;
      content: '';
      inset: 0;
      background: var(--ck-spinner-color);
      transform-origin: 0% 50%;
      animation: rotateExpiringSpinner 5000ms ease-in both;
    }
  }
  div:last-child {
    position: absolute;
    left: 0;
    right: 50%;
    top: 0;
    bottom: 0;
    overflow: hidden;
    &:before {
      position: absolute;
      content: '';
      inset: 0;
      background: var(--ck-spinner-color);
      transform-origin: 100% 50%;
      animation: rotateExpiringSpinner 5000ms ease-out 5000ms both;
    }
  }
  @keyframes rotateExpiringSpinner {
    0% {
      transform: rotate(-180deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
`;
const Spinner$2 = styled(motion.div) `
  pointer-events: none;
  user-select: none;
  z-index: 1;
  position: absolute;
  inset: 0;
  svg {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    animation: rotateSpinner 1200ms linear infinite;
  }
  @keyframes rotateSpinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const CircleSpinner = ({ logo, smallLogo, connecting = true, unavailable = false, countdown = false, }) => {
    return (jsxs(LogoContainer$3, { transition: { duration: 0.5, ease: [0.175, 0.885, 0.32, 0.98] }, children: [jsx(Logo, { "$small": !unavailable && smallLogo, style: unavailable ? { borderRadius: 0 } : undefined, children: logo }), jsx(SpinnerContainer, { children: jsxs(AnimatePresence, { children: [connecting && (jsx(Spinner$2, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: {
                                opacity: 0,
                                transition: {
                                    duration: countdown ? 1 : 0,
                                },
                            }, children: jsxs("svg", { "aria-hidden": "true", width: "102", height: "102", viewBox: "0 0 102 102", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("path", { d: "M52 100C24.3858 100 2 77.6142 2 50", stroke: "url(#paint0_linear_1943_4139)", strokeWidth: "3.5", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("defs", { children: jsxs("linearGradient", { id: "paint0_linear_1943_4139", x1: "2", y1: "48.5", x2: "53", y2: "100", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { stopColor: "var(--ck-spinner-color)" }), jsx("stop", { offset: "1", stopColor: "var(--ck-spinner-color)", stopOpacity: "0" })] }) })] }) }, "Spinner")), countdown && (jsxs(ExpiringSpinner, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.25 }, children: [jsx("div", {}), jsx("div", {})] }, "ExpiringSpinner"))] }) })] }));
};

const BrowserIconContainer = styled(motion.div) `
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 32px;
  max-height: 32px;
  width: 100%;
  height: 100%;
  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

/**
 * TODO: Move hex colors into css variables for p3 support
 */
const Chrome = (jsxs("svg", { "aria-hidden": "true", width: 20, height: 20, viewBox: "0 0 20 20", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("g", { filter: "url(#filter0_ii_927_5781)", children: jsxs("g", { clipPath: "url(#clip0_927_5781)", children: [jsx("path", { d: "M1.58771 0V12.2727H6.06498L10.0002 5.45455H20.0002V0H1.58771Z", fill: "#DB4437" }), jsx("path", { d: "M1.58771 0V12.2727H6.06498L10.0002 5.45455H20.0002V0H1.58771Z", fill: "url(#paint0_linear_927_5781)" }), jsx("path", { d: "M6.17038 12.2272L1.64538 4.46582L1.57947 4.57946L6.07265 12.284L6.17038 12.2272Z", fill: "black", fillOpacity: "0.15" }), jsx("path", { d: "M0 20.0003H9.51932L13.9375 15.5821V12.273H6.0625L0 1.87305V20.0003Z", fill: "#0F9D58" }), jsx("path", { d: "M0 20.0003H9.51932L13.9375 15.5821V12.273H6.0625L0 1.87305V20.0003Z", fill: "url(#paint1_linear_927_5781)" }), jsx("path", { d: "M13.8412 12.4208L13.7469 12.3662L9.38324 19.9969H9.51392L13.8435 12.4242L13.8412 12.4208Z", fill: "#263238", fillOpacity: "0.15" }), jsx("path", { d: "M10.0006 5.45459L13.9381 12.2728L9.51996 20H20.0006V5.45459H10.0006Z", fill: "#FFCD40" }), jsx("path", { d: "M10.0006 5.45459L13.9381 12.2728L9.51996 20H20.0006V5.45459H10.0006Z", fill: "url(#paint2_linear_927_5781)" }), jsx("path", { d: "M9.9996 5.45459L13.9371 12.2728L9.51892 20H19.9996V5.45459H9.9996Z", fill: "#FFCD40" }), jsx("path", { d: "M9.9996 5.45459L13.9371 12.2728L9.51892 20H19.9996V5.45459H9.9996Z", fill: "url(#paint3_linear_927_5781)" }), jsx("path", { d: "M1.58691 0V12.2727H6.06419L9.99941 5.45455H19.9994V0H1.58691Z", fill: "#DB4437" }), jsx("path", { d: "M1.58691 0V12.2727H6.06419L9.99941 5.45455H19.9994V0H1.58691Z", fill: "url(#paint4_linear_927_5781)" }), jsx("path", { d: "M10 5.45459V7.83527L18.9091 5.45459H10Z", fill: "url(#paint5_radial_927_5781)" }), jsx("path", { d: "M0 19.9998H9.51932L11.9318 15.9089L13.9375 12.2726H6.0625L0 1.87256V19.9998Z", fill: "#0F9D58" }), jsx("path", { d: "M0 19.9998H9.51932L12.1023 15.5112L13.9375 12.2726H6.0625L0 1.87256V19.9998Z", fill: "url(#paint6_linear_927_5781)" }), jsx("path", { d: "M1.58771 4.59668L8.09339 11.1012L6.06384 12.2728L1.58771 4.59668Z", fill: "url(#paint7_radial_927_5781)" }), jsx("path", { d: "M9.52661 19.9884L11.9084 11.1021L13.938 12.2725L9.52661 19.9884Z", fill: "url(#paint8_radial_927_5781)" }), jsx("path", { d: "M10.0003 14.5455C12.5107 14.5455 14.5458 12.5104 14.5458 10C14.5458 7.48966 12.5107 5.45459 10.0003 5.45459C7.48996 5.45459 5.4549 7.48966 5.4549 10C5.4549 12.5104 7.48996 14.5455 10.0003 14.5455Z", fill: "#F1F1F1" }), jsx("path", { d: "M9.99995 13.6365C12.0083 13.6365 13.6363 12.0084 13.6363 10.0001C13.6363 7.99183 12.0083 6.36377 9.99995 6.36377C7.99164 6.36377 6.36359 7.99183 6.36359 10.0001C6.36359 12.0084 7.99164 13.6365 9.99995 13.6365Z", fill: "#4285F4" }), jsx("path", { d: "M10.0003 5.34082C7.48899 5.34082 5.4549 7.37491 5.4549 9.88628V9.99991C5.4549 7.48855 7.48899 5.45446 10.0003 5.45446H20.0003V5.34082H10.0003Z", fill: "black", fillOpacity: "0.2" }), jsx("path", { d: "M13.9318 12.273C13.1455 13.6299 11.6818 14.5458 10 14.5458C8.31818 14.5458 6.85227 13.6299 6.06818 12.273H6.06364L0 1.87305V1.98668L6.06818 12.3867C6.85455 13.7435 8.31818 14.6594 10 14.6594C11.6818 14.6594 13.1455 13.7446 13.9318 12.3867H13.9375V12.273H13.9307H13.9318Z", fill: "white", fillOpacity: "0.1" }), jsx("path", { opacity: "0.1", d: "M10.1133 5.45459C10.094 5.45459 10.0758 5.45686 10.0565 5.458C12.5406 5.48868 14.5452 7.50913 14.5452 10C14.5452 12.491 12.5406 14.5114 10.0565 14.5421C10.0758 14.5421 10.094 14.5455 10.1133 14.5455C12.6247 14.5455 14.6588 12.5114 14.6588 10C14.6588 7.48868 12.6247 5.45459 10.1133 5.45459Z", fill: "black" }), jsx("path", { d: "M13.9769 12.4204C14.3632 11.7522 14.5871 10.9795 14.5871 10.1522C14.5874 9.68602 14.5157 9.22262 14.3746 8.77832C14.4826 9.16696 14.5451 9.57377 14.5451 9.99764C14.5451 10.8249 14.3212 11.5976 13.9348 12.2658L13.9371 12.2704L9.51892 19.9976H9.65074L13.9769 12.4204Z", fill: "white", fillOpacity: "0.2" }), jsx("path", { d: "M10 0.113636C15.5034 0.113636 19.9682 4.56023 20 10.0568C20 10.0375 20.0011 10.0193 20.0011 10C20.0011 4.47727 15.5239 0 10.0011 0C4.47841 0 0 4.47727 0 10C0 10.0193 0.00113639 10.0375 0.00113639 10.0568C0.0318182 4.56023 4.49659 0.113636 10 0.113636Z", fill: "white", fillOpacity: "0.2" }), jsx("path", { d: "M10 19.8865C15.5034 19.8865 19.9682 15.4399 20 9.94336C20 9.96268 20.0011 9.98086 20.0011 10.0002C20.0011 15.5229 15.5239 20.0002 10.0011 20.0002C4.47841 20.0002 0 15.5229 0 10.0002C0 9.98086 0.00113639 9.96268 0.00113639 9.94336C0.0318182 15.4399 4.49659 19.8865 10.0011 19.8865H10Z", fill: "black", fillOpacity: "0.15" })] }) }), jsxs("defs", { children: [jsxs("filter", { id: "filter0_ii_927_5781", x: 0, y: "-0.235294", width: 20, height: "20.4706", filterUnits: "userSpaceOnUse", colorInterpolationFilters: "sRGB", children: [jsx("feFlood", { floodOpacity: 0, result: "BackgroundImageFix" }), jsx("feBlend", { mode: "normal", in: "SourceGraphic", in2: "BackgroundImageFix", result: "shape" }), jsx("feColorMatrix", { in: "SourceAlpha", type: "matrix", values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0", result: "hardAlpha" }), jsx("feOffset", { dy: "0.235294" }), jsx("feGaussianBlur", { stdDeviation: "0.235294" }), jsx("feComposite", { in2: "hardAlpha", operator: "arithmetic", k2: -1, k3: 1 }), jsx("feColorMatrix", { type: "matrix", values: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" }), jsx("feBlend", { mode: "normal", in2: "shape", result: "effect1_innerShadow_927_5781" }), jsx("feColorMatrix", { in: "SourceAlpha", type: "matrix", values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0", result: "hardAlpha" }), jsx("feOffset", { dy: "-0.235294" }), jsx("feGaussianBlur", { stdDeviation: "0.235294" }), jsx("feComposite", { in2: "hardAlpha", operator: "arithmetic", k2: -1, k3: 1 }), jsx("feColorMatrix", { type: "matrix", values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" }), jsx("feBlend", { mode: "normal", in2: "effect1_innerShadow_927_5781", result: "effect2_innerShadow_927_5781" })] }), jsxs("linearGradient", { id: "paint0_linear_927_5781", x1: "2.42521", y1: "7.61591", x2: "8.39112", y2: "4.13068", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { stopColor: "#A52714", stopOpacity: "0.6" }), jsx("stop", { offset: "0.66", stopColor: "#A52714", stopOpacity: 0 })] }), jsxs("linearGradient", { id: "paint1_linear_927_5781", x1: "11.6932", y1: "17.7844", x2: "5.06136", y2: "13.8981", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { stopColor: "#055524", stopOpacity: "0.4" }), jsx("stop", { offset: "0.33", stopColor: "#055524", stopOpacity: 0 })] }), jsxs("linearGradient", { id: "paint2_linear_927_5781", x1: "12.9438", y1: "4.75004", x2: "14.6143", y2: "12.0569", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { stopColor: "#EA6100", stopOpacity: "0.3" }), jsx("stop", { offset: "0.66", stopColor: "#EA6100", stopOpacity: 0 })] }), jsxs("linearGradient", { id: "paint3_linear_927_5781", x1: "12.9428", y1: "4.75004", x2: "14.6132", y2: "12.0569", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { stopColor: "#EA6100", stopOpacity: "0.3" }), jsx("stop", { offset: "0.66", stopColor: "#EA6100", stopOpacity: 0 })] }), jsxs("linearGradient", { id: "paint4_linear_927_5781", x1: "2.42441", y1: "7.61591", x2: "8.39032", y2: "4.13068", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { stopColor: "#A52714", stopOpacity: "0.6" }), jsx("stop", { offset: "0.66", stopColor: "#A52714", stopOpacity: 0 })] }), jsxs("radialGradient", { id: "paint5_radial_927_5781", cx: 0, cy: 0, r: 1, gradientUnits: "userSpaceOnUse", gradientTransform: "translate(9.56818 5.44891) scale(9.55455)", children: [jsx("stop", { stopColor: "#3E2723", stopOpacity: "0.2" }), jsx("stop", { offset: 1, stopColor: "#3E2723", stopOpacity: 0 })] }), jsxs("linearGradient", { id: "paint6_linear_927_5781", x1: "11.6932", y1: "17.7839", x2: "5.06136", y2: "13.8976", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { stopColor: "#055524", stopOpacity: "0.4" }), jsx("stop", { offset: "0.33", stopColor: "#055524", stopOpacity: 0 })] }), jsxs("radialGradient", { id: "paint7_radial_927_5781", cx: 0, cy: 0, r: 1, gradientUnits: "userSpaceOnUse", gradientTransform: "translate(1.57975 4.60463) scale(8.86818)", children: [jsx("stop", { stopColor: "#3E2723", stopOpacity: "0.2" }), jsx("stop", { offset: 1, stopColor: "#3E2723", stopOpacity: 0 })] }), jsxs("radialGradient", { id: "paint8_radial_927_5781", cx: 0, cy: 0, r: 1, gradientUnits: "userSpaceOnUse", gradientTransform: "translate(9.97775 10.0157) scale(9.98523)", children: [jsx("stop", { stopColor: "#263238", stopOpacity: "0.2" }), jsx("stop", { offset: 1, stopColor: "#263238", stopOpacity: 0 })] }), jsx("clipPath", { id: "clip0_927_5781", children: jsx("rect", { width: 20, height: 20, rx: 10, fill: "white" }) })] })] }));
const FireFox = (jsxs("svg", { "aria-hidden": "true", width: 20, height: 20, viewBox: "0 0 20 20", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsxs("g", { clipPath: "url(#clip0_927_5847)", children: [jsx("path", { d: "M19.011 6.71023C18.5898 5.69685 17.7355 4.60269 17.0665 4.25681C17.5436 5.18063 17.8747 6.17276 18.0481 7.19792L18.0499 7.21417C16.954 4.48315 15.0963 3.38023 13.5782 0.981835C13.5014 0.860539 13.4246 0.738994 13.3498 0.610696C13.3071 0.537418 13.2728 0.471393 13.2431 0.410621C13.1801 0.288713 13.1316 0.159878 13.0985 0.0267267C13.0985 0.0205825 13.0963 0.0146369 13.0923 0.0100242C13.0882 0.00541151 13.0826 0.00245454 13.0765 0.00171737C13.0705 7.85858e-05 13.0642 7.85858e-05 13.0582 0.00171737C13.057 0.00171737 13.055 0.00396821 13.0535 0.0044684C13.052 0.00496859 13.0487 0.00721943 13.0465 0.00821981L13.0502 0.00171737C10.6156 1.42725 9.78901 4.06574 9.71399 5.38624C8.74136 5.45292 7.81141 5.81121 7.04549 6.41437C6.96561 6.34671 6.88212 6.28343 6.79539 6.2248C6.57456 5.45174 6.56514 4.6336 6.76813 3.85566C5.87401 4.28877 5.07954 4.90279 4.43501 5.65884H4.43051C4.04636 5.17191 4.07337 3.5663 4.09538 3.23093C3.98174 3.2766 3.87326 3.33419 3.77176 3.40274C3.43264 3.64477 3.11562 3.91635 2.8244 4.2143C2.49255 4.55075 2.18946 4.91441 1.91831 5.30146V5.30296V5.3012C1.29521 6.18444 0.853213 7.18234 0.617826 8.23731L0.604821 8.30133C0.586564 8.38661 0.52079 8.81377 0.509535 8.90656C0.509535 8.91381 0.508035 8.92056 0.507285 8.92781C0.42244 9.36882 0.369864 9.81542 0.349976 10.2641V10.3141C0.354259 12.7396 1.26772 15.0754 2.91002 16.8604C4.55233 18.6454 6.80415 19.7498 9.22094 19.9556C11.6377 20.1615 14.0439 19.4538 15.9644 17.9723C17.8849 16.4908 19.1803 14.3431 19.5947 11.9532C19.6109 11.8282 19.6242 11.7044 19.6387 11.5781C19.8384 9.92791 19.6222 8.25404 19.01 6.70873L19.011 6.71023ZM7.83928 14.2981C7.88455 14.3198 7.92707 14.3433 7.97358 14.3641L7.98034 14.3684C7.93332 14.3458 7.8863 14.3224 7.83928 14.2981ZM18.0501 7.21692V7.20767L18.0519 7.21792L18.0501 7.21692Z", fill: "url(#paint0_linear_927_5847)" }), jsx("path", { d: "M19.0109 6.71026C18.5898 5.69688 17.7354 4.60272 17.0664 4.25684C17.5435 5.18066 17.8746 6.17278 18.0481 7.19794V7.20719L18.0498 7.21745C18.797 9.35551 18.689 11.6997 17.7482 13.7599C16.6373 16.1435 13.9493 18.5867 9.7402 18.4667C5.19349 18.3379 1.18699 14.9629 0.439211 10.5437C0.30291 9.84668 0.439211 9.4933 0.507737 8.92684C0.414265 9.36685 0.362102 9.81463 0.351929 10.2643V10.3144C0.356212 12.7399 1.26967 15.0757 2.91198 16.8607C4.55429 18.6456 6.8061 19.7501 9.2229 19.9559C11.6397 20.1617 14.0458 19.4541 15.9664 17.9725C17.8869 16.491 19.1822 14.3434 19.5966 11.9535C19.6129 11.8284 19.6262 11.7046 19.6407 11.5783C19.8403 9.92819 19.6242 8.25431 19.0119 6.70901L19.0109 6.71026Z", fill: "url(#paint1_radial_927_5847)" }), jsx("path", { d: "M19.0109 6.71026C18.5898 5.69688 17.7354 4.60272 17.0664 4.25684C17.5435 5.18066 17.8746 6.17278 18.0481 7.19794V7.20719L18.0498 7.21745C18.797 9.35551 18.689 11.6997 17.7482 13.7599C16.6373 16.1435 13.9493 18.5867 9.7402 18.4667C5.19349 18.3379 1.18699 14.9629 0.439211 10.5437C0.30291 9.84668 0.439211 9.4933 0.507737 8.92684C0.414265 9.36685 0.362102 9.81463 0.351929 10.2643V10.3144C0.356212 12.7399 1.26967 15.0757 2.91198 16.8607C4.55429 18.6456 6.8061 19.7501 9.2229 19.9559C11.6397 20.1617 14.0458 19.4541 15.9664 17.9725C17.8869 16.491 19.1822 14.3434 19.5966 11.9535C19.6129 11.8284 19.6262 11.7046 19.6407 11.5783C19.8403 9.92819 19.6242 8.25431 19.0119 6.70901L19.0109 6.71026Z", fill: "url(#paint2_radial_927_5847)" }), jsx("path", { d: "M14.2993 7.84794C14.3203 7.8627 14.3398 7.87745 14.3595 7.89221C14.1161 7.46047 13.813 7.06519 13.4592 6.71802C10.4456 3.70439 12.6696 0.18557 13.0445 0.00550206L13.0483 0C10.6136 1.42553 9.78706 4.06402 9.71204 5.38452C9.82508 5.37677 9.93712 5.36726 10.0527 5.36726C10.9164 5.36893 11.7644 5.59929 12.5103 6.03492C13.2562 6.47055 13.8734 7.09592 14.2993 7.84744V7.84794Z", fill: "url(#paint3_radial_927_5847)" }), jsx("path", { d: "M10.0577 8.45061C10.0417 8.6917 9.18992 9.52326 8.89206 9.52326C6.13602 9.52326 5.68835 11.1906 5.68835 11.1906C5.8104 12.5947 6.78877 13.7516 7.97146 14.3618C8.02548 14.3898 8.08025 14.4151 8.13502 14.4399C8.22989 14.4819 8.32476 14.5207 8.41963 14.5564C8.82553 14.7 9.25065 14.7821 9.68085 14.7997C14.5127 15.0263 15.448 9.02257 11.9615 7.27942C12.7839 7.1724 13.6168 7.37463 14.2986 7.84688C13.8727 7.09536 13.2555 6.46999 12.5096 6.03436C11.7637 5.59873 10.9158 5.36837 10.052 5.3667C9.93695 5.3667 9.82441 5.3762 9.71136 5.38396C8.73874 5.45064 7.80879 5.80893 7.04286 6.41209C7.19067 6.53714 7.35748 6.7042 7.70886 7.05058C8.36661 7.69857 10.0535 8.36983 10.0572 8.44861L10.0577 8.45061Z", fill: "url(#paint4_radial_927_5847)" }), jsx("path", { d: "M10.0577 8.45061C10.0417 8.6917 9.18992 9.52326 8.89206 9.52326C6.13602 9.52326 5.68835 11.1906 5.68835 11.1906C5.8104 12.5947 6.78877 13.7516 7.97146 14.3618C8.02548 14.3898 8.08025 14.4151 8.13502 14.4399C8.22989 14.4819 8.32476 14.5207 8.41963 14.5564C8.82553 14.7 9.25065 14.7821 9.68085 14.7997C14.5127 15.0263 15.448 9.02257 11.9615 7.27942C12.7839 7.1724 13.6168 7.37463 14.2986 7.84688C13.8727 7.09536 13.2555 6.46999 12.5096 6.03436C11.7637 5.59873 10.9158 5.36837 10.052 5.3667C9.93695 5.3667 9.82441 5.3762 9.71136 5.38396C8.73874 5.45064 7.80879 5.80893 7.04286 6.41209C7.19067 6.53714 7.35748 6.7042 7.70886 7.05058C8.36661 7.69857 10.0535 8.36983 10.0572 8.44861L10.0577 8.45061Z", fill: "url(#paint5_radial_927_5847)" }), jsx("path", { d: "M6.59134 6.0923C6.66987 6.14231 6.73464 6.18583 6.79141 6.2251C6.57058 5.45204 6.56117 4.63389 6.76415 3.85596C5.87003 4.28907 5.07556 4.90308 4.43103 5.65913C4.4783 5.65788 5.88432 5.63262 6.59134 6.0923Z", fill: "url(#paint6_radial_927_5847)" }), jsx("path", { d: "M0.437567 10.5439C1.1856 14.963 5.19185 18.3393 9.73855 18.4668C13.9476 18.5859 16.6361 16.1425 17.7466 13.7601C18.6873 11.6998 18.7954 9.35569 18.0482 7.21762V7.20837C18.0482 7.20111 18.0467 7.19686 18.0482 7.19911L18.0499 7.21537C18.3938 9.46046 17.2519 11.6345 15.4665 13.1076L15.4609 13.1201C11.9821 15.9536 8.6534 14.8292 7.98064 14.3706C7.93363 14.348 7.88661 14.3246 7.83959 14.3003C5.81158 13.3309 4.97352 11.4842 5.15358 9.89862C4.67218 9.90573 4.19905 9.77307 3.79151 9.51672C3.38397 9.26038 3.05952 8.89134 2.85747 8.45433C3.38987 8.1282 3.99692 7.94382 4.62077 7.91878C5.24461 7.89374 5.86448 8.02887 6.42131 8.31128C7.56906 8.83225 8.87507 8.8836 10.0602 8.45433C10.0564 8.37555 8.36954 7.70405 7.71179 7.05631C7.36041 6.70993 7.1936 6.54312 7.04579 6.41782C6.96591 6.35016 6.88243 6.28688 6.7957 6.22825C6.73818 6.18898 6.6734 6.14647 6.59562 6.09545C5.88861 5.63578 4.48258 5.66104 4.43607 5.66229H4.43156C4.04742 5.17535 4.07443 3.56975 4.09644 3.23438C3.9828 3.28005 3.87431 3.33764 3.77282 3.40619C3.4337 3.64822 3.11667 3.91979 2.82546 4.21774C2.49242 4.55325 2.18808 4.91607 1.91562 5.3024V5.3039V5.30215C1.29252 6.18539 0.850521 7.18329 0.615133 8.23825C0.610381 8.25801 0.266002 9.76357 0.435816 10.5444L0.437567 10.5439Z", fill: "url(#paint7_radial_927_5847)" }), jsx("path", { d: "M13.459 6.71761C13.8128 7.06516 14.1159 7.46087 14.3593 7.89305C14.4126 7.93331 14.4624 7.97333 14.5046 8.01209C16.7022 10.0378 15.5508 12.9014 15.465 13.104C17.2502 11.6332 18.3911 9.45763 18.0485 7.21179C16.952 4.47826 15.0923 3.37535 13.5768 0.976952C13.5 0.855657 13.4232 0.734111 13.3484 0.605813C13.3057 0.532535 13.2714 0.466511 13.2417 0.405738C13.1787 0.283831 13.1302 0.154995 13.0971 0.0218439C13.0971 0.0156997 13.0949 0.0097541 13.0909 0.0051414C13.0868 0.000528701 13.0812 -0.00242828 13.0751 -0.00316545C13.0691 -0.00480423 13.0628 -0.00480423 13.0568 -0.00316545C13.0556 -0.00316545 13.0536 -0.000914601 13.0521 -0.000414413C13.0506 8.57743e-05 13.0473 0.00233662 13.0451 0.00333699C12.6702 0.181154 10.4466 3.70222 13.4602 6.71335L13.459 6.71761Z", fill: "url(#paint8_radial_927_5847)" }), jsx("path", { d: "M14.5043 8.01315C14.462 7.97439 14.4122 7.93437 14.359 7.8941C14.3392 7.87935 14.3197 7.86459 14.2987 7.84984C13.6169 7.37759 12.784 7.17536 11.9616 7.28238C15.4479 9.02553 14.5125 15.0278 9.68095 14.8027C9.25075 14.785 8.82562 14.703 8.41973 14.5594C8.32486 14.5238 8.22999 14.485 8.13512 14.4428C8.08035 14.4178 8.02558 14.3928 7.97156 14.3648L7.97831 14.369C8.65206 14.829 11.9798 15.9526 15.4586 13.1186L15.4641 13.1061C15.5509 12.9035 16.7023 10.0399 14.5038 8.01415L14.5043 8.01315Z", fill: "url(#paint9_radial_927_5847)" }), jsx("path", { d: "M5.68842 11.1892C5.68842 11.1892 6.13583 9.52179 8.89212 9.52179C9.18998 9.52179 10.0425 8.69023 10.0578 8.44914C8.8727 8.8784 7.56669 8.82706 6.41894 8.30608C5.86211 8.02367 5.24224 7.88855 4.61839 7.91359C3.99455 7.93863 3.3875 8.123 2.8551 8.44914C3.05715 8.88615 3.3816 9.25518 3.78914 9.51153C4.19668 9.76787 4.66981 9.90053 5.15121 9.89343C4.97165 11.4783 5.80946 13.3247 7.83722 14.2951C7.88249 14.3168 7.925 14.3403 7.97152 14.3611C6.78783 13.7496 5.81046 12.5932 5.68842 11.1899V11.1892Z", fill: "url(#paint10_radial_927_5847)" }), jsx("path", { d: "M19.0112 6.71023C18.59 5.69685 17.7357 4.60269 17.0667 4.25681C17.5438 5.18063 17.8749 6.17276 18.0483 7.19792L18.0501 7.21417C16.9542 4.48315 15.0965 3.38023 13.5784 0.981835C13.5016 0.860539 13.4249 0.738994 13.3501 0.610696C13.3073 0.537418 13.2731 0.471393 13.2433 0.410621C13.1803 0.288713 13.1318 0.159878 13.0987 0.0267267C13.0988 0.0205825 13.0966 0.0146369 13.0925 0.0100242C13.0884 0.00541151 13.0828 0.00245454 13.0767 0.00171737C13.0708 7.85859e-05 13.0644 7.85859e-05 13.0585 0.00171737C13.0572 0.00171737 13.0552 0.00396821 13.0537 0.0044684C13.0522 0.00496859 13.049 0.00721943 13.0467 0.00821981L13.0505 0.00171737C10.6158 1.42725 9.78925 4.06574 9.71422 5.38624C9.82726 5.37848 9.9393 5.36898 10.0548 5.36898C10.9186 5.37065 11.7666 5.60101 12.5125 6.03664C13.2584 6.47227 13.8756 7.09764 14.3014 7.84916C13.6196 7.37691 12.7868 7.17468 11.9643 7.2817C15.4506 9.02485 14.5153 15.0271 9.68371 14.802C9.25351 14.7843 8.82838 14.7023 8.42248 14.5587C8.32761 14.5232 8.23275 14.4843 8.13788 14.4421C8.08311 14.4171 8.02834 14.3921 7.97432 14.3641L7.98107 14.3684C7.93405 14.3458 7.88703 14.3224 7.84002 14.2981C7.88528 14.3198 7.9278 14.3433 7.97432 14.3641C6.79062 13.7524 5.81326 12.5959 5.69121 11.1929C5.69121 11.1929 6.13863 9.52554 8.89491 9.52554C9.19277 9.52554 10.0453 8.69398 10.0606 8.45289C10.0568 8.37411 8.36996 7.7026 7.71222 7.05486C7.36084 6.70848 7.19402 6.54167 7.04622 6.41637C6.96634 6.34871 6.88285 6.28543 6.79612 6.2268C6.57529 5.45374 6.56588 4.6356 6.76886 3.85766C5.87474 4.29077 5.08027 4.90479 4.43574 5.66084H4.43124C4.04709 5.17391 4.0741 3.5683 4.09611 3.23293C3.98247 3.2786 3.87399 3.33619 3.77249 3.40474C3.43337 3.64677 3.11635 3.91835 2.82514 4.2163C2.49328 4.55275 2.19019 4.91641 1.91905 5.30345V5.30496V5.30321C1.29595 6.18644 0.853946 7.18434 0.618558 8.23931L0.605554 8.30333C0.587297 8.38861 0.505516 8.82177 0.493762 8.91481C0.418959 9.36194 0.371188 9.81318 0.350708 10.2661V10.3161C0.354992 12.7416 1.26845 15.0774 2.91076 16.8624C4.55307 18.6474 6.80488 19.7518 9.22168 19.9576C11.6385 20.1635 14.0446 19.4558 15.9652 17.9743C17.8857 16.4928 19.181 14.3451 19.5954 11.9552C19.6117 11.8302 19.6249 11.7064 19.6394 11.5801C19.8391 9.92991 19.623 8.25604 19.0107 6.71073L19.0112 6.71023ZM18.0496 7.20817L18.0513 7.21842L18.0496 7.20817Z", fill: "url(#paint11_linear_927_5847)" })] }), jsxs("defs", { children: [jsxs("linearGradient", { id: "paint0_linear_927_5847", x1: "17.728", y1: "3.09786", x2: "1.63621", y2: "18.6237", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { offset: "0.048", stopColor: "#FFF44F" }), jsx("stop", { offset: "0.111", stopColor: "#FFE847" }), jsx("stop", { offset: "0.225", stopColor: "#FFC830" }), jsx("stop", { offset: "0.368", stopColor: "#FF980E" }), jsx("stop", { offset: "0.401", stopColor: "#FF8B16" }), jsx("stop", { offset: "0.462", stopColor: "#FF672A" }), jsx("stop", { offset: "0.534", stopColor: "#FF3647" }), jsx("stop", { offset: "0.705", stopColor: "#E31587" })] }), jsxs("radialGradient", { id: "paint1_radial_927_5847", cx: 0, cy: 0, r: 1, gradientUnits: "userSpaceOnUse", gradientTransform: "translate(17.1052 2.25108) scale(20.2076)", children: [jsx("stop", { offset: "0.129", stopColor: "#FFBD4F" }), jsx("stop", { offset: "0.186", stopColor: "#FFAC31" }), jsx("stop", { offset: "0.247", stopColor: "#FF9D17" }), jsx("stop", { offset: "0.283", stopColor: "#FF980E" }), jsx("stop", { offset: "0.403", stopColor: "#FF563B" }), jsx("stop", { offset: "0.467", stopColor: "#FF3750" }), jsx("stop", { offset: "0.71", stopColor: "#F5156C" }), jsx("stop", { offset: "0.782", stopColor: "#EB0878" }), jsx("stop", { offset: "0.86", stopColor: "#E50080" })] }), jsxs("radialGradient", { id: "paint2_radial_927_5847", cx: 0, cy: 0, r: 1, gradientUnits: "userSpaceOnUse", gradientTransform: "translate(9.6024 10.5042) scale(20.2076)", children: [jsx("stop", { offset: "0.3", stopColor: "#960E18" }), jsx("stop", { offset: "0.351", stopColor: "#B11927", stopOpacity: "0.74" }), jsx("stop", { offset: "0.435", stopColor: "#DB293D", stopOpacity: "0.343" }), jsx("stop", { offset: "0.497", stopColor: "#F5334B", stopOpacity: "0.094" }), jsx("stop", { offset: "0.53", stopColor: "#FF3750", stopOpacity: 0 })] }), jsxs("radialGradient", { id: "paint3_radial_927_5847", cx: 0, cy: 0, r: 1, gradientUnits: "userSpaceOnUse", gradientTransform: "translate(12.1034 -2.25084) scale(14.638)", children: [jsx("stop", { offset: "0.132", stopColor: "#FFF44F" }), jsx("stop", { offset: "0.252", stopColor: "#FFDC3E" }), jsx("stop", { offset: "0.506", stopColor: "#FF9D12" }), jsx("stop", { offset: "0.526", stopColor: "#FF980E" })] }), jsxs("radialGradient", { id: "paint4_radial_927_5847", cx: 0, cy: 0, r: 1, gradientUnits: "userSpaceOnUse", gradientTransform: "translate(7.35173 15.7558) scale(9.62111)", children: [jsx("stop", { offset: "0.353", stopColor: "#3A8EE6" }), jsx("stop", { offset: "0.472", stopColor: "#5C79F0" }), jsx("stop", { offset: "0.669", stopColor: "#9059FF" }), jsx("stop", { offset: 1, stopColor: "#C139E6" })] }), jsxs("radialGradient", { id: "paint5_radial_927_5847", cx: 0, cy: 0, r: 1, gradientUnits: "userSpaceOnUse", gradientTransform: "translate(10.5799 8.76923) rotate(-13.5916) scale(5.10194 5.97309)", children: [jsx("stop", { offset: "0.206", stopColor: "#9059FF", stopOpacity: 0 }), jsx("stop", { offset: "0.278", stopColor: "#8C4FF3", stopOpacity: "0.064" }), jsx("stop", { offset: "0.747", stopColor: "#7716A8", stopOpacity: "0.45" }), jsx("stop", { offset: "0.975", stopColor: "#6E008B", stopOpacity: "0.6" })] }), jsxs("radialGradient", { id: "paint6_radial_927_5847", cx: 0, cy: 0, r: 1, gradientUnits: "userSpaceOnUse", gradientTransform: "translate(9.35238 1.50057) scale(6.9226)", children: [jsx("stop", { stopColor: "#FFE226" }), jsx("stop", { offset: "0.121", stopColor: "#FFDB27" }), jsx("stop", { offset: "0.295", stopColor: "#FFC82A" }), jsx("stop", { offset: "0.502", stopColor: "#FFA930" }), jsx("stop", { offset: "0.732", stopColor: "#FF7E37" }), jsx("stop", { offset: "0.792", stopColor: "#FF7139" })] }), jsxs("radialGradient", { id: "paint7_radial_927_5847", cx: 0, cy: 0, r: 1, gradientUnits: "userSpaceOnUse", gradientTransform: "translate(14.8545 -3.00121) scale(29.5361)", children: [jsx("stop", { offset: "0.113", stopColor: "#FFF44F" }), jsx("stop", { offset: "0.456", stopColor: "#FF980E" }), jsx("stop", { offset: "0.622", stopColor: "#FF5634" }), jsx("stop", { offset: "0.716", stopColor: "#FF3647" }), jsx("stop", { offset: "0.904", stopColor: "#E31587" })] }), jsxs("radialGradient", { id: "paint8_radial_927_5847", cx: 0, cy: 0, r: 1, gradientUnits: "userSpaceOnUse", gradientTransform: "translate(12.3996 -1.36343) rotate(83.976) scale(21.6445 14.2051)", children: [jsx("stop", { stopColor: "#FFF44F" }), jsx("stop", { offset: "0.06", stopColor: "#FFE847" }), jsx("stop", { offset: "0.168", stopColor: "#FFC830" }), jsx("stop", { offset: "0.304", stopColor: "#FF980E" }), jsx("stop", { offset: "0.356", stopColor: "#FF8B16" }), jsx("stop", { offset: "0.455", stopColor: "#FF672A" }), jsx("stop", { offset: "0.57", stopColor: "#FF3647" }), jsx("stop", { offset: "0.737", stopColor: "#E31587" })] }), jsxs("radialGradient", { id: "paint9_radial_927_5847", cx: 0, cy: 0, r: 1, gradientUnits: "userSpaceOnUse", gradientTransform: "translate(9.35233 4.00165) scale(18.4369)", children: [jsx("stop", { offset: "0.137", stopColor: "#FFF44F" }), jsx("stop", { offset: "0.48", stopColor: "#FF980E" }), jsx("stop", { offset: "0.592", stopColor: "#FF5634" }), jsx("stop", { offset: "0.655", stopColor: "#FF3647" }), jsx("stop", { offset: "0.904", stopColor: "#E31587" })] }), jsxs("radialGradient", { id: "paint10_radial_927_5847", cx: 0, cy: 0, r: 1, gradientUnits: "userSpaceOnUse", gradientTransform: "translate(14.1041 5.00184) scale(20.1801)", children: [jsx("stop", { offset: "0.094", stopColor: "#FFF44F" }), jsx("stop", { offset: "0.231", stopColor: "#FFE141" }), jsx("stop", { offset: "0.509", stopColor: "#FFAF1E" }), jsx("stop", { offset: "0.626", stopColor: "#FF980E" })] }), jsxs("linearGradient", { id: "paint11_linear_927_5847", x1: "17.5331", y1: "3.01533", x2: "3.84302", y2: "16.708", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { offset: "0.167", stopColor: "#FFF44F", stopOpacity: "0.8" }), jsx("stop", { offset: "0.266", stopColor: "#FFF44F", stopOpacity: "0.634" }), jsx("stop", { offset: "0.489", stopColor: "#FFF44F", stopOpacity: "0.217" }), jsx("stop", { offset: "0.6", stopColor: "#FFF44F", stopOpacity: 0 })] }), jsx("clipPath", { id: "clip0_927_5847", children: jsx("rect", { width: 20, height: 20, fill: "white" }) })] })] }));
const Brave = (jsxs("svg", { "aria-hidden": "true", width: 20, height: 20, viewBox: "0 0 20 20", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("path", { d: "M17.2924 5.22043L17.7256 4.15905L16.4982 2.8883C15.8339 2.22404 14.4187 2.61393 14.4187 2.61393L12.8158 0.794434H7.16242L5.55231 2.62115C5.55231 2.62115 4.13715 2.23848 3.47289 2.8883L2.24545 4.15183L2.67866 5.21321L2.13715 6.78721L3.9422 13.6681C4.31765 15.141 4.57036 15.7114 5.63173 16.4623L8.93137 18.7006C9.24906 18.8955 9.63895 19.2349 9.99274 19.2349C10.3465 19.2349 10.7364 18.8955 11.0541 18.7006L14.3538 16.4623C15.4151 15.7114 15.6678 15.141 16.0433 13.6681L17.8483 6.78721L17.2924 5.22043Z", fill: "url(#paint0_linear_927_5861)" }), jsx("path", { d: "M13.9711 3.78343C13.9711 3.78343 16.0433 6.28884 16.0433 6.81592C16.0433 7.35744 15.7834 7.49462 15.5234 7.77621L13.9711 9.43686C13.8267 9.58126 13.5162 9.82675 13.6967 10.2527C13.8772 10.686 14.1299 11.2203 13.8411 11.769C13.5523 12.3249 13.0469 12.6932 12.722 12.6354C12.2387 12.4786 11.7777 12.2602 11.3502 11.9856C11.0758 11.8051 10.1949 11.0758 10.1949 10.7943C10.1949 10.5127 11.1047 10 11.278 9.89895C11.444 9.78343 12.2166 9.33577 12.231 9.16249C12.2455 8.9892 12.2455 8.94588 12.0144 8.51267C11.7834 8.07946 11.379 7.50184 11.4368 7.12639C11.509 6.75094 12.1588 6.54877 12.6426 6.36827L14.1372 5.80509C14.2527 5.74733 14.2238 5.69679 13.8772 5.66068C13.5307 5.6318 12.5559 5.50184 12.1155 5.62458C11.6751 5.74733 10.9386 5.93505 10.8664 6.03614C10.8086 6.13722 10.7509 6.13722 10.8159 6.48379L11.2346 8.75816C11.2635 9.04697 11.3213 9.24191 11.018 9.31411C10.7003 9.38632 10.1733 9.50906 9.99276 9.50906C9.81225 9.50906 9.27796 9.38632 8.96749 9.31411C8.65702 9.24191 8.71478 9.04697 8.75088 8.75816C8.77976 8.46935 9.09745 6.82314 9.16243 6.48379C9.23464 6.13722 9.16965 6.13722 9.11189 6.03614C9.03969 5.93505 8.29601 5.74733 7.85558 5.62458C7.42236 5.50184 6.44041 5.6318 6.09384 5.66791C5.74727 5.69679 5.71839 5.74011 5.83391 5.81231L7.3285 6.36827C7.80503 6.54877 8.46929 6.75094 8.53428 7.12639C8.60648 7.50906 8.19493 8.07946 7.95666 8.51267C7.71839 8.94588 7.72561 8.9892 7.74005 9.16249C7.75449 9.33577 8.53428 9.78343 8.69312 9.89895C8.86641 10.0073 9.77615 10.5127 9.77615 10.7943C9.77615 11.0758 8.91695 11.8051 8.62814 11.9856C8.20063 12.2602 7.73957 12.4786 7.2563 12.6354C6.93139 12.6932 6.42597 12.3249 6.12994 11.769C5.84113 11.2203 6.10106 10.686 6.27435 10.2527C6.45485 9.81953 6.1516 9.58848 5.99998 9.43686L4.44763 7.77621C4.19493 7.50906 3.935 7.36466 3.935 6.83036C3.935 6.29606 6.0072 3.79787 6.0072 3.79787L7.97832 4.11556C8.20937 4.11556 8.722 3.92061 9.19132 3.75455C9.66063 3.61014 9.98554 3.5957 9.98554 3.5957C9.98554 3.5957 10.3032 3.5957 10.7798 3.75455C11.2563 3.91339 11.7617 4.11556 11.9928 4.11556C12.231 4.11556 13.9783 3.77621 13.9783 3.77621L13.9711 3.78343ZM12.4188 13.3719C12.5487 13.4441 12.4693 13.6029 12.3465 13.6896L10.5126 15.1192C10.3682 15.2636 10.1372 15.4802 9.98554 15.4802C9.83391 15.4802 9.61009 15.2636 9.45846 15.1192C8.8506 14.6351 8.23683 14.1586 7.61731 13.6896C7.50178 13.6029 7.42236 13.4513 7.54511 13.3719L8.62814 12.7943C9.05864 12.5665 9.51417 12.3897 9.98554 12.2672C10.0938 12.2672 10.7798 12.5127 11.3357 12.7943L12.4188 13.3719Z", fill: "white" }), jsx("path", { d: "M14.4332 2.62115L12.8159 0.794434H7.16243L5.55232 2.62115C5.55232 2.62115 4.13716 2.23848 3.4729 2.8883C3.4729 2.8883 5.35016 2.72223 5.99998 3.77638L7.99276 4.11573C8.2238 4.11573 8.73644 3.92079 9.20575 3.75472C9.67507 3.61032 9.99998 3.59588 9.99998 3.59588C9.99998 3.59588 10.3177 3.59588 10.7942 3.75472C11.2707 3.91357 11.7761 4.11573 12.0072 4.11573C12.2455 4.11573 13.9928 3.77638 13.9928 3.77638C14.6426 2.72223 16.5198 2.8883 16.5198 2.8883C15.8556 2.22404 14.4404 2.61393 14.4404 2.61393", fill: "url(#paint1_linear_927_5861)" }), jsxs("defs", { children: [jsxs("linearGradient", { id: "paint0_linear_927_5861", x1: "2.13715", y1: "10.1991", x2: "17.8483", y2: "10.1991", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { offset: "0.4", stopColor: "#FF5500" }), jsx("stop", { offset: "0.6", stopColor: "#FF2000" })] }), jsxs("linearGradient", { id: "paint1_linear_927_5861", x1: "3.73384", y1: "2.4883", x2: "16.5198", y2: "2.4883", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { stopColor: "#FF452A" }), jsx("stop", { offset: 1, stopColor: "#FF2000" })] })] })] }));
const Edge = (jsxs("svg", { "aria-hidden": "true", width: 20, height: 20, viewBox: "0 0 20 20", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsxs("g", { clipPath: "url(#clip0_927_5865)", children: [jsx("path", { d: "M18.0547 14.8828C17.7865 15.0222 17.5099 15.1448 17.2266 15.25C16.3293 15.584 15.3792 15.7533 14.4219 15.75C10.7266 15.75 7.50781 13.2109 7.50781 9.94531C7.51262 9.50803 7.63385 9.07993 7.85905 8.70506C8.08424 8.33019 8.40526 8.0221 8.78906 7.8125C5.44531 7.95312 4.58594 11.4375 4.58594 13.4766C4.58594 19.2578 9.90625 19.8359 11.0547 19.8359C11.6719 19.8359 12.6016 19.6562 13.1641 19.4766L13.2656 19.4453C15.4183 18.7014 17.2534 17.2465 18.4688 15.3203C18.5041 15.2618 18.5192 15.1933 18.5119 15.1253C18.5046 15.0574 18.4752 14.9937 18.4282 14.944C18.3812 14.8944 18.3192 14.8615 18.2518 14.8505C18.1843 14.8394 18.1151 14.8508 18.0547 14.8828Z", fill: "url(#paint0_linear_927_5865)" }), jsx("path", { opacity: "0.35", d: "M18.0547 14.8828C17.7865 15.0222 17.5099 15.1448 17.2266 15.25C16.3293 15.584 15.3792 15.7533 14.4219 15.75C10.7266 15.75 7.50781 13.2109 7.50781 9.94531C7.51262 9.50803 7.63385 9.07993 7.85905 8.70506C8.08424 8.33019 8.40526 8.0221 8.78906 7.8125C5.44531 7.95312 4.58594 11.4375 4.58594 13.4766C4.58594 19.2578 9.90625 19.8359 11.0547 19.8359C11.6719 19.8359 12.6016 19.6562 13.1641 19.4766L13.2656 19.4453C15.4183 18.7014 17.2534 17.2465 18.4688 15.3203C18.5041 15.2618 18.5192 15.1933 18.5119 15.1253C18.5046 15.0574 18.4752 14.9937 18.4282 14.944C18.3812 14.8944 18.3192 14.8615 18.2518 14.8505C18.1843 14.8394 18.1151 14.8508 18.0547 14.8828Z", fill: "url(#paint1_radial_927_5865)" }), jsx("path", { d: "M8.2578 18.8516C7.56239 18.4196 6.95961 17.854 6.48436 17.1875C5.94166 16.4447 5.56809 15.5921 5.38987 14.6896C5.21165 13.787 5.23311 12.8565 5.45272 11.9631C5.67234 11.0697 6.08479 10.2353 6.66115 9.51826C7.23751 8.80123 7.96379 8.21903 8.78905 7.8125C9.03905 7.69531 9.45311 7.49219 10.0078 7.5C10.3981 7.50302 10.7824 7.59627 11.1308 7.77245C11.4791 7.94864 11.7819 8.20299 12.0156 8.51562C12.3299 8.93835 12.5023 9.4498 12.5078 9.97656C12.5078 9.96094 14.4219 3.75781 6.2578 3.75781C2.82811 3.75781 0.00780015 7.00781 0.00780015 9.86719C-0.00584162 11.3776 0.317079 12.8721 0.953112 14.2422C1.99473 16.4602 3.81447 18.2185 6.06689 19.1834C8.3193 20.1483 10.8476 20.2526 13.1719 19.4766C12.3576 19.7337 11.4972 19.811 10.6501 19.7031C9.80297 19.5952 8.98941 19.3047 8.26561 18.8516H8.2578Z", fill: "url(#paint2_linear_927_5865)" }), jsx("path", { opacity: "0.41", d: "M8.2578 18.8516C7.56239 18.4196 6.95961 17.854 6.48436 17.1875C5.94166 16.4447 5.56809 15.5921 5.38987 14.6896C5.21165 13.787 5.23311 12.8565 5.45272 11.9631C5.67234 11.0697 6.08479 10.2353 6.66115 9.51826C7.23751 8.80123 7.96379 8.21903 8.78905 7.8125C9.03905 7.69531 9.45311 7.49219 10.0078 7.5C10.3981 7.50302 10.7824 7.59627 11.1308 7.77245C11.4791 7.94864 11.7819 8.20299 12.0156 8.51562C12.3299 8.93835 12.5023 9.4498 12.5078 9.97656C12.5078 9.96094 14.4219 3.75781 6.2578 3.75781C2.82811 3.75781 0.00780015 7.00781 0.00780015 9.86719C-0.00584162 11.3776 0.317079 12.8721 0.953112 14.2422C1.99473 16.4602 3.81447 18.2185 6.06689 19.1834C8.3193 20.1483 10.8476 20.2526 13.1719 19.4766C12.3576 19.7337 11.4972 19.811 10.6501 19.7031C9.80297 19.5952 8.98941 19.3047 8.26561 18.8516H8.2578Z", fill: "url(#paint3_radial_927_5865)" }), jsx("path", { d: "M11.9062 11.625C11.8359 11.7031 11.6406 11.8203 11.6406 12.0625C11.6406 12.2656 11.7734 12.4688 12.0156 12.6328C13.1328 13.4141 15.25 13.3047 15.2578 13.3047C16.0907 13.3041 16.9081 13.0802 17.625 12.6562C18.3467 12.2341 18.9456 11.6307 19.3622 10.9057C19.7788 10.1808 19.9986 9.35955 20 8.52344C20.0234 6.77344 19.375 5.60937 19.1172 5.09375C17.4531 1.85937 13.8828 4.89564e-08 10 4.89564e-08C7.37202 -0.00025981 4.84956 1.03398 2.97819 2.87904C1.10682 4.7241 0.0369559 7.23166 0 9.85938C0.0390625 7.00781 2.875 4.70312 6.25 4.70312C6.52344 4.70312 8.08594 4.72656 9.53125 5.48438C10.5466 5.98895 11.3875 6.78627 11.9453 7.77344C12.4219 8.60156 12.5078 9.65625 12.5078 10.0781C12.5078 10.5 12.2969 11.1172 11.8984 11.6328L11.9062 11.625Z", fill: "url(#paint4_radial_927_5865)" }), jsx("path", { d: "M11.9062 11.625C11.8359 11.7031 11.6406 11.8203 11.6406 12.0625C11.6406 12.2656 11.7734 12.4688 12.0156 12.6328C13.1328 13.4141 15.25 13.3047 15.2578 13.3047C16.0907 13.3041 16.9081 13.0802 17.625 12.6562C18.3467 12.2341 18.9456 11.6307 19.3622 10.9057C19.7788 10.1808 19.9986 9.35955 20 8.52344C20.0234 6.77344 19.375 5.60937 19.1172 5.09375C17.4531 1.85937 13.8828 4.89564e-08 10 4.89564e-08C7.37202 -0.00025981 4.84956 1.03398 2.97819 2.87904C1.10682 4.7241 0.0369559 7.23166 0 9.85938C0.0390625 7.00781 2.875 4.70312 6.25 4.70312C6.52344 4.70312 8.08594 4.72656 9.53125 5.48438C10.5466 5.98895 11.3875 6.78627 11.9453 7.77344C12.4219 8.60156 12.5078 9.65625 12.5078 10.0781C12.5078 10.5 12.2969 11.1172 11.8984 11.6328L11.9062 11.625Z", fill: "url(#paint5_radial_927_5865)" })] }), jsxs("defs", { children: [jsxs("linearGradient", { id: "paint0_linear_927_5865", x1: "4.58594", y1: "13.8281", x2: "18.5234", y2: "13.8281", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { stopColor: "#0C59A4" }), jsx("stop", { offset: 1, stopColor: "#114A8B" })] }), jsxs("radialGradient", { id: "paint1_radial_927_5865", cx: 0, cy: 0, r: 1, gradientUnits: "userSpaceOnUse", gradientTransform: "translate(12.2813 13.9332) scale(7.45313 7.08047)", children: [jsx("stop", { offset: "0.7", stopOpacity: 0 }), jsx("stop", { offset: "0.9", stopOpacity: "0.5" }), jsx("stop", { offset: 1 })] }), jsxs("linearGradient", { id: "paint2_linear_927_5865", x1: "11.9297", y1: "7.78125", x2: "3.23436", y2: "17.2578", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { stopColor: "#1B9DE2" }), jsx("stop", { offset: "0.2", stopColor: "#1595DF" }), jsx("stop", { offset: "0.7", stopColor: "#0680D7" }), jsx("stop", { offset: 1, stopColor: "#0078D4" })] }), jsxs("radialGradient", { id: "paint3_radial_927_5865", cx: 0, cy: 0, r: 1, gradientUnits: "userSpaceOnUse", gradientTransform: "translate(5.51209 15.5419) rotate(-81.3844) scale(11.202 9.05011)", children: [jsx("stop", { offset: "0.8", stopOpacity: 0 }), jsx("stop", { offset: "0.9", stopOpacity: "0.5" }), jsx("stop", { offset: 1 })] }), jsxs("radialGradient", { id: "paint4_radial_927_5865", cx: 0, cy: 0, r: 1, gradientUnits: "userSpaceOnUse", gradientTransform: "translate(2.02266 3.69656) rotate(92.2906) scale(15.8251 33.7043)", children: [jsx("stop", { stopColor: "#35C1F1" }), jsx("stop", { offset: "0.1", stopColor: "#34C1ED" }), jsx("stop", { offset: "0.2", stopColor: "#2FC2DF" }), jsx("stop", { offset: "0.3", stopColor: "#2BC3D2" }), jsx("stop", { offset: "0.7", stopColor: "#36C752" })] }), jsxs("radialGradient", { id: "paint5_radial_927_5865", cx: 0, cy: 0, r: 1, gradientUnits: "userSpaceOnUse", gradientTransform: "translate(18.7547 6.03906) rotate(73.7398) scale(7.60156 6.18159)", children: [jsx("stop", { stopColor: "#66EB6E" }), jsx("stop", { offset: 1, stopColor: "#66EB6E", stopOpacity: 0 })] }), jsx("clipPath", { id: "clip0_927_5865", children: jsx("rect", { width: 20, height: 20, fill: "white" }) })] })] }));
var browsers = { Chrome, FireFox, Brave, Edge };

const BrowserIcon = React.forwardRef(({ browser }, ref) => {
    const currentBrowser = browser !== null && browser !== void 0 ? browser : detectBrowser();
    let icon;
    switch (currentBrowser) {
        case 'chrome':
            icon = browsers.Chrome;
            break;
        case 'firefox':
            icon = browsers.FireFox;
            break;
        case 'edge':
            icon = browsers.Edge;
            break;
    }
    if (!icon)
        return jsx(Fragment, {});
    return jsx(BrowserIconContainer, { children: icon });
});
BrowserIcon.displayName = 'BrowserIcon';

const states$1 = {
    CONNECTED: 'connected',
    CONNECTING: 'connecting',
    EXPIRING: 'expiring',
    FAILED: 'failed',
    REJECTED: 'rejected',
    NOTCONNECTED: 'notconnected',
    UNAVAILABLE: 'unavailable',
};
const contentVariants$1 = {
    initial: {
        willChange: 'transform,opacity',
        position: 'relative',
        opacity: 0,
        scale: 0.95,
    },
    animate: {
        position: 'relative',
        opacity: 1,
        scale: 1,
        transition: {
            ease: [0.16, 1, 0.3, 1],
            duration: 0.4,
            delay: 0.05,
            position: { delay: 0 },
        },
    },
    exit: {
        position: 'absolute',
        opacity: 0,
        scale: 0.95,
        transition: {
            ease: [0.16, 1, 0.3, 1],
            duration: 0.3,
        },
    },
};
const ConnectWithInjector = ({ connectorId, switchConnectMethod, forceState }) => {
    var _a, _b, _c, _d;
    const { connect, connectors } = useConnect({
        onMutate: (connector) => {
            if (connector.connector) {
                setStatus(states$1.CONNECTING);
            }
            else {
                setStatus(states$1.UNAVAILABLE);
            }
        },
        onError(err) {
            console.error(err);
        },
        onSettled(data, error) {
            if (error) {
                setShowTryAgainTooltip(true);
                setTimeout(() => setShowTryAgainTooltip(false), 3500);
                if (error.code) {
                    // https://github.com/MetaMask/eth-rpc-errors/blob/main/src/error-constants.ts
                    switch (error.code) {
                        case -32002:
                            setStatus(states$1.NOTCONNECTED);
                            break;
                        case 4001:
                            setStatus(states$1.REJECTED);
                            break;
                        default:
                            setStatus(states$1.FAILED);
                            break;
                    }
                }
                else {
                    // Sometimes the error doesn't respond with a code
                    if (error.message) {
                        switch (error.message) {
                            case 'User rejected request':
                                setStatus(states$1.REJECTED);
                                break;
                            default:
                                setStatus(states$1.FAILED);
                                break;
                        }
                    }
                }
            }
        },
    });
    const [id, setId] = useState(connectorId);
    const [showTryAgainTooltip, setShowTryAgainTooltip] = useState(false);
    const connector = supportedConnectors$1.filter((c) => c.id === id)[0];
    const expiryDefault = 9; // Starting at 10 causes layout shifting, better to start at 9
    useState(expiryDefault);
    const hasExtensionInstalled = connector.extensionIsInstalled && connector.extensionIsInstalled();
    const browser = detectBrowser();
    const extensionUrl = connector.extensions
        ? connector.extensions[browser]
        : undefined;
    const suggestedExtension = connector.extensions
        ? {
            name: Object.keys(connector.extensions)[0],
            label: Object.keys(connector.extensions)[0].charAt(0).toUpperCase() +
                Object.keys(connector.extensions)[0].slice(1),
            url: connector.extensions[Object.keys(connector.extensions)[0]],
        }
        : undefined;
    const [status, setStatus] = useState(forceState
        ? forceState
        : !hasExtensionInstalled
            ? states$1.UNAVAILABLE
            : states$1.CONNECTING);
    const locales = useLocales({
        CONNECTORNAME: connector.name,
        CONNECTORSHORTNAME: (_a = connector.shortName) !== null && _a !== void 0 ? _a : connector.name,
        SUGGESTEDEXTENSIONBROWSER: (_b = suggestedExtension === null || suggestedExtension === void 0 ? void 0 : suggestedExtension.label) !== null && _b !== void 0 ? _b : 'your browser',
    });
    const runConnect = () => {
        if (!hasExtensionInstalled)
            return;
        const con = connectors.find((c) => c.id === id);
        if (con) {
            connect({ connector: con });
        }
        else {
            setStatus(states$1.UNAVAILABLE);
        }
    };
    let connectTimeout;
    useEffect(() => {
        if (status === states$1.UNAVAILABLE)
            return;
        // UX: Give user time to see the UI before opening the extension
        connectTimeout = setTimeout(runConnect, 600);
        return () => {
            clearTimeout(connectTimeout);
        };
    }, []);
    /** Timeout functionality if necessary
    let expiryTimeout: any;
    useEffect(() => {
      if (status === states.EXPIRING) {
        expiryTimeout = setTimeout(
          () => {
            if (expiryTimer <= 0) {
              setStatus(states.FAILED);
              setExpiryTimer(expiryDefault);
            } else {
              setExpiryTimer(expiryTimer - 1);
            }
          },
          expiryTimer === 9 ? 1500 : 1000 // Google: Chronostasis
        );
      }
      return () => {
        clearTimeout(expiryTimeout);
      };
    }, [status, expiryTimer]);
    */
    if (!connector) {
        return (jsx(PageContent, { children: jsxs(Container$4, { children: [jsx(ModalHeading, { children: "Invalid State" }), jsx(ModalContent, { children: jsx(Alert, { children: "No connectors match the id given. This state should never happen." }) })] }) }));
    }
    // TODO: Make this more generic
    if (isWalletConnectConnector(connector === null || connector === void 0 ? void 0 : connector.id)) {
        return (jsx(PageContent, { children: jsxs(Container$4, { children: [jsx(ModalHeading, { children: "Invalid State" }), jsx(ModalContent, { children: jsx(Alert, { children: "WalletConnect does not have an injection flow. This state should never happen." }) })] }) }));
    }
    return (jsx(PageContent, { children: jsxs(Container$4, { children: [jsx(ConnectingContainer, { children: jsxs(ConnectingAnimation, { "$shake": status === states$1.FAILED || status === states$1.REJECTED, "$circle": true, children: [jsx(AnimatePresence, { children: (status === states$1.FAILED || status === states$1.REJECTED) && (jsx(RetryButton, { "aria-label": "Retry", initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 }, whileTap: { scale: 0.9 }, transition: { duration: 0.1 }, onClick: runConnect, children: jsx(RetryIconContainer, { children: jsx(Tooltip, { open: showTryAgainTooltip &&
                                                (status === states$1.FAILED || status === states$1.REJECTED), message: locales.tryAgainQuestion, xOffset: -6, children: jsx(RetryIconCircle, {}) }) }) })) }), jsx(CircleSpinner, { logo: status === states$1.UNAVAILABLE ? (jsx("div", { style: {
                                        transform: 'scale(1.14)',
                                        position: 'relative',
                                        width: '100%',
                                    }, children: (_c = connector.logos.transparent) !== null && _c !== void 0 ? _c : connector.logos.default })) : (jsx(Fragment, { children: (_d = connector.logos.transparent) !== null && _d !== void 0 ? _d : connector.logos.default })), smallLogo: connector.id === 'injected', connecting: status === states$1.CONNECTING, unavailable: status === states$1.UNAVAILABLE, countdown: status === states$1.EXPIRING })] }) }), jsx(ModalContentContainer, { children: jsxs(AnimatePresence, { initial: false, children: [status === states$1.FAILED && (jsxs(Content, { initial: 'initial', animate: 'animate', exit: 'exit', variants: contentVariants$1, children: [jsxs(ModalContent, { children: [jsxs(ModalH1, { "$error": true, children: [jsx(AlertIcon, {}), locales.injectionScreen_failed_h1] }), jsx(ModalBody, { children: locales.injectionScreen_failed_p })] }), connector.scannable && connector.id !== 'coinbaseWallet' && (jsxs(Fragment, { children: [jsx(OrDivider, {}), jsx(Button, { icon: jsx(Scan, {}), onClick: () => switchConnectMethod(id), children: locales.scanTheQRCode })] }))] }, states$1.FAILED)), status === states$1.REJECTED && (jsxs(Content, { initial: 'initial', animate: 'animate', exit: 'exit', variants: contentVariants$1, children: [jsxs(ModalContent, { style: { paddingBottom: 28 }, children: [jsx(ModalH1, { children: locales.injectionScreen_rejected_h1 }), jsx(ModalBody, { children: locales.injectionScreen_rejected_p })] }), connector.scannable && connector.id !== 'coinbaseWallet' && (jsxs(Fragment, { children: [jsx(OrDivider, {}), jsx(Button, { icon: jsx(Scan, {}), onClick: () => switchConnectMethod(id), children: locales.scanTheQRCode })] }))] }, states$1.REJECTED)), (status === states$1.CONNECTING || status === states$1.EXPIRING) && (jsx(Content, { initial: 'initial', animate: 'animate', exit: 'exit', variants: contentVariants$1, children: jsxs(ModalContent, { style: { paddingBottom: 28 }, children: [jsx(ModalH1, { children: connector.id === 'injected'
                                                ? locales.injectionScreen_connecting_injected_h1
                                                : locales.injectionScreen_connecting_h1 }), jsx(ModalBody, { children: connector.id === 'injected'
                                                ? locales.injectionScreen_connecting_injected_p
                                                : locales.injectionScreen_connecting_p })] }) }, states$1.CONNECTING)), status === states$1.CONNECTED && (jsx(Content, { initial: 'initial', animate: 'animate', exit: 'exit', variants: contentVariants$1, children: jsxs(ModalContent, { children: [jsxs(ModalH1, { "$valid": true, children: [jsx(TickIcon, {}), " ", locales.injectionScreen_connected_h1] }), jsx(ModalBody, { children: locales.injectionScreen_connected_p })] }) }, states$1.CONNECTED)), status === states$1.NOTCONNECTED && (jsx(Content, { initial: 'initial', animate: 'animate', exit: 'exit', variants: contentVariants$1, children: jsxs(ModalContent, { children: [jsx(ModalH1, { children: locales.injectionScreen_notconnected_h1 }), jsx(ModalBody, { children: locales.injectionScreen_notconnected_p })] }) }, states$1.NOTCONNECTED)), status === states$1.UNAVAILABLE && (jsx(Content, { initial: 'initial', animate: 'animate', exit: 'exit', variants: contentVariants$1, children: !extensionUrl ? (jsxs(Fragment, { children: [jsxs(ModalContent, { style: { paddingBottom: 12 }, children: [jsx(ModalH1, { children: locales.injectionScreen_unavailable_h1 }), jsx(ModalBody, { children: locales.injectionScreen_unavailable_p })] }), !hasExtensionInstalled && suggestedExtension && (jsxs(Button, { href: suggestedExtension === null || suggestedExtension === void 0 ? void 0 : suggestedExtension.url, icon: jsx(BrowserIcon, { browser: suggestedExtension === null || suggestedExtension === void 0 ? void 0 : suggestedExtension.name }), children: ["Install on ", suggestedExtension === null || suggestedExtension === void 0 ? void 0 : suggestedExtension.label] }))] })) : (jsxs(Fragment, { children: [jsxs(ModalContent, { style: { paddingBottom: 18 }, children: [jsx(ModalH1, { children: locales.injectionScreen_install_h1 }), jsx(ModalBody, { children: locales.injectionScreen_install_p })] }), !hasExtensionInstalled && extensionUrl && (jsx(Button, { href: extensionUrl, icon: jsx(BrowserIcon, {}), children: locales.installTheExtension }))] })) }, states$1.UNAVAILABLE))] }) })] }) }));
};

const QRCodeContainer = styled(motion.div) `
  z-index: 3;
  position: relative;
  overflow: hidden;
  height: 0;
  padding-bottom: 100% !important;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1px 0 2px;
  border-radius: var(--ck-qr-border-radius, 24px);
  background: var(--ck-qr-background, transparent);
  box-shadow: 0 0 0 1px var(--ck-qr-border-color);
  backface-visibility: hidden;
  svg {
    display: block;
    max-width: 100%;
    width: 100%;
    height: auto;
  }
`;
const QRCodeContent = styled(motion.div) `
  position: absolute;
  inset: 13px;
  svg {
    width: 100% !important;
    height: auto !important;
  }
`;
const PlaceholderKeyframes$2 = keyframes `
  0%{ background-position: 100% 0; }
  100%{ background-position: -100% 0; }
`;
const QRPlaceholder = styled(motion.div) `
  --color: var(--ck-qr-dot-color);
  --bg: var(--ck-qr-background, var(--ck-body-background));

  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  > div {
    z-index: 4;
    position: relative;
    width: 28%;
    height: 28%;
    border-radius: 20px;
    background: var(--bg);
    box-shadow: 0 0 0 7px var(--bg);
  }
  > span {
    z-index: 4;
    position: absolute;
    background: var(--color);
    border-radius: 12px;
    width: 13.25%;
    height: 13.25%;
    box-shadow: 0 0 0 4px var(--bg);
    &:before {
      content: '';
      position: absolute;
      inset: 9px;
      border-radius: 3px;
      box-shadow: 0 0 0 4px var(--bg);
    }
    &:nth-child(1) {
      top: 0;
      left: 0;
    }
    &:nth-child(2) {
      top: 0;
      right: 0;
    }
    &:nth-child(3) {
      bottom: 0;
      left: 0;
    }
  }
  &:before {
    z-index: 3;
    content: '';
    position: absolute;
    inset: 0;
    background: repeat;
    background-size: 1.888% 1.888%;
    background-image: radial-gradient(var(--color) 41%, transparent 41%);
  }
  &:after {
    z-index: 5;
    content: '';
    position: absolute;
    inset: 0;
    transform: scale(1.5) rotate(45deg);
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 50%,
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 0)
    );
    background-size: 200% 100%;
    animation: ${PlaceholderKeyframes$2} 1000ms linear infinite both;
  }
`;
const LogoContainer$2 = styled(motion.div) `
  z-index: 6;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translateY(50%) scale(0.9999); // Shifting fix
`;
const LogoIcon = styled(motion.div) `
  z-index: 6;
  position: absolute;
  left: 50%;
  overflow: hidden;

  transform: translate(-50%, -50%) scale(0.9999); // Shifting fix

  svg {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
  }

  ${(props) => props.$wcLogo
    ? css `
          width: 29%;
          height: 20.5%;
        `
    : css `
          width: 28%;
          height: 28%;
          border-radius: 17px;
          &:before {
            pointer-events: none;
            z-index: 2;
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.02);
          }
        `}
`;

const generateMatrix = (value, errorCorrectionLevel) => {
    const arr = Array.prototype.slice.call(QRCodeUtil.create(value, { errorCorrectionLevel }).modules.data, 0);
    const sqrt = Math.sqrt(arr.length);
    return arr.reduce((rows, key, index) => (index % sqrt === 0
        ? rows.push([key])
        : rows[rows.length - 1].push(key)) && rows, []);
};
function QRCode({ ecl = 'M', size: sizeProp = 200, uri, clearArea = false, image, imageBackground = 'transparent', }) {
    const logoSize = clearArea ? 76 : 0;
    const size = sizeProp - 10 * 2;
    const dots = useMemo(() => {
        const dots = [];
        const matrix = generateMatrix(uri, ecl);
        const cellSize = size / matrix.length;
        let qrList = [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
        ];
        qrList.forEach(({ x, y }) => {
            const x1 = (matrix.length - 7) * cellSize * x;
            const y1 = (matrix.length - 7) * cellSize * y;
            for (let i = 0; i < 3; i++) {
                dots.push(jsx("rect", { fill: i % 2 !== 0
                        ? 'var(--ck-qr-background, var(--ck-body-background))'
                        : 'var(--ck-qr-dot-color)', rx: (i - 2) * -5 + (i === 0 ? 2 : 3), ry: (i - 2) * -5 + (i === 0 ? 2 : 3), width: cellSize * (7 - i * 2), height: cellSize * (7 - i * 2), x: x1 + cellSize * i, y: y1 + cellSize * i }, `${i}-${x}-${y}`));
            }
        });
        if (image) {
            const x1 = (matrix.length - 7) * cellSize * 1;
            const y1 = (matrix.length - 7) * cellSize * 1;
            dots.push(jsxs(Fragment, { children: [jsx("rect", { fill: imageBackground, rx: (0 - 2) * -5 + 2, ry: (0 - 2) * -5 + 2, width: cellSize * (7 - 0 * 2), height: cellSize * (7 - 0 * 2), x: x1 + cellSize * 0, y: y1 + cellSize * 0 }), jsx("foreignObject", { width: cellSize * (7 - 0 * 2), height: cellSize * (7 - 0 * 2), x: x1 + cellSize * 0, y: y1 + cellSize * 0, children: jsx("div", { style: { borderRadius: (0 - 2) * -5 + 2, overflow: 'hidden' }, children: image }) })] }));
        }
        const clearArenaSize = Math.floor((logoSize + 25) / cellSize);
        const matrixMiddleStart = matrix.length / 2 - clearArenaSize / 2;
        const matrixMiddleEnd = matrix.length / 2 + clearArenaSize / 2 - 1;
        matrix.forEach((row, i) => {
            row.forEach((_, j) => {
                if (matrix[i][j]) {
                    // Do not render dots under position squares
                    if (!((i < 7 && j < 7) ||
                        (i > matrix.length - 8 && j < 7) ||
                        (i < 7 && j > matrix.length - 8))) {
                        //if (image && i > matrix.length - 9 && j > matrix.length - 9) return;
                        if (image ||
                            !(i > matrixMiddleStart &&
                                i < matrixMiddleEnd &&
                                j > matrixMiddleStart &&
                                j < matrixMiddleEnd)) {
                            dots.push(jsx("circle", { cx: i * cellSize + cellSize / 2, cy: j * cellSize + cellSize / 2, fill: "var(--ck-qr-dot-color)", r: cellSize / 3 }, `circle-${i}-${j}`));
                        }
                    }
                }
            });
        });
        return dots;
    }, [ecl, size, uri]);
    return (jsxs("svg", { height: size, width: size, viewBox: `0 0 ${size} ${size}`, style: {
            width: size,
            height: size,
        }, children: [jsx("rect", { fill: "transparent", height: size, width: size }), dots] }));
}

function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: 0,
        height: 0,
    });
    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return windowSize;
}

function CustomQRCode({ value, image, imageBackground, imagePosition = 'center', tooltipMessage, }) {
    const windowSize = useWindowSize();
    const Logo = windowSize.width > 920 && tooltipMessage ? (jsx(Tooltip, { xOffset: 139, yOffset: 5, delay: 0.1, message: tooltipMessage, children: image })) : (image);
    return (jsx(QRCodeContainer, { children: jsxs(QRCodeContent, { children: [image && (jsx(LogoContainer$2, { children: jsx(LogoIcon, { "$wcLogo": imagePosition !== 'center', style: {
                            background: imagePosition === 'center' ? imageBackground : undefined,
                        }, children: Logo }) })), jsx(AnimatePresence, { initial: false, children: value ? (jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0, position: 'absolute', inset: [0, 0] }, transition: {
                            duration: 0.2,
                        }, children: jsx(QRCode, { uri: value, size: 288, ecl: "M", clearArea: !!(imagePosition === 'center' && image) }) }, value)) : (jsxs(QRPlaceholder, { initial: { opacity: 0.1 }, animate: { opacity: 0.1 }, exit: { opacity: 0, position: 'absolute', inset: [0, 0] }, transition: {
                            duration: 0.2,
                        }, children: [jsx("span", {}), jsx("span", {}), jsx("span", {}), jsx("div", {})] })) })] }) }));
}
CustomQRCode.displayName = 'CustomQRCode';

const IconContainer$1 = styled(motion.div) `
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 47px;
  height: 52px;
  min-width: 47px;
  min-height: 52px;
  svg {
    display: block;
    max-width: 100%;
    height: auto;
  }
`;
const ScanIconWithLogos = ({ logo }) => {
    const logoList = [
        jsx(Logos.MetaMask, { background: true }),
        jsx(Logos.Coinbase, { background: true }),
        jsx(Logos.Crypto, {}),
        jsx(Logos.ImToken, {}),
        jsx(Logos.Argent, {}),
        jsx(Logos.Trust, {}),
    ];
    return (jsx(IconContainer$1, { children: jsxs("svg", { "aria-hidden": "true", width: "47", height: "52", viewBox: "0 0 47 52", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsxs("g", { mask: "url(#gradient-mask)", children: [jsx("path", { d: "M7 14.5C7 11.4624 9.46243 9 12.5 9H31.5C34.5376 9 37 11.4624 37 14.5V47H7V14.5Z", fill: "var(--ck-graphic-scaniconwithlogos-04)" }), logo ? (jsx("foreignObject", { x: "13", y: "21", width: "18", height: "18", rx: "5", children: jsx("div", { style: { overflow: 'hidden', borderRadius: 5 }, children: logo }) })) : (jsxs(Fragment, { children: [jsx("foreignObject", { x: "12", y: "15", width: "9", height: "9", rx: "2.5", children: jsx("div", { style: { overflow: 'hidden', borderRadius: 2.5 }, children: logoList[0] }) }), jsx("foreignObject", { x: "23", y: "15", width: "9", height: "9", rx: "2.5", children: jsx("div", { style: { overflow: 'hidden', borderRadius: 2.5 }, children: logoList[1] }) }), jsx("foreignObject", { x: "12", y: "26", width: "9", height: "9", rx: "2.5", children: jsx("div", { style: { overflow: 'hidden', borderRadius: 2.5 }, children: jsx("div", { style: { overflow: 'hidden', borderRadius: 2.5 }, children: logoList[2] }) }) }), jsx("foreignObject", { x: "23", y: "26", width: "9", height: "9", rx: "2.5", children: jsx("div", { style: { overflow: 'hidden', borderRadius: 2.5 }, children: logoList[3] }) }), jsx("foreignObject", { x: "12", y: "37", width: "9", height: "9", rx: "2.5", children: jsx("div", { style: { overflow: 'hidden', borderRadius: 2.5 }, children: logoList[4] }) }), jsx("foreignObject", { x: "23", y: "37", width: "9", height: "9", rx: "2.5", children: jsx("div", { style: { overflow: 'hidden', borderRadius: 2.5 }, children: logoList[5] }) })] })), jsx("path", { d: "M36 47V13.7143C36 11.1107 33.8893 9 31.2857 9H12.7143C10.1107 9 8 11.1107 8 13.7143V47", stroke: "url(#paint0_linear_924_12568)", strokeWidth: "2" }), jsx("path", { d: "M15 10H29C29 11.1046 28.1046 12 27 12H17C15.8954 12 15 11.1046 15 10Z", fill: "var(--ck-graphic-scaniconwithlogos-01)" }), jsx("rect", { x: "1", y: "47", width: "43", height: "5", fill: "var(--ck-tooltip-background)" }), jsx("rect", { x: "22", y: "1", width: "24", height: "24", rx: "12", fill: "var(--ck-graphic-scaniconwithlogos-03)", stroke: "var(--ck-tooltip-background)", strokeWidth: "2" }), jsx("rect", { x: "34.5", y: "10", width: "2.5", height: "2.5", rx: "0.75", fill: "#373737" }), jsx("rect", { x: "31", y: "10", width: "2.5", height: "2.5", rx: "0.75", fill: "#373737" }), jsx("rect", { x: "31", y: "13.5", width: "2.5", height: "2.5", rx: "0.75", fill: "#373737" }), jsx("rect", { x: "34.5", y: "13.5", width: "2.5", height: "2.5", rx: "0.75", fill: "#373737" }), jsx("path", { d: "M28.5 10.5V9C28.5 8.17157 29.1716 7.5 30 7.5H31.5", stroke: "#373737", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M36.5 7.5L38 7.5C38.8284 7.5 39.5 8.17157 39.5 9L39.5 10.5", stroke: "#373737", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M39.5 15.5L39.5 17C39.5 17.8284 38.8284 18.5 38 18.5L36.5 18.5", stroke: "#373737", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), jsx("path", { d: "M31.5 18.5L30 18.5C29.1716 18.5 28.5 17.8284 28.5 17L28.5 15.5", stroke: "#373737", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })] }), jsxs("defs", { children: [jsxs("linearGradient", { id: "paint0_linear_924_12568", x1: "22", y1: "8.2549", x2: "22", y2: "47", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { stopColor: "var(--ck-graphic-scaniconwithlogos-01)" }), jsx("stop", { offset: "1", stopColor: "var(--ck-graphic-scaniconwithlogos-02)" })] }), jsxs("linearGradient", { id: "linear-gradient-mask", x1: "47", y1: "42", x2: "47", y2: "47", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { stopColor: "white" }), jsx("stop", { offset: "1", stopColor: "black", stopOpacity: "0" })] }), jsx("mask", { id: "gradient-mask", children: jsx("rect", { x: "0", y: "0", width: "47", height: "52", fill: "url(#linear-gradient-mask)" }) })] })] }) }));
};

function useCoinbaseWalletUri() {
    const [uri, setUri] = useState(undefined);
    const context = useContext();
    const connector = useCoinbaseWalletConnector();
    const { connectAsync } = useConnect();
    useEffect(() => {
        async function handleMessage(e) {
            context.log('CBW Message', e);
            if (connector) {
                if (e.type === 'connecting') {
                    const p = await connector.getProvider();
                    setUri(p.qrUrl);
                }
            }
        }
        if (connector) {
            context.log('add cbw listeners');
            connectCoinbaseWallet(connector);
            connector.on('message', handleMessage);
            return () => {
                context.log('remove cbw listeners');
                connector.off('message', handleMessage);
            };
        }
    }, [connector]);
    async function connectWallet(connector) {
        const result = await connectAsync({ connector });
        if (result)
            return result;
        return false;
    }
    async function connectCoinbaseWallet(connector) {
        try {
            await connectWallet(connector);
        }
        catch (error) {
            context.log(error);
            context.displayError(jsxs(Fragment, { children: ["This dApp is most likely missing the ", jsx("code", { children: "headlessMode: true" }), ' ', "flag in the custom ", jsx("code", { children: "CoinbaseWalletConnector" }), " options. See", ' ', jsx("a", { target: "_blank", rel: "noopener noreferrer", href: "https://connect.family.co/v0/docs/cbwHeadlessMode", children: "documentation" }), ' ', "for more details."] }), error);
        }
    }
    return {
        uri,
    };
}

const ConnectWithQRCode = ({ connectorId }) => {
    var _a, _b, _c, _d;
    const context = useContext();
    const [id] = useState(connectorId);
    const { connectors } = useConnect();
    const { uri } = isWalletConnectConnector(id)
        ? useWalletConnectUri()
        : isCoinbaseWalletConnector(id)
            ? useCoinbaseWalletUri()
            : { uri: undefined };
    const connector = connectors.find((c) => c.id === id);
    const connectorInfo = supportedConnectors$1.find((c) => c.id === id);
    const locales = useLocales({
        CONNECTORNAME: connector === null || connector === void 0 ? void 0 : connector.name,
    });
    const { open: openW3M, isOpen: isOpenW3M } = useWalletConnectModal();
    if (!connector)
        return jsx(Fragment, { children: "Connector not found" });
    const browser = detectBrowser();
    (connectorInfo === null || connectorInfo === void 0 ? void 0 : connectorInfo.extensions)
        ? connectorInfo.extensions[browser]
        : undefined;
    const hasApps = (connectorInfo === null || connectorInfo === void 0 ? void 0 : connectorInfo.appUrls) && Object.keys(connectorInfo === null || connectorInfo === void 0 ? void 0 : connectorInfo.appUrls).length !== 0;
    (connectorInfo === null || connectorInfo === void 0 ? void 0 : connectorInfo.extensions)
        ? {
            name: Object.keys(connectorInfo === null || connectorInfo === void 0 ? void 0 : connectorInfo.extensions)[0],
            label: Object.keys(connectorInfo === null || connectorInfo === void 0 ? void 0 : connectorInfo.extensions)[0].charAt(0).toUpperCase() +
                Object.keys(connectorInfo === null || connectorInfo === void 0 ? void 0 : connectorInfo.extensions)[0].slice(1),
            url: connectorInfo === null || connectorInfo === void 0 ? void 0 : connectorInfo.extensions[Object.keys(connectorInfo === null || connectorInfo === void 0 ? void 0 : connectorInfo.extensions)[0]],
        }
        : undefined;
    (connectorInfo === null || connectorInfo === void 0 ? void 0 : connectorInfo.extensionIsInstalled) &&
        (connectorInfo === null || connectorInfo === void 0 ? void 0 : connectorInfo.extensionIsInstalled());
    if (!(connectorInfo === null || connectorInfo === void 0 ? void 0 : connectorInfo.scannable))
        return (jsxs(PageContent, { children: [jsx(ModalHeading, { children: "Invalid State" }), jsx(ModalContent, { children: jsxs(Alert, { children: [connectorInfo === null || connectorInfo === void 0 ? void 0 : connectorInfo.name, " does not have it's own QR Code to scan. This state should never happen"] }) })] }));
    const showAdditionalOptions = isWalletConnectConnector(connectorId);
    return (jsxs(PageContent, { children: [jsxs(ModalContent, { style: { paddingBottom: 8, gap: 14 }, children: [jsx(CustomQRCode, { value: uri, image: connectorInfo === null || connectorInfo === void 0 ? void 0 : connectorInfo.logos.qrCode, imageBackground: connectorInfo === null || connectorInfo === void 0 ? void 0 : connectorInfo.logoBackground, tooltipMessage: isWalletConnectConnector(connectorId) ? (jsxs(Fragment, { children: [jsx(ScanIconWithLogos, {}), jsx("span", { children: locales.scanScreen_tooltip_walletConnect })] })) : (jsxs(Fragment, { children: [jsx(ScanIconWithLogos, { logo: connectorInfo === null || connectorInfo === void 0 ? void 0 : connectorInfo.logos.connectorButton }), jsx("span", { children: locales.scanScreen_tooltip_default })] })) }), showAdditionalOptions ? (jsx(OrDivider, {})) : (hasApps && jsx(OrDivider, { children: locales.dontHaveTheApp }))] }), showAdditionalOptions && ( // for walletConnect
            jsxs("div", { style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 14,
                }, children: [((_a = context.options) === null || _a === void 0 ? void 0 : _a.walletConnectCTA) !== 'modal' && (jsx(CopyToClipboard, { variant: "button", string: uri, children: ((_b = context.options) === null || _b === void 0 ? void 0 : _b.walletConnectCTA) === 'link'
                            ? locales.copyToClipboard
                            : locales.copyCode })), ((_c = context.options) === null || _c === void 0 ? void 0 : _c.walletConnectCTA) !== 'link' && (jsx(Button, { icon: jsx(ExternalLinkIcon, {}), onClick: openW3M, disabled: isOpenW3M, waiting: isOpenW3M, children: ((_d = context.options) === null || _d === void 0 ? void 0 : _d.walletConnectCTA) === 'modal'
                            ? locales.useWalletConnectModal
                            : locales.useModal }))] })), hasApps && (jsx(Fragment, { children: jsx(Button, { onClick: () => {
                        context.setRoute(routes.DOWNLOAD);
                    }, 
                    /*
                    icon={
                      <div style={{ background: connectorInfo?.logoBackground }}>
                        {connectorInfo?.logos.default}
                      </div>
                    }
                    roundedIcon
                    */
                    download: true, children: locales.getWalletName }) }))] }));
};

const states = {
    QRCODE: 'qrcode',
    INJECTOR: 'injector',
};
const ConnectUsing = ({ connectorId }) => {
    const [id, setId] = useState(connectorId);
    const connector = supportedConnectors$1.filter((c) => c.id === id)[0];
    const hasExtensionInstalled = connector.extensionIsInstalled && connector.extensionIsInstalled();
    // If cannot be scanned, display injector flow, which if extension is not installed will show CTA to install it
    const useInjector = !connector.scannable || hasExtensionInstalled;
    const [status, setStatus] = useState(useInjector ? states.INJECTOR : states.QRCODE);
    if (!connector)
        return jsx(Alert, { children: "Connector not found" });
    return (jsxs(AnimatePresence, { children: [status === states.QRCODE && (jsx(motion.div, { initial: 'initial', animate: 'animate', exit: 'exit', variants: contentVariants$2, children: jsx(ConnectWithQRCode, { connectorId: id, switchConnectMethod: (id) => {
                        if (id)
                            setId(id);
                        setStatus(states.INJECTOR);
                    } }) }, states.QRCODE)), status === states.INJECTOR && (jsx(motion.div, { initial: 'initial', animate: 'animate', exit: 'exit', variants: contentVariants$2, children: jsx(ConnectWithInjector, { connectorId: id, switchConnectMethod: (id) => {
                        if (id)
                            setId(id);
                        setStatus(states.QRCODE);
                    } }) }, states.INJECTOR))] }));
};

const DownloadApp = ({ connectorId }) => {
    var _a, _b, _c;
    const [id] = useState(connectorId);
    const connector = supportedConnectors$1.filter((c) => c.id === id)[0];
    const locales = useLocales({
        CONNECTORNAME: connector.name,
    });
    if (!connector)
        return jsx(Fragment, { children: "Connector not found" });
    const ios = (_a = connector.appUrls) === null || _a === void 0 ? void 0 : _a.ios;
    const android = (_b = connector.appUrls) === null || _b === void 0 ? void 0 : _b.android;
    const downloadUri = (_c = connector.appUrls) === null || _c === void 0 ? void 0 : _c.download;
    const bodycopy = ios && android
        ? locales.downloadAppScreen_iosAndroid
        : ios
            ? locales.downloadAppScreen_ios
            : locales.downloadAppScreen_android;
    return (jsxs(PageContent, { children: [jsxs(ModalContent, { style: { paddingBottom: 4, gap: 14 }, children: [downloadUri && jsx(CustomQRCode, { value: downloadUri }), !downloadUri && jsx(Fragment, { children: "No download link available" }), jsx(ModalBody, { style: { fontSize: 15, lineHeight: '20px', padding: '0 12px' }, children: bodycopy }), connector.defaultConnect && jsx(OrDivider, {})] }), connector.defaultConnect && ( // Open the default connector modal
            jsx(Button, { icon: jsx(ExternalLinkIcon, {}), children: "Open Default Modal" }))] }));
};

const AvatarContainer = styled(motion.div) `
  padding: 18px 0 20px;
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    padding: 16px 0 20px;
  }
`;
const AvatarInner = styled(motion.div) `
  position: relative;
  display: inline-block;
`;
const ChainSelectorContainer = styled(motion.div) `
  z-index: 3;
  position: absolute;
  bottom: 0px;
  right: -16px;
`;
const BalanceContainer = styled(motion.div) `
  position: relative;
`;
const Balance$1 = styled(motion.div) `
  position: relative;
`;
const PlaceholderKeyframes$1 = keyframes `
  0%{ background-position: 100% 0; }
  100%{ background-position: -100% 0; }
`;
const LoadingBalance = styled(motion.div) `
  width: 25%;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  background: var(--ck-body-background-secondary);
  inset: 0;
  &:before {
    z-index: 4;
    content: '';
    position: absolute;
    inset: 0;
    background-image: linear-gradient(
      90deg,
      var(--ck-body-background-transparent) 50%,
      var(--ck-body-background),
      var(--ck-body-background-transparent)
    );
    opacity: 0.75;
    background-size: 200% 100%;
    animation: ${PlaceholderKeyframes$1} 1000ms linear infinite both;
  }
`;

function addressToNumber(address) {
    return ((address
        .split('')
        .map((l) => l.charCodeAt(0))
        .reduce((a, b) => a + b) %
        100) /
        100);
}
const EnsAvatar = styled(motion.div) `
  will-change: transform; // Needed for Safari
  pointer-events: none;
  user-select: none;
  position: relative;
  overflow: hidden;
  margin: 0;
  border-radius: ${(props) => `${props.$radius}px`};
  width: ${(props) => `${props.$size}px`};
  height: ${(props) => `${props.$size}px`};
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
  &:before {
    content: '';
    z-index: 1;
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.02);
  }
  ${(props) => {
    if (props.$seed) {
        const id = Math.ceil(addressToNumber(props.$seed) * 8);
        const ensColor = `0${id === 0 ? 1 : id}`; // No zero ID in ENS color list.. 🤷‍♀️
        return css `
        background: var(--ck-ens-${ensColor}-start);
        background: linear-gradient(
          180deg,
          var(--ck-ens-${ensColor}-start) 0%,
          var(--ck-ens-${ensColor}-stop) 100%
        );
      `;
    }
}}
`;
const ImageContainer = styled(motion.img) `
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  opacity: ${(props) => (props.$loaded ? 1 : 0)};
  will-change: opacity; // Needed for Safari
  transition: opacity 500ms ease;
  transform: scale(1.01); // fixes background color bleeding
`;

function useIsMounted() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return mounted;
}

const Avatar = ({ address, name, size = 96, radius = 96 }) => {
    var _a, _b, _c;
    const isMounted = useIsMounted();
    const context = useContext();
    const imageRef = useRef(null);
    const [loaded, setLoaded] = useState(true);
    const { data: ensAddress } = useEnsAddress({
        chainId: 1,
        name: name,
    });
    const { data: ensName } = useEnsName({
        chainId: 1,
        address: (_a = address !== null && address !== void 0 ? address : ensAddress) !== null && _a !== void 0 ? _a : undefined,
    });
    const { data: ensAvatar } = useEnsAvatar({
        chainId: 1,
        name: ensName,
    });
    const ens = {
        address: ensAddress !== null && ensAddress !== void 0 ? ensAddress : address,
        name: ensName !== null && ensName !== void 0 ? ensName : name,
        avatar: ensAvatar !== null && ensAvatar !== void 0 ? ensAvatar : undefined,
    };
    useEffect(() => {
        if (!(imageRef.current &&
            imageRef.current.complete &&
            imageRef.current.naturalHeight !== 0)) {
            setLoaded(false);
        }
    }, [ensAvatar]);
    if (!isMounted)
        return jsx("div", { style: { width: size, height: size, borderRadius: radius } });
    if ((_b = context.options) === null || _b === void 0 ? void 0 : _b.customAvatar)
        return (jsx("div", { style: {
                width: size,
                height: size,
                borderRadius: radius,
                overflow: 'hidden',
            }, children: (_c = context.options) === null || _c === void 0 ? void 0 : _c.customAvatar({
                address: address !== null && address !== void 0 ? address : ens === null || ens === void 0 ? void 0 : ens.address,
                ensName: name !== null && name !== void 0 ? name : ens === null || ens === void 0 ? void 0 : ens.name,
                ensImage: ens === null || ens === void 0 ? void 0 : ens.avatar,
                size,
                radius,
            }) }));
    if (!ens.name || !ens.avatar)
        return (jsx(ResetContainer, { style: { pointerEvents: 'none' }, children: jsx(EnsAvatar, { "$size": size, "$seed": ens.address, "$radius": radius }) }));
    return (jsx(ResetContainer, { style: { pointerEvents: 'none' }, children: jsx(EnsAvatar, { "$size": size, "$seed": ens.address, "$radius": radius, children: jsx(ImageContainer, { ref: imageRef, src: ens.avatar, alt: ens.name, onLoad: () => setLoaded(true), "$loaded": loaded }) }) }));
};

const KnownChain = ({ testnet, ...props }) => (jsxs("svg", { ...props, "aria-hidden": "true", width: "44", height: "44", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: {
        background: testnet
            ? 'linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)'
            : 'black',
    }, children: [jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M20.5611 8.12948C21.0082 7.90729 21.5007 7.79167 22 7.79167C22.4993 7.79167 22.9919 7.90729 23.439 8.12948L23.4408 8.1304L33.0387 12.9293C33.577 13.197 34.031 13.61 34.3478 14.121C34.6649 14.6323 34.833 15.2218 34.8333 15.8234V27.2595C34.833 27.8611 34.6649 28.4511 34.3478 28.9624C34.031 29.4733 33.578 29.8858 33.0398 30.1535L23.4411 34.9528C22.9919 35.1775 22.4963 35.2947 21.994 35.2947C21.4918 35.2947 20.9964 35.1777 20.5472 34.9529L10.9475 30.1531L10.9452 30.1519C10.4071 29.8808 9.95535 29.4646 9.6411 28.9504C9.32739 28.437 9.16312 27.8464 9.16673 27.2448L9.16675 27.2417L10.0004 27.2475H9.16673V27.2448V15.8239C9.16705 15.2223 9.33518 14.6322 9.65222 14.121C9.96906 13.61 10.4221 13.1976 10.9604 12.9298L20.5592 8.1304L20.5611 8.12948ZM21.3031 9.62267L11.8706 14.3389L22 19.4036L32.1294 14.3389L22.697 9.62267C22.4806 9.51531 22.2416 9.45905 22 9.45905C21.7585 9.45905 21.5194 9.51534 21.3031 9.62267ZM10.8341 15.8241C10.8341 15.7785 10.8362 15.733 10.8401 15.6878L21.1663 20.8509V33.3983L11.6955 28.6629C11.4352 28.5315 11.2159 28.3297 11.0638 28.0809C10.9116 27.8318 10.8321 27.5452 10.8341 27.2533L10.8341 27.2475V15.8241ZM22.8337 33.3923L32.2967 28.6608C32.5576 28.5312 32.7772 28.3313 32.9308 28.0836C33.0844 27.836 33.1658 27.5504 33.166 27.259V15.8243C33.1659 15.7786 33.1639 15.7331 33.1599 15.6878L22.8337 20.8509V33.3923Z", fill: "url(#paint0_linear_3546_7073)" }), jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M10.8341 15.8241C10.8341 15.7785 10.8362 15.733 10.8401 15.6878L21.1663 20.8509V33.3983L11.6955 28.6629C11.4352 28.5315 11.2159 28.3297 11.0638 28.0809C10.9116 27.8318 10.8321 27.5452 10.8341 27.2533L10.8341 27.2475V15.8241Z", fill: "url(#paint1_linear_3546_7073)", fillOpacity: "0.3" }), jsxs("defs", { children: [jsxs("linearGradient", { id: "paint0_linear_3546_7073", x1: "22", y1: "7.79167", x2: "22", y2: "35.2947", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { stopColor: "white" }), jsx("stop", { offset: "1", stopColor: "white", stopOpacity: "0.7" })] }), jsxs("linearGradient", { id: "paint1_linear_3546_7073", x1: "22", y1: "7.79167", x2: "22", y2: "35.2947", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { stopColor: "white" }), jsx("stop", { offset: "1", stopColor: "white", stopOpacity: "0.7" })] })] })] }));
const UnknownChain = ({ testnet, ...props }) => {
    return jsx(KnownChain, { testnet: true, ...props });
};
const Ethereum = ({ testnet, ...props }) => {
    let bg = 'var(--ck-chain-ethereum-01, #25292E)';
    let fill = 'var(--ck-chain-ethereum-02, #ffffff)';
    if (testnet) {
        bg = 'linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)';
        fill = '#fff';
    }
    return (jsxs("svg", { ...props, "aria-hidden": "true", width: "44", height: "44", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: {
            background: bg,
        }, children: [jsx("path", { d: "M21.9967 6.99621L21.7955 7.67987V27.5163L21.9967 27.7171L31.2044 22.2744L21.9967 6.99621Z", fill: fill }), jsx("path", { d: "M21.9957 6.99621L12.7878 22.2744L21.9957 27.7171V18.0891V6.99621Z", fill: fill }), jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M21.9959 36.9996L21.9959 36.9997V36.9995L31.2091 24.0243L21.9959 29.4642L12.788 24.0243L21.9957 36.9993L21.9958 36.9997L21.9959 36.9996Z", fill: fill }), jsx("path", { d: "M21.996 27.7181L31.2037 22.2753L21.996 18.09V27.7181Z", fill: fill }), jsx("path", { d: "M12.7878 22.2753L21.9957 27.7181V18.09L12.7878 22.2753Z", fill: fill })] }));
};
const Polygon = ({ testnet, ...props }) => (jsx("svg", { ...props, "aria-hidden": "true", width: "44", height: "44", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: {
        background: testnet
            ? 'linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)'
            : '#6F41D8',
    }, children: jsx("path", { d: "M29.0015 17.4529C28.4941 17.1572 27.8355 17.1572 27.2773 17.4529L23.3186 19.7271L20.6305 21.2094L16.6719 23.4822C16.1645 23.7792 15.5059 23.7792 14.9476 23.4822L11.8016 21.703C11.2943 21.4074 10.9395 20.8642 10.9395 20.2702V16.7612C10.9395 16.1686 11.2434 15.6255 11.8016 15.3285L14.8954 13.5988C15.4041 13.3018 16.0641 13.3018 16.6224 13.5988L19.7161 15.3285C20.2249 15.6255 20.5796 16.1686 20.5796 16.7612V19.0355L23.2678 17.5024V15.2295C23.2707 14.9343 23.1917 14.6441 23.0395 14.3911C22.8873 14.1381 22.6679 13.9324 22.4056 13.7968L16.6719 10.5353C16.1645 10.2382 15.5059 10.2382 14.9476 10.5353L9.11214 13.7968C8.84992 13.9324 8.63049 14.1381 8.47828 14.3911C8.32607 14.6441 8.24705 14.9343 8.25002 15.2295V21.802C8.25002 22.396 8.55389 22.9391 9.11214 23.2361L14.9476 26.4976C15.455 26.7932 16.115 26.7932 16.6719 26.4976L20.6305 24.2729L23.3186 22.7411L27.2773 20.5177C27.7846 20.2207 28.4433 20.2207 29.0015 20.5177L32.0966 22.2475C32.6054 22.5431 32.9588 23.0863 32.9588 23.6803V27.1893C32.9588 27.7819 32.6563 28.325 32.0966 28.622L29.0029 30.4013C28.4941 30.6983 27.8341 30.6983 27.2773 30.4013L24.1821 28.6715C23.6734 28.3745 23.3186 27.8314 23.3186 27.2387V24.9645L20.6305 26.4976V28.7705C20.6305 29.3631 20.9344 29.9076 21.4926 30.2032L27.3281 33.4647C27.8355 33.7617 28.4941 33.7617 29.0524 33.4647L34.8879 30.2032C35.3953 29.9076 35.75 29.3645 35.75 28.7705V22.198C35.753 21.9028 35.674 21.6126 35.5218 21.3596C35.3695 21.1066 35.1501 20.9009 34.8879 20.7653L29.0029 17.4529H29.0015Z", fill: "white" }) }));
const Optimism = ({ testnet, ...props }) => (jsxs("svg", { ...props, "aria-hidden": "true", width: "44", height: "44", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: {
        background: testnet
            ? 'linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)'
            : '#FF0420',
    }, children: [jsx("path", { d: "M15.5877 27.8473C14.2777 27.8473 13.2045 27.539 12.3679 26.9226C11.5422 26.2952 11.1294 25.4035 11.1294 24.2477C11.1294 24.0055 11.157 23.7082 11.212 23.356C11.3552 22.5634 11.5588 21.6112 11.823 20.4994C12.5715 17.4722 14.5034 15.9586 17.6187 15.9586C18.4664 15.9586 19.2259 16.1017 19.8974 16.3879C20.5689 16.663 21.0973 17.0814 21.4826 17.6428C21.8678 18.1932 22.0605 18.8537 22.0605 19.6242C22.0605 19.8554 22.033 20.1471 21.9779 20.4994C21.8128 21.4791 21.6146 22.4313 21.3835 23.356C20.9982 24.8641 20.3322 25.9924 19.3855 26.741C18.4388 27.4785 17.1729 27.8473 15.5877 27.8473ZM15.8189 25.4695C16.4354 25.4695 16.9582 25.2879 17.3876 24.9247C17.8279 24.5614 18.1416 24.0055 18.3287 23.257C18.5819 22.2222 18.7746 21.3195 18.9067 20.5489C18.9507 20.3178 18.9727 20.0811 18.9727 19.8389C18.9727 18.8372 18.4498 18.3363 17.4041 18.3363C16.7876 18.3363 16.2592 18.5179 15.8189 18.8812C15.3896 19.2445 15.0813 19.8004 14.8943 20.5489C14.6961 21.2865 14.4979 22.1892 14.2998 23.257C14.2557 23.477 14.2337 23.7082 14.2337 23.9504C14.2337 24.9632 14.7622 25.4695 15.8189 25.4695Z", fill: "white" }), jsx("path", { d: "M22.8188 27.6815C22.6977 27.6815 22.6041 27.6429 22.5381 27.5659C22.483 27.4778 22.4665 27.3788 22.4885 27.2687L24.7672 16.5358C24.7892 16.4147 24.8498 16.3156 24.9489 16.2385C25.0479 16.1615 25.1525 16.1229 25.2626 16.1229H29.6548C30.8767 16.1229 31.8564 16.3761 32.5939 16.8825C33.3426 17.3889 33.7168 18.1209 33.7168 19.0786C33.7168 19.3538 33.6838 19.64 33.6177 19.9372C33.3426 21.2032 32.7867 22.1389 31.95 22.7443C31.1244 23.3498 29.9905 23.6525 28.5485 23.6525H26.3194L25.5598 27.2687C25.5377 27.3898 25.4772 27.4888 25.3782 27.5659C25.2791 27.6429 25.1745 27.6815 25.0645 27.6815H22.8188ZM28.6641 21.3738C29.1264 21.3738 29.5282 21.2472 29.8695 20.994C30.2217 20.7408 30.4529 20.3776 30.563 19.9042C30.596 19.717 30.6125 19.552 30.6125 19.4089C30.6125 19.0896 30.519 18.8474 30.3318 18.6823C30.1446 18.5062 29.8255 18.4182 29.3741 18.4182H27.3926L26.7652 21.3738H28.6641Z", fill: "white" })] }));
const Arbitrum = ({ testnet, ...props }) => {
    const fill = testnet ? '#ffffff' : '#28A0F0';
    const outlineFill = testnet ? '#ffffff' : '#96BEDC';
    return (jsxs("svg", { ...props, "aria-hidden": "true", width: "44", height: "44", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: {
            background: testnet
                ? 'linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)'
                : '#2C364F',
        }, children: [!testnet && (jsx("path", { d: "M25.7948 20.5826L28.2683 16.3854L34.9355 26.7696L34.9386 28.7625L34.9168 15.0491C34.9011 14.7137 34.7231 14.407 34.4391 14.2261L22.4357 7.32182C22.1551 7.1838 21.7989 7.18546 21.5187 7.32618C21.4807 7.34524 21.4453 7.36576 21.4113 7.38835L21.3694 7.41467L9.71816 14.1664L9.67298 14.1871C9.61474 14.2137 9.55609 14.2479 9.50076 14.2872C9.27983 14.4456 9.1331 14.68 9.08564 14.9425C9.07859 14.9823 9.0732 15.023 9.07092 15.064L9.08916 26.239L15.2994 16.6138C16.0811 15.3376 17.7847 14.9262 19.3662 14.9488L21.2221 14.9977L10.2862 32.5356L11.5753 33.2778L22.6422 15.0155L27.5338 14.9977L16.4956 33.7209L21.0955 36.3668L21.6451 36.6827C21.8776 36.7772 22.1516 36.7819 22.386 36.6972L34.5581 29.6433L32.2309 30.9918L25.7948 20.5826ZM26.7384 34.175L22.0925 26.8829L24.9287 22.0702L31.0303 31.6876L26.7384 34.175Z", fill: '#2D374B' })), jsx("path", { d: "M22.0924 26.8832L26.7385 34.1751L31.0302 31.6879L24.9286 22.0705L22.0924 26.8832Z", fill: fill }), jsx("path", { d: "M34.9387 28.7627L34.9356 26.7698L28.2684 16.3856L25.7949 20.5828L32.2312 30.992L34.5584 29.6435C34.7866 29.4582 34.9248 29.1861 34.9393 28.8926L34.9387 28.7627Z", fill: fill }), jsx("path", { d: "M7 30.642L10.2863 32.5356L21.2222 14.9976L19.3663 14.9487C17.785 14.9263 16.0814 15.3375 15.2995 16.6137L9.08927 26.239L7 29.449V30.642V30.642Z", fill: "white" }), jsx("path", { d: "M27.534 14.9977L22.6423 15.0155L11.5754 33.2778L15.4437 35.5049L16.4955 33.7209L27.534 14.9977Z", fill: "white" }), jsx("path", { d: "M37 14.9723C36.9592 13.9493 36.4052 13.013 35.5377 12.4677L23.377 5.47434C22.5187 5.04223 21.4466 5.04161 20.5868 5.47414C20.4852 5.52533 8.76078 12.3251 8.76078 12.3251C8.5985 12.4029 8.44224 12.4955 8.2953 12.6008C7.52081 13.156 7.0487 14.0186 7 14.9661V29.4492L9.08927 26.2392L9.07103 15.0639C9.07352 15.0231 9.0787 14.9827 9.08575 14.9431C9.133 14.6801 9.27994 14.4457 9.50086 14.2872C9.5562 14.2478 21.4806 7.34517 21.5186 7.32611C21.799 7.18538 22.155 7.18373 22.4356 7.32175L34.439 14.226C34.723 14.4069 34.901 14.7137 34.9167 15.049V28.8921C34.9022 29.1856 34.7862 29.4577 34.558 29.643L32.2308 30.9916L31.03 31.6875L26.7383 34.1747L22.3859 36.6969C22.1515 36.7817 21.8773 36.7769 21.645 36.6824L16.4955 33.7206L15.4435 35.5046L20.0713 38.169C20.2243 38.256 20.3607 38.3331 20.4726 38.3961C20.6458 38.4933 20.764 38.5582 20.8056 38.5785C21.1345 38.7383 21.6077 38.8311 22.0342 38.8311C22.4251 38.8311 22.8064 38.7594 23.1672 38.6181L35.8092 31.2971C36.5347 30.7348 36.9617 29.8869 37 28.9686V14.9723Z", fill: outlineFill })] }));
};
const Telos = ({ testnet, ...props }) => (jsx("svg", { ...props, "aria-hidden": "true", width: "44", height: "44", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: {
        background: testnet
            ? 'linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)'
            : '#571AFF',
    }, children: jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M26.1834 8.14754C25.6606 8.23504 25.3644 8.50235 24.9216 9.28591C24.5651 9.91722 24.4762 10.0244 24.2024 10.1592L23.9832 10.2668L19.2967 10.286L14.6097 10.3057L14.3875 10.3902C13.7059 10.6492 13.6192 10.7135 11.6291 12.4407C9.72243 14.0953 9.64893 14.1723 9.59249 14.5836C9.54437 14.9362 9.78981 15.6327 10.5191 17.2143C11.2847 18.8737 11.2839 18.8641 10.7444 19.5256C10.2645 20.1136 10.2269 20.2588 10.2041 21.5915C10.1717 23.502 10.2487 27.6023 10.3222 27.8591C10.3572 27.9816 10.7908 29.204 11.2861 30.5755C11.7813 31.9471 12.4192 33.715 12.704 34.5038C13.4281 36.5107 13.4814 36.5986 14.0392 36.7237C14.3066 36.7837 14.3206 36.781 18.9677 35.7258C24.4395 34.4837 23.7264 34.709 25.0739 33.7968C29.8732 30.5475 29.7337 30.66 29.8969 29.9083C30.0583 29.1642 30.1082 29.1379 31.8267 28.8999C34.6122 28.5145 34.6328 28.5083 34.8831 28.0109C35.0182 27.7423 35.7786 23.3406 35.8136 22.6209C35.8504 21.8828 36.042 22.221 33.3816 18.3395C30.022 13.4382 30.2381 13.7777 30.2399 13.4041C30.2407 13.1735 30.3366 12.9736 31.3236 11.1418C31.8236 10.2134 32.2742 9.35241 32.3254 9.22904C32.5236 8.74691 32.4204 8.3921 32.0301 8.21622L31.8267 8.12391L29.1102 8.11822C27.6048 8.11516 26.2997 8.12829 26.1834 8.14754ZM30.0474 9.4876C30.5623 9.72297 30.5382 9.82447 29.5119 11.7398C28.4317 13.7558 28.3157 13.2711 30.7154 16.7707C31.639 18.1173 32.8076 19.8218 33.3124 20.5581C34.6844 22.5592 34.6048 22.1799 34.1831 24.6903C33.7858 27.0602 33.7792 27.0817 33.3759 27.282C33.1506 27.394 33.2276 27.3813 30.8493 27.7117C28.9147 27.9803 28.8543 28.017 28.6719 29.0338C28.5778 29.557 28.4606 29.8169 28.2243 30.0247C28.0808 30.1512 24.8682 32.368 23.9451 32.9778C23.2587 33.4311 23.6861 33.3152 17.7471 34.6574C17.1997 34.7812 16.4079 34.9632 15.987 35.0617C14.4588 35.4195 14.4299 35.4033 13.8804 33.8948C12.9188 31.2528 11.6811 27.7957 11.6194 27.5787C11.5534 27.3463 11.549 27.1202 11.549 24.059V20.7878L11.6501 20.5966C11.7056 20.4912 11.8671 20.2759 12.0088 20.118C12.8418 19.19 12.8383 19.1183 11.8601 16.9907C10.7663 14.612 10.6797 14.9992 12.697 13.2501C14.2418 11.91 14.3048 11.8593 14.5905 11.7237L14.8394 11.6055L19.6983 11.5854C23.5417 11.5692 24.5891 11.5543 24.7103 11.515C25.1465 11.3728 25.4086 11.1094 25.7975 10.4203C26.3851 9.38041 26.3111 9.40797 28.4597 9.41891C29.6996 9.42547 29.9332 9.43554 30.0474 9.4876Z", fill: "#F7F5FC" }) }));
const Aurora = ({ testnet, ...props }) => (jsx("svg", { ...props, "aria-hidden": "true", width: "44", height: "44", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: {
        background: testnet
            ? 'linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)'
            : '#6CD544',
    }, children: jsx("path", { d: "M22.0006 7.292C22.6198 7.29004 23.2271 7.46144 23.754 7.7868C24.2808 8.11216 24.706 8.57848 24.9816 9.133L34.3566 27.883C34.611 28.3912 34.7312 28.956 34.7058 29.5238C34.6805 30.0915 34.5103 30.6433 34.2116 31.1268C33.9129 31.6103 33.4956 32.0094 32.9992 32.2861C32.5028 32.5629 31.9439 32.7081 31.3756 32.708H12.6256C12.0573 32.7079 11.4985 32.5626 11.0023 32.2858C10.506 32.009 10.0888 31.6099 9.79022 31.1264C9.49163 30.6429 9.3216 30.0912 9.29628 29.5235C9.27096 28.9558 9.39119 28.3911 9.64556 27.883L19.0196 9.133C19.2951 8.57848 19.7203 8.11216 20.2472 7.7868C20.774 7.46144 21.3814 7.29004 22.0006 7.292ZM22.0006 5C20.9561 4.9999 19.9322 5.29059 19.0437 5.83952C18.1551 6.38846 17.4369 7.17394 16.9696 8.108L7.59456 26.858C7.16544 27.7156 6.96271 28.6687 7.00564 29.6268C7.04856 30.5848 7.33572 31.516 7.83982 32.3318C8.34392 33.1476 9.04823 33.821 9.88584 34.288C10.7235 34.755 11.6666 35.0001 12.6256 35H31.3756C32.3345 34.9999 33.2775 34.7547 34.1149 34.2876C34.9524 33.8206 35.6566 33.1472 36.1606 32.3314C36.6645 31.5156 36.9516 30.5845 36.9945 29.6265C37.0374 28.6686 36.8346 27.7156 36.4056 26.858L27.0316 8.108C26.5642 7.17394 25.846 6.38846 24.9574 5.83952C24.0689 5.29059 23.045 4.9999 22.0006 5Z", fill: "white" }) }));
const Avalanche = ({ testnet, ...props }) => (jsxs("svg", { ...props, "aria-hidden": "true", width: "44", height: "44", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: {
        background: testnet
            ? 'linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)'
            : '#E84142',
    }, children: [jsx("path", { d: "M11.0188 32.1528H15.4825C16.5334 32.1528 17.0589 32.1528 17.5278 32.023C18.042 31.8701 18.511 31.5991 18.9009 31.2261C19.2589 30.885 19.5173 30.4328 20.0269 29.5409L20.0272 29.5404L20.0422 29.5142L25.8314 19.2804C26.3456 18.3821 26.5999 17.93 26.7129 17.4554C26.8372 16.9412 26.8372 16.3988 26.7129 15.8847C26.6007 15.4136 26.3439 14.9648 25.8373 14.0798L25.8258 14.0597L23.56 10.1045C23.0911 9.27958 22.8538 8.86711 22.5543 8.71456C22.2323 8.55071 21.848 8.55071 21.526 8.71456C21.2265 8.86711 20.9892 9.27958 20.5202 10.1045L9.49892 29.5311C9.03561 30.3447 8.80392 30.7517 8.82089 31.0849C8.84349 31.4466 9.02994 31.7743 9.33507 31.9721C9.61756 32.1528 10.0809 32.1528 11.0188 32.1528Z", fill: "white" }), jsx("path", { d: "M33.1506 32.1528H26.7547C25.8111 32.1528 25.3365 32.1528 25.0596 31.9721C24.7545 31.7743 24.5681 31.4411 24.5455 31.0794C24.5286 30.7486 24.7621 30.3456 25.2294 29.539L25.2295 29.5388L25.2404 29.5199L28.4328 24.0392C28.9018 23.2313 29.1391 22.8301 29.4329 22.6776C29.7548 22.5137 30.1336 22.5137 30.4555 22.6776C30.7472 22.8261 30.9744 23.2102 31.4241 23.9708L31.4248 23.9719L31.4613 24.0336L34.665 29.5143C34.6806 29.5413 34.696 29.5678 34.7113 29.5939L34.7113 29.594C35.1554 30.3603 35.382 30.7514 35.3657 31.0739C35.3486 31.4353 35.1566 31.7688 34.8515 31.9666C34.5689 32.1528 34.0942 32.1528 33.1506 32.1528Z", fill: "white" })] }));
const Celo = ({ testnet, ...props }) => (jsx("svg", { ...props, "aria-hidden": "true", width: "44", height: "44", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: {
        background: testnet
            ? 'linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)'
            : '#FCFE72',
    }, children: jsx("path", { d: "M9 9H34.5183V18.112H30.3564C28.896 14.7687 25.6102 12.4171 21.777 12.4171C16.593 12.4171 12.3948 16.6422 12.3948 21.823C12.3948 27.0039 16.593 31.2654 21.777 31.2654C25.5373 31.2654 28.8231 28.9876 30.2829 25.7172H34.5178V34.682H9V9Z", fill: testnet ? '#ffffff' : 'black' }) }));
const Gnosis = ({ testnet, ...props }) => (jsx("svg", { ...props, "aria-hidden": "true", width: "44", height: "44", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: {
        background: testnet
            ? 'linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)'
            : '#009CB4',
    }, children: jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12.3439 11.8664C17.9374 6.53462 26.7953 6.74397 32.1271 12.3374C32.4738 12.7038 32.8075 13.0832 33.1084 13.4823L22 24.5972L10.8916 13.4823C11.1991 13.0832 11.5262 12.7038 11.8729 12.3374C12.0234 12.1804 12.1804 12.0234 12.3439 11.8664ZM30.6094 13.3972C28.3196 11.0944 25.271 9.83182 22 9.83182C18.729 9.83182 15.6804 11.0944 13.3907 13.3972L22 22.0066L30.6094 13.3972ZM33.9785 14.7446L31.7215 17.0016C33.5402 19.1801 33.2523 22.425 31.0738 24.2437C29.1636 25.84 26.3897 25.84 24.4794 24.2437L22 26.7231L19.5271 24.2502C17.3486 26.0689 14.1037 25.7811 12.285 23.6026C10.6888 21.6923 10.6888 18.9185 12.285 17.0082L11.1271 15.8502L10.028 14.7446C8.7 16.9297 8 19.4418 8 21.9998C8 29.7325 14.2673 35.9998 22 35.9998C29.7327 35.9998 36 29.7325 36 21.9998C36.0065 19.4418 35.3 16.9297 33.9785 14.7446ZM30.6486 18.0747C31.1392 18.7093 31.4075 19.4943 31.4075 20.299C31.4075 21.1037 31.1392 21.8887 30.6486 22.5233C29.4187 24.113 27.1355 24.4074 25.5458 23.1775L30.6486 18.0747ZM18.4542 23.1839C17.8196 23.6745 17.0346 23.9427 16.2299 23.9427C15.4252 23.9427 14.6467 23.6745 14.0056 23.1904C12.4159 21.9605 12.1215 19.6708 13.3514 18.0811L18.4542 23.1839Z", fill: "white" }) }));
const Evmos = ({ testnet, ...props }) => (jsx("svg", { ...props, "aria-hidden": "true", width: "44", height: "44", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: {
        background: testnet
            ? 'linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)'
            : '#2D2A25',
    }, children: jsx("path", { d: "M18.4916 12.6668C12.9416 14.806 12.4332 20.2846 10.8418 22.8432C9.23155 25.4322 5.54251 26.8607 6.04698 28.1801C6.55143 29.4994 10.2449 28.0824 13.1669 28.9242C16.0543 29.7561 20.0831 33.4862 25.633 31.3469C28.4603 30.2573 30.5076 28.0143 31.449 25.3574C31.5502 25.0723 31.361 24.7673 31.0606 24.7391C30.874 24.7215 30.6948 24.8196 30.6106 24.9877C29.759 26.6908 28.2981 28.0934 26.3864 28.8301C23.2303 30.0465 19.777 29.0915 17.6562 26.6961C17.1746 26.1522 16.7626 25.533 16.4374 24.8487C16.348 24.6603 16.2629 24.4689 16.1875 24.2708C16.1117 24.0728 16.0473 23.8735 15.9881 23.6732C17.6562 22.8925 19.5812 22.0656 21.7635 21.2246C23.903 20.3999 25.8505 19.731 27.5841 19.1958C28.7571 18.8341 29.8322 18.5331 30.8029 18.2871C30.8732 18.2695 30.9423 18.2519 31.0112 18.2347C31.158 18.1982 31.3088 18.2769 31.363 18.4186L31.364 18.4213C31.396 18.5053 31.4236 18.5898 31.4535 18.6743C31.6453 19.2196 31.7892 19.7706 31.8841 20.3229C31.9258 20.5645 32.1888 20.6961 32.4044 20.5799C33.2014 20.1504 33.9302 19.7314 34.5814 19.3283C37.0083 17.8276 38.3538 16.5549 38.0776 15.8336C37.802 15.1119 35.9541 15.0705 33.1503 15.5854C32.2593 15.7491 31.2716 15.9691 30.207 16.2416C30.0229 16.2886 29.8365 16.3375 29.6481 16.3877C28.7522 16.6262 27.8073 16.8995 26.8234 17.2053C24.9936 17.7744 23.0305 18.4561 21.0038 19.2372C19.1078 19.9682 17.3109 20.726 15.6629 21.4812C15.6428 18.2761 17.5725 15.2461 20.7286 14.0297C22.6399 13.293 24.6605 13.3533 26.4285 14.0473C26.6029 14.116 26.8015 14.0684 26.9291 13.9298C27.1331 13.7076 27.0706 13.3537 26.8053 13.2094C24.3353 11.8685 21.319 11.5771 18.4916 12.6668Z", fill: "#FAF1E4" }) }));
const BinanceSmartChain = ({ testnet, ...props }) => (jsxs("svg", { ...props, "aria-hidden": "true", width: "44", height: "44", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: {
        background: testnet
            ? 'linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)'
            : '#16181A',
    }, children: [jsx("path", { d: "M16.0445 19.6063L21.8705 13.7805L27.6996 19.6093L31.0896 16.2193L21.8705 7L12.6545 16.2163L16.0445 19.6063Z", fill: testnet ? '#fff' : '#F3BA2F' }), jsx("path", { d: "M13.6505 21.9995L10.2606 18.6096L6.87046 21.9997L10.2604 25.3896L13.6505 21.9995Z", fill: testnet ? '#fff' : '#F3BA2F' }), jsx("path", { d: "M16.0445 24.3937L21.8705 30.2195L27.6994 24.3909L31.0913 27.779L31.0896 27.7809L21.8705 37L12.6542 27.7839L12.6495 27.7792L16.0445 24.3937Z", fill: testnet ? '#fff' : '#F3BA2F' }), jsx("path", { d: "M33.4808 25.3911L36.8709 22.001L33.481 18.6111L30.0909 22.0012L33.4808 25.3911Z", fill: testnet ? '#fff' : '#F3BA2F' }), jsx("path", { d: "M25.3091 21.9982H25.3105L21.8705 18.5582L19.3283 21.1004H19.3281L19.0362 21.3926L18.4336 21.9951L18.4289 21.9999L18.4336 22.0048L21.8705 25.4418L25.3105 22.0018L25.3122 21.9999L25.3091 21.9982Z", fill: testnet ? '#fff' : '#F3BA2F' })] }));
const Canto = ({ testnet, ...props }) => (jsx("svg", { ...props, "aria-hidden": "true", width: "44", height: "44", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: {
        background: testnet
            ? 'linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)'
            : 'white',
    }, children: jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M35 8V36H9L13.875 35.9998V31.0586H9V12.9412H13.875V8H35ZM17.9373 12.9414H30.1247V17.8826H17.9373V12.9414ZM30.1247 26.9414H17.9373V17.8826L13.0623 17.8828V26.9416L17.9373 26.9414V31.8826H30.1247V26.9414Z", fill: "#06FC99" }) }));
const Fantom = ({ testnet, ...props }) => (jsx("svg", { ...props, "aria-hidden": "true", width: "44", height: "44", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: {
        background: testnet
            ? 'linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)'
            : '#0911EF',
    }, children: jsx("path", { d: "M20.92 9.25864C21.5933 8.91379 22.6178 8.91379 23.2911 9.25864L30.1616 12.7775C30.5671 12.9852 30.7898 13.2947 30.8297 13.6142H30.8363V31.302C30.8274 31.6504 30.6025 31.9966 30.1616 32.2225L23.2911 35.7413C22.6178 36.0862 21.5933 36.0862 20.92 35.7413L14.0495 32.2225C13.6104 31.9976 13.3997 31.6489 13.3893 31.302C13.3883 31.2678 13.3881 31.2393 13.3891 31.2157L13.3891 13.7278C13.3884 13.7086 13.3883 13.6895 13.3889 13.6705L13.3893 13.6142L13.3924 13.6142C13.4229 13.2912 13.6355 12.9896 14.0495 12.7775L20.92 9.25864ZM29.7547 23.4821L23.2911 26.7926C22.6178 27.1374 21.5933 27.1374 20.92 26.7926L14.4706 23.4895V31.2669L20.92 34.5527C21.2842 34.7415 21.6622 34.9254 22.0318 34.9488L22.1056 34.9512C22.4907 34.9524 22.8646 34.7628 23.2438 34.5833L29.7547 31.2387V23.4821ZM11.3214 31.8437C11.3214 32.5212 11.4026 32.9667 11.5639 33.2806C11.6976 33.5407 11.8981 33.7394 12.2643 33.9813L12.2852 33.9951C12.3656 34.0476 12.4541 34.1026 12.5619 34.1672L12.689 34.2427L13.0792 34.4711L12.5195 35.3685L12.0827 35.1126L12.0093 35.0689C11.883 34.9932 11.7783 34.9284 11.6807 34.8645C10.637 34.1822 10.2478 33.4384 10.2401 31.8907L10.24 31.8437H11.3214ZM21.5647 18.7412C21.5147 18.7579 21.4678 18.7772 21.4251 18.7991L14.5546 22.318C14.5474 22.3216 14.5405 22.3253 14.534 22.3289L14.5281 22.3322L14.5389 22.3382L14.5546 22.3464L21.4251 25.8653C21.4678 25.8872 21.5147 25.9065 21.5647 25.9231V18.7412ZM22.6465 18.7412V25.9231C22.6965 25.9065 22.7433 25.8872 22.7861 25.8653L29.6566 22.3464C29.6638 22.3427 29.6707 22.3391 29.6772 22.3355L29.683 22.3322L29.6722 22.3262L29.6566 22.318L22.7861 18.7991C22.7433 18.7772 22.6965 18.7579 22.6465 18.7412ZM29.7547 14.8689L23.5915 18.0256L29.7547 21.1822V14.8689ZM14.4706 14.8763V21.1749L20.6195 18.0256L14.4706 14.8763ZM22.7861 10.1859C22.4288 10.0029 21.7824 10.0029 21.4251 10.1859L14.5546 13.7048C14.5474 13.7085 14.5405 13.7122 14.534 13.7158L14.5281 13.719L14.5389 13.725L14.5546 13.7333L21.4251 17.2522C21.7824 17.4352 22.4288 17.4352 22.7861 17.2522L29.6566 13.7333C29.6638 13.7296 29.6707 13.7259 29.6772 13.7223L29.683 13.719L29.6722 13.7131L29.6566 13.7048L22.7861 10.1859ZM31.7205 9.64552L32.1573 9.90132L32.2307 9.94503C32.357 10.0206 32.4616 10.0856 32.5593 10.1494C33.603 10.8317 33.9922 11.5756 33.9998 13.1231L34 13.1703H32.9186C32.9186 12.4926 32.8373 12.0472 32.6761 11.7334C32.5424 11.4733 32.3419 11.2745 31.9757 11.0327L31.9547 11.0189C31.8744 10.9664 31.7858 10.9113 31.6781 10.8466L31.551 10.7712L31.1608 10.5428L31.7205 9.64552Z", fill: "white" }) }));
const Filecoin = ({ testnet, ...props }) => (jsx("svg", { ...props, "aria-hidden": "true", width: "44", height: "44", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: {
        background: testnet
            ? 'linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)'
            : '#0090FF',
    }, children: jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M23.75 19.3069L23.15 22.5069L28.85 23.3069L28.45 24.8069L22.85 24.0069C22.45 25.3069 22.25 26.7069 21.75 27.9069C21.25 29.3069 20.75 30.7069 20.15 32.0069C19.35 33.7069 17.95 34.9069 16.05 35.2069C14.95 35.4069 13.75 35.3069 12.85 34.6069C12.55 34.4069 12.25 34.0069 12.25 33.7069C12.25 33.3069 12.45 32.8069 12.75 32.6069C12.95 32.5069 13.45 32.6069 13.75 32.7069C14.05 33.0069 14.35 33.4069 14.55 33.8069C15.15 34.6069 15.95 34.7069 16.75 34.1069C17.65 33.3069 18.15 32.2069 18.45 31.1069C19.05 28.7069 19.65 26.4069 20.15 24.0069V23.6069L14.85 22.8069L15.05 21.3069L20.55 22.1069L21.25 19.0069L15.55 18.1069L15.75 16.5069L21.65 17.3069C21.85 16.7069 21.95 16.2069 22.15 15.7069C22.65 13.9069 23.15 12.1069 24.35 10.5069C25.55 8.90687 26.95 7.90687 29.05 8.00687C29.95 8.00687 30.85 8.30687 31.45 9.00687C31.55 9.10687 31.75 9.30687 31.75 9.50687C31.75 9.90687 31.75 10.4069 31.45 10.7069C31.05 11.0069 30.55 10.9069 30.15 10.5069C29.85 10.2069 29.65 9.90687 29.35 9.60687C28.75 8.80687 27.85 8.70687 27.15 9.40687C26.65 9.90687 26.15 10.6069 25.85 11.3069C25.15 13.4069 24.65 15.6069 23.95 17.8069L29.45 18.6069L29.05 20.1069L23.75 19.3069Z", fill: "white" }) }));
const IoTeX = ({ testnet, ...props }) => (jsxs("svg", { ...props, "aria-hidden": "true", width: "44", height: "44", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: {
        background: testnet
            ? 'linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)'
            : '#00D4D5',
    }, children: [jsx("path", { d: "M23.7136 6.875V14.3784L30.2284 10.6315L23.7136 6.875Z", fill: "white" }), jsx("path", { opacity: "0.9", d: "M30.2284 10.6316V18.135L36.7418 14.3785L30.2284 10.6316Z", fill: "white" }), jsx("path", { opacity: "0.8", d: "M23.7136 14.3784V21.8818L30.2284 18.1349L23.7136 14.3784ZM30.2284 18.1349V25.6383L36.7417 21.8818L30.2284 18.1349Z", fill: "white" }), jsx("path", { opacity: "0.8", d: "M23.7136 21.8817V29.385L30.2284 25.6382L23.7136 21.8817Z", fill: "white" }), jsx("path", { d: "M30.2284 25.6382V33.1416L36.7418 29.3851L30.2284 25.6382Z", fill: "white" }), jsx("path", { opacity: "0.4", d: "M6.87537 14.1253V21.6287L13.3901 17.8722L6.87537 14.1253Z", fill: "white" }), jsx("path", { opacity: "0.2", d: "M15.0938 16.9153V24.4186L21.5975 20.6718L15.0938 16.9153Z", fill: "white" }), jsx("path", { opacity: "0.3", d: "M10.2648 21.6604V29.1638L16.7781 25.4073L10.2648 21.6604Z", fill: "white" }), jsx("path", { opacity: "0.9", d: "M14.5575 27.3226V34.826L21.0612 31.0695L14.5575 27.3226Z", fill: "white" }), jsx("path", { opacity: "0.7", d: "M23.66 30.5525V38.0572L30.1637 34.2993L23.66 30.5525Z", fill: "white" }), jsx("path", { opacity: "0.9", d: "M16.1786 13.2097V20.7145L22.6824 16.9676L16.1786 13.2097Z", fill: "white" }), jsx("path", { opacity: "0.8", d: "M23.7136 6.875V14.3784L17.1989 10.6315L23.7136 6.875Z", fill: "white" }), jsx("path", { opacity: "0.6", d: "M16.1786 10.0649V17.5669L9.66248 13.8104L16.1786 10.0649Z", fill: "white" }), jsx("path", { opacity: "0.6", d: "M22.6934 13.7775V21.2823L16.1786 17.5244L22.6934 13.7775Z", fill: "white" }), jsx("path", { opacity: "0.95", d: "M15.0635 16.9153V24.4186L8.54877 20.6718L15.0635 16.9153Z", fill: "white" }), jsx("path", { opacity: "0.6", d: "M23.7136 21.8817V29.385L17.2099 25.6382L23.7136 21.8817Z", fill: "white" }), jsx("path", { opacity: "0.55", d: "M10.2648 23.6295V31.1328L3.75 27.375L10.2648 23.6295Z", fill: "white" }), jsx("path", { d: "M36.7418 14.3784V21.8818L30.2284 18.1349L36.7418 14.3784Z", fill: "white" }), jsx("path", { opacity: "0.95", d: "M30.2284 18.1362V25.6382L23.7136 21.8817L30.2284 18.1362Z", fill: "white" }), jsx("path", { opacity: "0.9", d: "M36.7418 21.8817V29.385L30.2284 25.6382L36.7418 21.8817Z", fill: "white" }), jsx("path", { opacity: "0.7", d: "M30.2284 25.6382V33.1416L23.7136 29.3851L30.2284 25.6382Z", fill: "white" }), jsx("path", { opacity: "0.4", d: "M22.2712 28.7651V36.2684L15.7579 32.5216L22.2712 28.7651Z", fill: "white" }), jsx("path", { d: "M30.2284 10.6316V18.135L23.7136 14.3785L30.2284 10.6316Z", fill: "white" })] }));
const Metis = ({ testnet, ...props }) => (jsx("svg", { ...props, "aria-hidden": "true", width: "44", height: "44", viewBox: "0 0 44 44", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: {
        background: testnet
            ? 'linear-gradient(180deg, #8995A9 0%, #424D5F 99.48%)'
            : '#2F3140',
    }, children: jsx("path", { d: "M37.5175 22.0531C37.4579 19.2923 36.6563 16.5985 35.1968 14.2542C33.7374 11.91 31.674 10.0017 29.223 8.72965C26.772 7.45759 24.0238 6.86863 21.2668 7.02455C18.5098 7.18047 15.8456 8.07553 13.5537 9.61582C11.2617 11.1561 9.42659 13.2849 8.24079 15.7787C7.05498 18.2725 6.56222 21.0396 6.81419 23.7895C7.06617 26.5394 8.05359 29.1708 9.67288 31.4076C11.2922 33.6444 13.4836 35.4042 16.0173 36.5023C16.7657 35.3775 17.3385 34.1453 17.716 32.848C18.0245 32.0632 18.3595 31.2913 18.7067 30.5446C19.5444 30.7955 20.4345 30.8143 21.282 30.5989C22.1295 30.3835 22.9026 29.942 23.5188 29.3215L23.5704 29.2699C22.8136 28.9884 21.9979 28.9032 21.1993 29.022C20.4006 29.1408 19.6451 29.4598 19.0029 29.9494C19.4276 29.0613 19.891 28.1997 20.3667 27.3632C21.189 27.6541 22.075 27.7156 22.9296 27.541C23.7842 27.3665 24.5751 26.9626 25.2175 26.3726L25.2692 26.3209C24.538 26.0116 23.7416 25.8885 22.9513 25.9626C22.1609 26.0368 21.4013 26.3058 20.7404 26.7456C21.216 25.9608 21.7053 25.1889 22.2203 24.468C23.0713 24.6915 23.9672 24.6777 24.811 24.4282C25.6547 24.1787 26.414 23.703 27.0066 23.0526L27.0453 23.001C26.3425 22.7718 25.5958 22.7106 24.8651 22.8224C24.1344 22.9341 23.4401 23.2157 22.838 23.6444C22.8767 23.5928 22.9283 23.5289 22.9664 23.4773C23.2749 23.0784 23.5969 22.6796 23.9177 22.2936C24.8969 21.9731 25.7703 21.3916 26.4436 20.6117C27.117 19.8318 27.5649 18.883 27.7391 17.8674L27.752 17.79H27.7391C26.7194 18.0552 25.7944 18.6007 25.0689 19.3648C24.3434 20.1288 23.8464 21.0808 23.6343 22.1129C23.3258 22.4859 23.0167 22.8603 22.7211 23.2449C22.9706 22.5925 23.0724 21.893 23.0191 21.1966C22.9657 20.5002 22.7586 19.8243 22.4126 19.2176L22.3739 19.2692C21.8489 19.9862 21.5326 20.8345 21.4599 21.7201C21.3873 22.6058 21.5611 23.4942 21.9621 24.2872C21.4729 24.9823 20.9972 25.6897 20.5467 26.4357C20.6918 25.6858 20.6542 24.9118 20.4369 24.1795C20.2196 23.4471 19.8291 22.7779 19.2985 22.2284L19.2727 22.2929C18.9445 23.1107 18.8477 24.0031 18.9929 24.8723C19.1382 25.7415 19.5199 26.5539 20.0962 27.2205C19.6457 28.0054 19.2211 28.816 18.8093 29.6524C18.9344 28.8712 18.8712 28.0715 18.6251 27.3196C18.3789 26.5677 17.9568 25.8855 17.3939 25.3295L17.3681 25.3941C17.0745 26.2514 17.0201 27.1724 17.2105 28.0583C17.401 28.9442 17.8292 29.7614 18.4492 30.4223C18.1774 31.0012 17.9219 31.5774 17.6773 32.1849C17.61 32.1231 17.5313 32.0751 17.4456 32.0435C17.0066 31.916 16.5867 31.7299 16.1974 31.4904C15.8754 31.2994 15.5337 31.144 15.1781 31.027C13.7886 30.5765 13.9945 29.9079 13.2756 28.5564C13.0416 28.2781 12.7931 28.0125 12.5309 27.7607C12.2876 27.603 12.0884 27.386 11.9519 27.1302C11.7934 26.8107 11.6931 26.4656 11.6557 26.1109C11.6514 25.9148 11.5858 25.7249 11.4681 25.5679C11.3504 25.4109 11.1864 25.2948 10.9993 25.2358C8.95338 24.5284 9.86728 21.8778 9.94406 21.5299C9.91262 21.08 9.81271 20.6375 9.64781 20.2178C9.63057 20.1632 9.61763 20.1073 9.60908 20.0506C9.55449 19.776 9.56444 19.4924 9.63813 19.2223C9.71183 18.9521 9.84726 18.7028 10.0338 18.4939C10.2784 18.2493 11.1277 17.8505 11.3078 17.6188C11.4879 17.387 11.6163 17.1295 11.797 16.9114C12.3687 16.3412 13.0291 15.8675 13.7526 15.509C14.3444 15.1876 14.4477 14.364 14.6787 14.1065C15.0647 13.6689 15.6565 13.6689 16.0941 13.283C16.3129 13.09 16.6377 12.9867 16.8415 12.7815C17.8692 11.8403 19.1644 11.2423 20.5474 11.0706C21.5064 10.9924 22.4717 11.0795 23.4012 11.3281C23.5358 11.3507 23.669 11.3809 23.8001 11.4185C25.9228 11.4959 28.4709 11.9328 29.397 12.8338C29.8555 13.2744 30.1961 13.8229 30.3877 14.4293C30.5382 14.8988 30.7456 15.3481 31.0054 15.7672L31.5714 16.6933C31.932 17.2773 32.0475 17.9801 31.8928 18.6489C31.7885 18.974 31.7795 19.3223 31.8669 19.6525C32.1655 20.1031 32.5152 20.5177 32.9093 20.8878C33.0658 21.0427 33.2382 21.1807 33.4236 21.2995C33.8592 21.5594 34.2802 21.8429 34.6848 22.1489C34.698 22.2729 34.6775 22.3982 34.6254 22.5115C34.5732 22.6247 34.4914 22.7218 34.3885 22.7924C34.0284 23.1137 33.3333 23.6159 33.3333 23.6159C33.3584 23.758 33.4016 23.8964 33.4617 24.0276C33.5643 24.2077 33.796 24.4911 33.7192 24.735C33.6424 24.9789 33.1403 25.1855 33.2816 25.4552C33.423 25.7386 33.7831 25.8154 33.6805 26.0729C33.5779 26.3175 33.0757 26.7524 33.1274 26.9352C33.179 27.1179 33.5908 28.8377 32.6382 29.1353C31.4592 29.3685 30.2627 29.5019 29.0614 29.5342C28.8675 29.5454 28.6797 29.6055 28.5155 29.709C28.3513 29.8125 28.216 29.956 28.1223 30.126C27.9399 30.4661 27.8222 30.837 27.7751 31.22C27.4275 32.5896 26.9671 33.928 26.3985 35.2215C26.3985 35.2215 26.3597 35.2989 26.3081 35.4144C26.1833 35.6687 26.1048 35.9432 26.0764 36.2251C26.1573 36.4321 26.2799 36.6204 26.4365 36.7782C26.519 36.8726 26.6271 36.9411 26.7477 36.9753C26.8683 37.0096 26.9962 37.0081 27.116 36.9711C30.1997 35.8965 32.8655 33.8757 34.7332 31.197C36.601 28.5182 37.5754 25.3182 37.5175 22.0531Z", fill: testnet ? '#ffffff' : '#00DACC' }) }));
var Chains = {
    UnknownChain,
    Ethereum,
    Polygon,
    Optimism,
    Arbitrum,
    Aurora,
    Avalanche,
    Celo,
    Telos,
    Gnosis,
    Evmos,
    BinanceSmartChain,
    Foundry: KnownChain,
    Sepolia: KnownChain,
    Taraxa: KnownChain,
    zkSync: KnownChain,
    Flare: KnownChain,
    Canto,
    Fantom,
    Filecoin,
    Metis,
    IoTeX,
};

const supportedChains = [
    {
        id: 1,
        name: 'Ethereum',
        logo: jsx(Chains.Ethereum, {}),
    },
    {
        id: 3,
        name: 'Rinkeby',
        logo: jsx(Chains.Ethereum, { testnet: true }),
    },
    {
        id: 4,
        name: 'Ropsten',
        logo: jsx(Chains.Ethereum, { testnet: true }),
    },
    {
        id: 5,
        name: 'Görli',
        logo: jsx(Chains.Ethereum, { testnet: true }),
    },
    {
        id: 42,
        name: 'Kovan',
        logo: jsx(Chains.Ethereum, { testnet: true }),
    },
    {
        id: 10,
        name: 'Optimism',
        logo: jsx(Chains.Optimism, {}),
    },
    {
        id: 69,
        name: 'Optimism Kovan',
        logo: jsx(Chains.Optimism, { testnet: true }),
    },
    {
        id: 420,
        name: 'Optimism Goerli',
        logo: jsx(Chains.Optimism, { testnet: true }),
    },
    {
        id: 137,
        name: 'Polygon',
        logo: jsx(Chains.Polygon, {}),
    },
    {
        id: 80001,
        name: 'Polygon Mumbai',
        logo: jsx(Chains.Polygon, { testnet: true }),
    },
    {
        id: 31337,
        name: 'Hardhat',
        logo: jsx(Chains.Ethereum, { testnet: true }),
    },
    {
        id: 1337,
        name: 'Localhost',
        logo: jsx(Chains.Ethereum, { testnet: true }),
    },
    {
        id: 42161,
        name: 'Arbitrum',
        logo: jsx(Chains.Arbitrum, {}),
    },
    {
        id: 421611,
        name: 'Arbitrum Rinkeby',
        logo: jsx(Chains.Arbitrum, { testnet: true }),
    },
    {
        id: 421613,
        name: 'Arbitrum Goerli',
        logo: jsx(Chains.Arbitrum, { testnet: true }),
    },
    {
        id: 40,
        name: 'Telos',
        logo: jsx(Chains.Telos, {}),
    },
    {
        id: 41,
        name: 'Telos Testnet',
        logo: jsx(Chains.Telos, { testnet: true }),
    },
    {
        id: 1313161554,
        name: 'Aurora',
        logo: jsx(Chains.Aurora, {}),
    },
    {
        id: 1313161555,
        name: 'Aurora Testnet',
        logo: jsx(Chains.Aurora, { testnet: true }),
    },
    {
        id: 43114,
        name: 'Avalanche',
        logo: jsx(Chains.Avalanche, {}),
    },
    {
        id: 43113,
        name: 'Avalanche Fuji',
        logo: jsx(Chains.Avalanche, { testnet: true }),
    },
    {
        id: 31337,
        name: 'Foundry',
        logo: jsx(Chains.Foundry, { testnet: true }),
    },
    {
        id: 100,
        name: 'Gnosis',
        logo: jsx(Chains.Gnosis, {}),
    },
    {
        id: 9001,
        name: 'Evmos',
        logo: jsx(Chains.Evmos, {}),
    },
    {
        id: 9000,
        name: 'Evmos Testnet',
        logo: jsx(Chains.Evmos, { testnet: true }),
    },
    {
        id: 56,
        name: 'BNB Smart Chain',
        logo: jsx(Chains.BinanceSmartChain, {}),
    },
    {
        id: 97,
        name: 'Binance Smart Chain Testnet',
        logo: jsx(Chains.BinanceSmartChain, { testnet: true }),
    },
    {
        id: 11155111,
        name: 'Sepolia',
        logo: jsx(Chains.Sepolia, {}),
    },
    {
        id: 841,
        name: 'Taraxa',
        logo: jsx(Chains.Taraxa, {}),
    },
    {
        id: 842,
        name: 'Taraxa Testnet',
        logo: jsx(Chains.Taraxa, { testnet: true }),
    },
    {
        id: 324,
        name: 'zkSync',
        logo: jsx(Chains.zkSync, {}),
    },
    {
        id: 280,
        name: 'zkSync Testnet',
        logo: jsx(Chains.zkSync, { testnet: true }),
    },
    {
        id: 42220,
        name: 'Celo',
        logo: jsx(Chains.Celo, {}),
    },
    {
        id: 44787,
        name: 'Celo Alfajores',
        logo: jsx(Chains.Celo, { testnet: true }),
    },
    {
        id: 7700,
        name: 'Canto',
        logo: jsx(Chains.Canto, {}),
    },
    {
        id: 250,
        name: 'Fantom',
        logo: jsx(Chains.Fantom, {}),
    },
    {
        id: 4002,
        name: 'Fantom Testnet',
        logo: jsx(Chains.Fantom, { testnet: true }),
    },
    {
        id: 14,
        name: 'Flare',
        logo: jsx(Chains.Flare, {}),
    },
    {
        id: 114,
        name: 'Coston2',
        logo: jsx(Chains.Flare, {}),
    },
    {
        id: 314,
        name: 'Filecoin',
        logo: jsx(Chains.Filecoin, {}),
    },
    {
        id: 3141,
        name: 'Filecoin Hyperspace',
        logo: jsx(Chains.Filecoin, { testnet: true }),
    },
    {
        id: 314159,
        name: 'Filecoin Calibration',
        logo: jsx(Chains.Filecoin, { testnet: true }),
    },
    {
        id: 1088,
        name: 'Metis',
        logo: jsx(Chains.Metis, {}),
    },
    {
        id: 599,
        name: 'Metis Goerli',
        logo: jsx(Chains.Metis, { testnet: true }),
    },
    {
        id: 4689,
        name: 'IoTeX',
        logo: jsx(Chains.IoTeX, {}),
    },
    {
        id: 4690,
        name: 'IoTeX Testnet',
        logo: jsx(Chains.IoTeX, { testnet: true }),
    },
];

const SwitchNetworksContainer = styled.div `
  display: flex;
  flex-direction: column;

  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    flex-direction: column-reverse;
  }
`;
const ChainIcon = styled(motion.div) `
  display: block;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  background: var(--ck-body-background);
  svg {
    border-radius: inherit;
    display: block;
    position: relative;
    transform: translate3d(0, 0, 0);
    width: 100%;
    height: auto;
  }
  ${(props) => props.$empty &&
    css `
      display: flex;
      align-items: center;
      justify-content: center;
      &:before {
        content: '?';
        color: var(--ck-body-color-muted);
        font-weight: bold;
        font-family: var(--ck-font-family);
      }
    `}
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    border-radius: 16px;
    width: 32px;
    height: 32px;
  }
`;
const ChainLogoContainer = styled(motion.div) `
  position: relative;
`;
const ChainLogoSpinner = styled(motion.div) `
  position: absolute;
  inset: -6px;
  animation: rotateSpinner 1200ms linear infinite;
  pointer-events: none;
  svg {
    display: block;
    position: relative;
    transform: translate3d(0, 0, 0);
    width: 100%;
    height: auto;
  }
  @keyframes rotateSpinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
const ChainButtonContainer = styled.div `
  position: relative;
  margin: -8px -8px;
  &:after {
    border-radius: var(--border-radius, 0);
    z-index: 2;
    content: '';
    pointer-events: none;
    position: absolute;
    inset: 0 2px;
    box-shadow: inset 0 16px 8px -12px var(--background, var(--ck-body-background)),
      inset 0 -16px 8px -12px var(--background, var(--ck-body-background));
  }
`;
const ChainButtons = styled(motion.div) `
  padding: 8px;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 242px;

  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }

  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    padding: 8px 14px;
    margin: 2px -2px 0;
    max-height: 60vh;
  }
`;
const ChainButton = styled(motion.button) `
  appearance: none;
  cursor: pointer;
  user-select: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-radius: 11px;
  margin: 0 0 1px;
  padding: 8px 0;
  padding-right: 154px;
  font-size: 15px;
  line-height: 18px;
  font-weight: 500;
  text-decoration: none;
  color: var(--ck-body-color);
  background: none;
  white-space: nowrap;
  transition: transform 100ms ease, background-color 100ms ease;
  transform: translateZ(0px);
  &:before {
    content: '';
    background: currentColor;
    position: absolute;
    z-index: -1;
    inset: 0 var(--ck-dropdown-active-inset, -8px);
    border-radius: var(--ck-dropdown-active-border-radius, 12px);
    opacity: 0;
    transition: opacity 180ms ease;
  }
  &:after {
    content: '';
    position: absolute;
    z-index: -1;
    inset: 0 var(--ck-dropdown-active-inset, -8px);
    border-radius: 12px;
    opacity: 0;
    transition: opacity 180ms ease;
    outline: 2px solid var(--ck-focus-color);
  }
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    font-size: 17px;
    padding: 8px 0;
  }
  @media only screen and (min-width: ${defaultTheme.mobileWidth}px) {
    &:hover {
      &:before {
        transition-duration: 80ms;
        opacity: 0.05;
      }
    }
  }
  &:active {
    transform: scale(0.99) translateZ(0px);
  }
  &:disabled {
    //opacity: 0.4;
    pointer-events: none;
  }
  &:focus-visible {
    outline: none !important;
    &:after {
      opacity: 1;
    }
  }
  ${(props) => props.$variant === 'secondary' &&
    css `
      padding: 12px 4px;
      margin: 0 0 8px;
      &:last-child {
        margin-bottom: 0;
      }
      &:before {
        opacity: 0.05;
      }
      &:hover:before {
        opacity: 0.1;
      }
    `}
`;
const ChainButtonStatus = styled(motion.div) `
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--ck-body-color-muted);
  font-size: 15px;
  line-height: 18px;
  font-weight: 500;
  padding-right: 4px;
  span {
    display: block;
    position: relative;
  }
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    font-size: 17px;
    padding: 0;
  }
`;
const ChainButtonBg = styled(motion.div) `
  position: absolute;
  z-index: -1;
  inset: 0 var(--ck-dropdown-active-inset, -8px);
  background: var(--ck-dropdown-active-background, rgba(26, 136, 248, 0.1));
  box-shadow var(--ck-dropdown-active-box-shadow);
  border-radius: var(--ck-dropdown-active-border-radius, 12px);
  
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    inset: 0 var(--ck-dropdown-active-inset, -8px);
  }
`;

const Spinner$1 = (jsxs("svg", { "aria-hidden": "true", width: "36", height: "36", viewBox: "0 0 36 36", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2 16.75C2.69036 16.75 3.25 17.3096 3.25 18V19C3.25 26.5939 9.40609 32.75 17 32.75V35.25C8.02537 35.25 0.75 27.9746 0.75 19V18C0.75 17.3096 1.30964 16.75 2 16.75Z", fill: "url(#paint0_linear_1288_18701)" }), jsx("defs", { children: jsxs("linearGradient", { id: "paint0_linear_1288_18701", x1: "2", y1: "19.4884", x2: "16.8752", y2: "33.7485", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { stopColor: "var(--ck-spinner-color)" }), jsx("stop", { offset: "1", stopColor: "var(--ck-spinner-color)", stopOpacity: "0" })] }) })] }));
const ChainSelectList = ({ variant, }) => {
    const { connector } = useAccount();
    const { chain, chains } = useNetwork();
    const { status, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork();
    const locales = useLocales({});
    const mobile = isMobile();
    const disabled = status === 'error' || !switchNetwork;
    const handleSwitchNetwork = (chainId) => {
        if (switchNetwork) {
            switchNetwork(chainId);
        }
    };
    return (jsxs(SwitchNetworksContainer, { style: { marginBottom: switchNetwork ? -8 : 0 }, children: [jsx(ChainButtonContainer, { children: jsx(ChainButtons, { children: chains.map((x) => {
                        var _a;
                        const c = supportedChains.find((ch) => ch.id === x.id);
                        const ch = { ...c, ...x };
                        return (jsxs(ChainButton, { "$variant": variant, disabled: disabled ||
                                ch.id === (chain === null || chain === void 0 ? void 0 : chain.id) ||
                                (isLoading && pendingChainId === ch.id), onClick: () => handleSwitchNetwork === null || handleSwitchNetwork === void 0 ? void 0 : handleSwitchNetwork(ch.id), style: {
                                opacity: disabled && ch.id !== (chain === null || chain === void 0 ? void 0 : chain.id) ? 0.4 : undefined,
                            }, children: [jsxs("span", { style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        gap: 12,
                                        color: ch.id === (chain === null || chain === void 0 ? void 0 : chain.id)
                                            ? 'var(--ck-dropdown-active-color, inherit)'
                                            : 'inherit',
                                    }, children: [jsxs(ChainLogoContainer, { children: [jsx(ChainLogoSpinner, { initial: { opacity: 0 }, animate: {
                                                        opacity: isLoading && pendingChainId === ch.id ? 1 : 0,
                                                    }, transition: {
                                                        ease: [0.76, 0, 0.24, 1],
                                                        duration: 0.15,
                                                        delay: 0.1,
                                                    }, children: jsx(motion.div, { animate: 
                                                        // UI fix for Coinbase Wallet on mobile does not remove isLoading on rejection event
                                                        mobile &&
                                                            isCoinbaseWalletConnector(connector === null || connector === void 0 ? void 0 : connector.id) &&
                                                            isLoading &&
                                                            pendingChainId === ch.id
                                                            ? {
                                                                opacity: [1, 0],
                                                                transition: { delay: 4, duration: 3 },
                                                            }
                                                            : { opacity: 1 }, children: Spinner$1 }, `${ch === null || ch === void 0 ? void 0 : ch.id}-${ch === null || ch === void 0 ? void 0 : ch.name}`) }), jsx(ChainIcon, { children: (_a = ch.logo) !== null && _a !== void 0 ? _a : jsx(Chains.UnknownChain, {}) })] }), ch.name] }), jsx(ChainButtonStatus, { children: jsxs(AnimatePresence, { initial: false, exitBeforeEnter: true, children: [ch.id === (chain === null || chain === void 0 ? void 0 : chain.id) && (jsx(motion.span, { style: {
                                                    color: 'var(--ck-dropdown-active-color, var(--ck-focus-color))',
                                                    display: 'block',
                                                    position: 'relative',
                                                }, initial: { opacity: 0, x: -4 }, animate: { opacity: 1, x: 0 }, exit: {
                                                    opacity: 0,
                                                    x: 4,
                                                    transition: { duration: 0.1, delay: 0 },
                                                }, transition: {
                                                    ease: [0.76, 0, 0.24, 1],
                                                    duration: 0.3,
                                                    delay: 0.2,
                                                }, children: locales.connected }, 'connectedText')), isLoading && pendingChainId === ch.id && (jsx(motion.span, { style: {
                                                    color: 'var(--ck-dropdown-pending-color, inherit)',
                                                    display: 'block',
                                                    position: 'relative',
                                                }, initial: {
                                                    opacity: 0,
                                                    x: -4,
                                                }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 4 }, transition: {
                                                    ease: [0.76, 0, 0.24, 1],
                                                    duration: 0.3,
                                                    delay: 0.1,
                                                }, children: jsx(motion.span, { animate: 
                                                    // UI fix for Coinbase Wallet on mobile does not remove isLoading on rejection event
                                                    mobile &&
                                                        isCoinbaseWalletConnector(connector === null || connector === void 0 ? void 0 : connector.id) && {
                                                        opacity: [1, 0],
                                                        transition: { delay: 4, duration: 4 },
                                                    }, children: locales.approveInWallet }) }, 'approveText'))] }) }), variant === 'secondary' ? (jsx(ChainButtonBg, { initial: false, animate: {
                                        opacity: ch.id === (chain === null || chain === void 0 ? void 0 : chain.id) ? 1 : 0,
                                    }, transition: {
                                        duration: 0.3,
                                        ease: 'easeOut',
                                    } })) : (
                                //hover === ch.name && (
                                ch.id === (chain === null || chain === void 0 ? void 0 : chain.id) && (jsx(ChainButtonBg, { layoutId: "activeChain", layout: "position", transition: {
                                        duration: 0.3,
                                        ease: 'easeOut',
                                    } })))] }, `${ch === null || ch === void 0 ? void 0 : ch.id}-${ch === null || ch === void 0 ? void 0 : ch.name}`));
                    }) }) }), jsx(AnimatePresence, { children: disabled && (jsx(motion.div, { style: {
                        overflow: 'hidden',
                    }, initial: { height: 0 }, animate: { height: 'auto' }, exit: { height: 0 }, transition: {
                        ease: [0.76, 0, 0.24, 1],
                        duration: 0.3,
                    }, children: jsx("div", { style: { paddingTop: 10, paddingBottom: 8 }, children: jsxs(Alert, { children: [locales.warnings_walletSwitchingUnsupported, ' ', locales.warnings_walletSwitchingUnsupportedResolve] }) }) })) })] }));
};

const DropdownWindow = styled(motion.div) `
  z-index: 2147483647;
  position: fixed;
  inset: 0;
`;
const DropdownOverlay = styled(motion.div) `
  position: absolute;
  inset: 0;
`;
const DropdownContainer = styled(motion.div) `
  --shadow: 0px 2px 15px rgba(0, 0, 0, 0.15);
  --background: var(--ck-dropdown-background, var(--ck-tooltip-background));
  --border-radius: var(
    --ck-dropdown-border-radius,
    var(--ck-tooltip-border-radius, 12px)
  );

  pointer-events: auto;
  z-index: 2147483647;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: fit-content;
  padding: 14px 16px 16px;
  color: var(--ck-dropdown-color, var(--ck-tooltip-color));
  background: var(--background);
  box-shadow: var(
    --ck-dropdown-box-shadow,
    var(--ck-tooltip-shadow, var(--shadow))
  );
  border-radius: var(--border-radius);
`;
const DropdownHeading = styled(motion.div) `
  padding: 0 0 6px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  user-select: none;
  color: var(--ck-dropdown-color, var(--ck-tooltip-color));
`;

const ChainSelectDropdown = ({ children, open, onClose, offsetX = 0, offsetY = 8 }) => {
    var _a, _b, _c;
    const context = useContext();
    const themeContext = useThemeContext();
    const locales = useLocales();
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    useLockBodyScroll(open);
    const contentRef = useRef(null);
    useEffect(() => {
        const listener = (e) => {
            var _a, _b, _c;
            if (!open)
                return;
            if (e.key === 'Escape')
                onClose();
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                if (!contentRef.current)
                    return;
                e.preventDefault();
                const focusableEls = (_a = contentRef.current) === null || _a === void 0 ? void 0 : _a.querySelectorAll(`
            a[href]:not(:disabled),
            button:not(:disabled),
            textarea:not(:disabled),
            input[type="text"]:not(:disabled),
            input[type="radio"]:not(:disabled),
            input[type="checkbox"]:not(:disabled),
            select:not(:disabled)
          `), firstFocusableEl = focusableEls[0], lastFocusableEl = focusableEls[focusableEls.length - 1];
                if (e.key === 'ArrowUp') {
                    if (document.activeElement === firstFocusableEl) {
                        lastFocusableEl.focus();
                    }
                    else {
                        let focusItem = (_b = document === null || document === void 0 ? void 0 : document.activeElement) === null || _b === void 0 ? void 0 : _b.previousSibling;
                        if (!focusItem)
                            focusItem = lastFocusableEl;
                        while (focusItem.disabled)
                            focusItem = focusItem.previousSibling;
                        focusItem.focus();
                    }
                }
                else {
                    if (document.activeElement === lastFocusableEl) {
                        firstFocusableEl.focus();
                    }
                    else {
                        let focusItem = (_c = document === null || document === void 0 ? void 0 : document.activeElement) === null || _c === void 0 ? void 0 : _c.nextSibling;
                        if (!focusItem)
                            focusItem = firstFocusableEl;
                        while (focusItem.disabled)
                            focusItem = focusItem.nextSibling;
                        focusItem.focus();
                    }
                }
            }
        };
        document.addEventListener('keydown', listener);
        return () => {
            document.removeEventListener('keydown', listener);
        };
    }, [open]);
    const targetRef = useRef(null);
    const innerRef = useCallback((node) => {
        if (!node)
            return;
        targetRef.current = node;
        refresh();
    }, [open]);
    const [ref, bounds] = useMeasure({
        debounce: 120,
        offsetSize: true,
        scroll: true,
    });
    const refresh = () => {
        if (!targetRef.current ||
            bounds.top +
                bounds.bottom +
                bounds.left +
                bounds.right +
                bounds.height +
                bounds.width ===
                0) {
            return;
        }
        let x = bounds.left + offsetX;
        let y = bounds.top + bounds.height + offsetY;
        targetRef.current.style.left = `${x}px`;
        targetRef.current.style.top = `${y}px`;
        /*
        const contentRect = targetRef.current.getBoundingClientRect();
    
        const w = contentRect.width;
        const h = contentRect.height;
    
        if (x + w > window.innerWidth) {
          x = bounds.left + bounds.width - contentRect.width - offsetX;
        }
        if (y + h > window.innerHeight - 24) {
          y = bounds.top - contentRect.height - offsetY;
        }
    
        setOffset({
          x: x,
          y: y,
        });
        */
    };
    const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
    useIsomorphicLayoutEffect(refresh, [targetRef.current, bounds, open]);
    useEffect(refresh, [open, targetRef.current]);
    const onScroll = onClose;
    const onResize = onClose;
    useEffect(() => {
        refresh();
        window.addEventListener('scroll', onScroll);
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
        };
    }, []);
    return (jsxs(Fragment, { children: [jsx("div", { ref: ref, children: children }), jsx(AnimatePresence, { children: open && (jsx(Portal, { children: jsx(ResetContainer, { "$useTheme": (_a = themeContext.theme) !== null && _a !== void 0 ? _a : context.theme, "$useMode": (_b = themeContext.mode) !== null && _b !== void 0 ? _b : context.mode, "$customTheme": (_c = themeContext.customTheme) !== null && _c !== void 0 ? _c : context.customTheme, children: jsx(FocusTrap, { children: jsxs(DropdownWindow, { ref: contentRef, children: [jsx(DropdownOverlay, { onClick: onClose }), jsxs(DropdownContainer, { ref: innerRef, style: {
                                            left: offset.x,
                                            top: offset.y,
                                        }, initial: 'collapsed', animate: 'open', exit: 'collapsed', variants: {
                                            collapsed: {
                                                transformOrigin: '0 0',
                                                opacity: 0,
                                                scale: 0.96,
                                                z: 0.01,
                                                y: -4,
                                                x: 0,
                                                transition: {
                                                    duration: 0.1,
                                                },
                                            },
                                            open: {
                                                transformOrigin: '0 0',
                                                willChange: 'opacity,transform',
                                                opacity: 1,
                                                scale: 1,
                                                z: 0.01,
                                                y: 0,
                                                x: 0,
                                                transition: {
                                                    ease: [0.76, 0, 0.24, 1],
                                                    duration: 0.15,
                                                },
                                            },
                                        }, children: [jsx(DropdownHeading, { children: locales.switchNetworks }), jsx(ChainSelectList, {})] })] }) }) }) })) })] }));
};

const ChainContainer = styled.div `
  --bg: transparent;
  --color: #333;
  ${(props) => typeof props.size === 'string'
    ? css `
          --width: ${props.size};
          --height: ${props.size};
        `
    : css `
          --width: ${props.size >= 0 ? `${props.size}px` : '24px'};
          --height: ${props.size >= 0 ? `${props.size}px` : '24px'};
        `};
  ${(props) => typeof props.radius === 'string'
    ? css `
          --radius: ${props.radius};
        `
    : css `
          --radius: ${props.radius >= 0 ? `${props.radius}px` : '24px'};
        `};
  display: block;
  position: relative;
  width: var(--width);
  height: var(--height);
  min-width: var(--width);
  min-height: var(--height);
  border-radius: var(--radius);
  background: var(--ck-body-background-secondary);
  pointer-events: none;
  user-select: none;
  svg {
    display: block;
    width: 100%;
    height: auto;
  }
  > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
const LogoContainer$1 = styled(motion.div) `
  display: block;
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    display: block;
    width: 100%;
    height: auto;
  }
`;
const Spin = keyframes `
  0%{ transform: rotate(0deg); }
  100%{ transform: rotate(360deg); }
`;
const LoadingContainer = styled(motion.div) `
  position: absolute;
  inset: 0;
  animation: ${Spin} 1s linear infinite;
  svg {
    display: block;
    position: absolute;
    inset: 0;
  }
`;
const Unsupported = styled(motion.div) `
  z-index: 2;
  position: absolute;
  top: 0;
  right: 0;
  width: 40%;
  height: 40%;
  min-width: 13px;
  min-height: 13px;
  color: var(--ck-body-color-danger, red);
  svg {
    display: block;
    position: relative;
    top: -30%;
    right: -30%;
  }
`;

const Spinner = (jsxs("svg", { "aria-hidden": "true", width: "36", height: "36", viewBox: "0 0 36 36", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M11.3592 30.1654C10.0472 29.4491 8.85718 28.524 7.83713 27.424C6.81708 26.324 5.98425 25.0677 5.36889 23.7054C5.20157 23.335 5.05033 22.9567 4.91578 22.5717C4.51465 21.4237 4.26735 20.2308 4.17794 19.0239C4.16599 18.8626 4.13894 18.7041 4.09809 18.5507C3.85023 17.6197 3.09399 16.8738 2.11531 16.7999C0.975331 16.7138 -0.0310983 17.5702 0.0141657 18.7125C0.0223289 18.9185 0.0340286 19.1243 0.049253 19.3298C0.165374 20.8971 0.486545 22.4464 1.00749 23.9373C1.10424 24.2142 1.20764 24.4884 1.31755 24.7596C2.13617 26.7799 3.31595 28.6371 4.80146 30.239C6.28696 31.841 8.04998 33.1573 10.0029 34.1258C10.2651 34.2558 10.5307 34.3796 10.7995 34.4969C12.247 35.1287 13.7676 35.5656 15.3217 35.7995C15.5255 35.8301 15.7298 35.8573 15.9346 35.881C17.0703 36.0122 18.0001 35.0731 18.0001 33.9299C18.0001 32.9484 17.3133 32.1381 16.4036 31.8208C16.2537 31.7685 16.0977 31.7296 15.9377 31.7056C14.7411 31.5255 13.5702 31.1891 12.4556 30.7026C12.0818 30.5394 11.716 30.3601 11.3592 30.1654Z", fill: "url(#paint0_linear_1288_1870)" }), jsx("defs", { children: jsxs("linearGradient", { id: "paint0_linear_1288_1870", x1: "2", y1: "19.4884", x2: "16.8752", y2: "33.7485", gradientUnits: "userSpaceOnUse", children: [jsx("stop", { stopColor: "var(--ck-connectbutton-balance-color,currentColor)", stopOpacity: "0.7" }), jsx("stop", { offset: "1", stopColor: "var(--ck-connectbutton-balance-color,currentColor)", stopOpacity: "0" })] }) })] }));
const Chain = ({ id, unsupported, radius = '50%', size = 24 }) => {
    var _a;
    const chain = supportedChains.find((c) => c.id === id);
    return (jsx(ChainContainer, { size: size, radius: radius, children: jsxs(AnimatePresence, { initial: false, children: [unsupported && (jsx(Unsupported, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: jsxs("svg", { width: "13", height: "12", viewBox: "0 0 13 12", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [jsx("path", { d: "M2.61317 11.2501H9.46246C10.6009 11.2501 11.3256 10.3506 11.3256 9.3549C11.3256 9.05145 11.255 8.73244 11.0881 8.43303L7.65903 2.14708C7.659 2.14702 7.65897 2.14696 7.65893 2.1469C7.65889 2.14682 7.65884 2.14673 7.65879 2.14664C7.31045 1.50746 6.6741 1.17871 6.04 1.17871C5.41478 1.17871 4.763 1.50043 4.41518 2.14968L0.993416 8.43476C0.828865 8.72426 0.75 9.04297 0.75 9.3549C0.75 10.3506 1.47471 11.2501 2.61317 11.2501Z", fill: "currentColor", stroke: "var(--ck-body-background, #fff)", strokeWidth: "1.5" }), jsx("path", { d: "M6.03258 7.43916C5.77502 7.43916 5.63096 7.29153 5.62223 7.02311L5.55675 4.96973C5.54802 4.69684 5.74446 4.5 6.02821 4.5C6.3076 4.5 6.51277 4.70131 6.50404 4.9742L6.43856 7.01864C6.42546 7.29153 6.2814 7.43916 6.03258 7.43916ZM6.03258 9.11676C5.7401 9.11676 5.5 8.9065 5.5 8.60677C5.5 8.30704 5.7401 8.09678 6.03258 8.09678C6.32506 8.09678 6.56515 8.30256 6.56515 8.60677C6.56515 8.91097 6.32069 9.11676 6.03258 9.11676Z", fill: "white" })] }) })), id ? (jsx(LogoContainer$1, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 }, children: (_a = chain === null || chain === void 0 ? void 0 : chain.logo) !== null && _a !== void 0 ? _a : jsx(Chains.UnknownChain, {}) }, `${chain === null || chain === void 0 ? void 0 : chain.id}-${chain === null || chain === void 0 ? void 0 : chain.name}-${id}`)) : (jsx(LoadingContainer, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 }, children: Spinner }, "loading"))] }) }));
};

const Container$3 = styled(motion.div) ``;
const SwitchChainButton = styled(motion.button) `
  --color: var(
    --ck-dropdown-button-color,
    var(--ck-button-primary-color, var(--ck-body-color))
  );
  --background: var(
    --ck-dropdown-button-background,
    var(--ck-secondary-button-background, var(--ck-body-background-secondary))
  );
  --box-shadow: var(
    --ck-dropdown-button-box-shadow,
    var(
      --ck-secondary-button-box-shadow,
      var(--ck-button-primary-box-shadow),
      none
    )
  );

  --hover-color: var(--ck-dropdown-button-hover-color, var(--color));
  --hover-background: var(
    --ck-dropdown-button-hover-background,
    var(--background)
  );
  --hover-box-shadow: var(
    --ck-dropdown-button-hover-box-shadow,
    var(--box-shadow)
  );

  --active-color: var(--ck-dropdown-button-active-color, var(--hover-color));
  --active-background: var(
    --ck-dropdown-button-active-background,
    var(--hover-background)
  );
  --active-box-shadow: var(
    --ck-dropdown-button-active-box-shadow,
    var(--hover-box-shadow)
  );

  appearance: none;
  user-select: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 15px;
  width: 52px;
  height: 30px;
  padding: 2px 6px 2px 3px;
  font-size: 16px;
  line-height: 19px;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  transform: translateZ(0px);

  transition: 100ms ease;
  transition-property: transform, background-color, box-shadow, color;

  color: var(--color);
  background: var(--background);
  box-shadow: var(--box-shadow);

  svg {
    position: relative;
    display: block;
  }

  ${(props) => props.disabled
    ? css `
          width: auto;
          padding: 3px;
          position: relative;
          left: -22px;
        `
    : css `
          cursor: pointer;

          @media only screen and (min-width: ${defaultTheme.mobileWidth +
        1}px) {
            &:hover,
            &:focus-visible {
              color: var(--hover-color);
              background: var(--hover-background);
              box-shadow: var(--hover-box-shadow);
            }
            &:active {
              color: var(--active-color);
              background: var(--active-background);
              box-shadow: var(--active-box-shadow);
            }
          }
        `}
`;
const ChevronDown = ({ ...props }) => (jsx("svg", { "aria-hidden": "true", width: "11", height: "6", viewBox: "0 0 11 6", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props, children: jsx("path", { d: "M1.5 1L5.5 5L9.5 1", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }));
const ChainSelector = () => {
    const context = useContext();
    const [isOpen, setIsOpen] = useState(false);
    const { chain, chains } = useNetwork();
    const locales = useLocales({
        CHAIN: chain === null || chain === void 0 ? void 0 : chain.name,
    });
    const mobile = isMobile() || (window === null || window === void 0 ? void 0 : window.innerWidth) < defaultTheme.mobileWidth;
    useEffect(() => {
        if (!context.open)
            setIsOpen(false);
    }, [context.open]);
    const disabled = chains.length <= 1;
    return (jsx(Fragment, { children: jsx(Container$3, { children: jsx(ChainSelectDropdown, { offsetX: -12, open: !mobile && isOpen, onClose: () => setIsOpen(false), children: jsxs(SwitchChainButton, { "aria-label": flattenChildren(locales.switchNetworks).toString(), disabled: disabled, onClick: () => {
                        if (mobile) {
                            context.setRoute(routes.SWITCHNETWORKS);
                        }
                        else {
                            setIsOpen(!isOpen);
                        }
                    }, children: [disabled ? (jsx(Tooltip, { message: locales.chainNetwork, xOffset: -6, delay: 0.01, children: jsx(Chain, { id: chain === null || chain === void 0 ? void 0 : chain.id, unsupported: chain === null || chain === void 0 ? void 0 : chain.unsupported }) })) : (jsx(Chain, { id: chain === null || chain === void 0 ? void 0 : chain.id, unsupported: chain === null || chain === void 0 ? void 0 : chain.unsupported })), !disabled && jsx(ChevronDown, { style: { top: 1, left: -3 } })] }) }) }) }));
};

const Profile = ({ closeModal }) => {
    var _a, _b, _c;
    const context = useContext();
    const themeContext = useThemeContext();
    const locales = useLocales();
    const { reset } = useConnect$1();
    const { disconnect } = useDisconnect();
    const { chain } = useNetwork();
    const { address, isConnected, connector } = useAccount();
    const { data: ensName } = useEnsName({
        chainId: 1,
        address: address,
    });
    const { data: balance } = useBalance({
        address,
        //watch: true,
    });
    const [shouldDisconnect, setShouldDisconnect] = useState(false);
    useEffect(() => {
        if (!isConnected)
            context.setOpen(false);
    }, [isConnected]);
    useEffect(() => {
        if (!shouldDisconnect)
            return;
        // Close before disconnecting to avoid layout shifting while modal is still open
        if (closeModal) {
            closeModal();
        }
        else {
            context.setOpen(false);
        }
        return () => {
            disconnect();
            reset();
        };
    }, [shouldDisconnect, disconnect, reset]);
    const separator = ['web95', 'rounded', 'minimal'].includes((_b = (_a = themeContext.theme) !== null && _a !== void 0 ? _a : context.theme) !== null && _b !== void 0 ? _b : '')
        ? '....'
        : undefined;
    return (jsxs(PageContent, { children: [jsxs(ModalContent, { style: { paddingBottom: 22, gap: 6 }, children: [jsx(AvatarContainer, { children: jsxs(AvatarInner, { children: [jsx(ChainSelectorContainer, { children: jsx(ChainSelector, {}) }), jsx(Avatar, { address: address })] }) }), jsx(ModalH1, { children: jsx(CopyToClipboard, { string: address, children: ensName !== null && ensName !== void 0 ? ensName : truncateEthAddress(address, separator) }) }), ((_c = context === null || context === void 0 ? void 0 : context.options) === null || _c === void 0 ? void 0 : _c.hideBalance) ? null : (jsx(ModalBody, { children: jsx(BalanceContainer, { children: jsxs(AnimatePresence, { exitBeforeEnter: true, initial: false, children: [balance && (jsxs(Balance$1, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 }, children: [nFormatter(Number(balance === null || balance === void 0 ? void 0 : balance.formatted)), ` `, balance === null || balance === void 0 ? void 0 : balance.symbol] }, `chain-${chain === null || chain === void 0 ? void 0 : chain.id}`)), !balance && (jsx(LoadingBalance, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 }, children: "\u00A0" }))] }) }) }))] }), !isSafeConnector(connector === null || connector === void 0 ? void 0 : connector.id) && (jsx(Button, { onClick: () => setShouldDisconnect(true), icon: jsx(DisconnectIcon, {}), children: locales.disconnect }))] }));
};

const SwitchNetworks = () => {
    const { reset } = useConnect$1();
    const { disconnect } = useDisconnect();
    const { chain } = useNetwork();
    const { connector } = useAccount();
    const locales = useLocales({});
    const onDisconnect = () => {
        disconnect();
        reset();
    };
    return (jsx(PageContent, { style: { width: 278 }, children: jsxs(ModalContent, { style: { padding: 0, marginTop: -10 }, children: [(chain === null || chain === void 0 ? void 0 : chain.unsupported) && (jsxs(ModalBody, { children: [locales.warnings_chainUnsupported, ' ', locales.warnings_chainUnsupportedResolve] })), jsx("div", { style: { padding: '6px 8px' }, children: jsx(ChainSelectList, { variant: "secondary" }) }), (chain === null || chain === void 0 ? void 0 : chain.unsupported) && !isSafeConnector(connector === null || connector === void 0 ? void 0 : connector.id) && (jsxs("div", { style: { paddingTop: 12 }, children: [jsx(OrDivider, {}), jsx(Button, { icon: jsx(DisconnectIcon, {}), variant: "secondary", onClick: onDisconnect, children: locales.disconnect })] }))] }) }));
};

const spinKeyframes = keyframes `
  from{ transform: rotate(0deg); }
  to{   transform: rotate(360deg); }
`;
const lineKeyframes = keyframes `
  from{ background-position: 0 0; }
  to{ background-position: 100% 0; }
`;
const ContentContainer = styled.div `
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    margin: 5px auto 24px;
    padding: 16px 16px;
    border-radius: var(--ck-tertiary-border-radius, 24px);
    box-shadow: var(--ck-tertiary-box-shadow, none);
    background: var(--ck-body-background-tertiary);
  }
`;
const LogoContainer = styled(motion.div) `
  z-index: 2;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 100%;
  transition: inherit;
  background: var(--ck-body-background-secondary);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04);
  svg,
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    width: 64px;
    height: 64px;
  }
`;
const StatusIcon = styled(motion.div) `
  z-index: 2;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  color: currentColor;
  border-radius: 100%;
  transition: inherit;
  svg {
    z-index: 3;
    position: relative;
    transform: scale(0.89);
    transition: inherit;
    opacity: 0.5;
  }
  &:before {
    z-index: 1;
    content: '';
    position: absolute;
    inset: 10px;
    border-radius: inherit;
    border: 1px dashed var(--border-color);
    background: var(--ck-body-background);
    transition: inherit;
    animation: ${spinKeyframes} 10s linear infinite;
  }
  &:after {
    z-index: 2;
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: #34c759;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04);
    transform: scale(0);
    transition: inherit;
  }
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    width: 64px;
    height: 64px;
    svg {
      transform: scale(1.1);
    }
  }
`;
const StatusGraphicBgSvg = styled(motion.svg) `
  display: block;
  position: relative;
  margin: 0 auto;
  transition: inherit;
  overflow: visible;
  rect {
    stroke: var(--border-color);
    rx: var(--ck-border-radius);
  }
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    display: none;
  }
`;
const StatusGraphic = styled(motion.div) `
  --border-color: var(--ck-siwe-border, var(--ck-body-divider));
  --border-size: 0;
  --border-style: dashed;

  user-select: none;
  pointer-events: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  width: 100%;
  margin: 12px auto;
  padding: 42px 32px;
  transition: all 320ms cubic-bezier(0.175, 0.885, 0.32, 1.1);
  border: var(--border-size) var(--border-style) var(--border-color);
  border-radius: var(--ck-border-radius);

  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    --border-size: 1px;
    margin: 0 auto 20px;
    padding: 38px 0;
    gap: 18px;
    + div {
      // easier than wrapping in another styled component
      padding-bottom: 10px;
    }
  }

  > div {
    z-index: 2;
    position: relative;
    transition: inherit;
  }

  &:before,
  &:after {
    z-index: 1;
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 120px;
    height: 1px;
    margin-left: -60px;
    transition: inherit;
    animation: ${lineKeyframes} 10s linear infinite;
    background: linear-gradient(
      90deg,
      var(--border-color),
      var(--border-color) 50%,
      transparent 50%,
      transparent 100%
    );
    background-size: 6px 1px;
  }

  &:after {
    background: var(--border-color);
    transform: scaleX(0);
  }

  ${({ $connected }) => $connected &&
    css `
      &:before {
        opacity: 0;
      }
      &:after {
        transform: none;
      }
      ${StatusGraphicBgSvg} {
        rect {
          stroke-dasharray: 0 0;
        }
      }
      ${LogoContainer} {
        transform: scale(0.62);
      }
      ${StatusIcon} {
        svg {
          transform: scale(1.5);
          opacity: 1;
          color: #fff;
        }
        &:before {
          transform: scale(0);
        }
        &:after {
          transform: scale(1);
        }
      }
      @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
        --border-size: 1px;
        --border-style: solid;
        ${StatusIcon} {
          svg {
            transform: scale(1.75);
          }
        }
      }
    `};
`;

const SIWEButton = ({ showSignOutButton, onSignIn, onSignOut, }) => {
    const isMounted = useIsMounted();
    const locales = useLocales();
    const { setOpen } = useModal();
    const { isSignedIn, isReady, isLoading, isRejected, isSuccess, isError, signIn, signOut, error, } = useSIWE({
        onSignIn: (data) => onSignIn === null || onSignIn === void 0 ? void 0 : onSignIn(data),
        onSignOut: () => onSignOut === null || onSignOut === void 0 ? void 0 : onSignOut(),
    });
    const { address: connectedAddress } = useAccount();
    function getButtonLabel() {
        if (isSuccess)
            return locales.signedIn;
        if (isRejected)
            return locales.tryAgain;
        if (isLoading)
            return locales.awaitingConfirmation;
        if (isError)
            return error !== null && error !== void 0 ? error : 'Unknown Error';
        if (isReady)
            return locales.signIn;
        return locales.signIn;
    }
    if (!isMounted) {
        return jsx(Button, { style: { margin: 0 }, disabled: true }, "loading");
    }
    if (showSignOutButton && isSignedIn) {
        return (jsx(Button, { style: { margin: 0 }, onClick: signOut, icon: jsx(DisconnectIcon, {}), children: locales.signOut }, "button"));
    }
    if (!connectedAddress) {
        // TODO: discuss non-connected wallet developer expectations
        return (jsx(Button, { style: { margin: 0 }, onClick: () => setOpen(true), arrow: true, children: locales.walletNotConnected }, "button"));
    }
    return (jsx(Button, { style: { margin: 0 }, arrow: !isSignedIn ? !isLoading && !isRejected : false, onClick: !isLoading && !isSuccess ? signIn : undefined, disabled: isLoading, waiting: isLoading, icon: isRejected && (jsx(motion.div, { initial: {
                rotate: -270,
            }, animate: {
                rotate: 0,
            }, transition: {
                duration: 1,
                ease: [0.175, 0.885, 0.32, 0.98],
            }, children: jsx(RetryIcon, { style: { opacity: 0.4 } }) })), children: getButtonLabel() }, "button"));
};
const SIWEButtonComponent = ({ ...props }) => (jsx(ResetContainer, { children: jsx(SIWEButton, { ...props }) }));

const LazyImage = ({ src, alt, width, height }) => {
    const imageRef = useRef(null);
    const [loaded, setLoaded] = useState(true);
    useEffect(() => {
        if (!(imageRef.current &&
            imageRef.current.complete &&
            imageRef.current.naturalHeight !== 0)) {
            setLoaded(false);
        }
    }, [src]);
    return (jsx("div", { style: {
            width,
            height,
            background: 'rgba(0,0,0,0.02)',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.02)',
        }, children: jsx("img", { ref: imageRef, src: src, alt: alt, width: width, height: height, onLoad: () => setLoaded(true), style: { transition: 'opacity 0.2s ease', opacity: loaded ? 1 : 0 } }) }));
};

const transition = { duration: 0.2, ease: [0.26, 0.08, 0.25, 1] };
const copyTransition = { duration: 0.16, ease: [0.26, 0.08, 0.25, 1] };
const SignInWithEthereum = () => {
    var _a, _b;
    const context = useContext();
    const { isSignedIn, reset } = useSIWE();
    const mobile = isMobile();
    const [status, setStatus] = useState(isSignedIn ? 'signedIn' : 'signedOut');
    const locales = useLocales({});
    const copy = status === 'signedIn'
        ? {
            heading: locales.signInWithEthereumScreen_signedIn_heading,
            h1: locales.signInWithEthereumScreen_signedIn_h1,
            p: locales.signInWithEthereumScreen_signedIn_p,
            button: locales.signInWithEthereumScreen_signedIn_button,
        }
        : {
            heading: locales.signInWithEthereumScreen_signedOut_heading,
            h1: locales.signInWithEthereumScreen_signedOut_h1,
            p: locales.signInWithEthereumScreen_signedOut_p,
            button: locales.signInWithEthereumScreen_signedOut_button,
        };
    useEffect(() => {
        if (isSignedIn)
            setStatus('signedIn');
    }, []);
    useEffect(() => {
        if (!isSignedIn)
            setStatus('signedOut');
    }, [isSignedIn]);
    const { address } = useAccount();
    // We use the favicon for the dApp logo because that's how the connectors do it
    // TODO: Allow for dev customisation
    const getFavicons = () => {
        const favicons = {
            svg: null,
            default: null,
        };
        const nodeList = document.getElementsByTagName('link');
        Array.from(nodeList).forEach((node) => {
            if ((node.getAttribute('rel') === 'icon' ||
                node.getAttribute('rel') === 'shortcut icon') &&
                node.getAttribute('href')) {
                if (node.getAttribute('type') === 'image/svg+xml') {
                    favicons.svg = node.getAttribute('href');
                }
                else {
                    favicons.default = node.getAttribute('href');
                }
            }
        });
        return favicons;
    };
    const favicons = getFavicons();
    const favicon = (_b = (_a = getAppIcon()) !== null && _a !== void 0 ? _a : favicons.svg) !== null && _b !== void 0 ? _b : favicons.default;
    return (jsx(PageContent, { style: { width: 278 }, children: jsxs(ModalContent, { style: { padding: 0, marginTop: -10 }, children: [jsx(ContentContainer, { children: jsx(AnimatePresence, { exitBeforeEnter: true, children: jsx(motion.div, { initial: mobile ? false : { opacity: 0, scale: 0.94 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.94 }, transition: copyTransition, children: jsx(ModalBody, { style: { height: 42 }, children: jsx(FitText, { children: copy.h1 }) }) }, flattenChildren(copy.h1).toString()) }) }), jsxs(StatusGraphic, { "$connected": isSignedIn, children: [jsx("div", { style: { position: 'absolute', inset: 0 }, children: jsx(StatusGraphicBgSvg, { width: "262", height: "134", viewBox: "0 0 262 134", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: jsx(motion.rect, { x: "0", y: "0", rx: "12", width: "262", height: "134", strokeDasharray: "3 3", animate: {
                                        strokeDashoffset: [0, -6],
                                    }, transition: {
                                        duration: 0.4,
                                        ease: 'linear',
                                        repeat: Infinity,
                                    } }) }) }), jsx(motion.div, { initial: mobile
                                ? false
                                : {
                                    opacity: 0,
                                    x: 50,
                                    scale: 0.8,
                                }, animate: {
                                opacity: 1,
                                x: 0,
                                scale: 1,
                            }, transition: transition, children: jsx(LogoContainer, { children: jsx(Avatar, { address: address, size: 64 }) }) }, "avatarImage"), jsx(motion.div, { initial: mobile
                                ? false
                                : {
                                    scale: 0.6,
                                }, animate: {
                                scale: 1,
                            }, transition: {
                                ...transition,
                            }, children: jsx(StatusIcon, { children: jsx(TickIcon, {}) }) }, "tickIcon"), jsx(motion.div, { initial: mobile
                                ? false
                                : {
                                    opacity: 0,
                                    x: -40,
                                    scale: 0.8,
                                }, animate: {
                                opacity: 1,
                                x: 0,
                                scale: 1,
                            }, transition: {
                                ...transition,
                            }, children: jsx(LogoContainer, { children: favicon ? (jsx(LazyImage, { src: favicon, alt: 'app' })) : (jsx(Chains.UnknownChain, {})) }) }, "appLogo")] }, "status"), jsx(AnimatePresence, { exitBeforeEnter: true, children: jsx(motion.div, { style: { paddingBottom: mobile ? 24 : 12 }, initial: mobile ? false : { opacity: 0, scale: 0.94 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.94 }, transition: copyTransition, children: jsx(ModalBody, { style: { height: 42, marginTop: -1, marginBottom: -3 }, children: jsx(FitText, { children: copy.p }) }) }, flattenChildren(copy.p).toString()) }), jsx(SIWEButton, { showSignOutButton: status === 'signedIn', onSignIn: () => {
                        setTimeout(() => {
                            context.setOpen(false);
                        }, 1000);
                    } })] }) }));
};

const customThemeDefault$1 = {};
const ConnectModal$1 = ({ mode = 'auto', theme = 'auto', customTheme = customThemeDefault$1, lang = 'en-US', }) => {
    var _a;
    const context = useContext();
    const { isConnected } = useAccount();
    const { chain } = useNetwork();
    //if chain is unsupported we enforce a "switch chain" prompt
    const closeable = !(((_a = context.options) === null || _a === void 0 ? void 0 : _a.enforceSupportedChains) && (chain === null || chain === void 0 ? void 0 : chain.unsupported));
    const showBackButton = closeable &&
        context.route !== routes.CONNECTORS &&
        context.route !== routes.PROFILE;
    const showInfoButton = closeable && context.route !== routes.PROFILE;
    const onBack = () => {
        if (context.route === routes.SIGNINWITHETHEREUM) {
            context.setRoute(routes.PROFILE);
        }
        else if (context.route === routes.SWITCHNETWORKS) {
            context.setRoute(routes.PROFILE);
        }
        else if (context.route === routes.DOWNLOAD) {
            context.setRoute(routes.CONNECT);
        }
        else {
            context.setRoute(routes.CONNECTORS);
        }
    };
    const pages = {
        onboarding: jsx(Introduction, {}),
        about: jsx(About, {}),
        download: jsx(DownloadApp, { connectorId: context.connector }),
        connectors: jsx(Wallets, {}),
        mobileConnectors: jsx(MobileConnectors, {}),
        connect: jsx(ConnectUsing, { connectorId: context.connector }),
        profile: jsx(Profile, {}),
        switchNetworks: jsx(SwitchNetworks, {}),
        signInWithEthereum: jsx(SignInWithEthereum, {}),
    };
    function hide() {
        context.setOpen(false);
    }
    useEffect(() => {
        var _a;
        if (isConnected) {
            if (context.route !== routes.PROFILE ||
                context.route !== routes.SIGNINWITHETHEREUM) {
                if (context.signInWithEthereum &&
                    !((_a = context.options) === null || _a === void 0 ? void 0 : _a.disableSiweRedirect)) {
                    context.setRoute(routes.SIGNINWITHETHEREUM);
                }
                else {
                    hide(); // Hide on connect
                }
            }
        }
        else {
            hide(); // Hide on connect
        }
    }, [isConnected]);
    useEffect(() => context.setMode(mode), [mode]);
    useEffect(() => context.setTheme(theme), [theme]);
    useEffect(() => context.setCustomTheme(customTheme), [customTheme]);
    useEffect(() => context.setLang(lang), [lang]);
    /* When pulling data into WalletConnect, it prioritises the og:title tag over the title tag */
    useEffect(() => {
        const appName = getAppName();
        if (!appName || !context.open)
            return;
        const title = document.createElement('meta');
        title.setAttribute('property', 'og:title');
        title.setAttribute('content', appName);
        document.head.prepend(title);
        /*
        // TODO:  When pulling data into WalletConnect, figure out which icon gets used and replace with appIcon if available
        const appIcon = getAppIcon();
        const icon = document.createElement('link');
        if (appIcon) {
          icon.setAttribute('rel', 'icon');
          icon.setAttribute('href', appIcon);
          document.head.prepend(icon);
        }*/
        return () => {
            document.head.removeChild(title);
            //if (appIcon) document.head.removeChild(icon);
        };
    }, [context.open]);
    return (jsx(ConnectKitThemeProvider, { theme: theme, customTheme: customTheme, mode: mode, children: jsx(Modal, { open: context.open, pages: pages, pageId: context.route, onClose: closeable ? hide : undefined, onInfo: showInfoButton ? () => context.setRoute(routes.ABOUT) : undefined, onBack: showBackButton ? onBack : undefined }) }));
};

function useGoogleFont(font) {
    useEffect(() => {
        if (!font)
            return;
        font = font.replace(/ /g, '+');
        const googleapis = document.createElement('link');
        googleapis.href = `https://fonts.googleapis.com`;
        googleapis.rel = 'preconnect';
        const gstatic = document.createElement('link');
        gstatic.href = `https://fonts.gstatic.com`;
        gstatic.rel = 'preconnect';
        gstatic.crossOrigin = 'true';
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${font}:wght@400;500;600&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(googleapis);
        document.head.appendChild(gstatic);
        document.head.appendChild(link);
        return () => {
            document.head.removeChild(googleapis);
            document.head.removeChild(gstatic);
            document.head.removeChild(link);
        };
    }, [font]);
}
// TODO: This could be dynamic if theming wasn't set up as css variables
function useThemeFont(theme) {
    var _a;
    const themeFonts = {
        web95: 'Lato',
        retro: 'Nunito',
        midnight: 'Inter',
        minimal: 'Inter',
        rounded: 'Nunito',
    };
    const font = (_a = themeFonts[theme]) !== null && _a !== void 0 ? _a : null;
    useGoogleFont(font !== null && font !== void 0 ? font : '');
}

function useChains() {
    var _a;
    // TODO: Find a better way to get configuration chains, but for now just grab first connector's chains
    const connectors = useConnectors();
    return (_a = connectors[0]) === null || _a === void 0 ? void 0 : _a.chains;
}

const useConnectCallback = ({ onConnect, onDisconnect, }) => {
    useAccount({
        onConnect: ({ address, connector, isReconnected }) => {
            if (!isReconnected) {
                onConnect === null || onConnect === void 0 ? void 0 : onConnect({
                    address: address,
                    connectorId: connector === null || connector === void 0 ? void 0 : connector.id,
                });
            }
        },
        onDisconnect: () => onDisconnect === null || onDisconnect === void 0 ? void 0 : onDisconnect(),
    });
};

const routes = {
    ONBOARDING: 'onboarding',
    ABOUT: 'about',
    CONNECTORS: 'connectors',
    MOBILECONNECTORS: 'mobileConnectors',
    CONNECT: 'connect',
    DOWNLOAD: 'download',
    PROFILE: 'profile',
    SWITCHNETWORKS: 'switchNetworks',
    SIGNINWITHETHEREUM: 'signInWithEthereum',
};
const Context = createContext(null);
const ConnectKitProvider = ({ children, theme = 'auto', mode = 'auto', customTheme, options, onConnect, onDisconnect, debugMode = false, }) => {
    var _a, _b, _c, _d;
    // Only allow for mounting ConnectKitProvider once, so we avoid weird global
    // state collisions.
    if (React.useContext(Context)) {
        throw new Error('Multiple, nested usages of ConnectKitProvider detected. Please use only one.');
    }
    useConnectCallback({
        onConnect,
        onDisconnect,
    });
    const chains = useChains();
    // Default config options
    const defaultOptions = {
        language: 'en-US',
        hideBalance: false,
        hideTooltips: false,
        hideQuestionMarkCTA: false,
        hideNoWalletCTA: false,
        walletConnectCTA: 'link',
        hideRecentBadge: false,
        avoidLayoutShift: true,
        embedGoogleFonts: false,
        truncateLongENSAddress: true,
        walletConnectName: undefined,
        reducedMotion: false,
        disclaimer: null,
        bufferPolyfill: true,
        customAvatar: undefined,
        initialChainId: (_a = chains === null || chains === void 0 ? void 0 : chains[0]) === null || _a === void 0 ? void 0 : _a.id,
        enforceSupportedChains: true,
        ethereumOnboardingUrl: undefined,
        walletOnboardingUrl: undefined,
        disableSiweRedirect: false,
    };
    const opts = Object.assign({}, defaultOptions, options);
    if (typeof window !== 'undefined') {
        // Buffer Polyfill, needed for bundlers that don't provide Node polyfills (e.g CRA, Vite, etc.)
        if (opts.bufferPolyfill)
            window.Buffer = (_b = window.Buffer) !== null && _b !== void 0 ? _b : Buffer;
        // Some bundlers may need `global` and `process.env` polyfills as well
        // Not implemented here to avoid unexpected behaviors, but leaving example here for future reference
        /*
         * window.global = window.global ?? window;
         * window.process = window.process ?? { env: {} };
         */
    }
    const [ckTheme, setTheme] = useState(theme);
    const [ckMode, setMode] = useState(mode);
    const [ckCustomTheme, setCustomTheme] = useState(customTheme !== null && customTheme !== void 0 ? customTheme : {});
    const [ckLang, setLang] = useState('en-US');
    const [open, setOpen] = useState(false);
    const [connector, setConnector] = useState('');
    const [route, setRoute] = useState(routes.CONNECTORS);
    const [errorMessage, setErrorMessage] = useState('');
    // Include Google Font that is needed for a themes
    if (opts.embedGoogleFonts)
        useThemeFont(theme);
    // Other Configuration
    useEffect(() => setTheme(theme), [theme]);
    useEffect(() => setLang(opts.language || 'en-US'), [opts.language]);
    useEffect(() => setErrorMessage(null), [route, open]);
    // Check if chain is supported, elsewise redirect to switches page
    const { chain } = useNetwork();
    useEffect(() => {
        if (opts.enforceSupportedChains && (chain === null || chain === void 0 ? void 0 : chain.unsupported)) {
            setOpen(true);
            setRoute(routes.SWITCHNETWORKS);
        }
    }, [chain, route, open]);
    const log = debugMode ? console.log : () => { };
    const value = {
        theme: ckTheme,
        setTheme,
        mode: ckMode,
        setMode,
        customTheme,
        setCustomTheme,
        lang: ckLang,
        setLang,
        open,
        setOpen,
        route,
        setRoute,
        connector,
        setConnector,
        signInWithEthereum: (_d = (_c = React.useContext(SIWEContext)) === null || _c === void 0 ? void 0 : _c.enabled) !== null && _d !== void 0 ? _d : false,
        onConnect,
        // Other configuration
        options: opts,
        errorMessage,
        debugMode,
        log,
        displayError: (message, code) => {
            setErrorMessage(message);
            console.log('---------CONNECTKIT DEBUG---------');
            console.log(message);
            if (code)
                console.table(code);
            console.log('---------/CONNECTKIT DEBUG---------');
        },
    };
    return createElement(Context.Provider, { value }, jsx(Fragment, { children: jsxs(ThemeProvider, { theme: defaultTheme$1, children: [children, jsx(ConnectModal$1, { lang: ckLang, theme: ckTheme, mode: mode, customTheme: ckCustomTheme })] }) }));
};
const useContext = () => {
    const context = React.useContext(Context);
    if (!context)
        throw Error('ConnectKit Hook must be inside a Provider.');
    return context;
};

const safeRoutes = {
    disconnected: [
        routes.CONNECTORS,
        routes.ABOUT,
        routes.ONBOARDING,
        routes.MOBILECONNECTORS,
        routes.ONBOARDING,
    ],
    connected: [routes.PROFILE, routes.SWITCHNETWORKS, routes.SIGNINWITHETHEREUM],
};
const allRoutes = [
    ...safeRoutes.connected,
    ...safeRoutes.disconnected,
];
const useModal = ({ onConnect, onDisconnect } = {}) => {
    const context = useContext();
    useConnectCallback({
        onConnect,
        onDisconnect,
    });
    const { isConnected } = useAccount();
    const { signIn } = useSIWE();
    const close = () => {
        context.setOpen(false);
    };
    const open = () => {
        context.setOpen(true);
    };
    const gotoAndOpen = (route) => {
        let validRoute = route;
        if (!allRoutes.includes(route)) {
            validRoute = isConnected ? routes.PROFILE : routes.CONNECTORS;
            context.log(`Route ${route} is not a valid route, navigating to ${validRoute} instead.`);
        }
        else {
            if (isConnected) {
                if (!safeRoutes.connected.includes(route)) {
                    validRoute = routes.PROFILE;
                    context.log(`Route ${route} is not a valid route when connected, navigating to ${validRoute} instead.`);
                }
            }
            else {
                if (!safeRoutes.disconnected.includes(route)) {
                    validRoute = routes.CONNECTORS;
                    context.log(`Route ${route} is not a valid route when disconnected, navigating to ${validRoute} instead.`);
                }
            }
        }
        context.setRoute(validRoute);
        open();
    };
    return {
        open: context.open,
        setOpen: (show) => {
            if (show) {
                gotoAndOpen(isConnected ? routes.PROFILE : routes.CONNECTORS);
            }
            else {
                close();
            }
        },
        // Disconnected Routes
        openAbout: () => gotoAndOpen(routes.ABOUT),
        openOnboarding: () => gotoAndOpen(routes.ONBOARDING),
        // Connected Routes
        openProfile: () => gotoAndOpen(routes.PROFILE),
        openSwitchNetworks: () => gotoAndOpen(routes.SWITCHNETWORKS),
        openSIWE: (triggerSIWE) => {
            gotoAndOpen(routes.SIGNINWITHETHEREUM);
            if (triggerSIWE)
                signIn();
        },
    };
};

const TextContainer = styled(motion.div) `
  top: 0;
  bottom: 0;
  left: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
`;
styled(motion.div) `
  position: relative;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  overflow: hidden;
  svg {
    display: block;
  }
`;
const IconContainer = styled(motion.div) `
  pointer-events: none;
  user-select: none;
  position: relative;
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;
const UnsupportedNetworkContainer = styled(motion.div) `
  z-index: 1;
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.02);
  background: var(--ck-body-color-danger, red);
  color: #fff;
  svg {
    display: block;
    position: relative;
    top: -1px;
  }
`;

const Container$2 = styled(motion.div) `
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  height: 40px;
  padding: 0;
  line-height: 0;
  letter-spacing: -0.2px;
  font-size: var(--ck-connectbutton-font-size, 16px);
  font-weight: var(--ck-connectbutton-font-weight, 500);
  text-align: center;
  transition: 100ms ease;
  transition-property: color, background, box-shadow, border-radius;

  color: var(--color);
  background: var(--background);
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);

  &.primary {
    --color: var(--ck-connectbutton-color);
    --background: var(--ck-connectbutton-background);
    --box-shadow: var(--ck-connectbutton-box-shadow);
    --border-radius: var(--ck-connectbutton-border-radius, 12px);

    --hover-color: var(--ck-connectbutton-hover-color, var(--color));
    --hover-background: var(
      --ck-connectbutton-hover-background,
      var(--background)
    );
    --hover-box-shadow: var(
      --ck-connectbutton-hover-box-shadow,
      var(--box-shadow)
    );
    --hover-border-radius: var(
      --ck-connectbutton-hover-border-radius,
      var(--border-radius)
    );

    --active-color: var(--ck-connectbutton-active-color, var(--hover-color));
    --active-background: var(
      --ck-connectbutton-active-background,
      var(--hover-background)
    );
    --active-box-shadow: var(
      --ck-connectbutton-active-box-shadow,
      var(--hover-box-shadow)
    );
    --active-border-radius: var(
      --ck-connectbutton-active-border-radius,
      var(--hover-border-radius)
    );
  }
  &.secondary {
    --color: var(--ck-connectbutton-balance-color);
    --background: var(--ck-connectbutton-balance-background);
    --box-shadow: var(--ck-connectbutton-balance-box-shadow);
    --border-radius: var(
      --ck-connectbutton-balance-border-radius,
      var(--ck-connectbutton-border-radius, 12px)
    );

    --hover-color: var(--ck-connectbutton-balance-hover-color, var(--color));
    --hover-background: var(
      --ck-connectbutton-balance-hover-background,
      var(--background)
    );
    --hover-box-shadow: var(
      --ck-connectbutton-balance-hover-box-shadow,
      var(--box-shadow)
    );
    --hover-border-radius: var(
      --ck-connectbutton-balance-hover-border-radius,
      var(--border-radius)
    );

    --active-color: var(
      --ck-connectbutton-balance-active-color,
      var(--hover-color)
    );
    --active-background: var(
      --ck-connectbutton-balance-active-background,
      var(--hover-background)
    );
    --active-box-shadow: var(
      --ck-connectbutton-balance-active-box-shadow,
      var(--hover-box-shadow)
    );
    --active-border-radius: var(
      --ck-connectbutton-balance-active-border-radius,
      var(--hover-border-radius)
    );
  }
`;
const ThemeContainer = styled.button `
  all: initial;
  appearance: none;
  user-select: none;
  position: relative;
  padding: 0;
  margin: 0;
  background: none;
  border-radius: var(--ck-border-radius);

  &:disabled {
    pointer-events: none;
    opacity: 0.3;
  }

  display: flex;
  flex-wrap: nowrap;
  background: none;
  cursor: pointer;
  * {
    cursor: pointer;
  }
  &:hover {
    ${Container$2} {
      color: var(--hover-color, var(--color));
      background: var(--hover-background, var(--background));
      box-shadow: var(--hover-box-shadow, var(--box-shadow));
      border-radius: var(--hover-border-radius, var(--border-radius));
    }
  }
  &:active {
    ${Container$2} {
      color: var(--active-color, var(--hover-color, var(--color)));
      background: var(
        --active-background,
        var(--hover-background, var(--background))
      );
      box-shadow: var(
        --active-box-shadow,
        var(--hover-box-shadow, var(--box-shadow))
      );
      border-radius: var(
        --active-border-radius,
        var(--hover-border-radius, var(--border-radius))
      );
    }
  }
  &:focus-visible {
    outline: 2px solid var(--ck-family-brand);
  }
`;

const ThemedButton = ({ children, variant = 'primary', autoSize = true, duration = 0.3, style, }) => {
    const [contentRef, bounds] = useMeasure();
    return (jsx(Container$2, { className: variant, initial: false, animate: autoSize
            ? {
                width: bounds.width > 10 ? bounds.width : 'auto',
            }
            : undefined, transition: {
            duration: duration,
            ease: [0.25, 1, 0.5, 1],
            delay: 0.01,
        }, style: style, children: jsx("div", { ref: contentRef, style: {
                whiteSpace: 'nowrap',
                width: 'fit-content',
                position: 'relative',
                padding: '0 12px',
            }, children: children }) }));
};

const Container$1 = styled(motion.div) `
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;
const PlaceholderKeyframes = keyframes `
  0%,100%{ opacity: 0.1; transform: scale(0.75); }
  50%{ opacity: 0.75; transform: scale(1.2) }
`;
const PulseContainer = styled.div `
  pointer-events: none;
  user-select: none;
  padding: 0 5px;
  span {
    display: inline-block;
    vertical-align: middle;
    margin: 0 2px;
    width: 3px;
    height: 3px;
    border-radius: 4px;
    background: currentColor;
    animation: ${PlaceholderKeyframes} 1000ms ease infinite both;
  }
`;
const Balance = ({ hideIcon, hideSymbol }) => {
    const isMounted = useIsMounted();
    const [isInitial, setIsInitial] = useState(true);
    const { address } = useAccount();
    const { chain } = useNetwork();
    const { data: balance } = useBalance({
        address,
        chainId: chain === null || chain === void 0 ? void 0 : chain.id,
        watch: true,
    });
    const currentChain = supportedChains.find((c) => c.id === (chain === null || chain === void 0 ? void 0 : chain.id));
    const state = `${!isMounted || (balance === null || balance === void 0 ? void 0 : balance.formatted) === undefined
        ? `balance-loading`
        : `balance-${currentChain === null || currentChain === void 0 ? void 0 : currentChain.id}-${balance === null || balance === void 0 ? void 0 : balance.formatted}`}`;
    useEffect(() => {
        setIsInitial(false);
    }, []);
    return (jsx("div", { style: { position: 'relative' }, children: jsx(AnimatePresence, { initial: false, children: jsx(motion.div, { initial: (balance === null || balance === void 0 ? void 0 : balance.formatted) !== undefined && isInitial
                    ? {
                        opacity: 1,
                    }
                    : { opacity: 0, position: 'absolute', top: 0, left: 0, bottom: 0 }, animate: { opacity: 1, position: 'relative' }, exit: {
                    opacity: 0,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                }, transition: {
                    duration: 0.4,
                    ease: [0.25, 1, 0.5, 1],
                    delay: 0.4,
                }, children: !address || !isMounted || (balance === null || balance === void 0 ? void 0 : balance.formatted) === undefined ? (jsxs(Container$1, { children: [!hideIcon && jsx(Chain, {}), jsx("span", { style: { minWidth: 32 }, children: jsxs(PulseContainer, { children: [jsx("span", { style: { animationDelay: '0ms' } }), jsx("span", { style: { animationDelay: '50ms' } }), jsx("span", { style: { animationDelay: '100ms' } })] }) })] })) : (chain === null || chain === void 0 ? void 0 : chain.unsupported) ? (jsxs(Container$1, { children: [!hideIcon && jsx(Chain, { id: chain === null || chain === void 0 ? void 0 : chain.id }), jsx("span", { style: { minWidth: 32 }, children: "???" })] })) : (jsxs(Container$1, { children: [!hideIcon && jsx(Chain, { id: chain === null || chain === void 0 ? void 0 : chain.id }), jsx("span", { style: { minWidth: 32 }, children: nFormatter(Number(balance === null || balance === void 0 ? void 0 : balance.formatted)) }), !hideSymbol && ` ${balance === null || balance === void 0 ? void 0 : balance.symbol}`] })) }, state) }) }));
};

const contentVariants = {
    initial: {
        zIndex: 2,
        opacity: 0,
        x: '-100%',
    },
    animate: {
        opacity: 1,
        x: 0.1,
        transition: {
            duration: 0.4,
            ease: [0.25, 1, 0.5, 1],
        },
    },
    exit: {
        zIndex: 1,
        opacity: 0,
        x: '-100%',
        pointerEvents: 'none',
        position: 'absolute',
        transition: {
            duration: 0.4,
            ease: [0.25, 1, 0.5, 1],
        },
    },
};
const addressVariants = {
    initial: {
        zIndex: 2,
        opacity: 0,
        x: '100%',
    },
    animate: {
        x: 0.2,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: [0.25, 1, 0.5, 1],
        },
    },
    exit: {
        zIndex: 1,
        x: '100%',
        opacity: 0,
        pointerEvents: 'none',
        position: 'absolute',
        transition: {
            duration: 0.4,
            ease: [0.25, 1, 0.5, 1],
        },
    },
};
const textVariants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: [0.25, 1, 0.5, 1],
        },
    },
    exit: {
        position: 'absolute',
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: [0.25, 1, 0.5, 1],
        },
    },
};
const ConnectButtonRenderer = ({ children, }) => {
    const isMounted = useIsMounted();
    const context = useContext();
    const { open, setOpen } = useModal();
    const { chain } = useNetwork();
    const { address, isConnected } = useAccount();
    const { data: ensName } = useEnsName({
        chainId: 1,
        address: address,
    });
    function hide() {
        setOpen(false);
    }
    function show() {
        setOpen(true);
        context.setRoute(isConnected ? routes.PROFILE : routes.CONNECTORS);
    }
    if (!children)
        return null;
    if (!isMounted)
        return null;
    return (jsx(Fragment, { children: children({
            show,
            hide,
            chain: chain,
            unsupported: !!(chain === null || chain === void 0 ? void 0 : chain.unsupported),
            isConnected: !!address,
            isConnecting: open,
            address: address,
            truncatedAddress: address ? truncateEthAddress(address) : undefined,
            ensName: ensName === null || ensName === void 0 ? void 0 : ensName.toString(),
        }) }));
};
ConnectButtonRenderer.displayName = 'ConnectKitButton.Custom';
function ConnectKitButtonInner({ label, showAvatar, separator, }) {
    var _a;
    const locales = useLocales({});
    const context = useContext();
    const { isSignedIn } = useSIWE();
    const { address } = useAccount();
    const { data: ensName } = useEnsName({
        chainId: 1,
        address: address,
    });
    const { chain } = useNetwork();
    const defaultLabel = locales.connectWallet;
    return (jsx(AnimatePresence, { initial: false, children: address ? (jsxs(TextContainer, { initial: 'initial', animate: 'animate', exit: 'exit', variants: addressVariants, style: {
                height: 40,
                //padding: !showAvatar ? '0 5px' : undefined,
            }, children: [showAvatar && (jsxs(IconContainer, { children: [jsxs(AnimatePresence, { initial: false, children: [isSignedIn && (jsx(motion.div, { style: {
                                        zIndex: 2,
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                    }, initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: jsx(AuthIcon, {}) })), (chain === null || chain === void 0 ? void 0 : chain.unsupported) && (jsx(UnsupportedNetworkContainer, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: jsx("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: jsx("path", { d: "M1.68831 13.5H12.0764C13.1026 13.5 13.7647 12.7197 13.7647 11.763C13.7647 11.4781 13.6985 11.1863 13.5462 10.9149L8.34225 1.37526C8.02445 0.791754 7.45505 0.5 6.88566 0.5C6.31627 0.5 5.73364 0.791754 5.42246 1.37526L0.225108 10.9217C0.0728291 11.1863 0 11.4781 0 11.763C0 12.7197 0.662083 13.5 1.68831 13.5ZM6.88566 8.8048C6.49503 8.8048 6.27655 8.5809 6.26331 8.1738L6.16399 5.0595C6.15075 4.64562 6.44869 4.34708 6.87904 4.34708C7.30278 4.34708 7.61396 4.6524 7.60071 5.06628L7.5014 8.16701C7.48154 8.5809 7.26305 8.8048 6.88566 8.8048ZM6.88566 11.3492C6.44207 11.3492 6.07792 11.0303 6.07792 10.5757C6.07792 10.1211 6.44207 9.80219 6.88566 9.80219C7.32926 9.80219 7.69341 10.1143 7.69341 10.5757C7.69341 11.0371 7.32264 11.3492 6.88566 11.3492Z", fill: "currentColor" }) }) }))] }), jsx(Avatar, { size: 24, address: address })] })), jsx("div", { style: {
                        position: 'relative',
                        paddingRight: showAvatar ? 1 : 0,
                    }, children: jsx(AnimatePresence, { initial: false, children: ensName ? (jsx(TextContainer, { initial: 'initial', animate: 'animate', exit: 'exit', variants: textVariants, style: {
                                position: ensName ? 'relative' : 'absolute',
                            }, children: ((_a = context.options) === null || _a === void 0 ? void 0 : _a.truncateLongENSAddress)
                                ? truncateENSAddress(ensName, 20)
                                : ensName }, "ckEnsName")) : (jsxs(TextContainer, { initial: 'initial', animate: 'animate', exit: 'exit', variants: textVariants, style: {
                                position: ensName ? 'absolute' : 'relative',
                            }, children: [truncateEthAddress(address, separator), ' '] }, "ckTruncatedAddress")) }) })] }, "connectedText")) : (jsx(TextContainer, { initial: 'initial', animate: 'animate', exit: 'exit', variants: contentVariants, style: {
                height: 40,
                //padding: '0 5px',
            }, children: label ? label : defaultLabel }, "connectWalletText")) }));
}
function ConnectKitButton({ 
// Options
label, showBalance = false, showAvatar = true, 
// Theming
theme, mode, customTheme, 
// Events
onClick, }) {
    var _a;
    const isMounted = useIsMounted();
    const context = useContext();
    const { isConnected, address } = useAccount();
    const { chain } = useNetwork();
    function show() {
        context.setOpen(true);
        context.setRoute(isConnected ? routes.PROFILE : routes.CONNECTORS);
    }
    const separator = ['web95', 'rounded', 'minimal'].includes((_a = theme !== null && theme !== void 0 ? theme : context.theme) !== null && _a !== void 0 ? _a : '')
        ? '....'
        : undefined;
    if (!isMounted)
        return null;
    const shouldShowBalance = showBalance && !(chain === null || chain === void 0 ? void 0 : chain.unsupported);
    const willShowBalance = address && shouldShowBalance;
    return (jsx(ResetContainer, { "$useTheme": theme !== null && theme !== void 0 ? theme : context.theme, "$useMode": mode !== null && mode !== void 0 ? mode : context.mode, "$customTheme": customTheme !== null && customTheme !== void 0 ? customTheme : context.customTheme, children: jsxs(ThemeContainer, { onClick: () => {
                if (onClick) {
                    onClick(show);
                }
                else {
                    show();
                }
            }, children: [shouldShowBalance && (jsx(AnimatePresence, { initial: false, children: willShowBalance && (jsx(motion.div, { initial: {
                            opacity: 0,
                            x: '100%',
                            width: 0,
                            marginRight: 0,
                        }, animate: {
                            opacity: 1,
                            x: 0,
                            width: 'auto',
                            marginRight: -24,
                            transition: {
                                duration: 0.4,
                                ease: [0.25, 1, 0.5, 1],
                            },
                        }, exit: {
                            opacity: 0,
                            x: '100%',
                            width: 0,
                            marginRight: 0,
                            transition: {
                                duration: 0.4,
                                ease: [0.25, 1, 0.5, 1],
                            },
                        }, children: jsx(ThemedButton, { variant: 'secondary', theme: theme !== null && theme !== void 0 ? theme : context.theme, mode: mode !== null && mode !== void 0 ? mode : context.mode, customTheme: customTheme !== null && customTheme !== void 0 ? customTheme : context.customTheme, style: { overflow: 'hidden' }, children: jsx(motion.div, { style: { paddingRight: 24 }, children: jsx(Balance, { hideSymbol: true }) }) }) }, 'balance')) })), jsx(ThemedButton, { theme: theme !== null && theme !== void 0 ? theme : context.theme, mode: mode !== null && mode !== void 0 ? mode : context.mode, customTheme: customTheme !== null && customTheme !== void 0 ? customTheme : context.customTheme, style: shouldShowBalance &&
                        showBalance &&
                        address &&
                        (theme === 'retro' || context.theme === 'retro')
                        ? {
                            /** Special fix for the retro theme... not happy about this one */
                            boxShadow: 'var(--ck-connectbutton-balance-connectbutton-box-shadow)',
                            borderRadius: 'var(--ck-connectbutton-balance-connectbutton-border-radius)',
                            overflow: 'hidden',
                        }
                        : {
                            overflow: 'hidden',
                        }, children: jsx(ConnectKitButtonInner, { separator: separator, showAvatar: showAvatar, label: label }) })] }) }));
}
ConnectKitButton.Custom = ConnectButtonRenderer;

const dist = 8;
const shake = keyframes `
  0%{ transform:none; }
  25%{ transform:translateX(${dist}px); }
  50%{ transform:translateX(-${dist}px); }
  75%{ transform:translateX(${dist}px); }
  100%{ transform:none; }
`;
const cursorIn = keyframes `
  0%{ transform:translate(500%,100%); opacity:0; }
  60%{ transform:translate(25%,-20%); opacity:1; }
  70%{ transform:translate(25%,-20%); }
  85%{ transform:translate(25%,-20%) scale(0.9); }
  100%{ transform:translate(25%,-20%) scale(1); opacity:1; }
`;
const Cursor = styled.div `
  z-index: 2;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4), 0 4px 6px rgba(0, 0, 0, 0.1);
  opacity: 0;
  &.play {
    animation: ${cursorIn} 1300ms 200ms cubic-bezier(0.16, 1, 0.6, 1) both;
  }
`;
const Container = styled.div `
  z-index: 1;
  position: absolute;
  inset: 0;
  &.shake {
    animation: ${shake} 300ms 100ms cubic-bezier(0.16, 1, 0.6, 1) both;
  }
`;
const ButtonContainer = styled.div `
  z-index: 1;
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  &:before {
    z-index: 9;
    content: '';
    position: absolute;
    inset: 0;
  }
`;
const customThemeDefault = {};
const ConnectModal = ({ theme = 'auto', customTheme = customThemeDefault, lang = 'en-US', mode = 'auto', inline = false, open, onClose, }) => {
    var _a;
    const context = useContext();
    const { isConnected } = useAccount();
    const { chain } = useNetwork();
    //if chain is unsupported we enforce a "switch chain" prompt
    const closeable = !(((_a = context.options) === null || _a === void 0 ? void 0 : _a.enforceSupportedChains) && (chain === null || chain === void 0 ? void 0 : chain.unsupported));
    const showBackButton = closeable &&
        context.route !== routes.CONNECTORS &&
        context.route !== routes.PROFILE;
    const showInfoButton = closeable && context.route !== routes.PROFILE;
    const onBack = () => {
        if (context.route === routes.SIGNINWITHETHEREUM) {
            context.setRoute(routes.PROFILE);
        }
        else if (context.route === routes.SWITCHNETWORKS) {
            context.setRoute(routes.PROFILE);
        }
        else if (context.route === routes.DOWNLOAD) {
            context.setRoute(routes.CONNECT);
        }
        else {
            context.setRoute(routes.CONNECTORS);
        }
    };
    const pages = {
        onboarding: jsx(Introduction, {}),
        about: jsx(About, {}),
        download: jsx(DownloadApp, { connectorId: context.connector }),
        connectors: jsx(Wallets, {}),
        mobileConnectors: jsx(MobileConnectors, {}),
        connect: jsx(ConnectUsing, { connectorId: context.connector }),
        profile: jsx(Profile, { closeModal: () => setIsOpen(false) }),
        switchNetworks: jsx(SwitchNetworks, {}),
        signInWithEthereum: jsx(SignInWithEthereum, {}),
    };
    const ref = useRef(null);
    const cursorRef = useRef(null);
    const [isOpen, setIsOpen] = useState(open !== null && open !== void 0 ? open : false);
    useEffect(() => {
        if (open)
            context.setRoute(isConnected ? routes.PROFILE : routes.CONNECTORS);
        setIsOpen(open !== null && open !== void 0 ? open : false);
    }, [open]);
    useEffect(() => {
        if (isOpen)
            context.setRoute(isConnected ? routes.PROFILE : routes.CONNECTORS);
    }, [isOpen]);
    useEffect(() => {
        if (!isOpen && inline) {
            if (onClose) {
                if (cursorRef.current) {
                    cursorRef.current.classList.remove('play');
                    void cursorRef.current.offsetWidth;
                    cursorRef.current.classList.add('play');
                }
                setTimeout(() => {
                    setIsOpen(true);
                }, 1500);
            }
            else {
                setTimeout(() => {
                    setIsOpen(true);
                }, 500);
            }
        }
    }, [isOpen]);
    //useEffect(() => setIsOpen(false), [isConnected]);
    const onModalClose = () => {
        if (onClose) {
            setIsOpen(false);
            onClose();
        }
        else {
            if (ref.current) {
                // reset animation
                ref.current.classList.remove('shake');
                void ref.current.offsetWidth;
                ref.current.classList.add('shake');
            }
        }
    };
    useEffect(() => {
        var _a;
        if (isConnected) {
            if (context.route !== routes.PROFILE ||
                context.route !== routes.SIGNINWITHETHEREUM) {
                if (context.signInWithEthereum &&
                    !((_a = context.options) === null || _a === void 0 ? void 0 : _a.disableSiweRedirect)) {
                    context.setRoute(routes.SIGNINWITHETHEREUM);
                }
                else {
                    onModalClose(); // Hide on connect
                }
            }
        }
        else {
            onModalClose(); // Hide on connect
        }
    }, [isConnected]);
    /* When pulling data into WalletConnect, it prioritises the og:title tag over the title tag */
    useEffect(() => {
        const appName = getAppName();
        if (!appName || (!open && !inline))
            return;
        const title = document.createElement('meta');
        title.setAttribute('property', 'og:title');
        title.setAttribute('content', appName);
        document.head.prepend(title);
        return () => {
            document.head.removeChild(title);
        };
    }, [open, inline]);
    return (jsx(ConnectKitThemeProvider, { theme: theme, customTheme: customTheme, mode: mode, children: jsxs(Container, { ref: ref, children: [inline && onClose && (jsxs(Fragment, { children: [jsx(Cursor, { ref: cursorRef }), jsx(ButtonContainer, { children: jsx(ConnectKitButton, { customTheme: customTheme, theme: theme, mode: mode }) })] })), jsx(Modal, { demo: { theme: theme, customTheme: customTheme, mode: mode }, onClose: closeable ? onModalClose : undefined, positionInside: inline, open: isOpen, pages: pages, pageId: context.route, onInfo: showInfoButton ? () => context.setRoute(routes.ABOUT) : undefined, onBack: showBackButton ? onBack : undefined })] }) }));
};

export { Avatar, Chain as ChainIcon, ConnectKitButton, ConnectModal as ConnectKitModalDemo, ConnectKitProvider, Context, SIWEButtonComponent as SIWEButton, SIWEProvider, types as Types, defaultConfig as getDefaultConfig, supportedConnectors$1 as supportedConnectors, useChains, useIsMounted, useModal, useSIWE };
//# sourceMappingURL=index.es.js.map
