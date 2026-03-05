import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CsvExportService {
  constructor() {}
  // Export data to CSV from table
  exportCSV(data: object[]): Blob {
    const csv = [];

    // Get headers from the first row
    const headers = [...Object.keys(data[0])];

    // Add headers to the CSV
    csv.push(headers.join(','));

    // Add rows to the CSV
    for (let i = 0; i < data.length; i++) {
      csv.push(Object.values(data[i]).join(','));
    }

    // Download the CSV file
    const csvData = csv.join('\r\n');
    const b = new Blob([csvData], { type: 'text/csv' });
    return b;
  }
}
