import api from "@/lib/api";
import { useSession } from "@/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";
import {
  BadgeCheck,
  BarChart,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  MessageSquare,
  Package,
  Puzzle,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface NavigationItem {
  title: string;
  href: Route;
  icon: React.ComponentType<any>;
  color?: string;
  gradient?: string;
  description?: string;
  subItems?: NavigationItem[];
  badge?: string;
  badgeColor?: string;
}

export default function useHeader() {
  const pathname = usePathname();
  const { session, signOut } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(5);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const [organizationSearchTerm, setOrganizationSearchTerm] = useState("");
  const [organizationsLimit, setOrganizationsLimit] = useState(5);
  const organizations = useOrganizations().data || [];

  function useOrganizations() {
    return useQuery<Organization[]>({
      queryKey: ["organizations"],
      queryFn: async () => {
        const { data } = await api.get("/organizations");
        return data;
      },
    });
  }

  const navigationItems: readonly NavigationItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: BarChart,
      description: "Visão geral do seu conteúdo e finanças",
      color: "text-blue-500",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Conteúdo",
      href: "/content",
      icon: Calendar,
      color: "text-emerald-500",
      gradient: "from-emerald-500 to-green-500",
      subItems: [
        {
          title: "Calendário Editorial",
          href: "/content/calendar" as Route,
          icon: Calendar,
        },
        {
          title: "Gestão de Conteúdos",
          href: "/content/list" as Route,
          icon: FileText,
        },
        {
          title: "Templates",
          href: "/content/templates" as Route,
          icon: Package,
        },
        {
          title: "Roteiros & Assets",
          href: "/content/scripts" as Route,
          icon: FileText,
        },
      ],
    },
    {
      title: "Financeiro",
      href: "/financial" as Route,
      icon: DollarSign,
      color: "text-amber-500",
      gradient: "from-amber-500 to-orange-500",
      subItems: [
        {
          title: "Dashboard Financeiro",
          href: "/financial/dashboard" as Route,
          icon: TrendingUp,
        },
        {
          title: "Registro de Receitas",
          href: "/financial/income" as Route,
          icon: DollarSign,
        },
        {
          title: "Previsão de Ganhos",
          href: "/financial/forecast" as Route,
          icon: TrendingUp,
        },
        {
          title: "Relatórios",
          href: "/financial/reports" as Route,
          icon: BarChart,
        },
      ],
    },
    {
      title: "Split",
      href: "/split" as Route,
      icon: CreditCard,
      color: "text-violet-500",
      gradient: "from-violet-500 to-purple-500",
      badge: "Beta",
      badgeColor: "bg-gradient-to-r from-violet-600 to-purple-600",
    },
    {
      title: "CRM",
      href: "/crm" as Route,
      icon: Users,
      color: "text-pink-500",
      gradient: "from-pink-500 to-rose-500",
      subItems: [
        { title: "Contatos", href: "/crm/contacts" as Route, icon: Users },
        { title: "Propostas", href: "/crm/proposals" as Route, icon: FileText },
        {
          title: "Contratos",
          href: "/crm/contracts" as Route,
          icon: BadgeCheck,
        },
      ],
    },
    {
      title: "Integrações",
      href: "/integrations" as Route,
      icon: Puzzle,
      color: "text-indigo-500",
      gradient: "from-indigo-500 to-blue-500",
      badge: "12+",
      badgeColor: "bg-gradient-to-r from-indigo-600 to-blue-600",
    },
  ];

  const quickActions = [
    { label: "Novo Conteúdo", shortcut: "⌘K", icon: Sparkles },
    { label: "Registrar Receita", shortcut: "⌘R", icon: DollarSign },
    { label: "Criar Invoice", shortcut: "⌘I", icon: FileText },
    { label: "Convidar Membro", shortcut: "⌘M", icon: Users },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const notificationItems = [
    {
      id: 1,
      title: "Novo comentário no roteiro",
      description: '"Vídeo sobre IA" recebeu feedback',
      time: "2 minutos atrás",
      unread: true,
      icon: MessageSquare,
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Pagamento recebido",
      description: "R$ 2.450 via Stripe - Ads YouTube",
      time: "1 hora atrás",
      unread: true,
      icon: DollarSign,
      color: "bg-emerald-500",
    },
    {
      id: 3,
      title: "Tarefa atribuída",
      description: "Revisar edição do vlog semanal",
      time: "3 horas atrás",
      unread: false,
      icon: Calendar,
      color: "bg-amber-500",
    },
    {
      id: 4,
      title: "Integração atualizada",
      description: "YouTube Analytics sync concluído",
      time: "1 dia atrás",
      unread: false,
      icon: Puzzle,
      color: "bg-indigo-500",
    },
  ];

  const currentOrganization = useOrganizations().data?.find(
    (org) => org.id === localStorage.getItem("ch_selected_org"),
  );

  const switchOrganization = (orgId: string) => {
    localStorage.setItem("ch_selected_org", orgId);
    window.location.reload();
  };

  const filteredOrganizations = organizations
    .filter(
      (org) =>
        org.name.toLowerCase().includes(organizationSearchTerm.toLowerCase()) ||
        org.slug.toLowerCase().includes(organizationSearchTerm.toLowerCase()),
    )
    .slice(0, organizationsLimit);

  const hasMoreOrganizations = organizationSearchTerm
    ? organizations.filter(
        (org) =>
          org.name
            .toLowerCase()
            .includes(organizationSearchTerm.toLowerCase()) ||
          org.slug.toLowerCase().includes(organizationSearchTerm.toLowerCase()),
      ).length > organizationsLimit
    : organizations.length > organizationsLimit;

  const loadMoreOrganizations = () => {
    setOrganizationsLimit((prev) => prev + 5);
  };

  return {
    pathname,
    session,
    scrolled,
    darkMode,
    notifications,
    mobileMenuOpen,
    searchOpen,
    quickActionOpen,
    userMenuOpen,
    activeHover,
    notificationItems,
    navigationItems,
    quickActions,
    currentOrganization,
    organizationSearchTerm,
    organizationsLimit,
    filteredOrganizations,
    hasMoreOrganizations,
    organizations,
    loadMoreOrganizations,
    setOrganizationsLimit,
    setOrganizationSearchTerm,
    switchOrganization,
    toggleDarkMode,
    signOut,
    setMobileMenuOpen,
    setSearchOpen,
    setQuickActionOpen,
    setUserMenuOpen,
    setActiveHover,
    useOrganizations,
  };
}
