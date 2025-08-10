import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
  },
  {
    path: '/manage/work',
    name: 'ManageWork',
    component: () => import('@/views/Manage/Work/Work.vue'),
  },
  {
    path: '/manage/task/:id',
    name: 'TaskDetail',
    component: () => import('@/views/Manage/TaskDetail/TaskDetail.vue'),
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
