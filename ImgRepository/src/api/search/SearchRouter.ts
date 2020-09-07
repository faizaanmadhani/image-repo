import * as Express from 'express';
import { db } from '../../GCPConfig'
import { ResponseObj } from '../interfaces';
import {lowerCase} from './SearchHelpers'

export const searchRouter = Express.Router()
const publicCollection = db.collection('public_images')
const privateCollection = db.collection('private_images')

//Get public images, add filter by tags if they exist
searchRouter.get("/public", async (req: Express.Request, res: Express.Response) => {

    let publicDocs: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>;
    var tags = req.query.tags
    if (tags && tags !== "") {
        //Seperate out query param tags into an array
        let tagArr = tags.toString().split(',')
        publicDocs = await publicCollection.where("tags", 'array-contains-any', tagArr).get()
    } else {
        publicDocs = await publicCollection.get();
    }
    let data = [];
    publicDocs.forEach(doc => {
        let id = doc.id;
        let docData = doc.data();
        data.push({
            id: id,
            data: docData
        });

    });
    let response: ResponseObj = {
        status: 200,
        data: data,
    }
    res.status(200).json(response)
});

//Get Private Images that match your access token. Access tokens are sent in as Bearer Tokens.
searchRouter.get("/private", async (req: Express.Request, res: Express.Response) => {
    if (!req.headers.authorization) {
        const response: ResponseObj = {
            status: 403,
            error: Error("No Auth Credentials Sent!")
        }
        res.status(403).json(response);
        return;
    }
    const token = req.headers.authorization.split(" ")[1]
    if (token === "" || !token) {
        const response: ResponseObj = {
            status: 400,
            error: Error("Token Not Specified")
        }
        res.send(400).json(response);
        return;
    }

    var tags = req.query.tags
    const privateDocs = await privateCollection.where("key", "==", token)
    let data = []
    if (tags && tags !== "") {
        const tagArr = lowerCase(tags.toString().split(','))
        const privateDocsFiltered = await privateDocs.where("tags", 'array-contains-any', tagArr).get()
        privateDocsFiltered.forEach(doc => {
            let id = doc.id;
            let docData = doc.data()
            data.push({
                id: id,
                data: docData
            })
        });
    } else {
        const privateDocsUnfiltered = await privateDocs.get()
        privateDocsUnfiltered.forEach(doc => {
            let id = doc.id;
            let docData = doc.data()
            data.push({
                id: id,
                data: docData
            })
        });
    }
    let response: ResponseObj = {
        status: 200,
        data: data
    }
    res.status(200).json(response)
});