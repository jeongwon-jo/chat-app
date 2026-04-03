"use client"

import useConverSation from '@/hooks/useConversation'
import useRoutes from '@/hooks/useRoutes'
import MobileItem from './MobileItem'

const MobileFooter = () => {
  const routes = useRoutes()
  const {isOpen} = useConverSation()

  // 채팅중일때는 mobileFooter 숨김
  if (isOpen) {
    return null
  }

  return (
    <div className={`fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t border-t-gray-400 lg:hidden`}>
      {routes.map((route) => (
        <MobileItem key={route.href} href={route.href} active={route.active} icon={route.icon} onClick={route.onClick} />
      ))}
    </div>
  )
}

export default MobileFooter