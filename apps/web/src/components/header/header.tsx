"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Building,
  Check,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Crown,
  Globe,
  HelpCircle,
  LifeBuoy,
  LogOut,
  Menu,
  Moon,
  Plus,
  Search,
  Settings,
  Shield,
  Smartphone,
  Sparkles,
  Sun,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useHeader from "./useHeader";

export default function Header() {
  const {
    pathname,
    scrolled,
    darkMode,
    notifications,
    mobileMenuOpen,
    searchOpen,
    quickActionOpen,
    userMenuOpen,
    activeHover,
    organizationSearchTerm,
    filteredOrganizations,
    hasMoreOrganizations,
    session,
    navigationItems,
    quickActions,
    notificationItems,
    setSearchOpen,
    setMobileMenuOpen,
    setQuickActionOpen,
    setUserMenuOpen,
    setActiveHover,
    setOrganizationSearchTerm,
    setOrganizationsLimit,
    toggleDarkMode,
    signOut,
    switchOrganization,
    currentOrganization,
    organizations,
    loadMoreOrganizations,
  } = useHeader();

  return (
    <>
      {/* Overlay de Busca */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-background/95 backdrop-blur-md"
            onClick={() => setSearchOpen(false)}
          >
            <div className="container mx-auto px-4 pt-32">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="max-w-2xl mx-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar conteúdos, relatórios, membros, configurações..."
                    className="h-14 pl-12 text-lg border-2"
                    autoFocus
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                      <span className="text-xs">ESC</span>
                    </kbd>
                  </div>
                </div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-8"
                >
                  <div className="grid grid-cols-2 gap-4">
                    {quickActions.map((action) => (
                      <div
                        key={action.label}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-all hover:scale-[1.02]"
                      >
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <action.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{action.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {action.shortcut}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Principal */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-all duration-500",
          scrolled
            ? "bg-background/90 backdrop-blur-xl supports-backdrop-filter:bg-background/70 shadow-lg"
            : "bg-background",
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo e Organização */}
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-3 group">
                <motion.div
                  whileHover={{ rotate: 5 }}
                  className="relative h-9 w-9"
                >
                  <Image
                    src="/logo.png"
                    alt="CreatorHub"
                    fill
                    className="object-contain drop-shadow-lg"
                    priority
                  />
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-linear-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-size-[300%_100%] animate-gradient">
                    CreatorHub
                  </span>
                  <span className="text-xs text-muted-foreground -mt-1">
                    Plataforma para Criadores
                  </span>
                </div>
              </Link>

              <Separator
                orientation="vertical"
                className="h-6 hidden lg:block"
              />

              {/* Seletor de Organização */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hidden lg:flex items-center gap-2 px-3 hover:bg-accent/50 mr-4"
                  >
                    <Building className="h-4 w-4 text-primary" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-sm truncate max-w-35">
                        {currentOrganization?.name || "Selecionar Org"}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate max-w-35">
                        {currentOrganization?.slug || "sem-organizacao"}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-80 p-2 max-h-100 flex flex-col"
                >
                  <DropdownMenuLabel className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Organizações</span>
                      <Badge variant="outline" className="ml-2">
                        {organizations.length}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      asChild
                    >
                      <Link href="#">
                        <Plus className="h-3 w-3 mr-1" />
                        Nova
                      </Link>
                    </Button>
                  </DropdownMenuLabel>

                  {/* Busca de Organizações */}
                  <div className="p-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por nome ou slug..."
                        value={organizationSearchTerm}
                        onChange={(e) => {
                          setOrganizationSearchTerm(e.target.value);
                          setOrganizationsLimit(5);
                        }}
                        className="pl-9 h-9 text-sm"
                        autoFocus
                      />
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  {/* Lista de Organizações */}
                  <div className="flex-1 overflow-y-auto max-h-70 p-1">
                    {filteredOrganizations.length === 0 ? (
                      <div className="p-4 text-center">
                        <Building className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          {organizationSearchTerm
                            ? `Nenhuma organização para "${organizationSearchTerm}"`
                            : "Nenhuma organização disponível"}
                        </p>
                      </div>
                    ) : (
                      <>
                        {filteredOrganizations.map((org) => (
                          <DropdownMenuItem
                            key={org.id}
                            onClick={() => switchOrganization(org.id)}
                            className={cn(
                              "flex items-center justify-between gap-2 cursor-pointer p-2 rounded-md mb-1",
                              currentOrganization?.id === org.id && "bg-accent",
                            )}
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                                <Building className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium truncate text-sm">
                                    {org.name}
                                  </p>
                                  {currentOrganization?.id === org.id && (
                                    <Badge className="h-4 px-1 text-[10px]">
                                      Atual
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <code className="bg-muted px-1 rounded text-[10px]">
                                    {org.slug}
                                  </code>
                                  <span>•</span>
                                  <Globe className="h-3 w-3" />
                                  <span>{org.locale}</span>
                                </div>
                              </div>
                            </div>
                            {currentOrganization?.id === org.id && (
                              <Check className="h-4 w-4 text-primary shrink-0" />
                            )}
                          </DropdownMenuItem>
                        ))}

                        {/* Indicador de Mais Organizações */}
                        {hasMoreOrganizations && (
                          <>
                            <DropdownMenuSeparator className="my-1" />
                            <div className="p-2">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-muted-foreground">
                                  Mostrando {filteredOrganizations.length} de{" "}
                                  {organizationSearchTerm
                                    ? organizations.filter(
                                        (org) =>
                                          org.name
                                            .toLowerCase()
                                            .includes(
                                              organizationSearchTerm.toLowerCase(),
                                            ) ||
                                          org.slug
                                            .toLowerCase()
                                            .includes(
                                              organizationSearchTerm.toLowerCase(),
                                            ),
                                      ).length
                                    : organizations.length}{" "}
                                  organizações
                                </span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-xs"
                                onClick={loadMoreOrganizations}
                              >
                                Carregar mais organizações
                              </Button>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>

                  <DropdownMenuSeparator />

                  {/* Ações Rápidas */}
                  <div className="p-2 space-y-1">
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link
                        href="#"
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                      >
                        <div className="h-8 w-8 rounded-md bg-blue-500/10 flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Gerenciar todas</p>
                          <p className="text-xs text-muted-foreground">
                            Ver todas as organizações
                          </p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Navegação Desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigationItems.map((item) => (
                <div
                  key={item.title}
                  className="relative"
                  onMouseEnter={() => setActiveHover(item.title)}
                  onMouseLeave={() => setActiveHover(null)}
                >
                  {item.subItems ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            "gap-2 px-3 transition-all duration-300",
                            pathname.startsWith(item.href)
                              ? "bg-linear-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-sm"
                              : "hover:bg-accent",
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-4 w-4 transition-colors",
                              item.color,
                            )}
                          />
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge
                              className={cn(
                                "ml-2 text-xs",
                                item.badgeColor ?? "",
                              )}
                            >
                              {item.badge}
                            </Badge>
                          )}
                          <ChevronDown className="h-4 w-4 opacity-70" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-64 animate-in slide-in-from-top-5"
                      >
                        <DropdownMenuLabel className="flex items-center gap-2">
                          <div
                            className={cn("h-2 w-2 rounded-full", item.color)}
                          />
                          {item.title}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {item.subItems.map((subItem) => (
                          <DropdownMenuItem key={subItem.title} asChild>
                            <Link
                              href={subItem.href}
                              className="flex items-center gap-2 group/item cursor-pointer"
                            >
                              <subItem.icon className="h-4 w-4 opacity-60" />
                              <span>{subItem.title}</span>
                              <ChevronRight className="h-3 w-3 ml-auto opacity-0 group-hover/item:opacity-60 transition-opacity" />
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button
                      variant="ghost"
                      asChild
                      className={cn(
                        "gap-2 px-3 relative transition-all duration-300",
                        pathname === item.href
                          ? "bg-linear-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-sm"
                          : "hover:bg-accent",
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon
                          className={cn(
                            "h-4 w-4 transition-colors",
                            item.color,
                          )}
                        />
                        {item.title}
                        {item.badge && (
                          <Badge
                            className={cn("ml-2 text-xs", item.badgeColor)}
                          >
                            {item.badge}
                          </Badge>
                        )}

                        <motion.div
                          className={cn(
                            "absolute bottom-0 left-1/2 h-0.5 rounded-full",
                            item.gradient &&
                              `bg-linear-to-r ${item.gradient}`,
                          )}
                          initial={{ width: 0, x: "-50%" }}
                          animate={{
                            width: activeHover === item.title ? "80%" : 0,
                            x: "-50%",
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </nav>

            {/* Ações do Header */}
            <div className="flex items-center gap-2">
              {/* Botão de Busca */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative"
                      onClick={() => setSearchOpen(true)}
                    >
                      <Search className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Buscar ⌘K</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Ações Rápidas */}
              <DropdownMenu
                open={quickActionOpen}
                onOpenChange={setQuickActionOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Sparkles className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 animate-in slide-in-from-top-5"
                >
                  <DropdownMenuLabel>Ações Rápidas</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {quickActions.map((action) => (
                    <DropdownMenuItem
                      key={action.label}
                      className="gap-3 cursor-pointer"
                    >
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <action.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p>{action.label}</p>
                      </div>
                      <DropdownMenuShortcut>
                        {action.shortcut}
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notificações */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative">
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      {notifications > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-linear-to-r from-red-500 to-pink-600 text-[10px] font-medium text-white flex items-center justify-center shadow-lg"
                        >
                          {notifications}
                        </motion.span>
                      )}
                    </Button>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-80 animate-in slide-in-from-top-5"
                >
                  <div className="flex items-center justify-between p-4 pb-2">
                    <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs"
                    >
                      Marcar todas como lidas
                    </Button>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="max-h-96 overflow-y-auto">
                    <AnimatePresence>
                      {notificationItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <DropdownMenuItem className="gap-3 py-3 cursor-pointer">
                            <div
                              className={cn(
                                "h-10 w-10 rounded-lg flex items-center justify-center bg-opacity-10",
                                item.color,
                              )}
                            >
                              <item.icon
                                className={cn(
                                  "h-5 w-5",
                                  item.color.replace("bg-", "text-"),
                                )}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium truncate">
                                  {item.title}
                                </p>
                                {item.unread && (
                                  <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {item.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {item.time}
                              </p>
                            </div>
                          </DropdownMenuItem>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-primary font-medium cursor-pointer">
                    Ver todas as notificações
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Tema */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleDarkMode}
                    >
                      {darkMode ? (
                        <Sun className="h-5 w-5" />
                      ) : (
                        <Moon className="h-5 w-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{darkMode ? "Modo claro" : "Modo escuro"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Perfil do Usuário */}
              <AlertDialog>
                <DropdownMenu
                  open={userMenuOpen}
                  onOpenChange={setUserMenuOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-accent cursor-pointer transition-all">
                      <Avatar className="h-8 w-8 ring-2 ring-primary/20 ring-offset-2">
                        <AvatarImage
                          src={session?.user?.image ?? undefined}
                          alt={session?.user.name}
                        />
                        <AvatarFallback className="bg-linear-to-br from-primary to-purple-600 text-white">
                          {session?.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden lg:flex flex-col items-start">
                        <span className="text-sm font-medium">
                          {session?.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {session?.user.email}
                        </span>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 hidden lg:block transition-transform",
                          userMenuOpen && "rotate-180",
                        )}
                      />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-80 p-0 animate-in slide-in-from-top-5"
                  >
                    {/* Header do Perfil */}
                    <div className="p-6 bg-linear-to-br from-primary/5 to-primary/10">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-14 w-14 ring-4 ring-white/50">
                          <AvatarImage
                            src={session?.user.image ?? undefined}
                            alt={session?.user.name}
                          />
                          <AvatarFallback className="bg-linear-to-br from-primary to-purple-600 text-white text-lg">
                            {session?.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">
                              {session?.user.name}
                            </h3>
                            <Badge className="bg-linear-to-r from-amber-500 to-orange-500">
                              <Crown className="h-3 w-3 mr-1" />
                              {session?.user?.profile?.plan}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {session?.user.email}
                          </p>

                          {/* Organização Atual */}
                          {currentOrganization && (
                            <div className="mt-3 p-3 rounded-lg bg-card border">
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-primary" />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium truncate">
                                      {currentOrganization.name}
                                    </p>
                                    <Badge
                                      variant="outline"
                                      className="h-4 px-1 text-[10px]"
                                    >
                                      Atual
                                    </Badge>
                                  </div>
                                  <code className="text-xs text-muted-foreground bg-muted px-1 rounded">
                                    {currentOrganization.slug}
                                  </code>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2 text-xs"
                                    >
                                      Trocar
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-56"
                                  >
                                    <div className="p-2">
                                      <div className="relative">
                                        <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                          placeholder="Buscar..."
                                          value={organizationSearchTerm}
                                          onChange={(e) => {
                                            setOrganizationSearchTerm(
                                              e.target.value,
                                            );
                                            setOrganizationsLimit(5);
                                          }}
                                          className="pl-7 h-8 text-sm"
                                        />
                                      </div>
                                    </div>
                                    <div className="max-h-48 overflow-y-auto">
                                      {filteredOrganizations
                                        .filter(
                                          (org) =>
                                            org.id !== currentOrganization.id,
                                        )
                                        .slice(0, 3)
                                        .map((org) => (
                                          <DropdownMenuItem
                                            key={org.id}
                                            onClick={() => {
                                              switchOrganization(org.id);
                                              setUserMenuOpen(false);
                                            }}
                                            className="cursor-pointer"
                                          >
                                            <div className="flex items-center gap-2 w-full">
                                              <Building className="h-4 w-4" />
                                              <div className="flex-1 min-w-0">
                                                <p className="truncate text-sm">
                                                  {org.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                  {org.slug}
                                                </p>
                                              </div>
                                            </div>
                                          </DropdownMenuItem>
                                        ))}

                                      {filteredOrganizations.length > 3 && (
                                        <div className="p-2 border-t">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full text-xs"
                                            asChild
                                          >
                                            <Link href="#">
                                              Ver todas ({organizations.length})
                                            </Link>
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Estatísticas */}
                      <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            {session?.user?.profile?.content}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Conteúdos
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold bg-linear-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
                            R${" "}
                            {session?.user?.profile?.revenue?.toLocaleString(
                              "pt-BR",
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Receita
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                            {session?.user?.profile?.tasks}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Tarefas
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu de Opções */}
                    <div className="p-2">
                      <DropdownMenuGroup>
                        <DropdownMenuItem className="gap-3 p-3 cursor-pointer rounded-lg">
                          <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-500" />
                          </div>
                          <div>
                            <p>Meu Perfil</p>
                            <p className="text-xs text-muted-foreground">
                              Configurações pessoais
                            </p>
                          </div>
                        </DropdownMenuItem>

                        <DropdownMenuItem className="gap-3 p-3 cursor-pointer rounded-lg">
                          <div className="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <Building className="h-4 w-4 text-purple-500" />
                          </div>
                          <div>
                            <p>Minha Equipe</p>
                            <p className="text-xs text-muted-foreground">
                              Gerenciar membros
                            </p>
                          </div>
                        </DropdownMenuItem>

                        <DropdownMenuItem className="gap-3 p-3 cursor-pointer rounded-lg">
                          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <CreditCard className="h-4 w-4 text-emerald-500" />
                          </div>
                          <div>
                            <p>Assinatura</p>
                            <p className="text-xs text-muted-foreground">
                              Plano {session?.user?.profile?.plan}
                            </p>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>

                      <Separator className="my-2" />

                      <DropdownMenuGroup>
                        <DropdownMenuItem className="gap-3 p-3 cursor-pointer rounded-lg">
                          <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <Settings className="h-4 w-4 text-amber-500" />
                          </div>
                          <div>
                            <p>Configurações</p>
                            <p className="text-xs text-muted-foreground">
                              Preferências do sistema
                            </p>
                          </div>
                        </DropdownMenuItem>

                        <DropdownMenuItem className="gap-3 p-3 cursor-pointer rounded-lg">
                          <div className="h-9 w-9 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                            <Shield className="h-4 w-4 text-indigo-500" />
                          </div>
                          <div>
                            <p>Segurança</p>
                            <p className="text-xs text-muted-foreground">
                              2FA, senhas, sessões
                            </p>
                          </div>
                        </DropdownMenuItem>

                        <DropdownMenuItem className="gap-3 p-3 cursor-pointer rounded-lg">
                          <div className="h-9 w-9 rounded-lg bg-pink-500/10 flex items-center justify-center">
                            <Smartphone className="h-4 w-4 text-pink-500" />
                          </div>
                          <div>
                            <p>Aplicativo</p>
                            <p className="text-xs text-muted-foreground">
                              Baixar app mobile
                            </p>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>

                      <Separator className="my-2" />

                      <DropdownMenuGroup>
                        <DropdownMenuItem className="gap-3 p-3 cursor-pointer rounded-lg">
                          <div className="h-9 w-9 rounded-lg bg-rose-500/10 flex items-center justify-center">
                            <LifeBuoy className="h-4 w-4 text-rose-500" />
                          </div>
                          <div>
                            <p>Suporte</p>
                            <p className="text-xs text-muted-foreground">
                              Central de ajuda
                            </p>
                          </div>
                        </DropdownMenuItem>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="gap-3 p-3 cursor-pointer rounded-lg text-destructive hover:text-destructive"
                          >
                            <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center">
                              <LogOut className="h-4 w-4 text-destructive" />
                            </div>
                            <div>
                              <p>Sair</p>
                              <p className="text-xs text-muted-foreground">
                                Encerrar sessão
                              </p>
                            </div>
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuGroup>
                    </div>

                    {/* Footer do Menu */}
                    <div className="p-4 border-t">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          Membro desde{" "}
                          {session?.user?.createdAt
                            ? new Date(session.user.createdAt).getFullYear()
                            : ""}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-xs"
                        >
                          v2.4.1
                        </Button>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-center">
                      Tem certeza?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                      Deseja mesmo sair da sua conta?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={signOut}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Confirmar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Menu Mobile */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[90vw] sm:w-96 p-0">
                  <div className="flex flex-col h-full">
                    {/* Header do Mobile */}
                    <div className="p-6 border-b">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-linear-to-r from-red-600 via-purple-600 to-blue-600 flex items-center justify-center">
                              <span className="text-white font-bold">CH</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-xl font-bold">
                              CreatorHub
                            </span>
                            <p className="text-xs text-muted-foreground">
                              Menu
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>

                      {/* Organização no Mobile */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-primary" />
                            <p className="text-sm font-medium">Organização</p>
                          </div>
                          <Badge variant="outline">
                            {organizations.length} orgs
                          </Badge>
                        </div>

                        {/* Organização Atual */}
                        {currentOrganization && (
                          <div className="p-3 rounded-lg bg-accent border mb-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Building className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">
                                  {currentOrganization.name}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  <code className="bg-muted px-1 rounded">
                                    {currentOrganization.slug}
                                  </code>
                                  <span>•</span>
                                  <Globe className="h-3 w-3" />
                                  <span>{currentOrganization.locale}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Busca e Lista de Organizações */}
                        <div className="space-y-2">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder="Buscar organização..."
                              value={organizationSearchTerm}
                              onChange={(e) => {
                                setOrganizationSearchTerm(e.target.value);
                                setOrganizationsLimit(5);
                              }}
                              className="pl-9 h-9"
                            />
                          </div>

                          <div className="max-h-60 overflow-y-auto border rounded-lg">
                            {filteredOrganizations.length === 0 ? (
                              <div className="p-4 text-center">
                                <p className="text-sm text-muted-foreground">
                                  Nenhuma organização encontrada
                                </p>
                              </div>
                            ) : (
                              filteredOrganizations.map((org) => (
                                <div
                                  key={org.id}
                                  onClick={() => {
                                    switchOrganization(org.id);
                                    setMobileMenuOpen(false);
                                  }}
                                  className={cn(
                                    "flex items-center gap-3 p-3 cursor-pointer hover:bg-accent border-b last:border-b-0",
                                    currentOrganization?.id === org.id &&
                                      "bg-accent",
                                  )}
                                >
                                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                                    <Building className="h-4 w-4 text-primary" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium text-sm">
                                        {org.name}
                                      </p>
                                      {currentOrganization?.id === org.id && (
                                        <Badge className="h-4 px-1 text-[10px]">
                                          Atual
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {org.slug} • {org.locale}
                                    </p>
                                  </div>
                                  {currentOrganization?.id === org.id && (
                                    <Check className="h-4 w-4 text-primary" />
                                  )}
                                </div>
                              ))
                            )}

                            {hasMoreOrganizations && (
                              <div className="p-3 border-t">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full text-xs"
                                  onClick={loadMoreOrganizations}
                                >
                                  Carregar mais organizações
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Usuário no Mobile */}
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-accent">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={session?.user?.image ?? undefined}
                            alt={session?.user?.name}
                          />
                          <AvatarFallback>
                            {session?.user?.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{session?.user?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {session?.user?.email}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {session?.user?.profile?.plan}
                        </Badge>
                      </div>
                    </div>

                    {/* Navegação Mobile */}
                    <div className="flex-1 overflow-y-auto p-4">
                      <nav className="space-y-1">
                        {navigationItems.map((item) => (
                          <div key={item.title}>
                            {item.subItems ? (
                              <details className="group">
                                <summary className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-accent cursor-pointer list-none">
                                  <div className="flex items-center gap-3">
                                    <item.icon
                                      className={cn("h-5 w-5", item.color)}
                                    />
                                    <span className="font-medium">
                                      {item.title}
                                    </span>
                                  </div>
                                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                                </summary>
                                <div className="ml-9 mt-1 space-y-1">
                                  {item.subItems.map((subItem) => (
                                    <Link
                                      key={subItem.title}
                                      href={subItem.href}
                                      className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-accent text-sm"
                                      onClick={() => setMobileMenuOpen(false)}
                                    >
                                      <subItem.icon className="h-4 w-4 opacity-60" />
                                      {subItem.title}
                                    </Link>
                                  ))}
                                </div>
                              </details>
                            ) : (
                              <Link
                                href={item.href}
                                className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-accent"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <div className="flex items-center gap-3">
                                  <item.icon
                                    className={cn("h-5 w-5", item.color)}
                                  />
                                  <span className="font-medium">
                                    {item.title}
                                  </span>
                                </div>
                                {item.badge && (
                                  <Badge className={item.badgeColor}>
                                    {item.badge}
                                  </Badge>
                                )}
                              </Link>
                            )}
                          </div>
                        ))}
                      </nav>

                      <Separator className="my-6" />

                      {/* Configurações Mobile */}
                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-3"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Settings className="h-5 w-5" />
                          Configurações
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-3"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <HelpCircle className="h-5 w-5" />
                          Ajuda & Suporte
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-3 text-destructive"
                          onClick={signOut}
                        >
                          <LogOut className="h-5 w-5" />
                          Sair
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
}
