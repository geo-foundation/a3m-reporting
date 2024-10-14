import sqlite3
import random
import math

# Configuration
DB_PATH = 'global_incidents.db'  # Path to your SQLite database
TABLE_NAME = 'incidents'         # Name of your table
MAX_OFFSET = 0.001               # Maximum offset in degrees (~100 meters)

def haversine(lat1, lon1, lat2, lon2):
    # Calculate the great-circle distance between two points on the Earth
    R = 6371  # Earth radius in kilometers
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)

    a = math.sin(d_phi/2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c  # in kilometers

def add_variance_to_duplicates(conn, table, max_offset=0.001):
    cursor = conn.cursor()

    # Find all duplicate coordinates
    cursor.execute(f"""
        SELECT latitude, longitude, COUNT(*) as cnt
        FROM {table}
        GROUP BY latitude, longitude
        HAVING cnt > 1
    """)

    duplicates = cursor.fetchall()
    print(f"Found {len(duplicates)} sets of duplicate coordinates.")

    for lat, lon, count in duplicates:
        print(f"\nProcessing {count} incidents at ({lat}, {lon})")

        # Fetch all ROWIDs for these duplicates
        cursor.execute(f"""
            SELECT ROWID, latitude, longitude
            FROM {table}
            WHERE latitude = ? AND longitude = ?
            ORDER BY ROWID
        """, (lat, lon))
        rows = cursor.fetchall()

        # Keep the first entry unchanged, adjust the rest
        for i, (rowid, _, _) in enumerate(rows):
            if i == 0:
                print(f"  Keeping ROWID {rowid} unchanged.")
                continue  # Skip the first entry

            # Generate a random small offset
            offset_lat = random.uniform(-max_offset, max_offset)
            offset_lon = random.uniform(-max_offset, max_offset)

            # Optionally, ensure that the new coordinates don't coincide with existing ones
            new_lat = lat + offset_lat
            new_lon = lon + offset_lon

            # Optionally, verify the new position is within valid latitude and longitude ranges
            new_lat = max(min(new_lat, 90.0), -90.0)
            new_lon = max(min(new_lon, 180.0), -180.0)

            # Update the coordinates in the database
            cursor.execute(f"""
                UPDATE {table}
                SET latitude = ?, longitude = ?
                WHERE ROWID = ?
            """, (new_lat, new_lon, rowid))
            print(f"  Updated ROWID {rowid}: ({lat}, {lon}) -> ({new_lat}, {new_lon})")

    # Commit all changes
    conn.commit()
    print("\nAll duplicate coordinates have been updated with variance.")

def main():
    # Connect to the SQLite database
    try:
        conn = sqlite3.connect(DB_PATH)
        print(f"Connected to database: {DB_PATH}")
    except sqlite3.Error as e:
        print(f"Error connecting to database: {e}")
        return

    try:
        add_variance_to_duplicates(conn, TABLE_NAME, MAX_OFFSET)
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        conn.close()
        print("Database connection closed.")

if __name__ == "__main__":
    main()
