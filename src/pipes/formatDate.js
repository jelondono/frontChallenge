import Vue from 'vue'

Vue.filter('dateFormat', function (value) {
  return new Date(value).toLocaleDateString('es-ES');
});
