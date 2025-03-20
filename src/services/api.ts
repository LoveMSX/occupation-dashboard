
// Fix the isAxiosError check
if (axios.isAxiosError && axios.isAxiosError(error)) {
  window.console.error('Response data:', error.response?.data);
  window.console.error('Status:', error.response?.status);
}
