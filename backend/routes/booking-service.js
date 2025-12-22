const {
    createBookingServiceHandler,
    createBookingTestDriveHandler,
    getPendingBookingsHandler,
    getPendingTestDriveBookingsHandler,
    approveBookingHandler,
    rejectBookingHandler,
    getApprovedBookingsHandler,
    getApprovedTestDriveHandler,
    getCustomerBookingsHandler,
    getCustomerTestDriveBookingsHandler,
    getBookingDetailHandler,
    getTestDriveVehiclesHandler,
    getServicesHandler,
    getBookingServiceDetailsHandler,
    addBookingServiceDetailHandler,
    deleteBookingServiceDetailHandler,
    updateBookingStatusHandler,
    getCustomerInfo,
} = require('../handlers/booking-service');

module.exports = {
    name: 'bookingservice-routes',
    register: async (server) => {
        server.route([
            {
              method: 'POST',
              path: '/booking-services',
              handler: createBookingServiceHandler,
              options: {
                auth: 'jwt'
              }
            },
            {
              method: 'POST',
              path: '/booking-testdrive',
              handler: createBookingTestDriveHandler,
              options: {
                auth: 'jwt'
              }
            },
            {
              method: 'GET',
              path: '/bookings/pending',
              options: {
                auth: 'jwt',
                handler: getPendingBookingsHandler,
              },
            },
            {
              method: 'GET',
              path: '/bookings/pending-testdrive',
              options: {
                auth: 'jwt',
                handler: getPendingTestDriveBookingsHandler,
              },
            },
            {
              method: 'PATCH',
              path: '/bookings/{id}/approve',
              options: {
                auth: 'jwt',
                handler: approveBookingHandler,
              },
            },
            {
              method: 'PUT',
              path: '/booking/{id}/reject',
              handler: rejectBookingHandler,
              options: { auth: 'jwt' }
            },
            {
              method: 'GET',
              path: '/bookings/approved',
              options: {
                auth: 'jwt',
                handler: getApprovedBookingsHandler,
              },
            },
            {
              method: 'GET',
              path: '/bookings/approved-testdrive',
              options: {
                auth: 'jwt',
                handler: getApprovedTestDriveHandler,
              },
            },
            {
              method: 'GET',
              path: '/bookings/my',
              handler: getCustomerBookingsHandler,
              options: {
                auth: 'jwt'
              }
            },
            {
              method: 'GET',
              path: '/bookings/mytd',
              handler: getCustomerTestDriveBookingsHandler,
              options: {
                auth: 'jwt'
              }
            },
            {
              method: 'GET',
              path: '/bookings/{id}',
              handler: getBookingDetailHandler,
              options: {
                auth: 'jwt'
              }
            },
            {
              method: 'GET',
              path: '/testdrive/vehicles',
              handler: getTestDriveVehiclesHandler,
              options: {
                auth: 'jwt'
              }
            },
            {
              method: 'GET',
              path: '/get-services',
              handler: getServicesHandler,
              options: { auth: 'jwt' }
            },
            {
              method: 'GET',
              path: '/booking-services/{bookingServiceId}/details',
              handler: getBookingServiceDetailsHandler,
              options: { auth: 'jwt' }
            },
            {
              method: 'POST',
              path: '/booking-services/{bookingServiceId}/details',
              handler: addBookingServiceDetailHandler,
              options: { auth: 'jwt' }
            },
            {
              method: "DELETE",
              path: "/booking-service-details/{id}",
              handler: deleteBookingServiceDetailHandler,
              options: { auth: "jwt" }
            },
            {
              method: "PATCH",
              path: "/bookings/{id}/status",
              handler: updateBookingStatusHandler,
              options: { auth: "jwt" }
            },
            {
              method: "GET",
              path: "/getCustomer",
              handler: getCustomerInfo,
              options: { auth: "jwt" }
            },
        ]);
    }
};