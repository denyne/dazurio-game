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


Notes
-----
Accounts, progress and settings are saved locally in this browser. This is a
client-side demo, not a secure production authentication service. It does not
synchronize data across devices.

The scripts have been syntax checked, the question database validated, and basic
storage registration/login/save-history/logout smoke-tested. Full interactive
browser testing was not completed in this environment.
