"use client";

import React, { useEffect, useState } from "react";
import {
  HeaderWrapper,
  UserButton,
  ModalBackdrop,
  ModalContent,
  ModalInput,
  ModalButtonContainer,
  ModalButton,
} from "./style";
import { useAuthContext } from "@/contexts/auth.context";
import Image from "next/image";
import { User } from "@/types";
import { UserService } from "@/services/user.service";
import { useParams } from "next/navigation";

const Header = () => {
  const { currentUser, userData, isLoading } = useAuthContext();
  const [greeting, setGreeting] = useState("Bienvenido");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedName, setEditedName] = useState("");
  const params = useParams();
  const roomId = params.id as string;

  useEffect(() => {
    const greetings = [
      "Bienvenido",
      "¡Hola!",
      "Saludos",
      "Bienvenido a Who Said it?",
      "¡Hola de nuevo!",
    ];
    const randomGreeting =
      greetings[Math.floor(Math.random() * greetings.length)];
    setGreeting(randomGreeting);
  }, []);

  const handleOpenModal = () => {
    if (userData) {
      setEditedName(userData.name);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveName = async () => {
    if (!currentUser || !userData || !editedName.trim()) {
      return;
    }
    try {
      const newAvatar = Math.floor(Math.random() * 11) + 1;

      const updatedProfileData: Partial<User> = {
        ...userData,
        name: editedName.trim(),
        avatar: newAvatar,
      };

      await UserService.createOrUpdateUser(currentUser.uid, updatedProfileData);
      handleCloseModal();
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };

  const copiarTexto = () => {
    navigator.clipboard
      .writeText(roomId)
      .then(() => {
        console.log("Texto copiado al portapapeles");
      })
      .catch((err) => {
        console.error("Error al copiar el texto: ", err);
      });
  };

  return (
    <>
      <HeaderWrapper>
        <Image src={`/who-said.webp`} alt="" width={80} height={80} />

        {roomId && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              alignItems: "center",
            }}
          >
            <p
              style={{
                userSelect: "none",
              }}
            >
              Room Id
            </p>
            <p
              onClick={copiarTexto}
              style={{ cursor: "pointer", userSelect: "none" }}
            >
              {roomId}
            </p>
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {isLoading ? (
            <div>Loading...</div>
          ) : userData ? (
            <UserButton onClick={handleOpenModal}>
              <img
                src={`/avatars/${userData?.avatar}.webp`}
                alt=""
                width={40}
                height={40}
              />
              <h3>{userData?.name}</h3>
            </UserButton>
          ) : (
            <div>{greeting}</div>
          )}
        </div>
      </HeaderWrapper>

      {isModalOpen && userData && (
        <ModalBackdrop>
          <ModalContent>
            <h2>Editar Nombre</h2>
            <ModalInput
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Nuevo nombre"
            />
            <ModalButtonContainer>
              <ModalButton onClick={handleCloseModal} color="gray">
                Cancelar
              </ModalButton>
              <ModalButton onClick={handleSaveName} color="#45818E">
                Guardar
              </ModalButton>
            </ModalButtonContainer>
          </ModalContent>
        </ModalBackdrop>
      )}
    </>
  );
};

export default Header;
