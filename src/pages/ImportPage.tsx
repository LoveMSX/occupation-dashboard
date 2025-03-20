
// Change this line:
//   <GSheetSync />
// To:
  <GSheetSync 
    pageId="imports" 
    onSync={async (spreadsheetId: string) => {
      // Implement a basic handler that returns a promise
      console.log("Sync initiated for spreadsheet:", spreadsheetId);
      return Promise.resolve();
    }} 
  />
