import getCurrentUser from "@/app/actions/getCurrentUser";
import React from "react";
import MobileFooter from "./MobileFooter";

const Sidebar = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();

  return (
    <div className="w-full max-w-110 m-auto h-full">
      {/* <DesktopSidebar currentUser={currentUser!}/> */}
      <MobileFooter />
      <main className="h-full">{children}</main>
    </div>
  );
};

export default Sidebar;
