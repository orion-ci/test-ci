import Vue from 'vue'
import Router from 'vue-router'
import dashboard from './../views/dashboard'
import login from './../views/login'
import projects from './../views/projects'
import apis from './../views/apis'
import rqhis from './../views/requestHis'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/dashboard/projects' },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: dashboard,
      children: [
        {
          path: 'projects',
          name: 'projects',
          component: projects
        },
        {
          path: 'apis/:projectId/:host',
          name: 'apis',
          component: apis
        },
        {
          path: 'rqhis/:projectId/:apiId/:host/:path',
          name: 'rqhis',
          component: rqhis
        }
      ]
    }
  ]
})
