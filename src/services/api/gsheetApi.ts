import axios from 'axios';

const GOOGLE_SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';
const GOOGLE_AUTH_SCOPE = [
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/drive.readonly'
].join(' ');

interface GSheetResponse {
  success: boolean;
  data: any;
}

interface GoogleAuthConfig {
  client_id: string;
  redirect_uri: string;
  scope: string;
  response_type: string;
}

export const gsheetApi = {
  getAuthUrl(): string {
    const config: GoogleAuthConfig = {
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirect_uri: 'http://localhost:8080/auth/google/callback', // Fixed redirect URI
      scope: GOOGLE_AUTH_SCOPE,
      response_type: 'code'
    };

    const params = new URLSearchParams({
      client_id: config.client_id,
      redirect_uri: config.redirect_uri,
      scope: config.scope,
      response_type: config.response_type,
      prompt: 'consent',
      access_type: 'offline'
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  },

  async exchangeCodeForToken(code: string): Promise<string> {
    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
        redirect_uri: 'http://localhost:8080/auth/google/callback', // Fixed redirect URI
        grant_type: 'authorization_code',
        code
      });

      return response.data.access_token;
    } catch (error) {
      console.error('Token exchange error:', error);
      throw new Error('Failed to exchange code for token');
    }
  },

  syncOccupation: async (spreadsheetId: string): Promise<GSheetResponse> => {
    try {
      const accessToken = localStorage.getItem('google_access_token');
      
      if (!accessToken) {
        throw new Error('No access token found. Please authenticate first.');
      }

      // Validation plus stricte de l'ID
      const spreadsheetIdRegex = /^[a-zA-Z0-9-_]+$/;
      if (!spreadsheetId || !spreadsheetIdRegex.test(spreadsheetId)) {
        throw new Error('Invalid spreadsheet ID format');
      }

      // Construction de l'URL
      const sheetUrl = `${GOOGLE_SHEETS_API_BASE}/${spreadsheetId}/values/Feuille%201!A:N`;
      
      console.log('Attempting to fetch from:', sheetUrl);

      const response = await axios.get(sheetUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
        params: {
          majorDimension: 'ROWS',
          valueRenderOption: 'FORMATTED_VALUE',
          dateTimeRenderOption: 'FORMATTED_STRING'
        }
      });

      console.log('Response data:', response.data); // Ajout d'un log pour vérifier les données

      if (!response.data || !response.data.values) {
        throw new Error('Empty response from Google Sheets API');
      }

      const values = response.data.values;
      if (!Array.isArray(values) || values.length < 2) {
        throw new Error('Invalid data format or empty sheet');
      }

      const [headers, ...rows] = values;

      // Validation des données avant transformation
      const formattedData = rows.map((row: any[], index: number) => {
        if (row.length < 14) {
          console.warn(`Row ${index + 2} has insufficient columns`);
          while (row.length < 14) row.push('0');
        }

        return {
          employee: row[0] || '',
          project: row[1] || '',
          occupationRates: {
            january: parsePercentage(row[2]),
            february: parsePercentage(row[3]),
            march: parsePercentage(row[4]),
            april: parsePercentage(row[5]),
            may: parsePercentage(row[6]),
            june: parsePercentage(row[7]),
            july: parsePercentage(row[8]),
            august: parsePercentage(row[9]),
            september: parsePercentage(row[10]),
            october: parsePercentage(row[11]),
            november: parsePercentage(row[12]),
            december: parsePercentage(row[13])
          }
        };
      });

      return {
        success: true,
        data: formattedData
      };

    } catch (error: any) {
      console.error('Full error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });

      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.error?.message || 'Unknown error';
        throw new Error(`Google Sheets API error: ${errorMessage}`);
      }
      throw error;
    }
  },

  syncSales: async (spreadsheetId: string): Promise<GSheetResponse> => {
    try {
      const response = await axios.post('/api/gsheet/sync/sales', {
        spreadsheetId,
      });

      if (!response.data) {
        throw new Error('No data received from sales sync');
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      window.console.error('Sales sync error:', error);
      throw new Error('Failed to sync sales with Google Sheets');
    }
  },

  async getSheetInfo(spreadsheetId: string): Promise<any> {
    try {
      const accessToken = localStorage.getItem('google_access_token');
      
      if (!accessToken) {
        throw new Error('No access token found');
      }

      // D'abord, récupérons les métadonnées du spreadsheet
      const response = await axios.get(`${GOOGLE_SHEETS_API_BASE}/${spreadsheetId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        }
      });

      console.log('Available sheets:', response.data.sheets);
      return response.data;
    } catch (error) {
      console.error('Error fetching sheet info:', error);
      throw error;
    }
  },

  // Méthode utilitaire pour parser les pourcentages
  parsePercentage(value: any): number {
    if (!value) return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      // Enlever le symbole % et convertir en nombre
      const cleaned = value.replace('%', '').trim();
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }
};

// Déplacer parsePercentage en dehors de l'objet comme fonction utilitaire
const parsePercentage = (value: any): number => {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // Enlever le symbole % et convertir en nombre
    const cleaned = value.replace('%', '').trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};
