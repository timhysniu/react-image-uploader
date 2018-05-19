'use strict';

const Hapi = require('hapi');
const Routes = require('./server/routes');

const launchServer = async function() {

    const server = Hapi.server({
        host: 'localhost',
        port: 3001
    });

    Routes(server);

    await server.start();
    console.log(`Server started at ${server.info.uri}`);
};

launchServer().catch((err) => {
    console.error(err);
    process.exit(1);
});
