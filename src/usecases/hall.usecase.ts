import { RoomService } from "../services/room.service";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";

export class HallUseCase {
  // Unirse al hall de una sala
  static async joinHall(roomId: string): Promise<void> {
    try {
      const currentUser = AuthService.getCurrentUser();

      if (!currentUser) {
        throw new Error("Usuario no autenticado");
      }

      // Verificar si el usuario existe en la base de datos
      const userData = await UserService.getUserData(currentUser.uid);

      if (!userData) {
        throw new Error("Usuario no existe en la base de datos");
      }

      // Verificar si la sala existe
      const roomExists = await RoomService.roomExists(roomId);

      if (!roomExists) {
        throw new Error("La sala no existe");
      }

      // Añadir usuario a la sala
      await RoomService.addUserToRoom(roomId, userData);

      // Configurar onDisconnect
      RoomService.setupUserDisconnect(roomId, currentUser.uid);
    } catch (error) {
      console.error("Error en joinHall:", error);
      throw error;
    }
  }

  // Iniciar la sala (solo el creador puede hacerlo)
  static async startRoom(roomId: string): Promise<void> {
    try {
      const currentUser = AuthService.getCurrentUser();

      if (!currentUser) {
        throw new Error("Usuario no autenticado");
      }

      // Verificar si la sala existe y si el usuario es el creador
      const roomData = await RoomService.getRoomData(roomId);

      if (!roomData) {
        throw new Error("La sala no existe");
      }

      if (roomData.creatorUid !== currentUser.uid) {
        throw new Error("Solo el creador puede iniciar la sala");
      }

      // Iniciar la sala
      await RoomService.startRoom(roomId);
    } catch (error) {
      console.error("Error en startRoom:", error);
      throw error;
    }
  }

  // Iniciar el juego (solo el creador puede hacerlo)
  static async startGame(roomId: string): Promise<void> {
    try {
      const currentUser = AuthService.getCurrentUser();

      if (!currentUser) {
        throw new Error("Usuario no autenticado");
      }

      // Verificar si la sala existe y si el usuario es el creador
      const roomData = await RoomService.getRoomData(roomId);

      if (!roomData) {
        throw new Error("La sala no existe");
      }

      if (roomData.creatorUid !== currentUser.uid) {
        throw new Error("Solo el creador puede iniciar el juego");
      }

      // Cambiar el estado de la sala a "responding"
      await RoomService.startGame(roomId);
    } catch (error) {
      console.error("Error en startGame:", error);
      throw error;
    }
  }

  // Verificar si el usuario actual es el creador de la sala
  static async isRoomCreator(roomId: string): Promise<boolean> {
    try {
      const currentUser = AuthService.getCurrentUser();

      if (!currentUser) {
        return false;
      }

      const roomData = await RoomService.getRoomData(roomId);

      if (!roomData) {
        return false;
      }

      return roomData.creatorUid === currentUser.uid;
    } catch (error) {
      console.error("Error en isRoomCreator:", error);
      return false;
    }
  }

  // Salir del hall
  static async leaveRoom(roomId: string): Promise<void> {
    try {
      const currentUser = AuthService.getCurrentUser();

      if (!currentUser) {
        return;
      }

      await RoomService.removeUserFromRoom(roomId, currentUser.uid);
    } catch (error) {
      console.error("Error en leaveRoom:", error);
      throw error;
    }
  }
}
