DAZURIO – local browser build
============================

Files
-----
index.html      Main app page
style.css      Styling and responsive layout
app.js         Navigation, login UI, profile, settings, archive and page actions
game.js       Daily, archive, practice and endless game flow
effects.js     UI effects, animation and sounds
questions.js   Question database
storage.js    Local browser storage and account/progress helpers


Start
-----
1. Extract the ZIP into a folder.
2. Open index.html in a modern browser (Chrome, Edge or Firefox).
3. Create a local demo account and play.

If your browser blocks local file storage or scripts, run a local server from this
folder (Python installed):

  python -m http.server 8000

Then open http://localhost:8000


Current prototype features
--------------------------
- Daily and archive challenges, Endless, Practice, Speed Run, Survival, Mystery,
  World Tour and Boss Challenge.
- Plus challenge links that friends can open, plus-only archive filters, and
  all-time, daily, weekly and monthly local leaderboards.
- Player levels, streak milestones, weekly quests, achievements, collectible
  collections, profile frames, titles and avatar pictures.
- Lifetime Plus demo unlock with advanced practice, extended local history,
  additional insights, exclusive frames/titles, an Early Access title and a Plus achievement.
- Local friends, local friend rankings, event/question/reward tools, a local
  player manager and visual Owner cosmetics in DAZURIO Studio.

Important prototype limitations
-------------------------------
All accounts, friends, cosmetics, event settings and leaderboards are stored in
this browser only. They do not synchronize across browsers or devices. Online
friends, global leaderboards, server-run events and secure account roles need a
real backend.

The Plus redemption code is currently checked in client-side JavaScript. It is
visible to anyone inspecting the source and is only a prototype convenience,
not secure payment or entitlement validation. The Studio passphrase is also a
client-side convenience lock. The Owner frame/title are visual cosmetics only;
they do not grant trusted administrator permissions.

Notes
-----
Accounts, progress and settings are saved locally in this browser. This is a
client-side demo, not a secure production authentication service. It does not
synchronize data across devices.

The scripts have been syntax checked, the question database validated, and basic
storage registration/login/save-history/logout smoke-tested. Full interactive
browser testing was not completed in this environment.
