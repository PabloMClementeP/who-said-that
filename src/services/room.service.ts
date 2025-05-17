import { db } from "./firebase.service";
import {
  ref,
  set,
  get,
  push,
  remove,
  onValue,
  onDisconnect,
  serverTimestamp,
  update,
} from "firebase/database";
import type { User, Room } from "../types";

export class RoomService {
  // Crear una nueva sala
  static async createRoom(creatorUid: string): Promise<string> {
    try {
      const newRoomRef = push(ref(db, "rooms"));
      const newRoomId = newRoomRef.key as string;

      await set(newRoomRef, {
        roomId: newRoomId,
        creatorUid,
        createdAt: new Date().toISOString(),
        status: "waiting",
        users: {},
      });

      return newRoomId;
    } catch (error) {
      console.error("Error en createRoom:", error);
      throw error;
    }
  }

  // Verificar si una sala existe
  static async roomExists(roomId: string): Promise<boolean> {
    try {
      const roomRef = ref(db, `rooms/${roomId}`);
      const snapshot = await get(roomRef);
      return snapshot.exists();
    } catch (error) {
      console.error("Error en roomExists:", error);
      return false;
    }
  }

  // Obtener datos de una sala
  static async getRoomData(roomId: string): Promise<Room | null> {
    try {
      const roomRef = ref(db, `rooms/${roomId}`);
      const snapshot = await get(roomRef);

      if (snapshot.exists()) {
        return snapshot.val() as Room;
      }

      return null;
    } catch (error) {
      console.error("Error en getRoomData:", error);
      throw error;
    }
  }

  // Obtener todas las salas
  static async getAllRooms(): Promise<Room[]> {
    try {
      const roomsRef = ref(db, "rooms");
      const snapshot = await get(roomsRef);

      if (snapshot.exists()) {
        const roomsData = snapshot.val();
        const roomsArray = Object.values(roomsData) as Room[];
        return roomsArray;
      }
      return [];
    } catch (error) {
      console.error("Error en getAllRooms:", error);
      throw error;
    }
  }

  // Observar cambios en los datos de una sala
  static observeRoomData(
    roomId: string,
    callback: (room: Room | null) => void
  ): () => void {
    const roomRef = ref(db, `rooms/${roomId}`);

    const unsubscribe = onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val() as Room);
      } else {
        callback(null);
      }
    });

    return () => unsubscribe();
  }

  // Iniciar una sala (cambiar estado a activo)
  static async startRoom(roomId: string): Promise<void> {
    try {
      const roomRef = ref(db, `rooms/${roomId}`);
      await update(roomRef, { status: "active" });
    } catch (error) {
      console.error("Error en startRoom:", error);
      throw error;
    }
  }
  
  // Cambiar el estado de la sala a "responding" (para iniciar el juego)
  static async startGame(roomId: string): Promise<void> {
    try {
      const roomRef = ref(db, `rooms/${roomId}`);
      await update(roomRef, { status: "responding" });
    } catch (error) {
      console.error("Error en startGame:", error);
      throw error;
    }
  }

  // Añadir un usuario a una sala
  static async addUserToRoom(roomId: string, user: User): Promise<void> {
    try {
      const userRef = ref(db, `rooms/${roomId}/users/${user.uid}`);
      await set(userRef, {
        ...user,
        joinedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error en addUserToRoom:", error);
      throw error;
    }
  }

  // Eliminar un usuario de una sala
  static async removeUserFromRoom(roomId: string, uid: string): Promise<void> {
    try {
      const userRef = ref(db, `rooms/${roomId}/users/${uid}`);
      await remove(userRef);
    } catch (error) {
      console.error("Error en removeUserFromRoom:", error);
      throw error;
    }
  }

  // Observar cambios en los usuarios de una sala
  static observeRoomUsers(
    roomId: string,
    callback: (users: User[]) => void
  ): () => void {
    const usersRef = ref(db, `rooms/${roomId}/users`);
    const roomRef = ref(db, `rooms/${roomId}`);

    const unsubscribe = onValue(usersRef, async (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const usersArray = Object.values(usersData) as User[];
        callback(usersArray);
        if (usersArray.length === 0) {
          try {
            // Si no hay usuarios, cambiar el estado de la sala a "waiting"
            await update(roomRef, { status: "waiting" });
          } catch (error) {
            console.error(
              `Error al actualizar el estado de la sala ${roomId} a waiting:`,
              error
            );
          }
        }
      } else {
        // Si el nodo 'users' no existe, significa que no hay usuarios
        callback([]);
        try {
          // Cambiar el estado de la sala a "waiting"
          await update(roomRef, { status: "waiting" });
        } catch (error) {
          console.error(
            `Error al actualizar el estado de la sala ${roomId} a waiting (nodo users no existe):`,
            error
          );
        }
      }
    });

    return () => unsubscribe();
  }

  // Configurar onDisconnect para eliminar al usuario de la sala
  static setupUserDisconnect(roomId: string, uid: string): void {
    const userRef = ref(db, `rooms/${roomId}/users/${uid}`);
    onDisconnect(userRef).remove();
  }
}
