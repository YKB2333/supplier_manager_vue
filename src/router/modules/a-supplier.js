
import Layout from '@/views/layout/Layout'
const routes = {
  path: '/supplier',
  name: 'Supplier',
  component: Layout,
  redirect: '/supplier/index',
  meta: {
    title: '供应商管理',
    icon: 'supplier'
  },
  children: [
    {
      path: '/index',
      name: 'SupplierIndex',
      component: () => import('@/views/supplier/manage'),
      meta: {
        title: '供应商列表',
        noCache: true
      }
    },
    {
      path: '/user',
      name: 'SupplierUserIndex',
      component: () => import('@/views/supplier/manage/user'),
      hidden: true,
      meta: {
        title: '供应商账号列表',
        noCache: true
      },
      props: true
    },
    {
      path: '/checkModify',
      name: 'CheckModify',
      component: () => import('@/views/supplier/manage/checkModify.vue'),
      meta: {
        title: '建档审核',
        noCache: true
      }
    },
    {
      path: '/cooperation',
      name: 'SupplierCooperation',
      component: () => import('@/views/supplier/cooperation'),
      meta: {
        title: '供应商合作商品',
        noCache: true
      }
    },
    {
      path: '/recommend',
      name: 'SupplierRecommend',
      component: () => import('@/views/supplier/recommend'),
      meta: {
        title: '供应商推荐商品',
        noCache: true
      }
    },
    {
      path: '/recommend/bulkImport',
      name: 'SupplierBulkImport',
      component: () => import('@/views/supplier/recommend/bulkImport'),
      meta: {
        title: '推荐商品批量导入',
        noCache: true
      }
    },
    {
      path: '/parts',
      name: 'SupplierParts',
      component: () => import('@/views/supplier/parts'),
      meta: {
        title: '供应商配件',
        noCache: true
      }
    },
  ]
}
export default routes
