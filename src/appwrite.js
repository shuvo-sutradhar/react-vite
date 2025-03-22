import { Client, Databases, Query, ID } from "appwrite"

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECITON_ID

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID)

const database = new Databases(client);


export const updateSearchCount = async (search, movie) => {

    // 1. Use app write SDK to check if the search term exist in the database
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('search', search),
        ])

        // 2. If it does, update the count
        if(result.documents.length > 0) {
            const doc = result.documents[0];

            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count: doc.count + 1
            })

        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                search,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            })
         }

    } catch (error) {
        
    }
    
    // 3. If it doesn't, create a new document with the search term and count as 1

}


export const getTrendingMovies = async() => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('count')
        ])
        return result.documents;
        
    } catch (error) {
        console.log(error);
    }
}