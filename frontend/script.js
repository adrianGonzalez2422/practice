document.addEventListener("DOMContentLoaded", () => {
    const btnConnecting = document.getElementById("btn-connecting");
    const inputSheetId = document.getElementById("sheetId");
    const cpuValue = document.getElementById("cpu-value");
    const ramValue = document.getElementById("ram-value");
    const tempValue = document.getElementById("temp-value");
    const ctx = document.getElementById("graficasHistorial").getContext("2d");

    let historyChart;

    function initChart() {
        historyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'CPU (%)',
                        borderColor: '#58a6ff',
                        backgroundColor: 'rgba(88, 166, 255, 0.1)',
                        data: [],
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'RAM (%)',
                        borderColor: '#bc8cff',
                        backgroundColor: 'rgba(188, 140, 255, 0.1)',
                        data: [],
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Temperature (°C)',
                        borderColor: '#ff7b72',
                        backgroundColor: 'rgba(255, 123, 114, 0.1)',
                        data: [],
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#e6edf3'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#8b949e',
                            maxTicksLimit: 10
                        },
                        grid: {
                            color: 'rgba(255,255,255,0.05)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#8b949e'
                        },
                        grid: {
                            color: 'rgba(255,255,255,0.05)'
                        },
                        min: 0,
                        max: 100
                    }
                }
            }
        });
    }

    // Parse Google Sheets CSV
    function parseCSV(csvText) {
        const lines = csvText.split('\n');
        const data = [];

        // Iterate line by line
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Remove double quotes and split by comma
            const cols = line.replace(/\"/g, "").split(',');

            // Verify if row is valid (at least 4 cols and CPU is a number)
            if (cols.length >= 4 && !isNaN(parseFloat(cols[1]))) {
                const dateObj = new Date(cols[0]);
                data.push({
                    timestamp: dateObj.toLocaleTimeString(), // Extract only time for X axis
                    cpu: parseFloat(cols[1]),
                    ram: parseFloat(cols[2]),
                    temp: parseFloat(cols[3])
                });
            }
        }
        return data;
    }

    // Fetch data using the public CSV export URL
    async function fetchData(sheetId) {
        const targetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

        try {
            btnConnecting.textContent = "Connecting...";
            const response = await fetch(targetUrl);

            if (!response.ok) {
                throw new Error("Could not connect (Is the sheet public and ID correct?)");
            }

            const csvText = await response.text();
            const data = parseCSV(csvText);

            if (data.length === 0) {
                throw new Error("The connected sheet does not have valid data yet.");
            }

            updateDashboard(data);
            btnConnecting.textContent = "Update Data";
            btnConnecting.style.background = "linear-gradient(135deg, #238636 0%, #2ea043 100%)";

        } catch (error) {
            console.error(error);
            alert("Error: " + error.message);
            btnConnecting.textContent = "Connect Data";
            btnConnecting.style.background = "";
        }
    }

    function updateDashboard(data) {
        const latest = data[data.length - 1];

        cpuValue.textContent = latest.cpu.toFixed(2) + "%";
        ramValue.textContent = latest.ram.toFixed(2) + "%";
        tempValue.textContent = latest.temp.toFixed(2) + "°C";

        const startIdx = Math.max(0, data.length - 30);
        const plotData = data.slice(startIdx);

        historyChart.data.labels = plotData.map(d => d.timestamp);
        historyChart.data.datasets[0].data = plotData.map(d => d.cpu);
        historyChart.data.datasets[1].data = plotData.map(d => d.ram);
        historyChart.data.datasets[2].data = plotData.map(d => d.temp);

        historyChart.update();
    }

    initChart();

    btnConnecting.addEventListener("click", () => {
        const sheetIdInput = inputSheetId.value.trim();
        if (sheetIdInput) {
            fetchData(sheetIdInput);
        } else {
            alert("Please enter a Google Sheets ID.");
        }
    });

    setInterval(() => {
        const sheetIdInput = inputSheetId.value.trim();
        if (sheetIdInput && btnConnecting.textContent === "Update Data") {
            fetchData(sheetIdInput);
        }
    }, 10000);
});
