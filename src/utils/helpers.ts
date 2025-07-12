import Papa from 'papaparse';

// Debounce function for search input
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

import { config } from '../config/env';

// File validation
export function validateFile(file: File): { isValid: boolean; error?: string } {
  const allowedTypes = config.upload.allowedTypes;
  const maxSize = config.upload.maxFileSize;

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Only CSV and JSON files are allowed'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`
    };
  }

  return { isValid: true };
}

// Parse CSV file
export function parseCSV(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    try {
      Papa.parse(file as any, {
        header: true,
        skipEmptyLines: true,
        complete: (results: Papa.ParseResult<any>) => {
          if (results.errors.length > 0) {
            reject(new Error(`Error parsing CSV: ${results.errors[0].message}`));
            return;
          }

          const names = results.data as any[];
          if (names.length === 0) {
            reject(new Error('CSV file is empty'));
            return;
          }

          const firstRow = names[0];
          if (!firstRow.names && !firstRow.name) {
            reject(new Error('CSV must have a "names" or "name" column'));
            return;
          }

          const nameColumn = firstRow.names ? 'names' : 'name';
          const extractedNames = names
            .map(row => row[nameColumn])
            .filter(name => name && name.trim() !== '');

          if (extractedNames.length === 0) {
            reject(new Error('No valid names found in the CSV file'));
            return;
          }

          resolve(extractedNames);
        }
      });
    } catch (error) {
      reject(new Error(`Error parsing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
}

// Parse JSON file
export function parseJSON(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (!Array.isArray(data)) {
          reject(new Error('JSON must be an array of objects'));
          return;
        }

        if (data.length === 0) {
          reject(new Error('JSON array is empty'));
          return;
        }

        const names: string[] = [];
        data.forEach((item, index) => {
          if (typeof item === 'string') {
            names.push(item);
          } else if (typeof item === 'object' && item !== null) {
            if (item.names) {
              names.push(item.names);
            } else if (item.name) {
              names.push(item.name);
            } else {
              reject(new Error(`Item at index ${index} must have a "names" or "name" field`));
            }
          } else {
            reject(new Error(`Item at index ${index} must be a string or object with "names"/"name" field`));
          }
        });

        if (names.length === 0) {
          reject(new Error('No valid names found in the JSON file'));
          return;
        }

        resolve(names);
      } catch (error) {
        reject(new Error(`Error parsing JSON: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
}

// Get confidence color based on score
export function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return 'bg-green-500';
  if (confidence >= 0.6) return 'bg-yellow-500';
  if (confidence >= 0.4) return 'bg-orange-500';
  return 'bg-red-500';
}

// Format confidence as percentage
export function formatConfidence(confidence: number): string {
  return `${(confidence * 100).toFixed(1)}%`;
}

// Export results to CSV
export function exportToCSV(data: any[], filename: string): void {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
} 