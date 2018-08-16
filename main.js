const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

// listen for the app to be ready
app.on('ready', function(){
// create new window
    mainWindow = new BrowserWindow({});
    //load html
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // quit whole app when main window is closed
    mainWindow.on('closed', function(){
        app.quit();
    });

    //build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // insert menu
    Menu.setApplicationMenu(mainMenu)
});

// handle create add window
function createAddWindow() {
// create new window
addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title:'Add Podcast'
});
//load html
addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes: true
}));
// garbage collection handle
addWindow.on('close', function() {
addWindow = null;
});
}

// handle create real add/search window
function createSearchWindow() {
    // create new window
    searchWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title:'Search for a Podcast'
    });
    //load html
    searchWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'searchWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    // garbage collection handle
    searchWindow.on('close', function() {
    searchWindow = null;
    });
    }


// catch item:add
ipcMain.on('item:add', function(e, item){
    console.log(item);
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});

//  create menu template
const mainMenuTemplate = [
{
    label:'File',
    submenu:[{
        label: 'Add Podcast',
        click(){
            createAddWindow();
        }
        },
        {
            label: 'Clear Podcasts',
            click(){
                mainWindow.webContents.send('item:clear');
            }
        },
        {
            label:'Add REAL Podcast',
            click(){
                createSearchWindow();
            }
        },
        {
            label:'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' :
            'Ctrl+Q',
            click(){
                app.quit();
            }
        }
    ]
    },
];

// if mac, add empty object to menu
if(process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

// add dev tools item if not in prod
if (process.env .NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Dev Tools',
        submenu: [
            {
            label: 'Toggle Devtools',
            accelerator: process.platform == 'darwin' ? 'Command+I' :
            'Ctrl+I',
            click(item, focusedWindow){
                focusedWindow.toggleDevTools();
            }
          },
          {
              role: 'reload'
          }
        ]
    });
}