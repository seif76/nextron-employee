import path from 'path'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'

//
import express from "express";
import cors from "cors";
//import bodyParser from "body-parser";
//


import employeeRouter from "./controllers/employeeController"
import departmentRouter from "./controllers/departmentController"
import attendanceRouter from "./controllers/attendanceController"
import absentRouter from "./controllers/absentController"




const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}


const startServer = () => {
  const server = express();
  server.use(cors());
  server.use(express.json());
  //server.use(bodyParser.json());
  server.use(express.urlencoded({ extended: true }));
  server.get("/api/test", (req, res) => {
    res.status(200).json({ message: "API is working!" });
  });

  server.use("/api",employeeRouter)
  server.use("/api",departmentRouter)
  server.use("/api",attendanceRouter)
  server.use("/api",absentRouter)
  
  

  // Start Express Server
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
};


// Start Express Server
startServer();

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (isProd) {
    await mainWindow.loadURL('app://./employees')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/employees`)
    mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})
