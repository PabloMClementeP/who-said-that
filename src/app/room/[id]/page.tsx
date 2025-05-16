"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthContext } from "@/contexts/auth.context";
import { useRoom } from "@/hooks/useRoom";
import { RoomUseCase } from "@/usecases/room.usecase";
import UserList from "@/components/ui-components/user-list/userList";
import { HallWrapper } from "./style";

export default function Room() {
  const [isJoining, setIsJoining] = useState(false);
  const { currentUser, userData, checkUserExists, isLoading } =
    useAuthContext();
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;

  const { users, loading: roomLoading, error, leaveRoom } = useRoom(roomId);

  useEffect(() => {
    if (isLoading) return;

    const setupRoom = async () => {
      // Verificar si el usuario está autenticado
      if (!currentUser) {
        router.push("/");
        return;
      }

      // Verificar si el usuario existe en la base de datos
      const exists = await checkUserExists();
      if (!exists) {
        router.push("/");
        return;
      }

      try {
        setIsJoining(true);
        // Unirse a la sala
        await RoomUseCase.joinRoom(roomId);
      } catch (error) {
        console.error("Error al unirse a la sala:", error);
      } finally {
        setIsJoining(false);
      }
    };

    setupRoom();

    return () => {
      if (currentUser) {
        RoomUseCase.leaveRoom(roomId).catch(console.error);
      }
    };
  }, [currentUser, userData, roomId, router, checkUserExists, isLoading]);

  const handleLeaveRoom = async () => {
    try {
      if (currentUser) {
        await leaveRoom(currentUser.uid);
      }
      router.push("/select-room");
    } catch (error) {
      console.error("Error al salir de la sala:", error);
    }
  };

  if (isLoading || roomLoading || isJoining) {
    return (
      <div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div>
          <p>{error}</p>
          <button onClick={() => router.push("/select-room")}>Volver</button>
        </div>
      </div>
    );
  }

  return (
    <HallWrapper>
      <div>
        <p>Sala: ${roomId}</p>
        <button onClick={handleLeaveRoom}>Salir de la sala</button>
      </div>

      {/* <UserList users={users} currentUserId={currentUser?.uid} /> */}
      <UserList roomId={roomId} />
    </HallWrapper>
  );
}
