const {
    getAllUsersHandler,
    getUserByIdHandler,
    addUserHandler,
    updateUserHandler,
    deleteUserHandler
} = require('../handlers/manage-user');

module.exports = {
    name: 'manageUser-routes',
    register: async (server) => {
        server.route([
            {
                method: 'GET',
                path: '/users',
                options: {
                auth: 'jwt',
                handler: getAllUsersHandler
              },
            },
            {
                method: 'GET',
                path: '/users/{id}',
                options: {
                auth: 'jwt',
                handler: getUserByIdHandler
              },
            },
            {
                method: 'POST',
                path: '/users',
                options: {
                  auth: 'jwt',
                  handler: addUserHandler
              },
            },
            {
                method: 'PUT',
                path: '/users/{id}',
                options: {
                auth: 'jwt',
                handler: updateUserHandler
              },
            },
            {
                method: 'DELETE',
                path: '/users/{id}',
                options: {
                auth: 'jwt',
                handler: deleteUserHandler
              },
            }
        ]);
    }
};