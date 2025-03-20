interface Employee {
  position: string;
  name: string;
  skills: string[];
  projects?: any[]; // You might want to define a Project interface for this
}