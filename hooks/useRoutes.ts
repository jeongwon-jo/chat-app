"use client"

import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { HiChat } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";
import useConverSation from "./useConversation";
const useRoutes = () => {
  const pathname = usePathname()
  const { isOpen } = useConverSation()
  
  const routes = [
		{
			label: "Chat",
			href: "/conversations",
			icon: HiChat,
			active: pathname === "/conversations" || isOpen,
		},
		{
			label: "Users",
			href: "/users",
			icon: HiUsers,
			active: pathname === "/users",
		},
		{
			label: "Logout",
			onClick: () => signOut(),
			href: "#",
			icon: HiArrowLeftOnRectangle,
		},
	];
  
  return routes
}

export default useRoutes