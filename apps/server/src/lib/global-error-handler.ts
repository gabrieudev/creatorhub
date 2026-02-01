import { ZodError } from "zod";
import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "./errors";

export function globalErrorHandler(
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // Zod (input inválido)
  if (error instanceof ZodError) {
    return reply.status(400).send({
      type: "VALIDATION_ERROR",
      message: "Invalid request data",
      errors: error.format(),
    });
  }

  // Erros de domínio
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      type: error.name,
      message: error.message,
      details: error.details,
    });
  }

  // Erro inesperado
  request.log.error(error);

  return reply.status(500).send({
    type: "INTERNAL_SERVER_ERROR",
    message: "Unexpected server error",
  });
}
