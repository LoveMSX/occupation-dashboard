
import Papa from 'papaparse';
import { useState } from 'react';
import { toast } from 'sonner';

interface CSVParserOptions<T> {
  onComplete: (results: T[]) => Promise<void>;
  transform: (row: Record<string, string>) => T;
  header?: boolean;
  skipEmptyLines?: boolean;
}

export function useCsvParser<T>() {
  const [isLoading, setIsLoading] = useState(false);

  const parseCSV = async (file: File, options: CSVParserOptions<T>) => {
    if (!file) {
      toast.error("No file selected");
      return;
    }

    setIsLoading(true);

    return new Promise<void>((resolve, reject) => {
      Papa.parse(file, {
        header: options.header ?? true,
        skipEmptyLines: options.skipEmptyLines ?? true,
        complete: async (results) => {
          try {
            const data = results.data as Record<string, string>[];
            const transformedData = data.map(options.transform);
            await options.onComplete(transformedData);
            resolve();
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`Error processing CSV: ${errorMessage}`);
            reject(error);
          } finally {
            setIsLoading(false);
          }
        },
        error: (error) => {
          toast.error(`Error parsing CSV: ${error.message}`);
          setIsLoading(false);
          reject(error);
        }
      });
    });
  };

  return {
    parseCSV,
    isLoading
  };
}
