const {
    getTestDriveDataHandler,
    addDataTestDriveHandler,
    updateDataTestDriveHandler,
    deleteDataTestDriveHandler,
    updateDataTestDriveStatusHandler
} = require('../handlers/testdrive');

module.exports = {
    name: 'testdrive-routes',
    register: async (server) => {
        server.route([
            {
                method: 'GET',
                path: '/testdrive',
                handler: getTestDriveDataHandler,
                options: { auth: "jwt" }
            },
            {
                method: 'POST',
                path: '/testdrive',
                handler: addDataTestDriveHandler,
                options: { auth: "jwt" }
            },
            {
                method: 'PUT',
                path: '/testdrive/{id}',
                handler: updateDataTestDriveHandler,
                options: { auth: "jwt" }
            },
            {
                method: 'DELETE',
                path: '/testdrive/{id}',
                handler: deleteDataTestDriveHandler,
                options: { auth: "jwt" }
            },
            {
              method: 'PATCH',
              path: '/testdrive/{id}/status',
              handler: updateDataTestDriveStatusHandler,
              options: { auth: "jwt" }
            }
        ]);
    }
};
