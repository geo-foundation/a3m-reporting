import { getIncidents } from '../../services/incidentService';

export default async function handler(req, res) {
  try {
    const incidents = await getIncidents();
    res.status(200).json(incidents);  // Return incidents as JSON
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch incidents' });
  }
}
