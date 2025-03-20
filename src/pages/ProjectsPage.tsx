
// Change this line:
//   const result = await gsheetApi.syncProjects(spreadsheetId);
// To:
  console.log("Would sync projects from spreadsheet:", spreadsheetId);
  // Since gsheetApi doesn't have syncProjects method, we'll use a generic sync method
  const result = await gsheetApi.syncOccupation(spreadsheetId);
