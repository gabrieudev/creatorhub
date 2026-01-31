"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import Image from "next/image";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import {
  ArrowRight,
  Award,
  Bot,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Cloud,
  DollarSign,
  Facebook,
  HelpCircle,
  Instagram,
  LayoutDashboard,
  Linkedin,
  Shield,
  Star,
  TrendingUp,
  Twitter,
  Users,
  Workflow,
  X,
} from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";

export type Plan = {
  name: string;
  popular?: boolean;
  price: string;
  period: string;
  savings?: string;
  originalPrice?: string;
  buttonVariant?: "default" | "outline" | "ghost";
  buttonText: string;
  features: string[];
};

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [activePricingTab, setActivePricingTab] = useState("monthly");
  const [activeAuthTab, setActiveAuthTab] = useState("signIn");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Calendário Editorial Inteligente",
      description:
        "Planeje, agende e acompanhe todas as publicações em múltiplas plataformas em uma visão única.",
      color: "from-blue-500 to-purple-600",
      gradient: "bg-linear-to-r from-blue-500 to-purple-600",
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Gestão Financeira Completa",
      description:
        "Rastreie receitas, splits automáticos, invoices e relatórios financeiros em tempo real.",
      color: "from-red-500 to-purple-600",
      gradient: "bg-linear-to-r from-red-500 to-purple-600",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Colaboração com Equipes",
      description:
        "Trabalhe com editores, managers e marcas com permissões granulares e workflow integrado.",
      color: "from-purple-600 to-blue-500",
      gradient: "bg-linear-to-r from-purple-600 to-blue-500",
    },
  ];

  const testimonials = [
    {
      name: "Ana Silva",
      role: "Creator - 2M+ seguidores",
      content:
        "O CreatorHub transformou minha produtividade. Agora consigo gerenciar toda minha equipe e finanças em um só lugar.",
      avatarColor: "bg-linear-to-r from-blue-500 to-purple-600",
    },
    {
      name: "Pedro Costa",
      role: "Agency Owner",
      content:
        "A ferramenta mais completa do mercado para gestão de criadores. O split automático de receitas é revolucionário.",
      avatarColor: "bg-linear-to-r from-red-500 to-purple-600",
    },
    {
      name: "Mariana Lima",
      role: "Content Manager",
      content:
        "O sistema de checklists e versionamento salvou nosso time. Finalmente temos um fluxo organizado de produção.",
      avatarColor: "bg-linear-to-r from-purple-600 to-blue-500",
    },
  ];

  const pricingPlans: Record<"monthly" | "yearly", Plan[]> = {
    monthly: [
      {
        name: "Starter",
        popular: false,
        price: "R$19",
        period: "/mês",
        savings: "0",
        originalPrice: undefined,
        buttonVariant: "outline",
        buttonText: "Começar Grátis",
        features: [
          "1 projeto ativo",
          "10 uploads/mês",
          "Suporte por e-mail",
          "Exportação básica",
          "Acesso à comunidade",
        ],
      },
      {
        name: "Pro",
        popular: true,
        price: "R$49",
        period: "/mês",
        savings: "0",
        originalPrice: undefined,
        buttonVariant: "default",
        buttonText: "Assinar Pro",
        features: [
          "Projetos ilimitados",
          "Uploads ilimitados",
          "Integrações com ferramentas",
          "Painel de analytics",
          "Prioridade no suporte",
        ],
      },
      {
        name: "Enterprise",
        popular: false,
        price: "R$149",
        period: "/mês",
        savings: "0",
        originalPrice: undefined,
        buttonVariant: "default",
        buttonText: "Fale com vendas",
        features: [
          "SLA e suporte dedicado",
          "Single Sign-On (SSO)",
          "Contas multi-usuário",
          "Relatórios personalizados",
          "Onboarding e treinamento",
        ],
      },
    ],

    yearly: [
      {
        name: "Starter",
        popular: false,
        price: "R$15",
        period: "/mês (faturado anualmente)",
        savings: "20",
        originalPrice: "R$19",
        buttonVariant: "outline",
        buttonText: "Começar Grátis",
        features: [
          "1 projeto ativo",
          "10 uploads/mês",
          "Suporte por e-mail",
          "Exportação básica",
          "Acesso à comunidade",
        ],
      },
      {
        name: "Pro",
        popular: true,
        price: "R$39",
        period: "/mês (faturado anualmente)",
        savings: "20",
        originalPrice: "R$49",
        buttonVariant: "default",
        buttonText: "Assinar Pro (Anual)",
        features: [
          "Projetos ilimitados",
          "Uploads ilimitados",
          "Integrações com ferramentas",
          "Painel de analytics",
          "Prioridade no suporte",
        ],
      },
      {
        name: "Enterprise",
        popular: false,
        price: "R$119",
        period: "/mês (faturado anualmente)",
        savings: "20",
        originalPrice: "R$149",
        buttonVariant: "default",
        buttonText: "Fale com vendas",
        features: [
          "SLA e suporte dedicado",
          "Single Sign-On (SSO)",
          "Contas multi-usuário",
          "Relatórios personalizados",
          "Onboarding e treinamento",
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 border-b",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-gray-200"
            : "bg-white border-transparent",
        )}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
              <span className="text-xl font-bold bg-linear-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                CreatorHub
              </span>
            </div>

            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-slate-800 hover:bg-slate-100 hover:text-slate-900 data-[state=open]:bg-slate-200! data-[state=open]:text-blue-600! rounded-md transition-colors">
                    Funcionalidades
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-white border border-gray-200 shadow-xl">
                    <div className="grid gap-3 p-6 md:w-125 lg:w-150">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <span className="font-semibold text-gray-900">
                              Produção
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Calendário, checklists, roteiros
                          </p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                              <DollarSign className="h-5 w-5 text-red-600" />
                            </div>
                            <span className="font-semibold text-gray-900">
                              Financeiro
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Receitas, splits, invoices
                          </p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                              <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <span className="font-semibold text-gray-900">
                              Equipe
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Colaboração, permissões, CRM
                          </p>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-slate-800 hover:bg-slate-100 hover:text-slate-900 data-[state=open]:bg-slate-200! data-[state=open]:text-blue-600! rounded-md transition-colors">
                    Soluções
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-white border border-gray-200 shadow-xl">
                    <div className="p-6 md:w-100">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <h4 className="font-bold text-gray-900 text-lg">
                            Para Criadores Solo
                          </h4>
                          <p className="text-sm text-gray-600">
                            Organize sua produção e finanças de forma
                            profissional
                          </p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-bold text-gray-900 text-lg">
                            Para Equipes
                          </h4>
                          <p className="text-sm text-gray-600">
                            Colabore com editores e managers em tempo real
                          </p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-bold text-gray-900 text-lg">
                            Para Agências
                          </h4>
                          <p className="text-sm text-gray-600">
                            Gerencie múltiplos criadores com ferramentas
                            white-label
                          </p>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="#pricing"
                    className="px-4 py-2 text-gray-800 hover:text-blue-600 hover:bg-gray-100 font-medium"
                  >
                    Preços
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="#testimonials"
                    className="px-4 py-2 text-gray-800 hover:text-blue-600 hover:bg-gray-100 font-medium"
                  >
                    Depoimentos
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="#faq"
                    className="px-4 py-2 text-gray-800 hover:text-blue-600 hover:bg-gray-100 font-medium"
                  >
                    FAQ
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center space-x-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    className="text-black bg-white hover:bg-gray-100 shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <DialogTitle className="text-black hover:text-blue-600">
                      Entrar
                    </DialogTitle>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-106.25 bg-slate-900">
                  <SignInForm />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-linear-to-r cursor-pointer from-red-600 to-blue-600 hover:from-blue-700 hover:to-red-700 shadow-md hover:shadow-lg">
                    <DialogTitle className="text-white">
                      Começar Grátis
                    </DialogTitle>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-106.25 bg-slate-900">
                  <SignUpForm />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Seção Hero */}
      <section className="relative overflow-hidden pt-20 pb-32 bg-linear-to-b from-white to-gray-50">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-purple-500/3 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="block bg-linear-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Tudo que você precisa
              </span>
              <span className="block text-gray-900">
                para criar com propósito
              </span>
            </h1>

            <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
              Planeje, produza, monetize e colabore em um só lugar. A plataforma
              completa para criadores de conteúdo e suas equipes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-linear-to-r from-red-600 to-blue-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl"
                  >
                    <DialogTitle>Começar Gratuitamente</DialogTitle>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-106.25">
                  <SignUpForm />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-center">
                <div className="text-3xl font-bold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  10K+
                </div>
                <div className="text-gray-700 font-medium">Criadores</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-linear-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                  50K+
                </div>
                <div className="text-gray-700 font-medium">Conteúdos/mês</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-linear-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                  R$5M+
                </div>
                <div className="text-gray-700 font-medium">Processados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-red-600 bg-clip-text text-transparent">
                  99.9%
                </div>
                <div className="text-gray-700 font-medium">Satisfação</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Funcionalidades */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Funcionalidades
              <span className="block bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Poderosas
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Tudo o que você precisa para escalar sua produção de conteúdo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setActiveFeature(index)}
                className="relative group"
              >
                <Card
                  className={cn(
                    "h-full transition-all duration-300 border-2 hover:border-blue-500/50 bg-white",
                    activeFeature === index
                      ? "shadow-xl border-blue-500/30"
                      : "shadow-md border-gray-200",
                  )}
                >
                  <CardContent className="p-8">
                    <div
                      className={cn(
                        "inline-flex p-3 rounded-xl mb-6 transition-all duration-300",
                        activeFeature === index
                          ? feature.gradient
                          : "bg-gray-100",
                      )}
                    >
                      <div
                        className={cn(
                          "transition-colors duration-300",
                          activeFeature === index
                            ? "text-white"
                            : "text-gray-700",
                        )}
                      >
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700 mb-6">{feature.description}</p>
                    <ul className="space-y-3">
                      {[
                        "Planejamento multi-plataforma",
                        "Status em tempo real",
                        "Integração automática",
                      ].map((item, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Showcase de Funcionalidades */}
          <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 border border-blue-100">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-linear-to-r from-red-500 to-blue-500 text-white border-0">
                  Novidade
                </Badge>
                <h3 className="text-3xl font-bold mb-6 text-gray-900">
                  Dashboard Inteligente em
                  <span className="bg-linear-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {" "}
                    Tempo Real
                  </span>
                </h3>
                <p className="text-gray-700 mb-8 text-lg">
                  Visualize métricas de produção, receita e performance em um
                  painel completamente personalizável.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-white/70 rounded-lg border border-gray-200">
                    <div className="h-12 w-12 rounded-lg bg-linear-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                      <LayoutDashboard className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">
                        Múltiplas Views
                      </div>
                      <div className="text-sm text-gray-600">
                        Personalize seu dashboard
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-white/70 rounded-lg border border-gray-200">
                    <div className="h-12 w-12 rounded-lg bg-linear-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">
                        Previsões IA
                      </div>
                      <div className="text-sm text-gray-600">
                        Análises preditivas
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-2xl" />
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex space-x-2">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      Dashboard CreatorHub
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="h-24 rounded-xl bg-linear-to-br from-blue-50 to-blue-100 p-4 border border-blue-200">
                      <div className="text-2xl font-bold text-blue-700">
                        85%
                      </div>
                      <div className="text-sm text-blue-600 font-medium">
                        Produtividade
                      </div>
                      <div className="h-1.5 w-full bg-blue-200 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full w-4/5" />
                      </div>
                    </div>
                    <div className="h-24 rounded-xl bg-linear-to-br from-purple-50 to-purple-100 p-4 border border-purple-200">
                      <div className="text-2xl font-bold text-purple-700">
                        R$12.5K
                      </div>
                      <div className="text-sm text-purple-600 font-medium">
                        Receita Mês
                      </div>
                      <div className="h-1.5 w-full bg-purple-200 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full w-3/4" />
                      </div>
                    </div>
                    <div className="h-24 rounded-xl bg-linear-to-br from-red-50 to-red-100 p-4 border border-red-200">
                      <div className="text-2xl font-bold text-red-700">24</div>
                      <div className="text-sm text-red-600 font-medium">
                        Conteúdos
                      </div>
                      <div className="h-1.5 w-full bg-red-200 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full w-2/3" />
                      </div>
                    </div>
                  </div>
                  <div className="h-36 rounded-xl bg-linear-to-r from-blue-50 to-purple-50 p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-bold text-gray-900">
                        Timeline de Produção
                      </div>
                      <div className="text-sm font-bold text-green-600 flex items-center">
                        +18% <TrendingUp className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-linear-to-r from-blue-500 to-purple-500 w-3/4" />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Seg</span>
                      <span>Ter</span>
                      <span>Qua</span>
                      <span>Qui</span>
                      <span>Sex</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Depoimentos */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              O que dizem nossos
              <span className="block bg-linear-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                criadores
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Junte-se a milhares de criadores que transformaram sua produção
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div
                        className={`h-14 w-14 rounded-full ${testimonial.avatarColor} flex items-center justify-center text-white font-bold text-xl`}
                      >
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="font-bold text-gray-900">
                          {testimonial.name}
                        </div>
                        <div className="text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                    <p className="text-gray-700 italic border-l-4 border-blue-500 pl-4 py-2 mb-6">
                      "{testimonial.content}"
                    </p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Preços */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-linear-to-r from-blue-500/10 to-purple-500/10 text-blue-700 border-blue-200">
              <DollarSign className="h-3 w-3 mr-1" />
              PREÇOS TRANSPARENTES
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Escolha o plano ideal
              <span className="block bg-linear-to-r from-purple-600 to-red-600 bg-clip-text text-transparent">
                para o seu crescimento
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Comece gratuitamente e evolua conforme suas necessidades mudam
            </p>
          </div>

          {/* Toggle de Faturamento */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-full p-1 inline-flex shadow-sm border border-slate-200">
              <Tabs
                defaultValue="monthly"
                className="w-full"
                value={activePricingTab}
                onValueChange={setActivePricingTab}
              >
                <TabsList className="grid w-full max-w-md grid-cols-2 bg-slate-100 p-1 rounded-full">
                  <TabsTrigger
                    value="monthly"
                    className="flex items-center justify-center cursor-pointer text-center leading-none rounded-full transition-all duration-200 text-slate-800 hover:text-slate-900 hover:bg-slate-200 data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    <span className="font-semibold text-sm text-slate-900">
                      Faturamento Mensal
                    </span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="yearly"
                    className="flex items-center justify-center cursor-pointer text-center leading-none rounded-full transition-all duration-200 text-slate-800 hover:text-slate-900 hover:bg-slate-200 data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">
                        Faturamento Anual
                      </span>
                      <Badge className="bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-full px-2 py-0.5 text-[11px] font-medium">
                        -20%
                      </Badge>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Plano Anual */}
          {activePricingTab === "yearly" && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto mb-12"
            >
              <Card className="bg-linear-to-r from-green-50 to-emerald-50 border border-green-200">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                        <Check className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Economize 20% no plano anual
                        </h3>
                        <p className="text-gray-700">
                          + 2 meses grátis no plano Pro e 3 meses grátis no
                          plano Agência
                        </p>
                      </div>
                    </div>
                    <div className="text-center md:text-right">
                      <div className="text-3xl font-bold text-green-600">
                        Até R$720 de economia
                      </div>
                      <div className="text-gray-600">por conta</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Cards de Preços */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans[activePricingTab as keyof typeof pricingPlans].map(
              (plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative h-full"
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-2 shadow-lg">
                        <Award className="h-3 w-3 mr-2" />
                        MAIS POPULAR
                      </Badge>
                    </div>
                  )}

                  <Card
                    className={cn(
                      "h-full border-2 transition-all duration-300 hover:shadow-xl flex flex-col bg-white",
                      plan.popular
                        ? "border-blue-500 shadow-lg relative overflow-hidden"
                        : "border-gray-200 hover:border-blue-300",
                    )}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-600 to-purple-600" />
                    )}

                    <CardContent className="p-8 flex flex-col grow">
                      {/* Cabeçalho do Plano */}
                      <div className="mb-8">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">
                              {plan.name}
                            </h3>
                            <p className="text-gray-600">
                              {activePricingTab === "yearly" &&
                              plan.savings &&
                              plan.savings !== "0"
                                ? `Economia de ${plan.savings}%`
                                : "Plano essencial"}
                            </p>
                          </div>
                          {activePricingTab === "yearly" &&
                            plan.savings &&
                            plan.savings !== "0" && (
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Economia
                              </Badge>
                            )}
                        </div>

                        {/* Preço */}
                        <div className="mb-4">
                          <div className="flex items-baseline">
                            <span className="text-4xl font-bold text-gray-900">
                              {plan.price}
                            </span>
                            <span className="text-gray-600 ml-2">
                              {plan.period}
                            </span>
                          </div>

                          {/* Preço Original (para anual com desconto) */}
                          {activePricingTab === "yearly" &&
                            plan.originalPrice && (
                              <div className="flex items-center mt-2">
                                <span className="text-gray-500 line-through mr-2">
                                  {plan.originalPrice}
                                  {plan.period}
                                </span>
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                                  Economize {plan.savings}%
                                </Badge>
                              </div>
                            )}

                          {plan.name === "Starter" && (
                            <p className="text-gray-600 mt-2">
                              Para criadores iniciantes
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Botão de Ação */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="lg"
                            className={cn(
                              "w-full mb-8 font-semibold cursor-pointer",
                              plan.buttonVariant === "default"
                                ? "bg-linear-to-r from-red-600 to-blue-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                : "border-2",
                            )}
                          >
                            <DialogTitle>{plan.buttonText}</DialogTitle>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-106.25 bg-slate-900">
                          <SignUpForm />
                        </DialogContent>
                      </Dialog>

                      {/* Lista de Recursos */}
                      <div className="grow">
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Inclui:
                        </h4>
                        <ul className="space-y-3">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 shrink-0" />
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Benefícios Adicionais para Anual */}
                      {activePricingTab === "yearly" &&
                        plan.savings &&
                        plan.savings !== "0" && (
                          <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex items-center text-green-600 mb-2">
                              <Check className="h-4 w-4 mr-2" />
                              <span className="font-semibold">
                                Benefícios do plano anual:
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div className="flex items-center text-sm">
                                <Clock className="h-3 w-3 text-green-500 mr-1" />
                                <span className="text-gray-600">
                                  Meses grátis
                                </span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Shield className="h-3 w-3 text-green-500 mr-1" />
                                <span className="text-gray-600">
                                  Preço congelado
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                    </CardContent>
                  </Card>
                </motion.div>
              ),
            )}
          </div>

          {/* Comparação de Planos */}
          <div className="mt-16 max-w-4xl mx-auto">
            <Card className="border border-gray-200 bg-gray-50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">
                  Comparação Completa de Planos
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 text-gray-700 font-semibold">
                          Funcionalidade
                        </th>
                        <th className="text-center py-4">
                          <div className="font-bold text-gray-900">Starter</div>
                          <div className="text-sm text-gray-600">Grátis</div>
                        </th>
                        <th className="text-center py-4">
                          <div className="font-bold text-gray-900">Pro</div>
                          <div className="text-sm text-gray-600">
                            {activePricingTab === "monthly"
                              ? "R$97/mês"
                              : "R$77/mês"}
                          </div>
                        </th>
                        <th className="text-center py-4">
                          <div className="font-bold text-gray-900">Agência</div>
                          <div className="text-sm text-gray-600">
                            {activePricingTab === "monthly"
                              ? "R$297/mês"
                              : "R$237/mês"}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Conteúdos/mês", "50", "Ilimitado", "Ilimitado"],
                        ["Usuários", "1", "Até 5", "Ilimitados"],
                        ["Armazenamento", "5GB", "50GB", "500GB"],
                        ["Integrações", "Básicas", "Premium", "Avançadas"],
                        ["Suporte", "Email", "Prioritário", "24/7"],
                        [
                          "White-label",
                          <X
                            key="x"
                            className="h-4 w-4 text-red-500 mx-auto"
                          />,
                          "Básico",
                          "Completo",
                        ],
                      ].map(([feature, starter, pro, agency], idx) => (
                        <tr
                          key={idx}
                          className={idx % 2 === 0 ? "bg-white" : ""}
                        >
                          <td className="py-4 px-4 text-gray-700 font-medium">
                            {feature}
                          </td>
                          <td className="py-4 px-4 text-center text-gray-900">
                            {starter}
                          </td>
                          <td className="py-4 px-4 text-center text-gray-900 font-semibold">
                            {pro}
                          </td>
                          <td className="py-4 px-4 text-center text-gray-900 font-semibold">
                            {agency}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ de Preços */}
          <div className="mt-16 max-w-3xl mx-auto" id="faq">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">
              Perguntas Frequentes sobre Preços
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border border-gray-200 bg-gray-50">
                <CardContent className="p-6">
                  <div className="flex items-start mb-4">
                    <HelpCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Posso mudar de plano depois?
                      </h4>
                      <p className="text-gray-600 mt-2">
                        Sim, você pode fazer upgrade ou downgrade a qualquer
                        momento. O valor será ajustado proporcionalmente.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200 bg-gray-50">
                <CardContent className="p-6">
                  <div className="flex items-start mb-4">
                    <HelpCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Há cobrança por usuário adicional?
                      </h4>
                      <p className="text-gray-600 mt-2">
                        No plano Pro, cada usuário adicional custa R$19/mês. No
                        plano Agência, usuários são ilimitados.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200 bg-gray-50">
                <CardContent className="p-6">
                  <div className="flex items-start mb-4">
                    <HelpCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Qual a política de cancelamento?
                      </h4>
                      <p className="text-gray-600 mt-2">
                        Você pode cancelar a qualquer momento. No plano anual,
                        reembolsamos os meses não utilizados.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200 bg-gray-50">
                <CardContent className="p-6">
                  <div className="flex items-start mb-4">
                    <HelpCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Há teste gratuito?
                      </h4>
                      <p className="text-gray-600 mt-2">
                        Sim! Todos os planos pagos têm 14 dias de teste
                        gratuito. Sem necessidade de cartão de crédito.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-red-600 via-purple-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Comece a criar com propósito hoje
            </h2>
            <p className="text-xl mb-10 text-blue-100">
              Junte-se a milhares de criadores que já transformaram sua produção
              com o CreatorHub
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="cursor-pointer bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-bold shadow-lg"
                  >
                    <DialogTitle>Criar Conta Gratuita</DialogTitle>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-106.25 bg-slate-900">
                  <SignUpForm />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
              <div className="text-center">
                <div className="h-14 w-14 mx-auto mb-4 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <div className="font-bold text-lg">Segurança</div>
                <div className="text-blue-200 text-sm">Certificado SSL</div>
              </div>
              <div className="text-center">
                <div className="h-14 w-14 mx-auto mb-4 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <Cloud className="h-7 w-7 text-white" />
                </div>
                <div className="font-bold text-lg">Backup</div>
                <div className="text-blue-200 text-sm">Automático</div>
              </div>
              <div className="text-center">
                <div className="h-14 w-14 mx-auto mb-4 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <Workflow className="h-7 w-7 text-white" />
                </div>
                <div className="font-bold text-lg">Integrações</div>
                <div className="text-blue-200 text-sm">+20 plataformas</div>
              </div>
              <div className="text-center">
                <div className="h-14 w-14 mx-auto mb-4 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <Bot className="h-7 w-7 text-white" />
                </div>
                <div className="font-bold text-lg">Suporte</div>
                <div className="text-blue-200 text-sm">24/7</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
