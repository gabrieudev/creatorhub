"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSession } from "@/providers/auth-provider";
import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import z from "zod";
import { FieldWrapper } from "./FieldWrapper";
import { InputWithIcon } from "./InputWithIcon";

export default function SignInForm() {
  const { signIn } = useSession();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await signIn(value.email, value.password);
    },
    validators: {
      onSubmit: z.object({
        email: z.string().email("Email inválido"),
        password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
      }),
    },
  });

  return (
    <Card className="max-w-md w-full p-6 sm:p-8 bg-slate-800 border border-slate-800">
      <div className="flex items-center justify-center mb-6">
        <div className="h-12 w-12 rounded-lg bg-linear-to-r flex items-center justify-center">
          <Image src="/logo.png" width={72} height={72} alt="logo" />
        </div>
      </div>

      <h1 className="mb-2 text-center text-2xl font-extrabold text-white">
        Bem-vindo de volta
      </h1>
      <p className="mb-6 text-center text-sm text-slate-300">
        Entre com sua conta para continuar
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
        noValidate
      >
        <div>
          <form.Field name="email">
            {(field) => (
              <FieldWrapper label="Email">
                <InputWithIcon
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e: any) => field.handleChange(e.target.value)}
                  icon={<Mail size={16} />}
                />

                <div aria-live="polite">
                  {field.state.meta.errors.map((error) => (
                    <p
                      key={error?.message}
                      id={`${field.name}-error`}
                      className="text-sm text-red-400 mt-1"
                    >
                      {error?.message}
                    </p>
                  ))}
                </div>
              </FieldWrapper>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {(field) => (
              <FieldWrapper label="Senha">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Lock size={16} />
                  </div>

                  <Input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? "text" : "password"}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e: any) => field.handleChange(e.target.value)}
                    className="pl-10 bg-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-slate-400 dark:placeholder-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500 border-slate-600"
                    aria-describedby={`${field.name}-error`}
                  />

                  <button
                    type="button"
                    tabIndex={0}
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>

                  <div aria-live="polite">
                    {field.state.meta.errors.map((error) => (
                      <p
                        key={error?.message}
                        id={`${field.name}-error`}
                        className="text-sm text-red-400 mt-1"
                      >
                        {error?.message}
                      </p>
                    ))}
                  </div>
                </div>
              </FieldWrapper>
            )}
          </form.Field>
        </div>

        <form.Subscribe>
          {(state) => (
            <Button
              type="submit"
              variant="default"
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!state.canSubmit || state.isSubmitting}
              aria-disabled={!state.canSubmit || state.isSubmitting}
            >
              {state.isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="animate-spin h-6 w-6" /> Enviando...
                </span>
              ) : (
                "Entrar"
              )}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </Card>
  );
}
