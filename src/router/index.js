import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  // 课程管理
  {
    path: '/project',
    component: Layout,
    redirect: '/project/topProject',
    meta: { title: '课程管理', icon: 'el-icon-s-management'},
    children: [
      {
        path: 'topProject',
        name: 'TopProject',
        component: () => import('@/views/project/topProject/index'),
        meta: { title: '课程大类', icon: 'education'}
      },
      {
        path: 'secondProject',
        name: 'SecondProject',
        component: () => import('@/views/project/secondProject/index'),
        meta: { title: '二级类目', icon: 'clipboard'}
      },
      {
        path: 'bookType',
        name: 'BookType',
        component: () => import('@/views/project/bookType/index'),
        meta: { title: '课本类型', icon: 'tree'}
      },
      {
        path: 'bookList',
        name: 'BookList',
        component: () => import('@/views/project/bookList/index'),
        meta: { title: '课本列表', icon: 'list'}
      },
      {
        path: 'bookDetail',
        name: 'BookDetail',
        component: () => import('@/views/project/bookDetail/index'),
        meta: { title: '课本详情', icon: 'documentation'}
      }
    ]
  },

  // 系统管理
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/user',
    meta: { title: '系统管理', icon: 'el-icon-setting'},
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/setting/user/index'),
        meta: { title: '用户管理', icon: 'peoples' }
      },
      {
        path: 'dept',
        name: 'Dept',
        component: () => import('@/views/setting/user/index'),
        meta: { title: '部门管理', icon: 'el-icon-news' }
      },
      {
        path: 'wechat',
        name: 'Wechat',
        component: () => import('@/views/setting/user/index'),
        meta: { title: '微信管理', icon: 'wechat' }
      },
      {
        path: 'link',
        name: 'Link',
        component: () => import('@/views/setting/link/index'),
        meta: { title: '链接管理', icon: 'link' }
      },
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
