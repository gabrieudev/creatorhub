"use client";

import { FieldWrapper } from "@/components/field-wrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/providers/auth-provider";
import { useForm } from "@tanstack/react-form";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart,
  ChevronLeft,
  Chrome,
  Eye,
  EyeOff,
  Facebook,
  Github,
  Loader2,
  Lock,
  Mail,
  Rocket,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";

export default function SignInPage() {
  const { signIn } = useSession();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "social">("email");
  const [loginError, setLoginError] = useState<string | null>(null);

  const socialProviders = [
    {
      name: "Google",
      icon: <Chrome className="h-5 w-5" />,
      color:
        "hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400",
      bgColor: "bg-white dark:bg-slate-900",
    },
    {
      name: "GitHub",
      icon: <Github className="h-5 w-5" />,
      color:
        "hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300",
      bgColor: "bg-white dark:bg-slate-900",
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-5 w-5" />,
      color:
        "hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400",
      bgColor: "bg-white dark:bg-slate-900",
    },
  ];

  const platformFeatures = [
    {
      icon: <Rocket className="h-6 w-6 text-blue-500" />,
      title: "Gestão Completa",
      description: "Tudo em um só lugar: conteúdo, finanças e equipe",
    },
    {
      icon: <BarChart className="h-6 w-6 text-green-500" />,
      title: "Análises Avançadas",
      description: "Dashboard em tempo real com métricas detalhadas",
    },
    {
      icon: <Users className="h-6 w-6 text-purple-500" />,
      title: "Colaboração",
      description: "Trabalhe com sua equipe em projetos conjuntos",
    },
    {
      icon: <Shield className="h-6 w-6 text-amber-500" />,
      title: "Segurança",
      description: "Seus dados protegidos com criptografia de ponta",
    },
  ];

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setLoginError(null);
      try {
        await signIn(value.email, value.password);
      } catch (error: any) {
        setLoginError(
          error.message || "Credenciais inválidas. Tente novamente.",
        );
      }
    },
    validators: {
      onSubmit: z.object({
        email: z.string().email("Email inválido"),
        password: z.string().min(1, "A senha é obrigatória"),
      }),
    },
  });

  const handleSocialLogin = (provider: string) => {
    console.log(`${provider} não está implementado ainda.`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-gray-900 flex items-center justify-center p-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white z-10"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Voltar para Home
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna esquerda - Features/Benefícios */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:flex flex-col justify-center"
          >
            <div className="max-w-lg">
              <div className="flex items-center gap-3 mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="h-14 w-14 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <Image
                    src="/logo.png"
                    width={48}
                    height={48}
                    alt="logo"
                    className="rounded-lg"
                  />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold bg-linear-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    CreatorHub
                  </h1>
                  <p className="text-gray-600 dark:text-slate-300">
                    Plataforma completa para criadores de conteúdo
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Transforme sua produção de conteúdo
              </h2>

              <div className="space-y-6 mb-8">
                {platformFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="flex items-start gap-4 p-4 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-linear-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 shadow-sm">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Estatísticas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="grid grid-cols-3 gap-4 p-6 rounded-xl bg-linear-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 border border-blue-200/50 dark:border-blue-900/50"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    5K+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">
                    Criadores
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    50K+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">
                    Conteúdos
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    R$ 10M+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">
                    Gerenciados
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Coluna direita - Formulário de Login */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center"
          >
            <Card className="w-full max-w-md p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-gray-200 dark:border-slate-700 shadow-2xl">
              {/* Logo para mobile */}
              <div className="flex lg:hidden items-center justify-center mb-8">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center">
                  <Image src="/logo.png" width={72} height={72} alt="logo" />
                </div>
              </div>

              <div className="text-center mb-8">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Bem-vindo de volta
                  </h1>
                  <p className="text-gray-600 dark:text-slate-300">
                    Entre com sua conta para continuar
                  </p>
                </motion.div>
              </div>

              {/* Tabs de método de login */}
              <Tabs
                value={loginMethod}
                onValueChange={(v) => setLoginMethod(v as any)}
                className="mb-6"
              >
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="social">Social</TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  {loginMethod === "email" ? (
                    <motion.div
                      key="email-form"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <TabsContent value="email" className="mt-6">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                          }}
                          className="space-y-6"
                          noValidate
                        >
                          <div>
                            <form.Field name="email">
                              {(field) => (
                                <FieldWrapper label="Email">
                                  <motion.div
                                    whileFocus={{ scale: 1.01 }}
                                    className="relative"
                                  >
                                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-slate-400">
                                      <Mail size={16} />
                                    </div>
                                    <Input
                                      id={field.name}
                                      name={field.name}
                                      type="email"
                                      value={field.state.value}
                                      onBlur={field.handleBlur}
                                      onChange={(e: any) => {
                                        field.handleChange(e.target.value);
                                        setLoginError(null);
                                      }}
                                      className="pl-10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 border-gray-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20"
                                      aria-describedby={`${field.name}-error`}
                                      placeholder="seu@email.com"
                                    />
                                  </motion.div>

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
                                  <motion.div
                                    whileFocus={{ scale: 1.01 }}
                                    className="relative"
                                  >
                                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-slate-400">
                                      <Lock size={16} />
                                    </div>

                                    <Input
                                      id={field.name}
                                      name={field.name}
                                      type={showPassword ? "text" : "password"}
                                      value={field.state.value}
                                      onBlur={field.handleBlur}
                                      onChange={(e: any) => {
                                        field.handleChange(e.target.value);
                                        setLoginError(null);
                                      }}
                                      className="pl-10 pr-10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 border-gray-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20"
                                      aria-describedby={`${field.name}-error`}
                                    />

                                    <motion.button
                                      whileTap={{ scale: 0.95 }}
                                      type="button"
                                      onClick={() => setShowPassword((s) => !s)}
                                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-300"
                                      aria-label={
                                        showPassword
                                          ? "Ocultar senha"
                                          : "Mostrar senha"
                                      }
                                    >
                                      {showPassword ? (
                                        <EyeOff size={16} />
                                      ) : (
                                        <Eye size={16} />
                                      )}
                                    </motion.button>
                                  </motion.div>

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

                          {/* Opções adicionais */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="remember-me"
                                checked={rememberMe}
                                onCheckedChange={setRememberMe}
                              />
                              <Label
                                htmlFor="remember-me"
                                className="text-sm text-gray-600 dark:text-slate-300 cursor-pointer"
                              >
                                Lembrar-me
                              </Label>
                            </div>
                            <a className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                              Esqueceu a senha?
                            </a>
                          </div>

                          {/* Mensagem de erro */}
                          {loginError && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                            >
                              <p className="text-sm text-red-600 dark:text-red-400 text-center">
                                {loginError}
                              </p>
                            </motion.div>
                          )}

                          <form.Subscribe>
                            {(state) => (
                              <motion.div
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                              >
                                <Button
                                  type="submit"
                                  className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg cursor-pointer"
                                  disabled={
                                    !state.canSubmit || state.isSubmitting
                                  }
                                  aria-disabled={
                                    !state.canSubmit || state.isSubmitting
                                  }
                                >
                                  {state.isSubmitting ? (
                                    <span className="inline-flex items-center gap-2">
                                      <Loader2 className="animate-spin h-5 w-5" />
                                      Entrando...
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-2">
                                      <Zap className="h-5 w-5" />
                                      Entrar na Conta
                                    </span>
                                  )}
                                </Button>
                              </motion.div>
                            )}
                          </form.Subscribe>
                        </form>
                      </TabsContent>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="social-form"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <TabsContent value="social" className="mt-6">
                        <div className="space-y-4">
                          <p className="text-sm text-gray-600 dark:text-slate-300 text-center mb-6">
                            Escolha uma plataforma para entrar rapidamente
                          </p>

                          {socialProviders.map((provider, index) => (
                            <motion.div
                              key={provider.name}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Button
                                type="button"
                                variant="outline"
                                className={`w-full h-12 ${provider.color} ${provider.bgColor} border transition-all duration-200 hover:shadow-md cursor-pointer`}
                                onClick={() => handleSocialLogin(provider.name)}
                              >
                                <span className="flex items-center justify-center gap-3">
                                  {provider.icon}
                                  <span className="font-medium">
                                    Continuar com {provider.name}
                                  </span>
                                </span>
                              </Button>
                            </motion.div>
                          ))}

                          <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-gray-300 dark:border-slate-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                              <span className="px-2 bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400">
                                Ou
                              </span>
                            </div>
                          </div>

                          <div className="text-center">
                            <Button
                              variant="ghost"
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer"
                              onClick={() => setLoginMethod("email")}
                            >
                              Entrar com email e senha
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Tabs>

              {/* Divisor */}
              <div className="my-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-slate-600"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400 text-sm">
                      Novo no CreatorHub?
                    </span>
                  </div>
                </div>
              </div>

              {/* Link para cadastro */}
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <a
                    href="/auth/signup"
                    className="inline-flex items-center gap-2 w-full max-w-xs mx-auto bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
                  >
                    <Sparkles className="h-5 w-5" />
                    Criar uma conta gratuita
                  </a>
                </motion.div>

                <p className="mt-4 text-sm text-gray-600 dark:text-slate-400">
                  É rápido, fácil e sem compromisso
                </p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Rodapé */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-slate-500">
            © {new Date().getFullYear()} CreatorHub. Todos os direitos
            reservados.
            <a
              href="/privacy"
              className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              Política de Privacidade
            </a>
            <span className="mx-2">•</span>
            <a
              href="/terms"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Termos de Uso
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
