"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/auth.context";
import { AuthUseCase } from "@/usecases/auth.usecase";
import { CustomButton, Form, Input, LogoContainer, Main } from "./page.style";
import Image from "next/image";

export default function Login() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser, userData, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Recuperar el nombre del localStorage si existe
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("userName");
      if (savedName) {
        setName(savedName);
      }
    }

    // Si el usuario ya está autenticado y existe en la base de datos, redirigir a select-room
    if (currentUser && userData) {
      router.push("/select-room");
    }
  }, [currentUser, userData, isLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      setLoading(true);
      await AuthUseCase.loginWithName(name);
      router.push("/select-room");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Main>
      <LogoContainer>
        <Image
          src="/easy-doritos.webp"
          alt="Logo"
          width={200}
          height={200}
          priority
        />
      </LogoContainer>
      <div>
        <Form onSubmit={handleLogin}>
          <Input
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <CustomButton type="submit" disabled={loading || !name.trim()}>
            {loading ? "Conectando..." : "Ingresar"}
          </CustomButton>
        </Form>
      </div>
    </Main>
  );
}
