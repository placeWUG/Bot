// ==UserScript==
// @name         PlaceDE Bot
// @namespace    https://github.com/PlaceDE/Bot
// @version      15
// @description  /r/place bot
// @author       NoahvdAa, reckter, SgtChrome, nama17, Kronox
// @match        https://www.reddit.com/r/place/*
// @match        https://new.reddit.com/r/place/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @require	     https://cdn.jsdelivr.net/npm/toastify-js
// @resource     TOASTIFY_CSS https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css
// @updateURL    https://github.com/PlaceDE/Bot/raw/main/placedebot.user.js
// @downloadURL  https://github.com/PlaceDE/Bot/raw/main/placedebot.user.js
// @grant        GM_getResourceText
// @grant        GM_addStyle
// ==/UserScript==

// Ignore that hideous code. But if it works, it works.

const VERSION = 15;

const TOKEN_URL = 'https://new.reddit.com/r/place/'
const PLACE_URL = 'https://gql-realtime-2.reddit.com/query';
const UPDATE_URL = 'https://github.com/placeDE/Bot/raw/main/placedebot.user.js';

let accessToken;
let canvas = document.createElement('canvas');

let ccConnection;

(function () {
	GM_addStyle(GM_getResourceText('TOASTIFY_CSS'));

	canvas.width = 2000;
	canvas.height = 1000;
	canvas = document.body.appendChild(canvas);

	void initToken();
	void initServerConnection();
})();

async function initToken() {
	// Create AccessToken
	Toastify({
		text: 'Abfrage des Zugriffstokens...',
		duration: 10000
	}).showToast();
	accessToken = await getAccessToken();
	Toastify({
		text: 'Zugriffstoken eingesammelt!',
		duration: 10000
	}).showToast();
}

async function initServerConnection() {
	// Establish connection to command&control server
	Toastify({
		text: 'Verbinde mit dem Kommando-Server...',
		duration: 10000
	}).showToast();

	ccConnection = new WebSocket('wss://placede.ml');
	ccConnection.onopen = function () {
		Toastify({
			text: 'Verbindung zum Server aufgebaut!',
			duration: 10000
		}).showToast();

		// handshake
		ccConnection.send(JSON.stringify({ "platform": "browser", "version": VERSION }));
	}
	ccConnection.onerror = function (error) {
		Toastify({
			text: 'Verbindung zum Server fehlgeschlagen!',
			duration: 10000,
			style: {
				background: "red",
			},
		}).showToast();
		console.log('WebSocket Error: '+ error);
	};
	ccConnection.onmessage  = processOperation;
}

function processOperation(message) {
	console.log('WebSocket Message received: '+message.data);
	const messageData = JSON.parse(message.data);
	switch (messageData.operation) {
		case 'place-pixel':
			void processOperationPlacePixel(messageData.data);
			return;
		case 'notify-update':
			void processOperationNotifyUpdate(messageData.data);
			return;
	}
}

async function processOperationPlacePixel(data) {
	const x = data.x;
	const y = data.y;
	const color = data.color;

	Toastify({
		text: `Pixel wird gesetzt auf ${x}, ${y}...`,
		duration: 10000
	}).showToast();

	const time = new Date().getTime();
	let nextAvailablePixelTimestamp = await place(x, y, color) ?? new Date(time + 1000 * 60 * 5 + 1000 * 15)

	// Sanity check timestamp
	if (nextAvailablePixelTimestamp < time || nextAvailablePixelTimestamp > time + 1000 * 60 * 5 + 1000 * 15) {
		nextAvailablePixelTimestamp = time + 1000 * 60 * 5 + 1000 * 15;
	}

	// Add a few random seconds to the next available pixel timestamp
	const waitFor = nextAvailablePixelTimestamp - time + (Math.random() * 1000 * 15);

	const minutes = Math.floor(waitFor / (1000 * 60))
	const seconds = Math.floor((waitFor / 1000) % 60)
	Toastify({
		text: `Warten auf Abklingzeit ${minutes}:${seconds} bis ${new Date(nextAvailablePixelTimestamp).toLocaleTimeString()}`,
		duration: waitFor
	}).showToast();
	setTimeout(setReady, waitFor);
}

async function processOperationNotifyUpdate(data) {
	Toastify({
		text: `Neue Version verfügbar! Aktulaisiere unter ${UPDATE_URL}`,
		duration: 10000
	}).showToast();
}

function setReady() {
	ccConnection.send("request_pixel");
}

/**
 * Places a pixel on the canvas, returns the "nextAvailablePixelTimestamp", if succesfull
 * @param x
 * @param y
 * @param color
 * @returns {Promise<number>}
 */
async function place(x, y, color) {
	const response = await fetch(PLACE_URL, {
		method: 'POST',
		body: JSON.stringify({
			'operationName': 'setPixel',
			'variables': {
				'input': {
					'actionName': 'r/replace:set_pixel',
					'PixelMessageData': {
						'coordinate': {
							'x': x % 1000,
							'y': y % 1000
						},
						'colorIndex': color,
						'canvasIndex': (x > 999 ? 1 : 0)
					}
				}
			},
			'query': `mutation setPixel($input: ActInput!) {
				act(input: $input) {
					data {
						... on BasicMessage {
							id
							data {
								... on GetUserCooldownResponseMessageData {
									nextAvailablePixelTimestamp
									__typename
								}
								... on SetPixelResponseMessageData {
									timestamp
									__typename
								}
								__typename
							}
							__typename
						}
						__typename
					}
					__typename
				}
			}
			`
		}),
		headers: {
			'origin': 'https://hot-potato.reddit.com',
			'referer': 'https://hot-potato.reddit.com/',
			'apollographql-client-name': 'mona-lisa',
			'Authorization': `Bearer ${accessToken}`,
			'Content-Type': 'application/json'
		}
	});
	console.log(response);
	const data = await response.json()
	if (data.errors !== undefined) {
		Toastify({
			text: 'Fehler beim Platzieren des Pixels, warte auf Abkühlzeit...',
			duration: 10000
		}).showToast();
		return data.errors[0].extensions?.nextAvailablePixelTs
	}
	return data?.data?.act?.data?.[0]?.data?.nextAvailablePixelTimestamp
}

async function getAccessToken() {
	const response = await fetch(TOKEN_URL);
	const responseText = await response.text();

	// TODO: Make it fancy.
	return responseText.split('\"accessToken\":\"')[1].split('"')[0];
}
