import { createRouter, createWebHistory } from 'vue-router'
import store from '../store';

const routes = [
  {
    path: '/',
    meta: { title: 'Meshconnect', name: 'Index', parent: true },
    component: () => import('../components/Layouts/IndexLayout.vue'),
    children: [
      {
        path: '/login',
        alias: '/login',
        component: () => import('../views/LoginView.vue'),
        meta: { title: 'Login', ParentName: 'Index'}
      },
      {
        path: '/',
        alias: '/admin',
        component: () => import('../views/AdminLoginView.vue'),
        meta: { title: 'Admin Login', ParentName: 'Index'}
      },
      {
        path: '/signup',
        alias: '/signup',
        component: () => import('../views/SignupView.vue'),
        meta: { title: 'Sign up', ParentName: 'Index'}
      },
    ]
  },
  {
    path: '/home',
    meta: { title: 'Home', name: 'Home', parent: true },
    component: () => import('../components/Layouts/DashboardLayout.vue'),
    children: [
      {
        path: '/dashboard',
        alias: '/dashboard',
        component: () => import('../views/DashboardView.vue'),
        meta: { title: 'Dashboard', ParentName: 'Home'}
      },
      {
        path: '/admin_dashboard',
        alias: '/admin_dashboard',
        component: () => import('../views/AdminDashboardView.vue'),
        meta: { title: 'Admin Dashboard', ParentName: 'Home'}
      },
      {
        path: '/receptionist_dashboard',
        alias: '/receptionist_dashboard',
        component: () => import('../views/ReceptionistDashboardView.vue'),
        meta: { title: 'Receptionist Dashboard', ParentName: 'Home'}
      },
      {
        path: '/wallet',
        alias: '/wallet',
        component: () => import('../views/WalletLoadView.vue'),
        meta: { title: 'Wallet', ParentName: 'Home'}
      },
      {
        path: '/time_monitoring',
        alias: '/time_monitoring',
        component: () => import('../views/TimeMonitoringView.vue'),
        meta: { title: 'Wallet', ParentName: 'Home'}
      },
      {
        path: '/wallet_transactions',
        alias: '/wallet_transactions',
        component: () => import('../views/WalletTransactionsView.vue'),
        meta: { title: 'Wallet Transactions', ParentName: 'Home'}
      },
      {
        path: '/visits',
        alias: '/visits',
        component: () => import('../views/VisitationListView.vue'),
        meta: { title: 'Visitations', ParentName: 'Home'}
      },
      //UTILITY
      {
        path: '/accounts',
        alias: '/accounts',
        component: () => import('../views/AccountsView.vue'),
        meta: { title: 'Accounts', ParentName: 'Home'}
      },
      {
        path: '/pending_accounts',
        alias: '/pending_accounts',
        component: () => import('../views/PendingAccountsView.vue'),
        meta: { title: 'Pending Accounts', ParentName: 'Home'}
      },
      {
        path: '/employees',
        alias: '/employees',
        component: () => import('../views/EmployeesView.vue'),
        meta: { title: 'Employees', ParentName: 'Home'}
      },
      {
        path: '/areas',
        alias: '/areas',
        component: () => import('../views/AreasView.vue'),
        meta: { title: 'Areas', ParentName: 'Home'}
      },
      {
        path: '/customers',
        alias: '/customers',
        component: () => import('../views/CustomersView.vue'),
        meta: { title: 'Customers', ParentName: 'Home'}
      },
      {
        path: '/user_menu',
        alias: '/user_menu',
        component: () => import('../views/UtilityUserMenuView.vue'),
        meta: { title: 'Utility User Menu', ParentName: 'Home'}
      },
      {
        path: '/assign_user_menu',
        alias: '/assign_user_menu',
        component: () => import('../views/AssignUserTypeMenuView.vue'),
        meta: { title: 'Assign User Type', ParentName: 'Home'}
      },
      {
        path: '/bookings',
        alias: '/bookings',
        component: () => import('../views/BookingView.vue'),
        meta: { title: 'Bookings', ParentName: 'Home'}
      },
      {
        path: '/book',
        alias: '/book',
        component: () => import('../views/BookView.vue'),
        meta: { title: 'Book a Seat', ParentName: 'Home'}
      },
      {
        path: '/my_appointments',
        alias: '/my_appointments',
        component: () => import('../views/MyAppointmentsView.vue'),
        meta: { title: 'My Appointments', ParentName: 'Home'}
      },
      {
        path: '/appointments',
        alias: '/appointments',
        component: () => import('../views/AppointmentsView.vue'),
        meta: { title: 'Appointments', ParentName: 'Home'}
      },
      {
        path: '/rates/:name',
        alias: '/rates/:name',
        component: () => import('../views/RatesView.vue'),
        meta: { title: 'Rates', ParentName: 'Home'}
      },
      {
        path: '/customer_sessions',
        alias: '/customer_sessions',
        component: () => import('../views/CustomerSessionsView.vue'),
        meta: { title: 'Customer Sessions', ParentName: 'Home'}
      },
      {
        path: '/employee_sessions',
        alias: '/employee_sessions',
        component: () => import('../views/EmployeeSessionsView.vue'),
        meta: { title: 'Employee Sessions', ParentName: 'Home'}
      },
      {
        path: '/reports',
        alias: '/reports',
        component: () => import('../views/ReportsView.vue'),
        meta: { title: 'Reports', ParentName: 'Home'}
      },
      {
        path: '/profile',
        alias: '/profile',
        component: () => import('../views/ProfileView.vue'),
        meta: { title: 'Profile', ParentName: 'Home'}
      },
      {
        path: '/settings',
        alias: '/settings',
        component: () => import('../views/SettingsView.vue'),
        meta: { title: 'Settings', ParentName: 'Home'}
      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  let role = store.state.user;
  if (to.matched.some(record => record.meta.Index)) {
      if (!role) {
          next({ path: '/meshconnect'})
      } else {
        document.title = "Meshconnect - " + to.meta.title;
        next()
      }
  }
  else {
    document.title = "Meshconnect - " + to.meta.title;
      next()
  }
})

export default router
