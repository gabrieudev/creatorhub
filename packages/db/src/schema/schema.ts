import { pgTable, pgSchema, index, unique, text, boolean, timestamp, jsonb, foreignKey, uuid, char, uniqueIndex, integer, bigint, smallint, check, numeric, date, bigserial, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const app = pgSchema("app");
export const contentPlatformInApp = app.enum("content_platform", ['youtube', 'tiktok', 'instagram', 'twitch', 'facebook', 'other'])
export const contentStatusInApp = app.enum("content_status", ['idea', 'roteiro', 'gravacao', 'edicao', 'pronto', 'agendado', 'publicado', 'arquivado'])
export const contractStatusInApp = app.enum("contract_status", ['draft', 'sent', 'signed', 'active', 'expired', 'cancelled'])
export const invoiceStatusInApp = app.enum("invoice_status", ['draft', 'sent', 'paid', 'overdue', 'cancelled'])
export const paymentStatusInApp = app.enum("payment_status", ['pending', 'completed', 'failed', 'refunded'])
export const revenueSourceInApp = app.enum("revenue_source", ['ads', 'affiliate', 'platform', 'donation', 'contract', 'other'])
export const taskStatusInApp = app.enum("task_status", ['todo', 'in_progress', 'blocked', 'done', 'archived'])
export const userStatusInApp = app.enum("user_status", ['active', 'invited', 'suspended', 'deleted'])


export const usersInApp = app.table("users", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").default(false),
	image: text(),
	lastSigninAt: timestamp("last_signin_at", { withTimezone: true, mode: 'string' }),
	status: userStatusInApp().default('active'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	profile: jsonb().default({}),
}, (table) => [
	index("idx_users_email").using("btree", sql`lower(email)`),
	index("idx_users_last_signin_at").using("btree", table.lastSigninAt.asc().nullsLast().op("timestamptz_ops")),
	unique("users_email_key").on(table.email),
]);

export const sessionInApp = app.table("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
}, (table) => [
	index("session_userid_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersInApp.id],
			name: "session_user_id_fkey"
		}).onDelete("cascade"),
	unique("session_token_key").on(table.token),
]);

export const accountInApp = app.table("account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true, mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true, mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("account_userid_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersInApp.id],
			name: "account_user_id_fkey"
		}).onDelete("cascade"),
]);

export const verificationInApp = app.table("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("verification_identifier_idx").using("btree", table.identifier.asc().nullsLast().op("text_ops")),
]);

export const mfaMethodsInApp = app.table("mfa_methods", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	methodType: text("method_type").notNull(),
	data: jsonb().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	lastUsedAt: timestamp("last_used_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_mfa_user").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersInApp.id],
			name: "mfa_methods_user_id_fkey"
		}).onDelete("cascade"),
]);

export const rolesInApp = app.table("roles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	name: text().notNull(),
	description: text(),
	isBuiltin: boolean("is_builtin").default(false),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_roles_org_name").using("btree", sql`organization_id`, sql`lower(name)`),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "roles_organization_id_fkey"
		}).onDelete("cascade"),
]);

export const organizationsInApp = app.table("organizations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	timezone: text().default('UTC'),
	locale: text().default('pt_BR'),
	currency: char({ length: 3 }).default('BRL'),
	whiteLabel: boolean("white_label").default(false),
	branding: jsonb().default({}),
	billingInfo: jsonb("billing_info").default({}),
	settings: jsonb().default({}),
}, (table) => [
	index("idx_organizations_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_organizations_slug").using("btree", sql`lower(slug)`),
	unique("organizations_slug_key").on(table.slug),
]);

export const permissionsInApp = app.table("permissions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	code: text().notNull(),
	description: text(),
}, (table) => [
	unique("permissions_code_key").on(table.code),
]);

export const organizationMembersInApp = app.table("organization_members", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	userId: text("user_id").notNull(),
	roleId: uuid("role_id"),
	joinedAt: timestamp("joined_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	isOwner: boolean("is_owner").default(false),
	preferences: jsonb().default({}),
	flActive: boolean("fl_active").default(true),
}, (table) => [
	index("idx_org_members_is_owner").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops"), table.isOwner.asc().nullsLast().op("uuid_ops")),
	index("idx_org_members_organization").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
	index("idx_org_members_role").using("btree", table.roleId.asc().nullsLast().op("uuid_ops")),
	index("idx_org_members_user").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "organization_members_organization_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersInApp.id],
			name: "organization_members_user_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [rolesInApp.id],
			name: "organization_members_role_id_fkey"
		}),
	unique("organization_members_organization_id_user_id_key").on(table.organizationId, table.userId),
]);

export const teamsInApp = app.table("teams", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	name: text().notNull(),
	description: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	uniqueIndex("idx_teams_org_name").using("btree", sql`organization_id`, sql`lower(name)`),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "teams_organization_id_fkey"
		}).onDelete("cascade"),
]);

export const contentItemsInApp = app.table("content_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	title: text().notNull(),
	description: text(),
	contentType: text("content_type"),
	platform: contentPlatformInApp(),
	externalId: text("external_id"),
	status: contentStatusInApp().default('idea'),
	visibility: text().default('private'),
	scheduledAt: timestamp("scheduled_at", { withTimezone: true, mode: 'string' }),
	publishedAt: timestamp("published_at", { withTimezone: true, mode: 'string' }),
	estimatedDurationSeconds: integer("estimated_duration_seconds"),
	metadata: jsonb().default({}),
	createdBy: text("created_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_content_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_content_org_platform").using("btree", table.organizationId.asc().nullsLast().op("enum_ops"), table.platform.asc().nullsLast().op("uuid_ops")),
	index("idx_content_org_status").using("btree", table.organizationId.asc().nullsLast().op("enum_ops"), table.status.asc().nullsLast().op("enum_ops")),
	index("idx_content_org_title_trgm").using("gin", sql`to_tsvector('portuguese'::regconfig, title)`),
	index("idx_content_published_at").using("btree", table.publishedAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_content_scheduled_at").using("btree", table.scheduledAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "content_items_organization_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [usersInApp.id],
			name: "content_items_created_by_fkey"
		}),
]);

export const contentVersionsInApp = app.table("content_versions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	contentItemId: uuid("content_item_id").notNull(),
	versionNumber: integer("version_number").notNull(),
	authorId: text("author_id"),
	body: text(),
	attachments: jsonb().default([]),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	notes: text(),
}, (table) => [
	index("idx_content_versions_item").using("btree", table.contentItemId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.contentItemId],
			foreignColumns: [contentItemsInApp.id],
			name: "content_versions_content_item_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [usersInApp.id],
			name: "content_versions_author_id_fkey"
		}),
	unique("content_versions_content_item_id_version_number_key").on(table.contentItemId, table.versionNumber),
]);

export const assetsInApp = app.table("assets", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	filename: text().notNull(),
	mimeType: text("mime_type"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	fileSize: bigint("file_size", { mode: "number" }),
	storage: jsonb().notNull(),
	createdBy: text("created_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	metadata: jsonb().default({}),
}, (table) => [
	index("idx_assets_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_assets_metadata_gin").using("gin", table.metadata.asc().nullsLast().op("jsonb_path_ops")),
	index("idx_assets_org").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
	index("idx_assets_storage_gin").using("gin", table.storage.asc().nullsLast().op("jsonb_path_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "assets_organization_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [usersInApp.id],
			name: "assets_created_by_fkey"
		}),
]);

export const assetVersionsInApp = app.table("asset_versions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	assetId: uuid("asset_id").notNull(),
	versionNumber: integer("version_number").notNull(),
	storage: jsonb().notNull(),
	checksum: text(),
	createdBy: text("created_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	notes: text(),
}, (table) => [
	index("idx_asset_versions_asset").using("btree", table.assetId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.assetId],
			foreignColumns: [assetsInApp.id],
			name: "asset_versions_asset_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [usersInApp.id],
			name: "asset_versions_created_by_fkey"
		}),
	unique("asset_versions_asset_id_version_number_key").on(table.assetId, table.versionNumber),
]);

export const checklistTemplatesInApp = app.table("checklist_templates", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	name: text().notNull(),
	description: text(),
	defaultForContentType: text("default_for_content_type"),
	items: jsonb().notNull(),
	createdBy: text("created_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_checklist_templates_org").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "checklist_templates_organization_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [usersInApp.id],
			name: "checklist_templates_created_by_fkey"
		}),
]);

export const checklistsInApp = app.table("checklists", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	contentItemId: uuid("content_item_id"),
	templateId: uuid("template_id"),
	itemsState: jsonb("items_state").notNull(),
	createdBy: text("created_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_checklists_content").using("btree", table.contentItemId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "checklists_organization_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.contentItemId],
			foreignColumns: [contentItemsInApp.id],
			name: "checklists_content_item_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.templateId],
			foreignColumns: [checklistTemplatesInApp.id],
			name: "checklists_template_id_fkey"
		}),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [usersInApp.id],
			name: "checklists_created_by_fkey"
		}),
]);

export const tasksInApp = app.table("tasks", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	contentItemId: uuid("content_item_id"),
	title: text().notNull(),
	description: text(),
	status: taskStatusInApp().default('todo'),
	priority: smallint().default(0),
	assignedTo: uuid("assigned_to"),
	dueDate: timestamp("due_date", { withTimezone: true, mode: 'string' }),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }),
	completedAt: timestamp("completed_at", { withTimezone: true, mode: 'string' }),
	metadata: jsonb().default({}),
	createdBy: text("created_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_tasks_assigned_to").using("btree", table.assignedTo.asc().nullsLast().op("uuid_ops")),
	index("idx_tasks_due_date").using("btree", table.dueDate.asc().nullsLast().op("timestamptz_ops")),
	index("idx_tasks_org_status").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops"), table.status.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "tasks_organization_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.contentItemId],
			foreignColumns: [contentItemsInApp.id],
			name: "tasks_content_item_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.assignedTo],
			foreignColumns: [organizationMembersInApp.id],
			name: "tasks_assigned_to_fkey"
		}),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [usersInApp.id],
			name: "tasks_created_by_fkey"
		}),
]);

export const commentsInApp = app.table("comments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	authorId: text("author_id"),
	commentableType: text("commentable_type").notNull(),
	commentableId: uuid("commentable_id").notNull(),
	body: text().notNull(),
	attachments: jsonb().default([]),
	parentCommentId: uuid("parent_comment_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	editedAt: timestamp("edited_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_comments_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_comments_lookup").using("btree", table.commentableType.asc().nullsLast().op("uuid_ops"), table.commentableId.asc().nullsLast().op("text_ops")),
	index("idx_comments_org").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "comments_organization_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [usersInApp.id],
			name: "comments_author_id_fkey"
		}),
	foreignKey({
			columns: [table.parentCommentId],
			foreignColumns: [table.id],
			name: "comments_parent_comment_id_fkey"
		}).onDelete("cascade"),
]);

export const revenueTagsInApp = app.table("revenue_tags", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	name: text().notNull(),
	color: text(),
}, (table) => [
	index("idx_revenue_tags_org").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("revenue_tags_unique_org_name").using("btree", sql`organization_id`, sql`lower(name)`),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "revenue_tags_organization_id_fkey"
		}).onDelete("cascade"),
]);

export const splitRulesInApp = app.table("split_rules", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	name: text().notNull(),
	description: text(),
	conditions: jsonb().default({}),
	allocations: jsonb().notNull(),
	isDefault: boolean("is_default").default(false),
	createdBy: text("created_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_split_rules_is_default").using("btree", table.organizationId.asc().nullsLast().op("bool_ops"), table.isDefault.asc().nullsLast().op("bool_ops")),
	index("idx_split_rules_org").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "split_rules_organization_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [usersInApp.id],
			name: "split_rules_created_by_fkey"
		}),
]);

export const revenueAllocationsInApp = app.table("revenue_allocations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	revenueEntryId: uuid("revenue_entry_id").notNull(),
	payeeMemberId: uuid("payee_member_id"),
	payeeDetails: jsonb("payee_details"),
	allocationType: text("allocation_type").notNull(),
	allocationValue: numeric("allocation_value", { precision: 14, scale:  6 }).notNull(),
	amountAllocated: numeric("amount_allocated", { precision: 14, scale:  2 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_revenue_allocations_entry").using("btree", table.revenueEntryId.asc().nullsLast().op("uuid_ops")),
	index("idx_revenue_allocations_payee").using("btree", table.payeeMemberId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.revenueEntryId],
			foreignColumns: [revenueEntriesInApp.id],
			name: "revenue_allocations_revenue_entry_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.payeeMemberId],
			foreignColumns: [organizationMembersInApp.id],
			name: "revenue_allocations_payee_member_id_fkey"
		}),
	check("revenue_allocations_amount_allocated_check", sql`amount_allocated >= (0)::numeric`),
]);

export const forecastsInApp = app.table("forecasts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	contentItemId: uuid("content_item_id"),
	periodStart: date("period_start").notNull(),
	periodEnd: date("period_end").notNull(),
	predictedAmount: numeric("predicted_amount", { precision: 14, scale:  2 }).notNull(),
	modelMetadata: jsonb("model_metadata"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_forecasts_period").using("btree", table.organizationId.asc().nullsLast().op("date_ops"), table.periodStart.asc().nullsLast().op("uuid_ops"), table.periodEnd.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("idx_forecasts_unique").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops"), table.contentItemId.asc().nullsLast().op("date_ops"), table.periodStart.asc().nullsLast().op("uuid_ops"), table.periodEnd.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "forecasts_organization_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.contentItemId],
			foreignColumns: [contentItemsInApp.id],
			name: "forecasts_content_item_id_fkey"
		}),
]);

export const contactsInApp = app.table("contacts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	name: text().notNull(),
	email: text(),
	phone: text(),
	company: text(),
	address: jsonb(),
	metadata: jsonb().default({}),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_contacts_email").using("btree", sql`lower(email)`),
	index("idx_contacts_org").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "contacts_organization_id_fkey"
		}).onDelete("cascade"),
]);

export const invoicesInApp = app.table("invoices", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	contactId: uuid("contact_id"),
	invoiceNumber: text("invoice_number"),
	status: invoiceStatusInApp().default('draft'),
	issuedAt: timestamp("issued_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	dueDate: date("due_date"),
	currency: char({ length: 3 }).default('BRL'),
	subtotal: numeric({ precision: 14, scale:  2 }).default('0'),
	tax: numeric({ precision: 14, scale:  2 }).default('0'),
	discount: numeric({ precision: 14, scale:  2 }).default('0'),
	total: numeric({ precision: 14, scale:  2 }).default('0'),
	items: uuid().array().default([""]),
	metadata: jsonb().default({}),
	createdBy: text("created_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_invoices_issued_at").using("btree", table.issuedAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_invoices_number_org").using("btree", table.organizationId.asc().nullsLast().op("text_ops"), table.invoiceNumber.asc().nullsLast().op("text_ops")),
	index("idx_invoices_org").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "invoices_organization_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.contactId],
			foreignColumns: [contactsInApp.id],
			name: "invoices_contact_id_fkey"
		}),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [usersInApp.id],
			name: "invoices_created_by_fkey"
		}),
	check("invoices_total_check", sql`total >= (0)::numeric`),
]);

export const gatewaysInApp = app.table("gateways", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	provider: text().notNull(),
	credentials: jsonb().notNull(),
	config: jsonb().default({}),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_gateways_credentials_gin").using("gin", table.credentials.asc().nullsLast().op("jsonb_ops")),
	index("idx_gateways_org_provider").using("btree", table.organizationId.asc().nullsLast().op("text_ops"), table.provider.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "gateways_organization_id_fkey"
		}).onDelete("cascade"),
]);

export const invoiceItemsInApp = app.table("invoice_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	description: text(),
	quantity: numeric({ precision: 12, scale:  2 }).default('1'),
	unitPrice: numeric("unit_price", { precision: 14, scale:  2 }).notNull(),
	total: numeric({ precision: 14, scale:  2 }).generatedAlwaysAs(sql`(quantity * unit_price)`),
}, (table) => [
	index("idx_invoice_items_total").using("btree", table.total.asc().nullsLast().op("numeric_ops")),
]);

export const gatewayTransactionsInApp = app.table("gateway_transactions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	gatewayId: uuid("gateway_id"),
	organizationId: uuid("organization_id").notNull(),
	externalId: text("external_id"),
	type: text(),
	amount: numeric({ precision: 14, scale:  2 }),
	currency: char({ length: 3 }).default('BRL'),
	status: paymentStatusInApp().default('pending'),
	fees: numeric({ precision: 14, scale:  2 }).default('0'),
	rawPayload: jsonb("raw_payload").default({}),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_gateway_transactions_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_gateway_transactions_external").using("btree", table.externalId.asc().nullsLast().op("text_ops")),
	index("idx_gateway_transactions_org").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
	index("idx_gateway_transactions_raw_gin").using("gin", table.rawPayload.asc().nullsLast().op("jsonb_ops")),
	foreignKey({
			columns: [table.gatewayId],
			foreignColumns: [gatewaysInApp.id],
			name: "gateway_transactions_gateway_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "gateway_transactions_organization_id_fkey"
		}).onDelete("cascade"),
]);

export const invoicePaymentsInApp = app.table("invoice_payments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	invoiceId: uuid("invoice_id").notNull(),
	gatewayTransactionId: uuid("gateway_transaction_id"),
	amount: numeric({ precision: 14, scale:  2 }).notNull(),
	currency: char({ length: 3 }).default('BRL'),
	paidAt: timestamp("paid_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	status: paymentStatusInApp().default('completed'),
	rawPayload: jsonb("raw_payload").default({}),
}, (table) => [
	index("idx_invoice_payments_invoice").using("btree", table.invoiceId.asc().nullsLast().op("uuid_ops")),
	index("idx_invoice_payments_paid_at").using("btree", table.paidAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_invoice_payments_raw_gin").using("gin", table.rawPayload.asc().nullsLast().op("jsonb_ops")),
	foreignKey({
			columns: [table.invoiceId],
			foreignColumns: [invoicesInApp.id],
			name: "invoice_payments_invoice_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.gatewayTransactionId],
			foreignColumns: [gatewayTransactionsInApp.id],
			name: "invoice_payments_gateway_transaction_id_fkey"
		}),
]);

export const payoutsInApp = app.table("payouts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	reference: text(),
	recipient: jsonb(),
	amount: numeric({ precision: 14, scale:  2 }).notNull(),
	currency: char({ length: 3 }).default('BRL'),
	fees: numeric({ precision: 14, scale:  2 }).default('0'),
	status: paymentStatusInApp().default('pending'),
	executedAt: timestamp("executed_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_payouts_executed_at").using("btree", table.executedAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_payouts_org").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
	index("idx_payouts_status").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "payouts_organization_id_fkey"
		}).onDelete("cascade"),
]);

export const proposalsInApp = app.table("proposals", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	contactId: uuid("contact_id"),
	number: text(),
	title: text(),
	body: text(),
	amount: numeric({ precision: 14, scale:  2 }),
	currency: char({ length: 3 }).default('BRL'),
	status: text().default('draft'),
	createdBy: text("created_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_proposals_number").using("btree", table.organizationId.asc().nullsLast().op("text_ops"), table.number.asc().nullsLast().op("text_ops")),
	index("idx_proposals_org").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "proposals_organization_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.contactId],
			foreignColumns: [contactsInApp.id],
			name: "proposals_contact_id_fkey"
		}),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [usersInApp.id],
			name: "proposals_created_by_fkey"
		}),
]);

export const documentsInApp = app.table("documents", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	name: text().notNull(),
	description: text(),
	storage: jsonb().notNull(),
	createdBy: text("created_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_documents_org").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
	index("idx_documents_storage_gin").using("gin", table.storage.asc().nullsLast().op("jsonb_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "documents_organization_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [usersInApp.id],
			name: "documents_created_by_fkey"
		}),
]);

export const documentVersionsInApp = app.table("document_versions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	documentId: uuid("document_id").notNull(),
	versionNumber: integer("version_number").notNull(),
	storage: jsonb().notNull(),
	createdBy: text("created_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	notes: text(),
}, (table) => [
	index("idx_document_versions_document").using("btree", table.documentId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.documentId],
			foreignColumns: [documentsInApp.id],
			name: "document_versions_document_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [usersInApp.id],
			name: "document_versions_created_by_fkey"
		}),
	unique("document_versions_document_id_version_number_key").on(table.documentId, table.versionNumber),
]);

export const contractsInApp = app.table("contracts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	contactId: uuid("contact_id"),
	proposalId: uuid("proposal_id"),
	title: text(),
	status: contractStatusInApp().default('draft'),
	startDate: date("start_date"),
	endDate: date("end_date"),
	signedAt: timestamp("signed_at", { withTimezone: true, mode: 'string' }),
	signMetadata: jsonb("sign_metadata"),
	amount: numeric({ precision: 14, scale:  2 }),
	currency: char({ length: 3 }).default('BRL'),
	documentId: uuid("document_id"),
	createdBy: text("created_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_contracts_org").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
	index("idx_contracts_signed_at").using("btree", table.signedAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_contracts_status").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "contracts_organization_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.contactId],
			foreignColumns: [contactsInApp.id],
			name: "contracts_contact_id_fkey"
		}),
	foreignKey({
			columns: [table.proposalId],
			foreignColumns: [proposalsInApp.id],
			name: "contracts_proposal_id_fkey"
		}),
	foreignKey({
			columns: [table.documentId],
			foreignColumns: [documentsInApp.id],
			name: "contracts_document_id_fkey"
		}),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [usersInApp.id],
			name: "contracts_created_by_fkey"
		}),
]);

export const templatesInApp = app.table("templates", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	name: text().notNull(),
	type: text(),
	content: text(),
	metadata: jsonb().default({}),
	createdBy: text("created_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_templates_org").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
	index("idx_templates_type").using("btree", table.type.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "templates_organization_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [usersInApp.id],
			name: "templates_created_by_fkey"
		}),
]);

export const automationsInApp = app.table("automations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	name: text(),
	trigger: jsonb().notNull(),
	actions: jsonb().notNull(),
	enabled: boolean().default(true),
	createdBy: text("created_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_automations_org_enabled").using("btree", table.organizationId.asc().nullsLast().op("bool_ops"), table.enabled.asc().nullsLast().op("bool_ops")),
	index("idx_automations_trigger_gin").using("gin", table.trigger.asc().nullsLast().op("jsonb_ops")),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [usersInApp.id],
			name: "automations_created_by_fkey"
		}),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "automations_organization_id_fkey"
		}).onDelete("cascade"),
]);

export const notificationsInApp = app.table("notifications", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	userId: text("user_id"),
	channel: text(),
	payload: jsonb(),
	delivered: boolean().default(false),
	deliveredAt: timestamp("delivered_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_notifications_delivered").using("btree", table.delivered.asc().nullsLast().op("bool_ops")),
	index("idx_notifications_org").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
	index("idx_notifications_user").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "notifications_organization_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [usersInApp.id],
			name: "notifications_user_id_fkey"
		}),
]);

export const exportsInApp = app.table("exports", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	type: text(),
	parameters: jsonb(),
	generatedBy: text("generated_by"),
	storage: jsonb(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_exports_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_exports_org").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "exports_organization_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.generatedBy],
			foreignColumns: [usersInApp.id],
			name: "exports_generated_by_fkey"
		}),
]);

export const auditLogInApp = app.table("audit_log", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	organizationId: uuid("organization_id"),
	actorUserId: uuid("actor_user_id"),
	tableName: text("table_name").notNull(),
	recordId: uuid("record_id"),
	action: text().notNull(),
	beforeData: jsonb("before_data"),
	afterData: jsonb("after_data"),
	diff: jsonb(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_audit_actor").using("btree", table.actorUserId.asc().nullsLast().op("uuid_ops")),
	index("idx_audit_after_gin").using("gin", table.afterData.asc().nullsLast().op("jsonb_ops")),
	index("idx_audit_before_gin").using("gin", table.beforeData.asc().nullsLast().op("jsonb_ops")),
	index("idx_audit_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_audit_diff_gin").using("gin", table.diff.asc().nullsLast().op("jsonb_ops")),
	index("idx_audit_org").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
	index("idx_audit_record").using("btree", table.recordId.asc().nullsLast().op("uuid_ops")),
	index("idx_audit_table").using("btree", table.tableName.asc().nullsLast().op("text_ops")),
]);

export const subscriptionPlansInApp = app.table("subscription_plans", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id"),
	name: text().notNull(),
	sku: text(),
	priceMonthly: numeric("price_monthly", { precision: 12, scale:  2 }),
	priceAnnual: numeric("price_annual", { precision: 12, scale:  2 }),
	features: jsonb(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_subscription_plans_org").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "subscription_plans_organization_id_fkey"
		}),
]);

export const subscriptionsInApp = app.table("subscriptions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	planId: uuid("plan_id"),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	renewedAt: timestamp("renewed_at", { withTimezone: true, mode: 'string' }),
	canceledAt: timestamp("canceled_at", { withTimezone: true, mode: 'string' }),
	status: text().default('active'),
	billingMetadata: jsonb("billing_metadata"),
}, (table) => [
	index("idx_subscriptions_org").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
	index("idx_subscriptions_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "subscriptions_organization_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.planId],
			foreignColumns: [subscriptionPlansInApp.id],
			name: "subscriptions_plan_id_fkey"
		}),
]);

export const settingsInApp = app.table("settings", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id"),
	key: text().notNull(),
	value: jsonb(),
}, (table) => [
	index("idx_settings_org_key").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops"), table.key.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "settings_organization_id_fkey"
		}).onDelete("cascade"),
	unique("settings_organization_id_key_key").on(table.organizationId, table.key),
]);

export const tagsInApp = app.table("tags", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	name: text().notNull(),
}, (table) => [
	index("idx_tags_org_name").using("btree", sql`organization_id`, sql`lower(name)`),
	uniqueIndex("tags_unique_org_name").using("btree", sql`organization_id`, sql`lower(name)`),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "tags_organization_id_fkey"
		}).onDelete("cascade"),
]);

export const revenueEntriesInApp = app.table("revenue_entries", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: uuid("organization_id").notNull(),
	contentItemId: uuid("content_item_id"),
	source: revenueSourceInApp().default('other'),
	platform: contentPlatformInApp(),
	externalReference: text("external_reference"),
	amount: numeric({ precision: 14, scale:  2 }).notNull(),
	currency: char({ length: 3 }).default('BRL'),
	receivedAt: timestamp("received_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	note: text(),
	rawPayload: jsonb("raw_payload").default({}),
	createdBy: text("created_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_revenue_amount").using("btree", table.amount.asc().nullsLast().op("numeric_ops")),
	index("idx_revenue_content").using("btree", table.contentItemId.asc().nullsLast().op("uuid_ops")),
	index("idx_revenue_org").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
	index("idx_revenue_raw_payload_gin").using("gin", table.rawPayload.asc().nullsLast().op("jsonb_ops")),
	index("idx_revenue_received_at").using("btree", table.receivedAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizationsInApp.id],
			name: "revenue_entries_organization_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.contentItemId],
			foreignColumns: [contentItemsInApp.id],
			name: "revenue_entries_content_item_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [usersInApp.id],
			name: "revenue_entries_created_by_fkey"
		}),
	check("revenue_entries_amount_check", sql`amount >= (0)::numeric`),
	check("revenue_positive", sql`amount >= (0)::numeric`),
]);

export const rolePermissionsInApp = app.table("role_permissions", {
	roleId: uuid("role_id").notNull(),
	permissionId: uuid("permission_id").notNull(),
}, (table) => [
	index("idx_role_permissions_role").using("btree", table.roleId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [rolesInApp.id],
			name: "role_permissions_role_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.permissionId],
			foreignColumns: [permissionsInApp.id],
			name: "role_permissions_permission_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.roleId, table.permissionId], name: "role_permissions_pkey"}),
]);

export const revenueEntryTagsInApp = app.table("revenue_entry_tags", {
	revenueEntryId: uuid("revenue_entry_id").notNull(),
	tagId: uuid("tag_id").notNull(),
}, (table) => [
	index("idx_revenue_entry_tags_tag").using("btree", table.tagId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.revenueEntryId],
			foreignColumns: [revenueEntriesInApp.id],
			name: "revenue_entry_tags_revenue_entry_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [revenueTagsInApp.id],
			name: "revenue_entry_tags_tag_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.revenueEntryId, table.tagId], name: "revenue_entry_tags_pkey"}),
]);

export const contentTagsInApp = app.table("content_tags", {
	contentItemId: uuid("content_item_id").notNull(),
	tagId: uuid("tag_id").notNull(),
}, (table) => [
	index("idx_content_tags_tag").using("btree", table.tagId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.contentItemId],
			foreignColumns: [contentItemsInApp.id],
			name: "content_tags_content_item_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [tagsInApp.id],
			name: "content_tags_tag_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.contentItemId, table.tagId], name: "content_tags_pkey"}),
]);

export const teamMembersInApp = app.table("team_members", {
	teamId: uuid("team_id").notNull(),
	memberId: uuid("member_id").notNull(),
	roleInTeam: text("role_in_team"),
}, (table) => [
	index("idx_team_members_member_id").using("btree", table.memberId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [teamsInApp.id],
			name: "team_members_team_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.memberId],
			foreignColumns: [organizationMembersInApp.id],
			name: "team_members_member_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.teamId, table.memberId], name: "team_members_pkey"}),
]);
