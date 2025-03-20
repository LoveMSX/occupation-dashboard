
// Change this line:
//   const result = await gsheetApi.syncResources(spreadsheetId);
// To:
  console.log("Would sync resources from spreadsheet:", spreadsheetId);
  // Since gsheetApi doesn't have syncResources method, we'll use a generic sync method
  const result = await gsheetApi.syncOccupation(spreadsheetId);
