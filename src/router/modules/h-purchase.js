import Layout from '@/views/layout/Layout'
const routes = {
  path: '/purchase',
  name: 'purchase',
  component: Layout,
  redirect: '/myData',
  meta: {
    title: '采购需求管理',
    icon: 'message'
  },
  children: [
    {
    //   path: '/purchase/data',
    //   name: 'purchase',
    //   component: () => import('@/views/purchase/data'),
    //   hidden: false,
    //   meta: {
    //     title: '采购需求管理',
    //     noCache: false
    //   }
    // },{
      path: '/purchase/add',
      name: 'addPurchase',
      component: () => import('@/views/purchase/addPurchase'),
      hidden: false,
      meta: {
        title: '发起采购需求',
        noCache: false
      }
    },{
      path: '/purchase/myData',
      name: 'myPurchase',
      component: () => import('@/views/purchase/data'),
      hidden: false,
      meta: {
        title: '我发起的采购需求',
        noCache: false,
        op: 'my'
      }
    },{
      path: '/purchase/recData',
      name: 'recPurchase',
      component: () => import('@/views/purchase/data'),
      hidden: false,
      meta: {
        title: '我接收的采购需求',
        noCache: false,
        op: 'rec'
      }
    }
  ]
}
export default routes
