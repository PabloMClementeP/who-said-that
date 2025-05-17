"use client";
import React, { useState, useEffect } from "react";
import {
  AnswerTextarea,
  QuestionCard,
  QuestionsContainer,
  QuestionsWrapper,
  QuestionText,
} from "./style";
import { CustomButton } from "@/app/page.style";
import { questions } from "@/consts/questions";
import { useParams, useRouter } from "next/navigation";
import { useHall } from "@/hooks/useHall";
import { useAuthContext } from "@/contexts/auth.context";
import { RoomService } from "@/services/room.service";
import { UserService } from "@/services/user.service";

const Questions = () => {
  const [selectedQuestions, setSelectedQuestions] = useState<
    { question: string }[]
  >([]);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const params = useParams();
  const roomId = params.id as string;
  const router = useRouter();

  const { isCreator, startRoom, room } = useHall(roomId);
  const { isLoading, currentUser } = useAuthContext();

  useEffect(() => {
    // Copiar el array para no mutar el original
    const shuffledQuestions = [...questions];

    // Algoritmo de Fisher-Yates para barajar el array
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledQuestions[i], shuffledQuestions[j]] = [
        shuffledQuestions[j],
        shuffledQuestions[i],
      ];
    }

    // Seleccionar las primeras 3 preguntas
    setSelectedQuestions(shuffledQuestions.slice(0, 3));
  }, []);

  // Observar cambios en el estado de la sala
  useEffect(() => {
    if (room && room.status === "active") {
      router.push(`/room/${roomId}`);
    }
  }, [room, roomId, router]);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleFinish = async () => {
    try {
      setIsSubmitting(true);

      if (!currentUser) {
        throw new Error("Usuario no autenticado");
      }

      // Preparar las respuestas para guardar en la base de datos
      const questionAnswers = selectedQuestions.map((q, index) => ({
        question: q.question,
        answer: answers[index],
      }));

      // Guardar las respuestas del usuario en la sala
      await RoomService.saveUserAnswers(
        roomId,
        currentUser.uid,
        questionAnswers
      );

      // Actualizar el estado "ready" del usuario a true
      await UserService.setUserReady(currentUser.uid, true);

      // Si es el creador, cambiar el estado de la sala a "active"
      if (isCreator) {
        await startRoom();
      }

      // La redirección se manejará automáticamente por el efecto que observa el estado de la sala
    } catch (error) {
      console.error("Error al finalizar las preguntas:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <QuestionsWrapper>
      <h1
        style={{
          textAlign: "center",
          color: "#fff",
        }}
      >
        Responde las siguientes preguntas
      </h1>
      {selectedQuestions.length > 0 ? (
        <QuestionsContainer>
          {selectedQuestions.map((q, index) => (
            <QuestionCard key={index}>
              <QuestionText>{q.question}</QuestionText>
              <AnswerTextarea
                placeholder="Escribe tu respuesta aquí..."
                value={answers[index]}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              />
            </QuestionCard>
          ))}
        </QuestionsContainer>
      ) : (
        <p>Cargando preguntas...</p>
      )}
      <div
        style={{
          width: 300,
        }}
      >
        {isCreator && !isLoading && (
          <CustomButton
            $color="#40966b"
            onClick={handleFinish}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Procesando..." : "Comenzar"}
          </CustomButton>
        )}
      </div>
    </QuestionsWrapper>
  );
};

export default Questions;
