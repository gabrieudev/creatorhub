"use client";

import { FieldWrapper } from "@/components/field-wrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSession } from "@/providers/auth-provider";
import { useForm } from "@tanstack/react-form";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building,
  CheckCircle,
  ChevronLeft,
  Chrome,
  DollarSign,
  Eye,
  EyeOff,
  Facebook,
  Github,
  Globe,
  Loader2,
  Lock,
  Mail,
  Sparkles,
  User,
  User as UserIcon,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import z from "zod";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/lib/api";
import { authClient } from "@/lib/auth-client";

// Tipos de organização
type OrganizationType = "creator" | "team" | "agency";

// Configurações de timezone
const timezones = [
  { value: "America/Sao_Paulo", label: "Brasília (GMT-3)" },
  { value: "America/New_York", label: "Nova York (GMT-4)" },
  { value: "America/Los_Angeles", label: "Los Angeles (GMT-7)" },
  { value: "Europe/London", label: "Londres (GMT+1)" },
  { value: "Europe/Paris", label: "Paris (GMT+2)" },
  { value: "Asia/Tokyo", label: "Tóquio (GMT+9)" },
];

// Moedas disponíveis
const currencies = [
  { code: "BRL", symbol: "R$", name: "Real Brasileiro" },
  { code: "USD", symbol: "$", name: "Dólar Americano" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "Libra Esterlina" },
];

// Configurações padrão por tipo de organização
const orgTypeConfigs = {
  creator: {
    title: "Creator Solo",
    description:
      "Para criadores individuais que gerenciam seu próprio conteúdo",
    icon: <UserIcon className="h-5 w-5" />,
    features: [
      "Dashboard pessoal",
      "Controle financeiro",
      "Calendário de conteúdo",
      "Sem limites de integrantes",
    ],
    settings: {
      white_label: false,
      default_timezone: "America/Sao_Paulo",
      default_currency: "BRL",
    },
  },
  team: {
    title: "Equipe/Coletivo",
    description: "Para equipes que colaboram em projetos conjuntos",
    icon: <Users className="h-5 w-5" />,
    features: [
      "Até 10 membros",
      "Sistema de splits",
      "Permissões por função",
      "Colaboração em tempo real",
    ],
    settings: {
      white_label: false,
      default_timezone: "America/Sao_Paulo",
      default_currency: "BRL",
    },
  },
  agency: {
    title: "Agência",
    description: "Para agências que gerenciam múltiplos criadores/clientes",
    icon: <Building className="h-5 w-5" />,
    features: [
      "White-label",
      "Múltiplos clientes",
      "Dashboard por cliente",
      "Relatórios avançados",
      "API completa",
    ],
    settings: {
      white_label: true,
      default_timezone: "America/Sao_Paulo",
      default_currency: "BRL",
    },
  },
};

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, refresh, session } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [orgType, setOrgType] = useState<OrganizationType>("creator");
  const [isWhiteLabel, setIsWhiteLabel] = useState(false);
  const [orgSlug, setOrgSlug] = useState("");
  const [isSlugAvailable, setIsSlugAvailable] = useState(true);

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

  // Validação para Step 1
  const step1Schema = z.object({
    name: z.string().min(2, "Nome precisa ter pelo menos 2 caracteres"),
    email: z.string().email("Endereço de email inválido"),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    accountType: z.enum(["creator", "team", "agency"]),
  });

  // Validação para Step 2
  const step2Schema = z.object({
    orgName: z
      .string()
      .min(3, "Nome da organização precisa ter pelo menos 3 caracteres"),
    orgSlug: z
      .string()
      .min(3, "Slug precisa ter pelo menos 3 caracteres")
      .regex(
        /^[a-z0-9-]+$/,
        "Slug deve conter apenas letras minúsculas, números e hífens",
      ),
    timezone: z.string(),
    currency: z.string().length(3, "Código da moeda deve ter 3 caracteres"),
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, "Você precisa aceitar os termos de uso"),
  });

  // Formulário Step 1
  const formStep1 = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      accountType: "creator" as OrganizationType,
    },
    onSubmit: async ({ value }) => {
      // Validar dados do Step 1
      const result = step1Schema.safeParse(value);
      if (!result.success) {
        console.error("Validation error:", result.error.issues);
        return;
      }

      setOrgType(value.accountType);
      setIsWhiteLabel(orgTypeConfigs[value.accountType].settings.white_label);
      setCurrentStep(2);
    },
    validators: {
      onChange: step1Schema,
    },
  });

  // Formulário Step 2
  const formStep2 = useForm({
    defaultValues: {
      orgName: "",
      orgSlug: "",
      timezone: "America/Sao_Paulo",
      currency: "BRL",
      acceptTerms: false,
    },
    onSubmit: async ({ value }) => {
      // Validar dados do Step 2
      const result = step2Schema.safeParse(value);
      if (!result.success) {
        console.error("Validation error:", result.error.issues);
        return;
      }

      // Combinar dados dos dois steps
      const allData = {
        ...formStep1.state.values,
        organization: {
          name: value.orgName,
          slug: value.orgSlug,
          timezone: value.timezone,
          currency: value.currency,
          locale: value.currency === "BRL" ? "pt-BR" : "en-US",
          whiteLabel: orgTypeConfigs[orgType].settings.white_label,
          branding: isWhiteLabel ? {} : undefined,
          billingInfo: {},
          settings: {},
        },
      };

      // Criar usuário e organização
      try {
        await signUp(allData as any);
        const { data } = await authClient.getSession();
        const userId = data?.user?.id;
        if (!userId) throw new Error("Usuário não autenticado após cadastro");

        await api.post(`/users/${userId}/organizations`, {
          ...allData.organization,
        });
      } catch (err: any) {
        toast.error(err.message ?? "Erro");
      }
    },
    validators: {
      onChange: step2Schema,
    },
  });

  // Atualizar slug quando o nome da organização mudar
  useEffect(() => {
    if (formStep2.state.values.orgName && !formStep2.state.values.orgSlug) {
      const generatedSlug = generateSlug(formStep2.state.values.orgName);
      formStep2.setFieldValue("orgSlug", generatedSlug);
      setOrgSlug(generatedSlug);
    }
  }, [formStep2.state.values.orgName]);

  // Verificar disponibilidade do slug
  const checkSlugAvailability = async (slug: string) => {
    if (slug.length < 3) return;
    // Simulação de verificação
    setTimeout(() => {
      setIsSlugAvailable(slug !== "slug-ocupado");
    }, 500);
  };

  // Efeito para verificar slug
  useEffect(() => {
    if (orgSlug.length >= 3) {
      checkSlugAvailability(orgSlug);
    }
  }, [orgSlug]);

  const handleOrgNameChange = (value: string) => {
    formStep2.setFieldValue("orgName", value);
    const generatedSlug = generateSlug(value);
    formStep2.setFieldValue("orgSlug", generatedSlug);
    setOrgSlug(generatedSlug);
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  const getStepIndicator = () => {
    const steps = [
      { number: 1, label: "Dados Pessoais", active: currentStep === 1 },
      { number: 2, label: "Organização", active: currentStep === 2 },
      { number: 3, label: "Configuração", active: currentStep === 3 },
    ];

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: step.active ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                step.active
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-gray-300 dark:border-slate-600 text-gray-500 dark:text-slate-400"
              } font-semibold`}
            >
              {step.number}
            </motion.div>
            <div className="ml-2 mr-4 text-sm font-medium text-gray-700 dark:text-slate-300">
              {step.label}
            </div>
            {index < steps.length - 1 && (
              <div className="w-12 h-px bg-gray-300 dark:bg-slate-600 mx-2" />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/")}
          className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar para Home
        </Button>
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row gap-8"
        >
          {/* Coluna esquerda - Ilustração/Features */}
          <div className="lg:w-2/5">
            <div className="sticky top-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center">
                  <Image src="/logo.png" alt="logo" width={72} height={72} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    CreatorHub
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-slate-300">
                    Plataforma completa para criadores de conteúdo
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Por que escolher o CreatorHub?
                </h2>
                <ul className="space-y-3">
                  {[
                    "Gestão completa de conteúdo",
                    "Controle financeiro avançado",
                    "Sistema de splits automático",
                    "Dashboard em tempo real",
                    "Integrações com todas as plataformas",
                    "White-label para agências",
                  ].map((feature, index) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2 text-gray-700 dark:text-slate-300"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Card de preview da organização */}
              <AnimatePresence>
                {currentStep >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700 shadow-lg"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Preview da sua organização
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500 dark:text-slate-400">
                          Tipo:
                        </span>
                        <Badge variant="outline" className="ml-2 capitalize">
                          {orgType}
                        </Badge>
                      </div>
                      {formStep2.state.values.orgName && (
                        <div>
                          <span className="text-sm text-gray-500 dark:text-slate-400">
                            Nome:
                          </span>
                          <span className="ml-2 font-medium text-gray-900 dark:text-white">
                            {formStep2.state.values.orgName}
                          </span>
                        </div>
                      )}
                      {formStep2.state.values.orgSlug && (
                        <div>
                          <span className="text-sm text-gray-500 dark:text-slate-400">
                            URL:
                          </span>
                          <span className="ml-2 font-medium text-blue-600 dark:text-blue-400">
                            {formStep2.state.values.orgSlug}.creatorhub.com
                          </span>
                        </div>
                      )}
                      {isWhiteLabel && (
                        <div className="flex items-center gap-2 mt-4 p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                          <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          <span className="text-sm text-purple-600 dark:text-purple-400">
                            Modo White-label ativado
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Coluna direita - Formulário */}
          <div className="lg:w-3/5">
            <Card className="w-full p-6 sm:p-8 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-xl">
              {getStepIndicator()}

              <AnimatePresence mode="wait">
                {currentStep === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h1 className="mb-2 text-2xl font-extrabold text-gray-900 dark:text-white">
                      Criar sua conta
                    </h1>
                    <p className="mb-6 text-gray-600 dark:text-slate-300">
                      Preencha seus dados pessoais para começar
                    </p>

                    {/* Seção de Login Social */}
                    <div className="space-y-3 mb-8">
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
                            onClick={() =>
                              console.log(`${provider.name} sign up clicked`)
                            }
                          >
                            {provider.icon}
                            <span className="sr-only">
                              Cadastrar com {provider.name}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        formStep1.handleSubmit();
                      }}
                      className="space-y-5"
                      noValidate
                    >
                      {/* Nome */}
                      <formStep1.Field name="name">
                        {(field) => (
                          <FieldWrapper label="Nome Completo">
                            <div className="relative">
                              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-slate-400">
                                <User size={16} />
                              </div>
                              <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e: any) =>
                                  field.handleChange(e.target.value)
                                }
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
                      </formStep1.Field>

                      {/* Email */}
                      <formStep1.Field name="email">
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
                                onChange={(e: any) =>
                                  field.handleChange(e.target.value)
                                }
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
                      </formStep1.Field>

                      {/* Senha */}
                      <formStep1.Field name="password">
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
                                onChange={(e: any) =>
                                  field.handleChange(e.target.value)
                                }
                                className="pl-10 pr-10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 border-gray-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20"
                                aria-describedby={`${field.name}-error`}
                              />
                              <button
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
                              </button>
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
                      </formStep1.Field>

                      {/* Tipo de Conta */}
                      <formStep1.Field name="accountType">
                        {(field) => (
                          <FieldWrapper label="Tipo de Conta">
                            <RadioGroup
                              value={field.state.value}
                              onValueChange={(value: string) =>
                                field.handleChange(value as any)
                              }
                              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                            >
                              {Object.entries(orgTypeConfigs).map(
                                ([key, config]) => (
                                  <motion.div
                                    key={key}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <RadioGroupItem
                                      value={key}
                                      id={`account-type-${key}`}
                                      className="peer sr-only"
                                    />
                                    <Label
                                      htmlFor={`account-type-${key}`}
                                      className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                        field.state.value === key
                                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                          : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-gray-700 dark:text-slate-300">
                                          {config.icon}
                                        </span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                          {config.title}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-600 dark:text-slate-400">
                                        {config.description}
                                      </p>
                                    </Label>
                                  </motion.div>
                                ),
                              )}
                            </RadioGroup>
                          </FieldWrapper>
                        )}
                      </formStep1.Field>

                      <formStep1.Subscribe>
                        {(state) => (
                          <div className="pt-4">
                            <Button
                              type="submit"
                              className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                              disabled={!state.canSubmit || state.isSubmitting}
                              aria-disabled={
                                !state.canSubmit || state.isSubmitting
                              }
                            >
                              {state.isSubmitting ? (
                                <span className="inline-flex items-center gap-2">
                                  <Loader2 className="animate-spin h-5 w-5" />
                                  Enviando...
                                </span>
                              ) : (
                                "Continuar →"
                              )}
                            </Button>
                          </div>
                        )}
                      </formStep1.Subscribe>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBackToStep1}
                        className="text-gray-600 dark:text-slate-400"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Voltar
                      </Button>
                      <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                          Configurar organização
                        </h1>
                        <p className="text-gray-600 dark:text-slate-300">
                          Configure os detalhes da sua{" "}
                          {orgType === "creator" ? "conta" : "organização"}
                        </p>
                      </div>
                    </div>

                    {/* Badge do tipo de organização */}
                    <div className="mb-6">
                      <Badge variant="secondary" className="capitalize">
                        {orgTypeConfigs[orgType].icon}
                        <span className="ml-2">
                          {orgTypeConfigs[orgType].title}
                        </span>
                      </Badge>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        formStep2.handleSubmit();
                      }}
                      className="space-y-6"
                      noValidate
                    >
                      {/* Nome da Organização */}
                      <formStep2.Field name="orgName">
                        {(field) => (
                          <FieldWrapper label="Nome da Organização">
                            <div className="relative">
                              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-slate-400">
                                <Building size={16} />
                              </div>
                              <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e: any) =>
                                  handleOrgNameChange(e.target.value)
                                }
                                placeholder={`Ex: ${
                                  orgType === "creator"
                                    ? "Meu Estúdio de Conteúdo"
                                    : orgType === "team"
                                      ? "Equipe Criativa XYZ"
                                      : "Agência Digital ABC"
                                }`}
                                className="pl-10 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 border-gray-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20"
                              />
                            </div>
                            <div aria-live="polite">
                              {field.state.meta.errors.map((error) => (
                                <p
                                  key={error?.message}
                                  className="text-sm text-red-500 dark:text-red-400 mt-1"
                                >
                                  {error?.message}
                                </p>
                              ))}
                            </div>
                          </FieldWrapper>
                        )}
                      </formStep2.Field>

                      {/* Slug da Organização */}
                      <formStep2.Field name="orgSlug">
                        {(field) => (
                          <FieldWrapper label="URL da Organização">
                            <div className="flex items-center">
                              <div className="relative flex-1">
                                <Input
                                  id={field.name}
                                  name={field.name}
                                  value={field.state.value}
                                  onBlur={field.handleBlur}
                                  onChange={(e: any) => {
                                    const value = e.target.value.toLowerCase();
                                    field.handleChange(value);
                                    setOrgSlug(value);
                                  }}
                                  className="pr-24 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white border-gray-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                  <span className="text-gray-500 dark:text-slate-400">
                                    .creatorhub.com
                                  </span>
                                </div>
                              </div>
                              {orgSlug.length >= 3 && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="ml-3"
                                >
                                  <Badge
                                    variant={
                                      isSlugAvailable
                                        ? "outline"
                                        : "destructive"
                                    }
                                    className="capitalize"
                                  >
                                    {isSlugAvailable
                                      ? "Disponível"
                                      : "Indisponível"}
                                  </Badge>
                                </motion.div>
                              )}
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                              {field.state.meta.errors.map((error) => (
                                <p
                                  key={error?.message}
                                  className="text-sm text-red-500 dark:text-red-400"
                                >
                                  {error?.message}
                                </p>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                              Esta será a URL única da sua organização
                            </p>
                          </FieldWrapper>
                        )}
                      </formStep2.Field>

                      {/* Configurações da Organização */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Timezone */}
                        <formStep2.Field name="timezone">
                          {(field) => (
                            <FieldWrapper label="Fuso Horário">
                              <Select
                                value={field.state.value}
                                onValueChange={field.handleChange}
                              >
                                <SelectTrigger className="bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-slate-600">
                                  <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-gray-400" />
                                    <SelectValue placeholder="Selecione um fuso horário" />
                                  </div>
                                </SelectTrigger>
                                <SelectContent>
                                  {timezones.map((tz) => (
                                    <SelectItem key={tz.value} value={tz.value}>
                                      {tz.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FieldWrapper>
                          )}
                        </formStep2.Field>

                        {/* Moeda */}
                        <formStep2.Field name="currency">
                          {(field) => (
                            <FieldWrapper label="Moeda Principal">
                              <Select
                                value={field.state.value}
                                onValueChange={field.handleChange}
                              >
                                <SelectTrigger className="bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-slate-600">
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-gray-400" />
                                    <SelectValue placeholder="Selecione uma moeda" />
                                  </div>
                                </SelectTrigger>
                                <SelectContent>
                                  {currencies.map((currency) => (
                                    <SelectItem
                                      key={currency.code}
                                      value={currency.code}
                                    >
                                      {currency.symbol} {currency.code} -{" "}
                                      {currency.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FieldWrapper>
                          )}
                        </formStep2.Field>
                      </div>

                      {/* Configurações Avançadas para Agências */}
                      {orgType === "agency" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800/50"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              Configurações White-label
                            </h3>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  Ativar modo White-label
                                </p>
                                <p className="text-sm text-gray-600 dark:text-slate-400">
                                  Personalize a plataforma com sua marca
                                </p>
                              </div>
                              <Switch
                                checked={isWhiteLabel}
                                onCheckedChange={setIsWhiteLabel}
                              />
                            </div>
                            {isWhiteLabel && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-3 pt-3 border-t border-gray-200 dark:border-slate-700"
                              >
                                <p className="text-sm text-gray-600 dark:text-slate-400">
                                  Você poderá configurar logo, cores e domínio
                                  personalizado após a criação da conta.
                                </p>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* Termos e Condições */}
                      <formStep2.Field name="acceptTerms">
                        {(field) => (
                          <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                            <div className="flex items-start gap-3">
                              <Switch
                                id="accept-terms"
                                checked={field.state.value}
                                onCheckedChange={field.handleChange}
                              />
                              <div>
                                <Label
                                  htmlFor="accept-terms"
                                  className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                                >
                                  Aceito os Termos de Uso e Política de
                                  Privacidade
                                </Label>
                                <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                                  Ao criar sua conta, você concorda com nossos
                                  termos de serviço e confirma que leu nossa
                                  política de privacidade.
                                </p>
                                {field.state.meta.errors.map((error) => (
                                  <p
                                    key={error?.message}
                                    className="text-sm text-red-500 dark:text-red-400 mt-1"
                                  >
                                    {error?.message}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </formStep2.Field>

                      <formStep2.Subscribe>
                        {(state) => (
                          <div className="pt-6">
                            <Button
                              type="submit"
                              className="w-full bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                              disabled={!state.canSubmit || state.isSubmitting}
                              aria-disabled={
                                !state.canSubmit || state.isSubmitting
                              }
                            >
                              {state.isSubmitting ? (
                                <span className="inline-flex items-center gap-2">
                                  <Loader2 className="animate-spin h-5 w-5" />
                                  Criando conta...
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-2">
                                  <CheckCircle className="h-5 w-5" />
                                  Criar Conta e Organização
                                </span>
                              )}
                            </Button>
                            <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-3">
                              Você será redirecionado para o dashboard após a
                              criação
                            </p>
                          </div>
                        )}
                      </formStep2.Subscribe>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              <Separator className="my-8" />

              <div className="text-center">
                <p className="text-gray-600 dark:text-slate-400">
                  Já tem uma conta?{" "}
                  <a
                    href="/auth/signin"
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    Faça login
                  </a>
                </p>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
