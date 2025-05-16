"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthContext } from "@/contexts/auth.context";
import { useHall } from "@/hooks/useHall";
import { HallUseCase } from "@/usecases/hall.usecase";
import { HallTitle, HallWrapper, UserContainer, UsersContainer } from "./style";
import { CustomButton } from "@/app/page.style";
import Image from "next/image";

export default function Hall() {
  const [isJoining, setIsJoining] = useState(false);
  const { currentUser, userData, checkUserExists, isLoading } =
    useAuthContext();
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;

  const {
    users,
    room,
    isCreator,
    loading: hallLoading,
    error,
    startRoom,
  } = useHall(roomId);

  useEffect(() => {
    if (isLoading) return;

    const setupHall = async () => {
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
        // Unirse al hall
        await HallUseCase.joinHall(roomId);
      } catch (error) {
        console.error("Error al unirse al hall:", error);
      } finally {
        setIsJoining(false);
      }
    };

    setupHall();

    return () => {};
  }, [currentUser, userData, roomId, router, checkUserExists, isLoading]);

  useEffect(() => {
    if (room && room.status === "active") {
      // Si la sala está activa, redirigir a la página de la sala
      router.push(`/room/${roomId}`);
    }
  }, [room, roomId, router]);

  const handleStartRoom = async () => {
    try {
      await startRoom();
    } catch (error) {
      console.error("Error al iniciar la sala:", error);
    }
  };

  const handleLeaveHall = async () => {
    try {
      if (currentUser) {
        await HallUseCase.leaveRoom(roomId);
      }
      router.push("/select-room");
    } catch (error) {
      console.error("Error al salir del hall:", error);
    }
  };

  if (isLoading || hallLoading || isJoining) {
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
          <h1>Error</h1>
          <p>{error}</p>
          <button onClick={() => router.push("/select-room")}>Volver</button>
        </div>
      </div>
    );
  }

  return (
    <HallWrapper>
      <HallTitle>Aguardando usuarios</HallTitle>

      <UsersContainer>
        {users.map((user) => (
          <UserContainer key={user.uid}>
            <Image
              src={`/avatars/${user?.avatar}.webp`}
              alt=""
              width={32}
              height={32}
            />
            <li>{user.name}</li>
          </UserContainer>
        ))}
      </UsersContainer>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "150px",
          }}
        >
          <CustomButton onClick={handleLeaveHall} $color="#6a7679">
            Salir
          </CustomButton>
        </div>
        {isCreator && (
          <div
            style={{
              width: "150px",
            }}
          >
            <CustomButton onClick={handleStartRoom} $color="#45818E">
              Iniciar Juego
            </CustomButton>
          </div>
        )}
      </div>
    </HallWrapper>
  );
}
