import { BackendServer } from './server';
const dotenv = require('dotenv');

    const result = dotenv.config();

    if (result.error) {
        console.error("Error dotenv config", result.error)
    }

const port = process.env.PORT || '8080';

/**
 *  Server Configuration
 */

const server = new BackendServer();
server.start(port);