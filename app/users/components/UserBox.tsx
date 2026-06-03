"use client";
import Avatar from "@/components/Avatar";
import LoadingModal from "@/components/modals/LoadingModal";
import useActiveList from "@/hooks/useActiveList";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";

import { useState } from "react";

interface UserBoxProps {
  data: User;
}
const UserBox = ({ data }: UserBoxProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { members } = useActiveList();
  const isActive = members.indexOf(data?.email || "") !== -1;

  const handleClick = () => {
    setIsLoading(true);
    axios
      .post("/api/conversations", { userId: data.id })
      .then((data) => {
        router.push(`/conversations/${data.data.id}`);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      {isLoading && <LoadingModal />}

      <div
        onClick={handleClick}
        className="w-full relative flex items-center space-x-3 bg-transparent py-4 px-5 hover:bg-[#1a1a1a] transition cursor-pointer"
      >
        <Avatar user={data} isActive={isActive} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-gray-200">{data.name}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBox;
