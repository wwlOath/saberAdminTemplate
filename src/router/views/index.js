import Layout from '@/page/index/'

export default [
  {
    path: '/wel',
    component: Layout,
    redirect: '/wel/index',
    children: [{
      path: 'index',
      name: '首页',
      meta: {
        i18n: 'dashboard'
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/wel/index')
    }, {
      path: 'dashboard',
      name: '控制台',
      meta: {
        i18n: 'dashboard',
        menu: false,
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/wel/dashboard')
    }]
  },
  {
    path: '/test',
    component: Layout,
    redirect: '/test/index',
    children: [{
      path: 'index',
      name: '测试页',
      meta: {
        i18n: 'test'
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/util/test')
    }]
  },
  {
    path: '/info',
    component: Layout,
    redirect: '/info/index',
    children: [{
      path: 'index',
      name: '个人信息',
      meta: {
        i18n: 'info'
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/user/info')
    }]
  },
  {
    path: '/work/process/leave',
    component: Layout,
    redirect: '/work/process/leave/form',
    children: [{
      path: 'form/:id',
      name: '请假流程',
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/work/leave')
    }]
  },
  {
    path: '/work/process/leave',
    component: Layout,
    redirect: '/work/process/leave/handle',
    children: [{
      path: 'handle/:taskId/:processInstanceId/:businessId',
      name: '处理请假流程',
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/work/todoHandle')
    }]
  },
  {
    path: '/work/process/leave',
    component: Layout,
    redirect: '/work/process/leave/detail',
    children: [{
      path: 'detail/:processInstanceId/:businessId',
      name: '请假流程详情',
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/work/todoDetail')
    }]
  }
]
