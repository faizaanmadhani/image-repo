import { Firestore } from '@google-cloud/firestore' 
import { Storage } from '@google-cloud/storage'
import vision from '@google-cloud/vision'

const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.KEYFILE_NAME
})

const db = new Firestore({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.KEYFILE_NAME
})

const visionClient = new vision.ImageAnnotatorClient({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.KEYFILE_NAME
})

export { db, storage, visionClient }