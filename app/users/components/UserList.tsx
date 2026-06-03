import { User } from "@prisma/client";
import UserBox from "./UserBox";

interface UserListProps {
  items: User[];
}
const UserList = ({ items }: UserListProps) => {
  return (
    <aside className="h-full block w-full pb-20 overflow-y-auto border-r border-[#1e1e1e] bg-[#111111]">
      <div className="px-5">
        <div className="flex-col">
          <div className="py-4 text-xl font-bold tracking-widest text-gray-100 uppercase">
            사람들
          </div>
        </div>
      </div>
      {items.map((item) => (
        <UserBox key={item.id} data={item} />
      ))}
    </aside>
  );
};

export default UserList;
