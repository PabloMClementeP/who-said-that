"use client";
import type { User } from "@/types";

interface UserListProps {
  users: User[];
  currentUserId?: string;
}

export function List({ users, currentUserId }: UserListProps) {
  if (users.length === 0) {
    return <p>No hay usuarios conectados</p>;
  }

  return (
    <div>
      {users.map((user) => (
        <div key={user.uid}>
          <div>
            <p>{user.name}</p>
            <p>{user.uid === currentUserId ? "Tú" : "Usuario"}</p>
          </div>
          <div>
            <span></span>
          </div>
        </div>
      ))}
    </div>
  );
}
