import Layout from '@/views/layout/Layout'
const routes = {
  path: '/notice/data',
  name: 'notice',
  component: Layout,
  redirect: '/notice',
  meta: {
    title: '公告管理',
    icon: 'message'
  },
  children: [
    {
      path: '/notice',
      name: 'noticeManagement',
      component: () => import('@/views/notice/data'),
      hidden: false,
      meta: {
        title: '公告管理',
        noCache: false
      }
    }
  ]
}
export default routes
