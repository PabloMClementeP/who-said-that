import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import type { User } from "../types";

export class AuthUseCase {
  // Iniciar sesión con nombre
  static async loginWithName(name: string): Promise<User> {
    try {
      // 1. Autenticar anónimamente
      const user = await AuthService.signInAnonymously();

      // 2. Generar número aleatorio
      const avatar = Math.floor(Math.random() * 11) + 1;

      // 3. Crear o actualizar usuario en la base de datos
      const userData: User = {
        uid: user.uid,
        name,
        status: "conectado",
        avatar,
        score: 0,
      };

      await UserService.createOrUpdateUser(user.uid, userData);

      // 4. Configurar onDisconnect
      await UserService.setupDisconnect(user.uid);

      // 5. Guardar nombre en localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("userName", name);
      }

      return userData;
    } catch (error) {
      console.error("Error en loginWithName:", error);
      throw error;
    }
  }

  // Verificar si el usuario está autenticado y existe en la base de datos
  static async checkAuthAndUserExists(): Promise<boolean> {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) {
      return false;
    }

    return UserService.userExists(currentUser.uid);
  }
}
