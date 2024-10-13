import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDb() {
  return open({
    filename: './data/global_incidents.db',  // Path to the SQLite DB
    driver: sqlite3.Database
  });
}
