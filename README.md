# PlaceWUG Bot - German
Fork von PlaceNL Bot. Thanks guys!  
Der Bot für PlaceWUG! Dieser Bot holt automatisch alle paar Minuten [Pläne](https://github.com/placeWUG/pixel), um zu verhindern, dass Bots miteinander kollidieren.

## Installationsanweisungen

Überprüfe, dass gerade neue Pixel plaziert werden können und dies nicht auf Cooldown ist

1. Installiere die Browsererweiterung [Tampermonkey](https://www.tampermonkey.net/) oder [Violentmonkey (Firefox)](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/).
2. Klicke auf diesen Link: [https://github.com/PlaceWUG/Bot/raw/main/placedebot.user.js](https://github.com/PlaceWUG/Bot/raw/main/placedebot.user.js). Wenn alles gut geht, bietet Tampermonkey an, ein Benutzerskript zu installieren. Klicke auf **Installieren**.
3. Lade den **r/place** Tab neu. Wenn alles gut gegangen ist, sollte "Abfrage des Zugriffstokens..." oben rechts auf dem Bildschirm zu sehen sein. Der Bot ist nun aktiv und wird diese Benachrichtigungen oben rechts für laufende Informationen nutzen.
4. In Chrome werden Browsertabs in den Ruhemodus versetzt, wenn sie nicht mehr sichtbar oder im Hintergrund / minimiert sind. Lösung: in der Adresszeile nach `chrome://discards/` gehen, und dort bei auto-discardable togglen das dort ein X ist für den Bot-Tab, dann bleibt der tab active.

WICHTIG: Sollten anbleibende Verbindungsprobleme zum Server bestehen kann dies an eurem Adblocker etc. liegen!

## Schwachstellen des Bots

- Der Bot aktualisiert die Cooldown Nachricht nicht, so dass es aussieht als ob noch ein Pixel platziert werden kann. Der Bot hat das Pixel jedoch schon platziert und wartet nun auf den Cooldown.
- Der Bot berücksichtigt eine bestehende Abklingzeit nicht und geht daher davon aus, dass man sofort einen Pixel platzieren kann, wenn man **r/place** öffnet. Im schlimmsten fall gehen so 5 Minuten verloren

<br/>

# PlaceWUG Bot - English
Fork from PlaceNL Bot. Thanks guys!  
The bot for PlaceWUG! This bot automatically fetches [plans](https://github.com/placeWUG/pixel) every few minutes to prevent bots from colliding with each other.

## Installation Instructions

Check that your account is not on cooldown, so the bot can place a pixel as soon as it's activated.

1. Install the [Tampermonkey (Chrome)](https://www.tampermonkey.net/) or [Violentmonkey (Firefox)](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/) browser extension.
2. Click on this link: [https://github.com/PlaceWUG/Bot/raw/main/placedebot.user.js](https://github.com/PlaceWUG/Bot/raw/main/placedebot.user.js ). If all goes well, Tampermonkey will offer to install a user script. Click **Install**
3. Reload the **r/place** tab. If all went well, you should see 'Ask for access token...' at the top right of the screen. The bot is now active and will use these notifications at the top right for ongoing information.
4. In Chrome, browser tabs are put into idle mode when they are no longer visible or in the background / minimized. Solution: in the address bar go to `chrome://discards/`, and toggle auto-discardable so that there is an X for the bot tab, then the tab remains active.

IMPORTANT: If there are persistent connection problems to the server, this may be due to your adblocker, etc.!

## Bot Weaknesses

- The bot doesn't update the cooldown message, so it looks like there's still a pixel to place. However, the bot has already placed the pixel and is now waiting for the cooldown.
- The bot doesn't take into account an existing cooldown, so it assumes you can place a pixel immediately when you open **r/place**. Worst case, 5 minutes are lost.
