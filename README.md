<<<<<<< HEAD
# practice
Real-time PC resource monitoring dashboard using Node.js, Chart.js, and Google Sheets API as a free cloud database.
=======
# 🌩️ Cloud Resource Monitor (Google Sheets API)

![Project Status](https://img.shields.io/badge/Status-Active-success.svg)
![Nodejs](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js)
![HTML/CSS](https://img.shields.io/badge/Vanilla_JS-Frontend-F7DF1E?logo=javascript)
![Google Sheets](https://img.shields.io/badge/Google_Sheets-Database-34A853?logo=google-sheets)

A lightweight remote monitoring system that captures the current status of computer resources (CPU, RAM, Temperature) and logs it directly into a **Google Sheets** cloud database.

This includes an interactive **Frontend Dashboard** that reads data in real-time from your public spreadsheet and renders it using **Chart.js** with a modern *Glassmorphism* design.

---

## 🎯 Main Features

- **No Traditional Database Required:** Uses the Google Sheets API as a free and lightweight cloud database.
- **Serverless Frontend:** The dashboard fetches data directly from the public Google Sheets CSV export link. This means you can host the frontend anywhere statically without any backend logic.
- **Premium UI Design:** Modern graphical interface with dark mode, glass UI effects, and modern typography.
- **Background Logging:** A Node.js backend script meant to run silently on your machine to monitor resources.

---

## 🏗️ Project Architecture

The project is split into two independent ecosystems:

```
monitoreo-recursos/
├── backend/                  # Metrics Collector (Node.js)
│   ├── .env                  # Hidden variables (Sheet ID)
│   ├── credentials.json      # Private Key for API access (GCP)
│   ├── package.json          # Dependency list
│   └── index.js              # Main collector logic
└── frontend/                 # Visual Dashboard (HTML/CSS/JS)
    ├── index.html            # Dashboard HTML
    ├── style.css             # Glassmorphism visual styles
    └── script.js             # Data fetching & Chart.js rendering
```

---

## 🚀 Prerequisites

1. **Node.js**: Version 16+ installed.
2. **Google Cloud Account**: A Google Cloud project with the *Google Sheets API* enabled and a "Service Account" to generate your `credentials.json` file.
3. **Google Sheets**: An empty spreadsheet created, with its ID extracted from the browser URL.

---

## 🛠️ Installation and Setup

### 1. Database Setup (Google Sheets)
1. Create a spreadsheet in Google Sheets and name the columns in the first row: `TimeStamp`, `CPU`, `RAM`, `Temp`.
2. Click "Share" and change the General Access to **"Anyone with the link"**.
3. Copy the **Spreadsheet ID** (the long alphanumeric string in the URL).

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Paste your `credentials.json` (downloaded from GCP Service Accounts, remember to share the Google Sheet with that exact service email as an Editor).
4. Run the collector:
   ```bash
   node index.js
   ```

### 3. Dashboard Setup (Frontend)
1. Launch a local web server in the frontend folder, for example with Node:
   ```bash
   npx serve
   ```
   Or Python:
   ```bash
   python3 -m http.server 3000
   ```
2. Open the displayed `localhost:3000` URL in any browser.
3. Enter your **Spreadsheet ID** in the top input field and hit connect.
4. The frontend will automatically download, parse, and render your servers' CPU, RAM, and temperature metrics.

---

## 🔥 Best Practices Applied

- **Modularity:** The Frontend and Backend are completely separated.
- **Security:** Secret tokens and keys are kept out of version control (`.gitignore` covers `credentials.json` and `node_modules`).
- **Resilience:** Try/catch blocks implemented to ensure network cutoffs do not crash the Node.js collector.

---

*Made with Node.js, Vanilla JS, and Chart.js.*
>>>>>>> c73bb34 (feat: initial release with full nodejs to google sheets integration)
