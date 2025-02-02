import { Home, MessageCircleQuestion, Settings2 } from 'lucide-react'

const navMain = [
  {
    title: 'Home',
    url: '/dashboard',
    icon: Home,
  },
]

const navSecondary = [
  {
    title: 'FAQ',
    url: '/dashboard/faq',
    icon: MessageCircleQuestion,
  },
]

const workspaces = [
  {
    name: 'Daily Journal & Reflection',
    url: '/dashboard/workspace1',
    emoji: '📔',
  },
  {
    name: 'Health & Wellness Tracker',
    url: '/dashboard/workspace2',
    emoji: '🍏',
  },
  {
    name: 'Personal Growth & Learning Goals',
    url: '/dashboard/workspace3',
    emoji: '🌟',
  },
]

// This is sample data.
export const dashboardConfig = {
  navMain,
  navSecondary,
  workspaces,
}
