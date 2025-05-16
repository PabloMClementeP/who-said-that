"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

type FirebaseContextType = {
  app: any;
  db: any;
  auth: any;
  currentUser: any;
  userData: any;
  loading: boolean;
  checkUserExists: () => Promise<boolean>;
};

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [app, setApp] = useState<any>(null);
  const [db, setDb] = useState<any>(null);
  const [auth, setAuth] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      const db = getDatabase(app);
      const auth = getAuth(app);

      setApp(app);
      setDb(db);
      setAuth(auth);

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);

        if (user) {
          // Verificar si el usuario existe en la base de datos
          try {
            const userRef = ref(db, `users/${user.uid}`);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
              setUserData(snapshot.val());
            } else {
              setUserData(null);
            }
          } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
            setUserData(null);
          }
        } else {
          setUserData(null);
        }

        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error initializing Firebase:", error);
      setLoading(false);
    }
  }, []);

  // Función para verificar si el usuario existe en la base de datos
  const checkUserExists = async () => {
    if (!currentUser || !db) return false;

    try {
      const userRef = ref(db, `users/${currentUser.uid}`);
      const snapshot = await get(userRef);
      return snapshot.exists();
    } catch (error) {
      console.error("Error al verificar si el usuario existe:", error);
      return false;
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        app,
        db,
        auth,
        currentUser,
        userData,
        loading,
        checkUserExists,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}
