import { BackendServer } from './server';

const port = process.env.PORT || '8080';

/**
 *  Server Configuration
 */

const server = new BackendServer();
server.start(port);