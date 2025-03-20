interface Project {
  name: string;
  client: string;
  team?: string[];
  status: 'active' | 'completed';
}