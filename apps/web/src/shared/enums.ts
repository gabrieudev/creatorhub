export enum ContentPlatform {
  YOUTUBE = "youtube",
  TIKTOK = "tiktok",
  INSTAGRAM = "instagram",
  TWITCH = "twitch",
  FACEBOOK = "facebook",
  OTHER = "other",
}

export enum ContentStatus {
  IDEA = "idea",
  SCRIPT = "roteiro",
  RECORDING = "gravacao",
  EDITING = "edicao",
  READY = "pronto",
  SCHEDULED = "agendado",
  PUBLISHED = "publicado",
  ARCHIVED = "arquivado",
}

export enum RevenueSource {
  ADS = "ads",
  AFFILIATE = "affiliate",
  PLATFORM = "platform",
  DONATION = "donation",
  CONTRACT = "contract",
  OTHER = "other",
}

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  BLOCKED = "blocked",
  DONE = "done",
  ARCHIVED = "archived",
}

export enum UserStatus {
  ACTIVE = "active",
  INVITED = "invited",
  SUSPENDED = "suspended",
  DELETED = "deleted",
}

export enum InvoiceStatus {
  DRAFT = "draft",
  SENT = "sent",
  PAID = "paid",
  OVERDUE = "overdue",
  CANCELLED = "cancelled",
}

export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
}
