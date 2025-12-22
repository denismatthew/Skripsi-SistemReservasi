const verifyToken = require('../verifyToken');
const { 
  getServiceBookingsHandler, 
  getTestDriveBookingsHandler,
  getDashboardSummaryHandler,
  getCustomerBookingDetailHandler,
  cancelCustomerBookingHandler,
  getAdminBookingDetailHandler,
  getBookingTrendHandler,
  getBookingStatusChartHandler,
  getPopularServicesHandler,
  getTopCustomersHandler,
  getRecentBookingsHandler,
} = require('../handlers/monitoring-booking');

const bookingRoutes = {
  name: 'booking-routes',
  version: '1.0.0',
  register: async (server) => {
    server.route([
        {
          method: 'GET',
          path: '/bookings/all-services',
          options: {
            auth: 'jwt',
            handler: getServiceBookingsHandler,
          },
        },
        {
          method: 'GET',
          path: '/bookings/all-testdrive',
          options: {
            auth: 'jwt',
            handler: getTestDriveBookingsHandler,
          },
        },
        {
          method: 'GET',
          path: '/dashboard/summary',
          options: {
            auth: 'jwt',
            handler: getDashboardSummaryHandler,
          },
        },
        {
          method: 'GET',
          path: '/customer/bookings/{id}',
          handler: getCustomerBookingDetailHandler,
          options: { auth: 'jwt' }
        },
        {
          method: 'PATCH',
          path: '/customer/bookings/{id}/cancel',
          handler: cancelCustomerBookingHandler,
          options: { auth: 'jwt' }
        },
        {
          method: 'GET',
          path: '/admin/bookings/{id}',
          handler: getAdminBookingDetailHandler,
          options: { auth: 'jwt' }
        },
        {
          method: 'GET',
          path: '/dashboard/chart/booking-trend',
          handler: getBookingTrendHandler,
          options: { auth: 'jwt' },
        },
        {
          method: 'GET',
          path: '/dashboard/chart/status',
          handler: getBookingStatusChartHandler,
          options: { auth: 'jwt' },
        },
        {
          method: 'GET',
          path: '/dashboard/chart/popular-services',
          handler: getPopularServicesHandler,
          options: { auth: 'jwt' },
        },
        {
          method: "GET",
          path: "/dashboard/top-customers",
          handler: getTopCustomersHandler,
          options: { auth: "jwt" },
        },
        {
          method: "GET",
          path: "/dashboard/recent-bookings",
          handler: getRecentBookingsHandler,
          options: { auth: "jwt" },
        },
    ]);
  }
};

module.exports = bookingRoutes;
