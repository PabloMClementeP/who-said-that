"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/auth.context";
import { RoomUseCase } from "@/usecases/room.usecase";
import { RoomService } from "@/services/room.service";
import { CustomButton, Form, Input } from "../page.style";
import {
  ButtonWrapper,
  FormTitle,
  FormWrapper,
  RoomItem,
  RoomList,
  RoomsContainer,
} from "./style";
import { useRoom } from "@/hooks/useRoom";

export default function SelectRoom() {
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { currentUser, checkUserExists, isLoading } = useAuthContext();
  const router = useRouter();
  const { userRooms } = useRoom();

  useEffect(() => {
    if (isLoading) return;

    const checkAuth = async () => {
      // Verificar si el usuario está autenticado y existe en la BD
      if (!currentUser) {
        router.push("/");
        return;
      }

      const exists = await checkUserExists();
      if (!exists) {
        router.push("/");
      }
    };

    checkAuth();
  }, [currentUser, checkUserExists, isLoading, router]);

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomId.trim()) return;

    try {
      setLoading(true);
      setError("");

      // Verificar si la sala existe
      const roomExists = await RoomService.roomExists(roomId);

      if (!roomExists) {
        setError("La sala no existe");
        return;
      }

      router.push(`/hall/${roomId}`);
    } catch (error) {
      console.error("Error al unirse a la sala:", error);
      setError("Error al unirse a la sala");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    try {
      setLoading(true);
      setError("");

      // Crear una nueva sala
      const newRoomId = await RoomUseCase.createRoom();

      // Redirigir al hall de la nueva sala
      router.push(`/hall/${newRoomId}`);
    } catch (error) {
      console.error("Error al crear la sala:", error);
      setError("Error al crear la sala");
    } finally {
      setLoading(false);
    }
  };

  const handleClickRoom = async (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    const roomId = e.currentTarget.querySelector("p")?.textContent;
    if (roomId) {
      await RoomUseCase.removeAnswersFromRoom(roomId);
      router.push(`/hall/${roomId}`);
    }
  };

  return (
    <FormWrapper>
      {userRooms.length > 0 && (
        <RoomsContainer>
          <h2>Tus Salas</h2>
          <RoomList>
            {userRooms.map((room) => (
              <RoomItem key={room.roomId} onClick={(e) => handleClickRoom(e)}>
                <p>{room.roomId}</p>
              </RoomItem>
            ))}
          </RoomList>
        </RoomsContainer>
      )}
      <Form onSubmit={handleJoinRoom}>
        <FormTitle>Ingresar a una sala con su Id</FormTitle>
        <div>
          <Input
            type="text"
            placeholder="ID de la sala"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          {error && <p>{error}</p>}
        </div>
        <CustomButton type="submit" disabled={loading || !roomId.trim()}>
          {loading ? "Ingresando..." : "Ingresar a la sala"}
        </CustomButton>
      </Form>
      <ButtonWrapper>
        <CustomButton
          onClick={handleCreateRoom}
          disabled={loading}
          $color="#45818E"
        >
          {loading ? "Creando..." : "Crear nueva sala"}
        </CustomButton>
      </ButtonWrapper>
    </FormWrapper>
  );
}
