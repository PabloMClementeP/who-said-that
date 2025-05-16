"use client";

import { useState, useEffect } from "react";
import type { User, Room } from "../types";
import { RoomService } from "@/services/room.service";
import { HallUseCase } from "@/usecases/hall.usecase";

export function useHall(roomId: string) {
  const [users, setUsers] = useState<User[]>([]);
  const [room, setRoom] = useState<Room | null>(null);
  const [isCreator, setIsCreator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function setupHall() {
      try {
        // Verificar si la sala existe
        const exists = await RoomService.roomExists(roomId);

        if (!exists) {
          setError("La sala no existe");
          setLoading(false);
          return;
        }

        // Verificar si el usuario es el creador
        const isCreator = await HallUseCase.isRoomCreator(roomId);
        setIsCreator(isCreator);

        // Observar cambios en los datos de la sala
        const unsubscribeRoom = RoomService.observeRoomData(
          roomId,
          (roomData) => {
            setRoom(roomData);
          }
        );

        // Observar cambios en los usuarios de la sala
        const unsubscribeUsers = RoomService.observeRoomUsers(
          roomId,
          (roomUsers) => {
            setUsers(roomUsers);
            setLoading(false);
          }
        );

        return () => {
          unsubscribeRoom();
          unsubscribeUsers();
        };
      } catch (err) {
        setError("Error al cargar el hall");
        setLoading(false);
      }
    }

    setupHall();
  }, [roomId]);

  const startRoom = async () => {
    try {
      await HallUseCase.startRoom(roomId);
    } catch (err) {
      setError("Error al iniciar la sala");
    }
  };

  return {
    users,
    room,
    isCreator,
    loading,
    error,
    startRoom,
  };
}
