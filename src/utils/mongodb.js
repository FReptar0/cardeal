import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
    throw new Error('Por favor, define la variable de entorno MONGODB_URI en .env.local');
}

if (!dbName) {
    throw new Error('Por favor, define la variable de entorno MONGODB_DB en .env.local');
}

// Opciones de conexión (puedes agregar más opciones según necesites)
const options = {};

// Se utiliza una variable global para conservar la conexión en modo de desarrollo (para hot-reloading)
let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

/**
 * Conecta a la base de datos y retorna el cliente y la DB.
 * @returns {Promise<{ client: MongoClient, db: Db }>}
 */
export async function connectToDatabase() {
    const client = await clientPromise;
    const db = client.db(dbName);
    return { client, db };
}

/**
 * Busca documentos en una colección.
 * @param {string} collectionName - Nombre de la colección.
 * @param {Object} [query={}] - Consulta (query) para filtrar documentos.
 * @param {Object} [options={}] - Opciones adicionales para el método find.
 * @returns {Promise<Array>} - Array de documentos encontrados.
 */
export async function findDocuments(collectionName, query = {}, options = {}) {
    const { db } = await connectToDatabase();
    return db.collection(collectionName).find(query, options).toArray();
}

/**
 * Inserta un documento en una colección.
 * @param {string} collectionName - Nombre de la colección.
 * @param {Object} document - Documento a insertar.
 * @returns {Promise<InsertOneResult>} - Resultado de la inserción.
 */
export async function insertDocument(collectionName, document) {
    const { db } = await connectToDatabase();
    return db.collection(collectionName).insertOne(document);
}

/**
 * Actualiza un documento en una colección.
 * @param {string} collectionName - Nombre de la colección.
 * @param {Object} filter - Filtro para encontrar el documento.
 * @param {Object} update - Actualización a aplicar.
 * @param {Object} [options={}] - Opciones adicionales.
 * @returns {Promise<UpdateResult>} - Resultado de la actualización.
 */
export async function updateDocument(collectionName, filter, update, options = {}) {
    const { db } = await connectToDatabase();
    return db.collection(collectionName).updateOne(filter, update, options);
}

/**
 * Elimina un documento de una colección.
 * @param {string} collectionName - Nombre de la colección.
 * @param {Object} filter - Filtro para encontrar el documento a eliminar.
 * @param {Object} [options={}] - Opciones adicionales.
 * @returns {Promise<DeleteResult>} - Resultado de la eliminación.
 */
export async function deleteDocument(collectionName, filter, options = {}) {
    const { db } = await connectToDatabase();
    return db.collection(collectionName).deleteOne(filter, options);
}
