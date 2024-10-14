import csv
import sqlite3

# Define your parameters here
DB_PATH = 'global_incidents.db'        # Replace with your SQLite DB path
CSV_PATH = 'dummy_data.csv'          # Replace with your CSV file path
TABLE_NAME = 'incidents'                    # Replace with your table name

def import_csv(db_path, csv_path, table_name):
    try:
        # Connect to the SQLite database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        with open(csv_path, 'r', encoding='utf-8-sig') as csvfile:
            reader = csv.DictReader(csvfile)
            columns = reader.fieldnames

            # Prepare the INSERT statement
            placeholders = ','.join(['?'] * len(columns))
            insert_sql = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({placeholders})"

            data = []
            for row in reader:
                values = [row[col] for col in columns]
                data.append(values)

            # Execute bulk insert
            cursor.executemany(insert_sql, data)
            conn.commit()
            print(f"Imported {cursor.rowcount} records into '{table_name}' table.")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    import_csv(DB_PATH, CSV_PATH, TABLE_NAME)
