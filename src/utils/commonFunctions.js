// Function used for Convert Json Into CSV format

export const jsonToCsv = (jsonData) => {
  let tempData = jsonData?.data;
  const csvRows = [];
  const headers = Object.keys(tempData[0]);

  csvRows.push(headers.join(","));

  for (const row of tempData) {
    const values = headers.map((header) => {
      const escapedValue = row[header].toString().replace(/"/g, '\\"');
      return `"${escapedValue}"`;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
};

// Function for Handle the date as per DD-MM-YYYY format

export const handleDate = (date) => {
  const dateObj = new Date(date);

  const year = dateObj.getFullYear();
  const month = getMonthName(dateObj.getMonth());
  const day = dateObj.getDate().toString().padStart(2, "0");
  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  const seconds = dateObj.getSeconds().toString().padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

const getMonthName = (monthIndex) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return monthNames[monthIndex];
};

// Function for Download the file in the CSV format

export const downloadFileInCSV = (csvData, TEMPLATE_NAME, RUN_ID) => {
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

  const csvUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", csvUrl);
  link.setAttribute("download", `${TEMPLATE_NAME}_${RUN_ID}.csv`);

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
};

// Function for Calculating the percentage
export const calculatePercentage = (value, total) => {
  return Math.round((value * 100) / total);
};
