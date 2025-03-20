import ProjectsPage from "./ProjectsPage";

// Create a function to reset console.log to its original state
// This will run before the ProjectsPage component is mounted
const resetConsoleLog = () => {
  // Restore the original console.log if it's been overridden
  const originalConsole = Object.getPrototypeOf(console);
  console.log = originalConsole.log;
};

export default function ProjectsPageWrapper() {
  // Reset console.log before rendering ProjectsPage
  resetConsoleLog();
  
  return <ProjectsPage />;
}
