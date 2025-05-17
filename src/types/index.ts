// Tipos para usuarios
export interface User {
  uid: string;
  name: string;
  status: string;
  avatar: number;
  lastLogin?: any;
  score?: number;
}

// Tipos para salas
export interface Room {
  roomId: string;
  creatorUid: string;
  createdAt: string;
  status?: "waiting" | "active" | "responding";
  users: Record<string, User>;
}

// Tipos para el contexto de Firebase
export interface FirebaseContextType {
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
}

// Tipos para el contexto de autenticación
export interface AuthContextType {
  currentUser: any;
  userData: User | null;
  isLoading: boolean;
  error: Error | null;
  checkUserExists: () => Promise<boolean>;
}
