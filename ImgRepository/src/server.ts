import { Server } from 'http'
import express from 'express'
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import * as bodyParser from 'body-parser';
import { addRouter } from './api/add/AddRouter'
import { searchRouter } from './api/search/SearchRouter'
const dotenv = require('dotenv');
const path = require('path')

    const result = dotenv.config({ path: require('find-config')('.env') });

    if (result.error) {
        console.error("Error dotenv config", result.error)
    }

class BackendServer extends Server {

    public app = express();
    private readonly SERVER_STARTED = 'App started on port:'

    constructor() {
        super();
        this.app.use(cors())
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use(session({ secret: 'S3CRE7', resave: true, saveUninitialized: true }));

        this.app.use(helmet())
        this.app.use(cors())
        this.app.use(express.json())

        this.app.set('view engine', 'pug');
        
    }

    public start(port: string): void {

        this.app.get("/", (req: express.Request, res: express.Response) => {
            res.status(200).send('Welcome to the Image Repository. Take a look at the README.md for more information for accessing these endpoints!');
        });

        this.app.get('/hello-world', (req: express.Request, res: express.Response) => {
            res.status(200).send('Hello, World');
        });

        this.app.use('/add', addRouter)
        this.app.use('/search', searchRouter)


        this.app.listen(port, () => {
            console.log(this.SERVER_STARTED + port);
        });
    }
}

export { BackendServer }