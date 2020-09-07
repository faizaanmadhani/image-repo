import { db, storage, visionClient } from '../../GCPConfig'
import { ResponseObj } from '../interfaces'
import { v4 as uuidv4 } from 'uuid'

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

//imageValidater validates whether a file is an image
export const imageValidator = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
}

export const uploadImage = async (multerFile: globalThis.Express.Multer.File, imguuid?: string): Promise<ResponseObj> => {
    const image_uuid = uuidv4()
    if (!multerFile) {
        return {
            status: 400,
            error: Error("No File Uploaded")
        }
    }

    const file = bucket.file(image_uuid);
    const fileStream = file.createWriteStream({
        metadata: {
          contentType: multerFile.mimetype
        }
      });

    var promise: Promise<ResponseObj> = new Promise((resolve, _reject) => {
        fileStream.on('error', err => {
            resolve({
                status: 500,
                error: err
            })
        });

        fileStream.on('finish', async () => {
            // The public URL can be used to directly access the file via HTTP.
            file.makePublic()
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`

            //Get Google Cloud Vision to get Image Properties from file immediately
            const gcsUri = `gs://${bucket.name}/${file.name}`;
            const [result] = await visionClient.objectLocalization(gcsUri)
            const objects = result.localizedObjectAnnotations;
            const tags: Set<String> = new Set()
            objects.forEach(object => {
                tags.add(object.name.toLowerCase())
                const veritices = object.boundingPoly.normalizedVertices;
            });

            if (imguuid) {
                db.collection("private_images").doc(image_uuid).set({
                    name: multerFile.originalname,
                    date: new Date(),
                    url: publicUrl,
                    key: imguuid,
                    tags: Array.from(tags)
                })
                resolve ({
                    status: 200,
                    data: {
                        url: publicUrl,
                        accessToken: imguuid
                    },
                    error: null
                })
            } else {
                db.collection("public_images").doc(image_uuid).set({
                    name: multerFile.originalname,
                    date: new Date(),
                    url: publicUrl,
                    tags: Array.from(tags)
                })

                resolve ({
                    status: 200,
                    data: {
                        url: publicUrl
                    },
                    error: null
                })
            }
        });

    });

    fileStream.end(multerFile.buffer);

    const result = await promise

    return result
}