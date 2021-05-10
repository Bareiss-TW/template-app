let appVer = '';
let appName = 'Minimal React-Electron App';

if (process.env.NODE_ENV === 'development') {
  appVer = require('../package.json').version;
  appName = require('../package.json').name;
} else {
  appVer = require('electron').remote.app.getVersion();
  appName = require('electron').remote.app.name;
}

document.title = appName + ' v' + appVer;