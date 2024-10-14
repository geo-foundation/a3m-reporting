// app/api/incidents/route.js

import { NextResponse } from 'next/server';
import { getIncidents } from '../../services/incidentService';  // Adjust the path based on your setup

// Named export for GET method
export async function GET(req) {
  try {
    const incidents = await getIncidents();
    return new Response(JSON.stringify(incidents), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch incidents' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
