export {};

declare global {
  export interface Organization {
    id: string;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
    timezone: string;
    locale: string;
    currency: string;
    white_label: boolean;
    branding: Record<string, any>;
    billing_info: Record<string, any>;
    settings: Record<string, any>;
  }

  export interface User {
    id: string;
    name: string;
    email: string;
    email_verified?: boolean;
    image?: string;
    last_signin_at?: string;
    status?: UserStatus;
    created_at?: string;
    updated_at?: string;
    profile?: Record<string, any>;
  }

  export interface ContentItem {
    id: string;
    organization_id: string;
    title: string;
    description?: string;
    content_type?: string;
    platform: ContentPlatform;
    external_id?: string;
    status: ContentStatus;
    visibility: string;
    scheduled_at?: string;
    published_at?: string;
    estimated_duration_seconds?: number;
    metadata: Record<string, any>;
    created_by?: string;
    created_at: string;
    updated_at: string;
    revenue?: number;
    tasks?: Task[];
    tags?: Tag[];
  }

  export interface Task {
    id: string;
    organization_id: string;
    content_item_id?: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: number;
    assigned_to?: string;
    due_date?: string;
    started_at?: string;
    completed_at?: string;
    metadata: Record<string, any>;
    created_by?: string;
    created_at: string;
    updated_at: string;
  }

  export interface RevenueEntry {
    id: string;
    organization_id: string;
    content_item_id?: string;
    source: RevenueSource;
    platform: ContentPlatform;
    external_reference?: string;
    amount: number;
    currency: string;
    received_at: string;
    note?: string;
    raw_payload: Record<string, any>;
    created_by?: string;
    created_at: string;
  }

  export interface ContentVersion {
    id: string;
    content_item_id: string;
    version_number: number;
    author_id?: string;
    body?: string;
    attachments: any[];
    created_at: string;
    notes?: string;
  }

  export interface Checklist {
    id: string;
    organization_id: string;
    content_item_id?: string;
    template_id?: string;
    items_state: Record<string, any>;
    created_by?: string;
    created_at: string;
  }

  export interface Comment {
    id: string;
    organization_id: string;
    author_id?: string;
    commentable_type: string;
    commentable_id: string;
    body: string;
    attachments: any[];
    parent_comment_id?: string;
    created_at: string;
    edited_at?: string;
  }

  export interface Team {
    id: string;
    organization_id: string;
    name: string;
    description?: string;
    created_at: string;
  }

  export interface OrganizationMember {
    id: string;
    organization_id: string;
    user_id: string;
    role_id: string | null;
    joined_at: string;
    is_owner: boolean;
    preferences: Record<string, any>;
    fl_active: boolean;
    user: User;
    role?: Role | null;
  }

  export interface Role {
    id: string;
    organization_id: string;
    name: string;
    description?: string;
    is_builtin: boolean;
    created_at: string;
  }

  export interface Tag {
    id: string;
    organization_id: string;
    name: string;
  }

  export interface Asset {
    id: string;
    organization_id: string;
    filename: string;
    mime_type?: string;
    file_size?: number;
    storage: Record<string, any>;
    created_by?: string;
    created_at: string;
    metadata: Record<string, any>;
  }

  export interface Invoice {
    id: string;
    organization_id: string;
    contact_id?: string;
    invoice_number?: string;
    status: InvoiceStatus;
    issued_at: string;
    due_date?: string;
    currency: string;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    items: string[];
    metadata: Record<string, any>;
    created_by?: string;
    created_at: string;
  }

  export interface Contract {
    id: string;
    organization_id: string;
    contact_id?: string;
    proposal_id?: string;
    title?: string;
    status: string;
    start_date?: string;
    end_date?: string;
    signed_at?: string;
    sign_metadata?: Record<string, any>;
    amount?: number;
    currency: string;
    document_id?: string;
    created_by?: string;
    created_at: string;
  }

  export interface DashboardStats {
    totalRevenue: number;
    monthlyRevenue: number;
    activeContent: number;
    pendingTasks: number;
    teamMembers: number;
    upcomingPublications: number;
    revenueGrowth: number;
    taskCompletion: number;
  }

  export interface RevenueByPlatform {
    platform: ContentPlatform;
    amount: number;
    percentage: number;
    growth: number;
  }

  export interface ContentPerformance {
    id: string;
    title: string;
    platform: ContentPlatform;
    revenue: number;
    views: number;
    engagement: number;
    status: ContentStatus;
    published_at?: string;
  }

  export interface UpcomingContent {
    id: string;
    title: string;
    platform: ContentPlatform;
    scheduled_at: string;
    status: ContentStatus;
    assigned_to?: string;
  }

  export interface RecentActivity {
    id: string;
    user: string;
    action: string;
    target: string;
    timestamp: string;
    type: "content" | "revenue" | "task" | "system";
  }

  export interface Organization {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    timezone: string;
    locale: string;
    currency: string;
    whiteLabel: boolean;
    branding: Record<string, any>;
    billingInfo: Record<string, any>;
    settings: Record<string, any>;
  }

  export interface PendingTask {
    id: string;
    title: string;
    status: "todo" | "in_progress" | "blocked" | "done" | "archived";
    priority: number;
    due_date: string | null;
    assigned_to: {
      id: string;
      name: string;
    } | null;
    content_item: {
      id: string;
      title: string;
    } | null;
  }

  export interface RevenueTrend {
    period: string;
    revenue: number;
    growth: number | null;
  }

  export interface TasksDistribution {
    todo: number;
    in_progress: number;
    blocked: number;
    done: number;
    archived: number;
  }

  export interface ContentByStatus {
    idea: number;
    roteiro: number;
    gravacao: number;
    edicao: number;
    pronto: number;
    agendado: number;
    publicado: number;
    arquivado: number;
  }
}
