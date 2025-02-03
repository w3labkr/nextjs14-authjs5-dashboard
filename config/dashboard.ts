import { ListTodo, MessageCircleQuestion, Settings2, SquareTerminal } from 'lucide-react'

const navMain = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: SquareTerminal,
    open: true,
    items: [],
  },
  {
    title: 'Tasks',
    url: '/dashboard/tasks',
    icon: ListTodo,
    open: true,
    items: [],
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings2,
    open: true,
    items: [
      { title: 'Profile', url: '/dashboard/settings/profile' },
      { title: 'Account', url: '/dashboard/settings/account' },
      { title: 'Appearance', url: '/dashboard/settings/appearance' },
      { title: 'Notifications', url: '/dashboard/settings/notifications' },
      { title: 'Display', url: '/dashboard/settings/display' },
    ],
  },
]

const navSecondary = [
  {
    title: 'FAQ',
    url: '/dashboard/faq',
    icon: MessageCircleQuestion,
  },
]

export const dashboard = {
  navMain,
  navSecondary,
}
