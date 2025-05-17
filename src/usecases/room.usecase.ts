import { RoomService } from "../services/room.service";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";

export class RoomUseCase {
  // Crear una nueva sala
  static async createRoom(): Promise<string> {
    try {
      const currentUser = AuthService.getCurrentUser();

      if (!currentUser) {
        throw new Error("Usuario no autenticado");
      }

      // Verificar si el usuario existe en la base de datos
      const exists = await UserService.userExists(currentUser.uid);

      if (!exists) {
        throw new Error("Usuario no existe en la base de datos");
      }

      // Crear la sala
      return RoomService.createRoom(currentUser.uid);
    } catch (error) {
      console.error("Error en createRoom:", error);
      throw error;
    }
  }

  // Unirse a una sala
  static async joinRoom(roomId: string): Promise<void> {
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
      console.error("Error en joinRoom:", error);
      throw error;
    }
  }

  // Remover answers de una sala
  static async removeAnswersFromRoom(roomId: string): Promise<void> {
    try {
      await RoomService.removeAnswers(roomId);
    } catch (error) {
      console.error("Error en removeAnswersFromRoom:", error);
      throw error;
    }
  }

  // Salir de una sala
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
