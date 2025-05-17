// Tipos para usuarios
export interface User {
  uid: string;
  name: string;
  status: string;
  avatar: number;
  lastLogin?: any;
  score?: number;
  ready?: boolean;
}

// Tipos para salas
export interface Room {
  roomId: string;
  creatorUid: string;
  createdAt: string;
  status?: "waiting" | "active" | "responding";
  users: Record<string, User>;
  answers?: RoomAnswer[];
}

// Tipos para respuestas en salas
export interface RoomAnswer {
  question: string;
  answer: string;
  userId: string;
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
