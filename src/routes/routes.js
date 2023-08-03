import DashboardLayout from '../layout/DashboardLayout.vue'

// Admin pages
import Patients from 'src/pages/Patients/Patients.vue'
import Overview from 'src/pages/Overview.vue'


const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/admin/overview'
  },
  {
    path: '/admin',
    component: DashboardLayout,
    redirect: '/admin/overview',
    children: [
      {
        path: 'overview',
        name: 'Overview',
        component: Overview
      },
      
      {
        path: 'clinic-history',
        name: 'Historia Clínica',
        component: Patients
      }
    ]
  }
]

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes
