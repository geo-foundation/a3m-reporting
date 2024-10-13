import { openDb } from '../config/db-config';

export async function getIncidents() {
  const db = await openDb();
  const incidents = await db.all('SELECT * FROM incidents');
  return incidents;
}
