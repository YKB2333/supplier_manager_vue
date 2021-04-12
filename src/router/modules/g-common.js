import Layout from '@/views/layout/Layout'
const routes = {
  path: '/common',
  name: 'common',
  component: Layout,
  redirect: '/common',
  meta: {
    title: '供应商留言',
    icon: 'message'
  },
  children: [
    {
      path: '/common/data',
      name: 'commonManagement',
      component: () => import('@/views/common/data'),
      hidden: false,
      meta: { 
        title: '供应商留言',
        noCache: false
      }
    }
  ]
}
export default routes
