const {
    getAllServicesHandler,
    addServiceHandler,
    updateServiceHandler,
    deleteServiceHandler,
    updateServiceStatusHandler
} = require('../handlers/service');

module.exports = {
    name: 'service-routes',
    register: async (server) => {
        server.route([
            {
                method: 'GET',
                path: '/services',
                options: {
                auth: 'jwt',
                handler: getAllServicesHandler
              },
            },
            {
                method: 'POST',
                path: '/services',
                options: {
                auth: 'jwt',
                handler: addServiceHandler
              },
            },
            {
                method: 'PUT',
                path: '/services/{id}',
                options: {
                auth: 'jwt',
                handler: updateServiceHandler
              },
            },
            {
                method: 'DELETE',
                path: '/services/{id}',
                options: {
                auth: 'jwt',
                handler: deleteServiceHandler
              },
            },
            {
                method: 'PATCH',
                path: '/services/{id}/status',
                options: {
                auth: 'jwt',
                handler: updateServiceStatusHandler
              },
            }
        ]);
    }
};
