import { useForm } from "@tanstack/react-form";
import z from "zod";

import { useSession } from "@/providers/session-provider";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { FieldWrapper } from "./FieldWrapper";
import { InputWithIcon } from "./InputWithIcon";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import Image from "next/image";

export default function SignUpForm() {
  const { signUp } = useSession();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      await signUp(value);
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Nome precisa ter pelo menos 2 caracteres"),
        email: z.string().email("Endereço de email inválido"),
        password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
      }),
    },
  });

  return (
    <Card className="max-w-md w-full p-6 sm:p-8">
      <div className="flex items-center justify-center mb-6">
        <div className="h-12 w-12 rounded-lg bg-linear-to-r flex items-center justify-center">
          <Image src="/logo.png" alt="logo" width={72} height={72} />
        </div>
      </div>

      <h1 className="mb-2 text-center text-2xl font-extrabold">Criar conta</h1>
      <p className="mb-6 text-center text-sm text-slate-300">
        Preencha seus dados para criar uma nova conta
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
          <form.Field name="name">
            {(field) => (
              <FieldWrapper label="Nome">
                <InputWithIcon
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e: any) => field.handleChange(e.target.value)}
                  icon={<User size={16} />}
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
                    className="pl-10"
                    aria-describedby={`${field.name}-error`}
                  />

                  <button
                    type="button"
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
              className="w-full mt-2"
              disabled={!state.canSubmit || state.isSubmitting}
              aria-disabled={!state.canSubmit || state.isSubmitting}
            >
              {state.isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="animate-spin h-6 w-6" /> Enviando...
                </span>
              ) : (
                "Criar conta"
              )}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </Card>
  );
}
