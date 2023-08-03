
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// LightBootstrap plugin
import LightBootstrap from "./light-bootstrap-main";

// router setup
import routes from "./routes/routes";

import "./registerServiceWorker";

import axios from 'axios'
// plugin setup
Vue.use(VueRouter);
Vue.use(LightBootstrap);
library.add(fas);
Vue.component('font-awesome-icon', FontAwesomeIcon);


// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: "nav-item active",
  scrollBehavior: (to) => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  },
});


axios.defaults.baseURL = 'http://localhost:8500'

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: (h) => h(App),
  router,
});
