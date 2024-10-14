import os
import sqlite3
import openai
import hashlib
import json

openai.api_key = os.getenv("OPENAI_API_KEY")

def create_embedding(data):
    """
    Generates an embedding for the whole row (data) using OpenAI API.
    """
    response = openai.Embedding.create(
        model="text-embedding-small",
        input=data
    )
    return response['data'][0]['embedding']

def get_data_hash(data):
    """
    Creates a hash for a given row of data to uniquely identify it.
    """
    return hashlib.sha256(data.encode('utf-8')).hexdigest()

def store_embedding(conn, row_id, embedding):
    """
    Stores the embedding in the database linked to the row.
    """
    conn.execute('''
    UPDATE incidents SET embedding = ? WHERE id = ?
    ''', (json.dumps(embedding), row_id))
    conn.commit()

def embedding_exists(conn, row_id):
    """
    Checks if an embedding already exists for a given row_id.
    """
    cursor = conn.execute('''
    SELECT embedding FROM incidents WHERE id = ?
    ''', (row_id,))
    result = cursor.fetchone()
    return result and result[0] is not None

def add_embedding_column(conn):
    """
    Adds the 'embedding' column to the 'incidents' table if it doesn't exist.
    """
    try:
        conn.execute('''
        ALTER TABLE incidents ADD COLUMN embedding TEXT
        ''')
        conn.commit()
    except sqlite3.OperationalError:
        # If the column already exists, ignore the error
        pass

def generate_embeddings():
    conn = sqlite3.connect('data/global_incidents.db')
    
    # Ensure the embedding column exists
    add_embedding_column(conn)

    cursor = conn.execute('SELECT id, title, description, country, city, date, severity, impact, latitude, longitude, type FROM incidents')

    for row in cursor:
        row_id = row[0]
        row_data = ', '.join(map(str, row[1:]))  # Combine all columns as a single string

        if not embedding_exists(conn, row_id):
            print(f"Generating embedding for row {row_id}")
            embedding = create_embedding(row_data)
            store_embedding(conn, row_id, embedding)
        else:
            print(f"Embedding already exists for row {row_id}")

    conn.close()

if __name__ == "__main__":
    generate_embeddings()
