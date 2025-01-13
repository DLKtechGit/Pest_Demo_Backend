const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const { DB_CONNECTION_URL } = require('./env/env')
const app = express();
const path = require('path')
const puppeteer = require('puppeteer'); // Import Puppeteer


const CreateServices = require("./Routes/AdminRoutes/CreateService")
const CompanyData = require("./Routes/AdminRoutes/Company")
const TechnicianData = require("./Routes/AdminRoutes/TechnicianRoutes")
const Tasks = require("./Routes/AdminRoutes/Tasks")
const Admin = require("./Routes/AdminRoutes/AdminAuth")
const OtherAuth = require("./Routes/AdminRoutes/OtherAuth")
const Qrcode = require("./Routes/AdminRoutes/Qrcode")
const Chemicals = require("./Routes/AdminRoutes/CreateChemicals")
const Pdf = require ("./Routes/AdminRoutes/Pdf")
const serviceCategory = require ("./Routes/AdminRoutes/ServiceCategory")
const Issues = require ("./Routes/AdminRoutes/Issues")

app.get("/", (req, res) => {
    res.send("from get route")
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


app.use('/services', CreateServices);
app.use('/company', CompanyData);
app.use('/technician', TechnicianData);
app.use('/task', Tasks);
app.use('/adminauth', Admin);
app.use('/otherauth', OtherAuth);
app.use('/qrcode',Qrcode)
app.use('/category',serviceCategory)

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/images', express.static(path.join(__dirname, '/pdf_images')));
app.use('/reports', express.static(path.join(__dirname, '/reports')));

app.use('/chemicals',Chemicals)
app.use('/pdf',Pdf)
app.use('/issuesApi',Issues)

app.use('/EmailImgs', express.static(path.join(__dirname, '/EmailImgs')));

// const uri = '';
  
mongoose.connect(DB_CONNECTION_URL) 
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

  // Puppeteer Task Example (Executed on Server Start)
const runPuppeteerTask = async () => {
    try {
      console.log("Launching Puppeteer..."); 
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('https://pest-demo-backend.onrender.com'); // Replace with your target URL
      const title = await page.title();
      console.log(`Page title: ${title}`);
      await browser.close();
      console.log("Puppeteer task completed!");
    } catch (error) {
      console.error("Error with Puppeteer:", error);
    }
  };
  
  // Call Puppeteer Task (Optional: Remove if not needed on startup)
  runPuppeteerTask();
  
  // Puppeteer API Endpoint
  app.get('/puppeteer-task', async (req, res) => {
    try {
      console.log("Running Puppeteer task...");
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('https://pest-demo-backend.onrender.com'); // Replace with your target URL
      const title = await page.title();
      await browser.close();
      res.json({ success: true, title });
    } catch (error) {
      console.error("Error with Puppeteer:", error);
      res.status(500).json({ success: false, error: error.message });
    }   
  });
  


const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log('Backend Server alive on port ' + PORT)
})   