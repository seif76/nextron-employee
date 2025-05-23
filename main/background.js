import path from 'path'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'

//
import express from "express";
import cors from "cors";
import { resetSalaries } from "./services/salaryService.js";  // ✅ Import reset function

//import "./services/salaryScheduler.js";
//import bodyParser from "body-parser";
//


import employeeRouter from "./controllers/employeeController"
import departmentRouter from "./controllers/departmentController"
import attendanceRouter from "./controllers/attendanceController"
import absentRouter from "./controllers/absentController"
import analticsRouter from "./controllers/analyticsController.js"
import authRouter from "./controllers/authController.js"



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
  server.use("/api",analticsRouter)
  server.use("/api/auth",authRouter)
  
  
 
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

  console.log("🔄 Checking salary reset...");
  await resetSalaries();  // ✅ Only call the function here
  console.log("✅ Salary reset check completed.");


  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (isProd) {
    await mainWindow.loadURL('app://./login')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/login`)
    mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})
