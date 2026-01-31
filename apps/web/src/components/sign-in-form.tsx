"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSession } from "@/providers/auth-provider";
import { useForm } from "@tanstack/react-form";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Github,
  Chrome,
  Facebook,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import z from "zod";
import { FieldWrapper } from "./FieldWrapper";

export default function SignInForm() {
  const { signIn } = useSession();
  const [showPassword, setShowPassword] = useState(false);

  const socialProviders = [
    {
      name: "Google",
      icon: <Chrome className="h-5 w-5" />,
      color:
        "hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400",
    },
    {
      name: "GitHub",
      icon: <Github className="h-5 w-5" />,
      color:
        "hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300",
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-5 w-5" />,
      color:
        "hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400",
    },
  ];

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
    <Card className="max-w-md w-full p-6 sm:p-8 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-lg">
      <div className="flex items-center justify-center mb-6">
        <div className="h-12 w-12 rounded-lg flex items-center justify-center">
          <Image src="/logo.png" width={72} height={72} alt="logo" />
        </div>
      </div>

      <h1 className="mb-2 text-center text-2xl font-extrabold text-gray-900 dark:text-white">
        Bem-vindo de volta
      </h1>
      <p className="mb-6 text-center text-sm text-gray-600 dark:text-slate-300">
        Entre com sua conta para continuar
      </p>

      {/* Seção de Login Social */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-slate-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400">
              Ou continue com
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {socialProviders.map((provider) => (
            <Button
              key={provider.name}
              type="button"
              variant="outline"
              className={`${provider.color} border h-10 transition-all duration-200`}
              onClick={() => console.log(`${provider.name} login clicked`)}
            >
              {provider.icon}
              <span className="sr-only">Entrar com {provider.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-5"
        noValidate
      >
        <div>
          <form.Field name="email">
            {(field) => (
              <FieldWrapper label="Email">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-slate-400">
                    <Mail size={16} />
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e: any) => field.handleChange(e.target.value)}
                    className="pl-10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 border-gray-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20"
                    aria-describedby={`${field.name}-error`}
                  />
                </div>

                <div aria-live="polite">
                  {field.state.meta.errors.map((error) => (
                    <p
                      key={error?.message}
                      id={`${field.name}-error`}
                      className="text-sm text-red-500 dark:text-red-400 mt-1"
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
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-slate-400">
                    <Lock size={16} />
                  </div>

                  <Input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? "text" : "password"}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e: any) => field.handleChange(e.target.value)}
                    className="pl-10 pr-10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 border-gray-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20"
                    aria-describedby={`${field.name}-error`}
                  />

                  <button
                    type="button"
                    tabIndex={0}
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-300"
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
                        className="text-sm text-red-500 dark:text-red-400 mt-1"
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
              className="w-full mt-2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              disabled={!state.canSubmit || state.isSubmitting}
              aria-disabled={!state.canSubmit || state.isSubmitting}
            >
              {state.isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" /> Enviando...
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
