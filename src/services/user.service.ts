import { db } from "./firebase.service";
import {
  ref,
  set,
  get,
  onValue,
  onDisconnect,
  serverTimestamp,
  update,
} from "firebase/database";
import type { User } from "../types";

export class UserService {
  // Crear o actualizar un usuario
  static async createOrUpdateUser(
    uid: string,
    userData: Partial<User>
  ): Promise<void> {
    try {
      const userRef = ref(db, `users/${uid}`);
      await set(userRef, {
        ...userData,
        lastLogin: serverTimestamp(),
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("userName", userData.name!);
      }
    } catch (error) {
      console.error("Error en createOrUpdateUser:", error);
      throw error;
    }
  }

  // Obtener datos de un usuario
  static async getUserData(uid: string): Promise<User | null> {
    try {
      const userRef = ref(db, `users/${uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        return snapshot.val() as User;
      }

      return null;
    } catch (error) {
      console.error("Error en getUserData:", error);
      throw error;
    }
  }

  // Verificar si un usuario existe
  static async userExists(uid: string): Promise<boolean> {
    try {
      const userData = await this.getUserData(uid);
      return userData !== null;
    } catch (error) {
      console.error("Error en userExists:", error);
      return false;
    }
  }

  // Configurar onDisconnect para actualizar el estado
  static setupDisconnect(uid: string): Promise<void> {
    try {
      const statusRef = ref(db, `users/${uid}/status`);
      return onDisconnect(statusRef).set("desconectado");
    } catch (error) {
      console.error("Error en setupDisconnect:", error);
      throw error;
    }
  }

  // Observar cambios en los datos de un usuario
  static observeUserData(
    uid: string,
    callback: (userData: User | null) => void
  ): () => void {
    const userRef = ref(db, `users/${uid}`);

    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val() as User);
      } else {
        callback(null);
      }
    });

    return () => unsubscribe();
  }

  // Actualizar el estado "ready" del usuario
  static async setUserReady(
    userId: string,
    ready: boolean = true
  ): Promise<void> {
    try {
      const userRef = ref(db, `users/${userId}`);
      await update(userRef, { ready });
    } catch (error) {
      console.error("Error en setUserReady:", error);
      throw error;
    }
  }
}
