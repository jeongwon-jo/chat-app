"use client";
import useConverSation from "@/hooks/useConversation";
import clsx from "clsx";

const ConversationPage = () => {
  const { isOpen } = useConverSation();
  return (
    <div className={clsx(`h-full`, isOpen ? "block" : "hidden")}>
      {/* <EmptyState /> */}
    </div>
  );
};

export default ConversationPage;
