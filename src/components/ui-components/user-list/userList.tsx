import { useHall } from "@/hooks/useHall";
import React from "react";
import { Sidebar, User, UserContainer } from "./style";
import Image from "next/image";

interface UserListProps {
  roomId: string;
}

const UserList = ({ roomId }: UserListProps) => {
  const { users } = useHall(roomId);
  return (
    <Sidebar>
      {users?.map((user) => (
        <UserContainer key={user?.uid}>
          <User>
            <Image
              src={`/avatars/${user?.avatar}.webp`}
              alt="user avatar"
              width={30}
              height={30}
            />
            <p>{user?.name}</p>
          </User>
          <p>{user?.score}</p>
        </UserContainer>
      ))}
    </Sidebar>
  );
};

export default UserList;
