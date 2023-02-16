import VTooltip from "v-tooltip";
// Notifications plugin
// A plugin file where you could register global components used across the app
import GlobalComponents from "./globalComponents";
// A plugin file where you could register global directives
import GlobalDirectives from "./globalDirectives";
// Sidebar on the right. Used as a local plugin in DashboardLayout.vue
import SideBar from "./components/SidebarPlugin";
import BootstrapVue from "bootstrap-vue";
import Toasted from 'vue-toasted'


// asset imports
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "./assets/sass/light-bootstrap-dashboard.scss";

/**
 * This is the main Light Bootstrap Dashboard Vue plugin where dashboard related plugins are registerd.
 */
export default {
  install(Vue) {
    Vue.use(BootstrapVue);
    Vue.use(GlobalComponents);
    Vue.use(GlobalDirectives);
    Vue.use(SideBar);
    Vue.use(VTooltip);
    Vue.use(Toasted)

  },
};
