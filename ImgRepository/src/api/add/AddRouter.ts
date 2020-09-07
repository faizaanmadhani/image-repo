import * as Express from 'express';
import Multer from 'multer'
import { imageValidator, uploadImage } from './AddHelpers'
import { v4 as uuidv4 } from 'uuid'
import { ResponseObj } from '../interfaces';

/**
 * Controller Definitions
 */

export const addRouter = Express.Router()

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: imageValidator
});


addRouter.post("/", multer.single('image'), async (req: Express.Request, res: Express.Response) => {
    if (req.query.private) {
        const privateKey = uuidv4()
        const response = await uploadImage(req.file, privateKey)
        res.json(response)
        return
    }
    const response = await uploadImage(req.file)
    res.json(response)
});

addRouter.post("/bulk", multer.array('image', 5), async (req: Express.Request, res: Express.Response) => {
    if (!req.files) {
        res.status(400).send("No Files Uploaded")
        return;
    }
    var publicUrls = []
    var filesLength = req.files.length
    if (req.query.private) {
        const imgPrivateKey = uuidv4()
        for (let i = 0; i < filesLength; i++) {

            const response = await uploadImage(req.files[i], imgPrivateKey)
    
            publicUrls.push(response.data.url)
        }

        const response: ResponseObj = {
            status: 200,
            data: {
                accessToken: imgPrivateKey,
                urls: publicUrls
            }
        }

        res.status(200).json(response)
    } else {
        for (let i = 0; i < filesLength; i++) {

            const response = await uploadImage(req.files[i])
            publicUrls.push(response.data.url)
        }

        const response: ResponseObj = {
            status: 200,
            data: {
                urls: publicUrls
            }
        }

        res.status(200).json(response)
    }

});




