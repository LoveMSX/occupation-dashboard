
// Ce fichier est un simple exemple pour illustrer comment configurer un serveur backend
// avec Express.js et PostgreSQL

/*
Si vous voulez implémenter ce backend, vous devrez créer un projet Node.js séparé avec:

1. Express.js pour créer l'API REST
2. pg ou node-postgres pour se connecter à PostgreSQL
3. Structure du projet:

backend/
  |- src/
      |- index.js         // Point d'entrée du serveur
      |- db/
          |- index.js     // Configuration et connexion à PostgreSQL
      |- routes/
          |- employees.js // Routes pour les employés
          |- projects.js  // Routes pour les projets
      |- controllers/
          |- employees.js // Logique pour gérer les requêtes employés
          |- projects.js  // Logique pour gérer les requêtes projets

4. Schéma SQL pour PostgreSQL:

-- Table Employees
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  avatar VARCHAR(255),
  location VARCHAR(100) NOT NULL,
  join_date DATE NOT NULL,
  manager VARCHAR(255),
  occupancy_rate INTEGER NOT NULL
);

-- Table Skills
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- Table Employee_Skills (relation many-to-many)
CREATE TABLE employee_skills (
  employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
  skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (employee_id, skill_id)
);

-- Table Projects
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  client VARCHAR(255),
  category VARCHAR(100)
);

-- Table Employee_Projects (relation many-to-many)
CREATE TABLE employee_projects (
  employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  PRIMARY KEY (employee_id, project_id)
);

5. Exemple de code Express pour les routes employees:

// routes/employees.js
const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employees');

router.get('/', employeesController.getAllEmployees);
router.get('/:id', employeesController.getEmployeeById);
router.post('/', employeesController.createEmployee);
router.put('/:id', employeesController.updateEmployee);
router.delete('/:id', employeesController.deleteEmployee);
router.get('/:id/projects', employeesController.getEmployeeProjects);

module.exports = router;

// controllers/employees.js
const db = require('../db');

exports.getAllEmployees = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT e.*, 
        array_agg(DISTINCT s.name) as skills,
        json_agg(
          json_build_object(
            'id', p.id,
            'name', p.name,
            'status', p.status,
            'client', p.client,
            'category', p.category
          )
        ) as projects
      FROM employees e
      LEFT JOIN employee_skills es ON e.id = es.employee_id
      LEFT JOIN skills s ON es.skill_id = s.id
      LEFT JOIN employee_projects ep ON e.id = ep.employee_id
      LEFT JOIN projects p ON ep.project_id = p.id
      GROUP BY e.id
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createEmployee = async (req, res) => {
  const { name, position, department, email, phone, avatar, location, joinDate, manager, skills, occupancyRate } = req.body;
  
  try {
    // Démarrer une transaction
    await db.query('BEGIN');
    
    // Insérer l'employé
    const employeeResult = await db.query(
      `INSERT INTO employees (name, position, department, email, phone, avatar, location, join_date, manager, occupancy_rate)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [name, position, department, email, phone, avatar, location, joinDate, manager, occupancyRate]
    );
    
    const employeeId = employeeResult.rows[0].id;
    
    // Ajouter des compétences
    if (skills && skills.length > 0) {
      for (const skill of skills) {
        // Vérifier si la compétence existe déjà
        let skillId;
        const skillResult = await db.query('SELECT id FROM skills WHERE name = $1', [skill]);
        
        if (skillResult.rows.length > 0) {
          skillId = skillResult.rows[0].id;
        } else {
          // Créer une nouvelle compétence
          const newSkillResult = await db.query(
            'INSERT INTO skills (name) VALUES ($1) RETURNING id',
            [skill]
          );
          skillId = newSkillResult.rows[0].id;
        }
        
        // Associer la compétence à l'employé
        await db.query(
          'INSERT INTO employee_skills (employee_id, skill_id) VALUES ($1, $2)',
          [employeeId, skillId]
        );
      }
    }
    
    // Valider la transaction
    await db.query('COMMIT');
    
    // Renvoyer l'employé créé avec ses compétences
    const result = await db.query(`
      SELECT e.*, 
        array_agg(DISTINCT s.name) as skills,
        '[]'::json as projects
      FROM employees e
      LEFT JOIN employee_skills es ON e.id = es.employee_id
      LEFT JOIN skills s ON es.skill_id = s.id
      WHERE e.id = $1
      GROUP BY e.id
    `, [employeeId]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Annuler la transaction en cas d'erreur
    await db.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Implémentez de façon similaire les autres méthodes du contrôleur

6. Démarrage du serveur (index.js):

const express = require('express');
const cors = require('cors');
const employeesRoutes = require('./routes/employees');
const projectsRoutes = require('./routes/projects');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/employees', employeesRoutes);
app.use('/api/projects', projectsRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

*/

// Ce fichier est fourni uniquement comme exemple et n'est pas fonctionnel en lui-même.
// Vous devez créer un projet backend séparé pour implémenter ces fonctionnalités.
