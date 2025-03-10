import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProjectsPage from "./ProjectsPage";

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Wrapper component with React Query provider
export default function ProjectsPageWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProjectsPage />
    </QueryClientProvider>
  );
}
