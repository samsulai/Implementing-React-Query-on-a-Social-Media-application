import {Client, Account, Databases, Storage, Avatars} from 'appwrite'


export const appwriteConfig = {
    projectId  : import.meta.env.VITE_APPWRITE_PROJECT_ID,
    url : import.meta.env.VITE_URL,
    databaseId : import.meta.env.VITE_DATABASE,
    storageId : import.meta.env.VITE_STORAGE,
    userCollectionId : import.meta.env.VITE_USERS,
    postCollectionId : import.meta.env.VITE_POSTS,
    savesCollectionId : import.meta.env.VITE_SAVES,

}

export const client = new Client()
client.setProject(appwriteConfig.projectId)
client.setEndpoint(appwriteConfig.url)
export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)
export const avatars = new Avatars(client)


