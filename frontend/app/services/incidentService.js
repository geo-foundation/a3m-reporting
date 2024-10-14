// frontend/app/services/incidentService.js

import { openDb } from '../config/db-config';

export async function getIncidents() {
  try {
    const db = await openDb();

    // Execute the SQL query to fetch all incidents
    const incidents = await db.all('SELECT * FROM incidents');

    return incidents;
  } catch (error) {
    console.error('Error accessing the database:', error);
    throw error;
  }
}
