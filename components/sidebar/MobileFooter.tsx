"use client"

import useConverSation from '@/hooks/useConversation'
import useRoutes from '@/hooks/useRoutes'
import MobileItem from './MobileItem'

const MobileFooter = () => {
  const routes = useRoutes()
  const { isOpen } = useConverSation()

  if (isOpen) {
    return null
  }

  return (
    <div className="fixed justify-between w-full bottom-0 z-40 flex items-center bg-[#0d0d0d] border-t border-t-[#1e1e1e] lg:hidden">
      {routes.map((route) => (
        <MobileItem key={route.href} href={route.href} active={route.active} icon={route.icon} onClick={route.onClick} />
      ))}
    </div>
  )
}

export default MobileFooter
