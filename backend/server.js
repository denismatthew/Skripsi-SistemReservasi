const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
require('dotenv').config();

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 5000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'], // Allow all origins (nanti ganti ke frontend URL)
                credentials: true
            }
        }
    });

    await server.register(Jwt);

    server.auth.strategy('jwt', 'jwt', {
        keys: process.env.JWT_SECRET,
        verify: { aud: false, iss: false, sub: false, maxAgeSec: 7 * 24 * 60 * 60 },
        validate: (artifacts) => ({
        isValid: true,
        credentials: {
            userId: artifacts.decoded.payload.userId,
            email: artifacts.decoded.payload.email,
            role: artifacts.decoded.payload.role,
        },
        }),
    });

    server.auth.default('jwt');

    // Register routes
    await server.register([
        require('./routes/auth'),
        require('./routes/booking'),
        require('./routes/service'),
        require('./routes/testdrive'),
        require('./routes/manage-user'),
        require('./routes/booking-service'),
    ]);

    await server.start();
    console.log(`🚀 Server berjalan di: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();