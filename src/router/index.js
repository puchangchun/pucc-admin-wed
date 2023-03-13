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
      meta: { title: '数据可用性管控系统', icon: 'dashboard', affix:true } // affix 能否关闭标签卡
    }]
  },

  {
    path: '/sys',
    component: Layout,
    redirect: '/sys/user',
    name: 'sysManage',
    meta: { title: '系统管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/sys/user'),
        meta: { title: '用户管理', icon: 'tree' } // 图标在icons下面svg找
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/sys/role'),
        meta: { title: '角色管理', icon: 'tree' }
      }
    ]
  },

  {
    path: '/transfer',
    component: Layout,
    redirect: '/transfer/accuracy',
    name: 'transfer',
    meta: { title: '流转数据可用性管控', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'accuracy',
        name: 'accuracy',
        component: () => import('@/views/transfer/accuracy'),
        meta: { title: '数据表准确性分析', icon: 'tree' } // 图标在icons下面svg找
      },
      {
        path: 'completeness',
        name: 'completeness',
        component: () => import('@/views/transfer/completeness'),
        meta: { title: '数据表完整性分析', icon: 'tree' }
      },
      {
        path: 'consistency',
        name: 'consistency',
        component: () => import('@/views/transfer/consistency'),
        meta: { title: '数据表一致性分析', icon: 'tree' }
      }
    ]
  },

  {
    path: '/storage',
    component: Layout,
    redirect: '/storage/result',
    name: 'storage',
    meta: { title: '存储数据可用性管控', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'result',
        name: 'result',
        component: () => import('@/views/storage/result'),
        meta: { title: '异常检测与修复结果', icon: 'el-icon-s-help' } // 图标在icons下面svg找
      }
      // {
      //   path: 'detection',
      //   name: 'detection',
      //   component: () => import('@/views/storage/detection'),
      //   meta: { title: '异常数据检测', icon: 'tree' } // 图标在icons下面svg找
      // },
      // {
      //   path: 'repair',
      //   name: 'repair',
      //   component: () => import('@/views/test/test2'),
      //   meta: { title: '异常数据修复', icon: 'tree' }
      // }
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
