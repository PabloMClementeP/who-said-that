"use client";

import { useState, useEffect } from "react";
import type { Room, User } from "../types";
import { RoomService } from "@/services/room.service";
import { AuthService } from "@/services/auth.service";

export function useRoom(roomId?: string) {
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [userRooms, setUserRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Obtener todas las salas
    async function getRooms() {
      try {
        const allRooms = await RoomService.getAllRooms();
        setRooms(allRooms);
        
        // Si hay un usuario autenticado, filtrar sus salas
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
          const filteredRooms = allRooms.filter(room => room.creatorUid === currentUser.uid);
          setUserRooms(filteredRooms);
        }
        
        if (!roomId) {
          setLoading(false);
        }
      } catch (err) {
        setError("Error al cargar las salas");
        setLoading(false);
      }
    }

    // Si se proporciona un roomId, verificar y observar esa sala específica
    async function checkRoom() {
      if (!roomId) return;
      
      try {
        // Verificar si la sala existe
        const exists = await RoomService.roomExists(roomId);

        if (!exists) {
          setError("La sala no existe");
          setLoading(false);
          return;
        }

        // Observar cambios en los usuarios de la sala
        const unsubscribe = RoomService.observeRoomUsers(
          roomId,
          (roomUsers) => {
            setUsers(roomUsers);
            setLoading(false);
          }
        );

        return () => unsubscribe();
      } catch (err) {
        setError("Error al cargar la sala");
        setLoading(false);
      }
    }

    getRooms();
    if (roomId) {
      checkRoom();
    }
  }, [roomId]);

  // Función para obtener salas de un usuario específico
  const getRoomsByUser = async (uid: string) => {
    try {
      setLoading(true);
      const allRooms = await RoomService.getAllRooms();
      const filteredRooms = allRooms.filter(room => room.creatorUid === uid);
      setUserRooms(filteredRooms);
      setLoading(false);
      return filteredRooms;
    } catch (err) {
      setError("Error al obtener las salas del usuario");
      setLoading(false);
      return [];
    }
  };

  const leaveRoom = async (uid: string) => {
    if (!roomId) return;
    
    try {
      await RoomService.removeUserFromRoom(roomId, uid);
    } catch (err) {
      setError("Error al salir de la sala");
    }
  };

  return {
    users,
    rooms,
    userRooms,
    loading,
    error,
    leaveRoom,
    getRoomsByUser,
  };
}
