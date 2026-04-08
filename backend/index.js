import 'dotenv/config.js';
import { google } from 'googleapis';
import si from 'systeminformation';

// Basic configuration
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = '1j60kcsoJ0gUFthTxunlnXg6aAT-0hX-M_TWzR0j12mc';

// Function to initialize Google API connection
async function authGoogle() {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: "credentials.json",
            scopes: SCOPES,
        });

        const client = await auth.getClient();
        const googleSheests = google.sheets({ version: 'v4', auth: client });

        return googleSheests;
    } catch (error) {
        console.error("Error authenticating with Google API:", error);
        process.exit(1);
    }
}

async function writeData() {
    try {
        const load = await si.currentLoad();
        const mem = await si.mem();
        const temp = await si.cpuTemperature();

        const timestamp = new Date().toISOString();
        const cpuUsage = load.currentLoad.toFixed(2);
        const ramUsage = ((mem.active / mem.total) * 100).toFixed(2);
        const tempCPU = temp.main.toFixed(2);

        return [timestamp, cpuUsage, ramUsage, tempCPU];
    } catch (error) {
        console.error("Error getting system data:", error);
        return null;
    }
}

async function sendDataToSheets(googleSheets, metrics) {
    try {
        await googleSheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Hoja 1!A:D',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [metrics]
            }
        });
        console.log(`[${metrics[0]}] Data sent to Google Sheets: CPU ${metrics[1]}%, RAM ${metrics[2]}%, Temp ${metrics[3]}°C`);
    } catch (error) {
        console.error("Error sending data to Google Sheets:", error);
    }
}

async function startMonitoring() {
    console.log("Starting cloud resource monitoring....");

    if (!SPREADSHEET_ID) {
        console.error("ERROR: SPREADSHEET_ID is not defined");
        process.exit(1);
    }

    const googleSheets = await authGoogle();
    const initialMetrics = await writeData();

    if (initialMetrics) {
        await sendDataToSheets(googleSheets, initialMetrics);

        const INTERVAL_MS = 5 * 1000;
        setInterval(async () => {
            const metrics = await writeData();
            if (metrics) {
                await sendDataToSheets(googleSheets, metrics);
            }
        }, INTERVAL_MS);
    }
}
startMonitoring();