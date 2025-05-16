import {
  signInAnonymously,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "./firebase.service";

export class AuthService {
  // Iniciar sesión anónimamente
  static async signInAnonymously(): Promise<FirebaseUser> {
    try {
      const userCredential = await signInAnonymously(auth);
      return userCredential.user;
    } catch (error) {
      console.error("Error en signInAnonymously:", error);
      throw error;
    }
  }

  // Observar cambios en el estado de autenticación
  static onAuthStateChanged(
    callback: (user: FirebaseUser | null) => void
  ): () => void {
    return onAuthStateChanged(auth, callback);
  }

  // Obtener el usuario actual
  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }
}
