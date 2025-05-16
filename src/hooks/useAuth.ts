"use client";

import { useState, useEffect } from "react";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import type { User } from "../types";

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribeAuth = AuthService.onAuthStateChanged(async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          // Observar cambios en los datos del usuario
          const unsubscribeUser = UserService.observeUserData(
            user.uid,
            (data) => {
              setUserData(data);
              setLoading(false);
            }
          );

          return () => unsubscribeUser();
        } catch (err) {
          setError(err instanceof Error ? err : new Error("Error desconocido"));
          setLoading(false);
        }
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const checkUserExists = async (): Promise<boolean> => {
    if (!currentUser) return false;
    return UserService.userExists(currentUser.uid);
  };

  return {
    currentUser,
    userData,
    isLoading: loading,
    error,
    checkUserExists,
  };
}
