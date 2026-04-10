"use client"

import useConverSation from '@/hooks/useConversation'
import useRoutes from '@/hooks/useRoutes'
import MobileItem from './MobileItem'
import { useTheme } from '@/context/ThemeContext'
import { HiMoon, HiSun } from 'react-icons/hi2'

const MobileFooter = () => {
  const routes = useRoutes()
  const { isOpen } = useConverSation()
  const { theme, toggle } = useTheme()

  if (isOpen) {
    return null
  }

  return (
    <div className="fixed justify-between w-full bottom-0 z-40 flex items-center bg-white dark:bg-gray-900 border-t border-t-gray-200 dark:border-t-gray-700 lg:hidden">
      {routes.map((route) => (
        <MobileItem key={route.href} href={route.href} active={route.active} icon={route.icon} onClick={route.onClick} />
      ))}
      <button
        onClick={toggle}
        className="group flex gap-x-3 text-sm leading-6 font-semibold w-full justify-center p-4 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        {theme === 'dark' ? <HiSun className="w-6 h-6" /> : <HiMoon className="w-6 h-6" />}
      </button>
    </div>
  )
}

export default MobileFooter
