import { relations } from "drizzle-orm/relations";
import { usersInApp, sessionInApp, accountInApp, mfaMethodsInApp, organizationsInApp, rolesInApp, organizationMembersInApp, teamsInApp, contentItemsInApp, contentVersionsInApp, assetsInApp, assetVersionsInApp, checklistTemplatesInApp, checklistsInApp, tasksInApp, commentsInApp, revenueTagsInApp, splitRulesInApp, revenueEntriesInApp, revenueAllocationsInApp, forecastsInApp, contactsInApp, invoicesInApp, gatewaysInApp, gatewayTransactionsInApp, invoicePaymentsInApp, payoutsInApp, proposalsInApp, documentsInApp, documentVersionsInApp, contractsInApp, templatesInApp, automationsInApp, notificationsInApp, exportsInApp, subscriptionPlansInApp, subscriptionsInApp, settingsInApp, tagsInApp, rolePermissionsInApp, permissionsInApp, revenueEntryTagsInApp, contentTagsInApp, teamMembersInApp } from "./schema";

export const sessionInAppRelations = relations(sessionInApp, ({one}) => ({
	usersInApp: one(usersInApp, {
		fields: [sessionInApp.userId],
		references: [usersInApp.id]
	}),
}));

export const usersInAppRelations = relations(usersInApp, ({many}) => ({
	sessionInApps: many(sessionInApp),
	accountInApps: many(accountInApp),
	mfaMethodsInApps: many(mfaMethodsInApp),
	organizationMembersInApps: many(organizationMembersInApp),
	contentItemsInApps: many(contentItemsInApp),
	contentVersionsInApps: many(contentVersionsInApp),
	assetsInApps: many(assetsInApp),
	assetVersionsInApps: many(assetVersionsInApp),
	checklistTemplatesInApps: many(checklistTemplatesInApp),
	checklistsInApps: many(checklistsInApp),
	tasksInApps: many(tasksInApp),
	commentsInApps: many(commentsInApp),
	splitRulesInApps: many(splitRulesInApp),
	invoicesInApps: many(invoicesInApp),
	proposalsInApps: many(proposalsInApp),
	documentsInApps: many(documentsInApp),
	documentVersionsInApps: many(documentVersionsInApp),
	contractsInApps: many(contractsInApp),
	templatesInApps: many(templatesInApp),
	automationsInApps: many(automationsInApp),
	notificationsInApps: many(notificationsInApp),
	exportsInApps: many(exportsInApp),
	revenueEntriesInApps: many(revenueEntriesInApp),
}));

export const accountInAppRelations = relations(accountInApp, ({one}) => ({
	usersInApp: one(usersInApp, {
		fields: [accountInApp.userId],
		references: [usersInApp.id]
	}),
}));

export const mfaMethodsInAppRelations = relations(mfaMethodsInApp, ({one}) => ({
	usersInApp: one(usersInApp, {
		fields: [mfaMethodsInApp.userId],
		references: [usersInApp.id]
	}),
}));

export const rolesInAppRelations = relations(rolesInApp, ({one, many}) => ({
	organizationsInApp: one(organizationsInApp, {
		fields: [rolesInApp.organizationId],
		references: [organizationsInApp.id]
	}),
	organizationMembersInApps: many(organizationMembersInApp),
	rolePermissionsInApps: many(rolePermissionsInApp),
}));

export const organizationsInAppRelations = relations(organizationsInApp, ({many}) => ({
	rolesInApps: many(rolesInApp),
	organizationMembersInApps: many(organizationMembersInApp),
	teamsInApps: many(teamsInApp),
	contentItemsInApps: many(contentItemsInApp),
	assetsInApps: many(assetsInApp),
	checklistTemplatesInApps: many(checklistTemplatesInApp),
	checklistsInApps: many(checklistsInApp),
	tasksInApps: many(tasksInApp),
	commentsInApps: many(commentsInApp),
	revenueTagsInApps: many(revenueTagsInApp),
	splitRulesInApps: many(splitRulesInApp),
	forecastsInApps: many(forecastsInApp),
	contactsInApps: many(contactsInApp),
	invoicesInApps: many(invoicesInApp),
	gatewaysInApps: many(gatewaysInApp),
	gatewayTransactionsInApps: many(gatewayTransactionsInApp),
	payoutsInApps: many(payoutsInApp),
	proposalsInApps: many(proposalsInApp),
	documentsInApps: many(documentsInApp),
	contractsInApps: many(contractsInApp),
	templatesInApps: many(templatesInApp),
	automationsInApps: many(automationsInApp),
	notificationsInApps: many(notificationsInApp),
	exportsInApps: many(exportsInApp),
	subscriptionPlansInApps: many(subscriptionPlansInApp),
	subscriptionsInApps: many(subscriptionsInApp),
	settingsInApps: many(settingsInApp),
	tagsInApps: many(tagsInApp),
	revenueEntriesInApps: many(revenueEntriesInApp),
}));

export const organizationMembersInAppRelations = relations(organizationMembersInApp, ({one, many}) => ({
	organizationsInApp: one(organizationsInApp, {
		fields: [organizationMembersInApp.organizationId],
		references: [organizationsInApp.id]
	}),
	usersInApp: one(usersInApp, {
		fields: [organizationMembersInApp.userId],
		references: [usersInApp.id]
	}),
	rolesInApp: one(rolesInApp, {
		fields: [organizationMembersInApp.roleId],
		references: [rolesInApp.id]
	}),
	tasksInApps: many(tasksInApp),
	revenueAllocationsInApps: many(revenueAllocationsInApp),
	teamMembersInApps: many(teamMembersInApp),
}));

export const teamsInAppRelations = relations(teamsInApp, ({one, many}) => ({
	organizationsInApp: one(organizationsInApp, {
		fields: [teamsInApp.organizationId],
		references: [organizationsInApp.id]
	}),
	teamMembersInApps: many(teamMembersInApp),
}));

export const contentItemsInAppRelations = relations(contentItemsInApp, ({one, many}) => ({
	organizationsInApp: one(organizationsInApp, {
		fields: [contentItemsInApp.organizationId],
		references: [organizationsInApp.id]
	}),
	usersInApp: one(usersInApp, {
		fields: [contentItemsInApp.createdBy],
		references: [usersInApp.id]
	}),
	contentVersionsInApps: many(contentVersionsInApp),
	checklistsInApps: many(checklistsInApp),
	tasksInApps: many(tasksInApp),
	forecastsInApps: many(forecastsInApp),
	revenueEntriesInApps: many(revenueEntriesInApp),
	contentTagsInApps: many(contentTagsInApp),
}));

export const contentVersionsInAppRelations = relations(contentVersionsInApp, ({one}) => ({
	contentItemsInApp: one(contentItemsInApp, {
		fields: [contentVersionsInApp.contentItemId],
		references: [contentItemsInApp.id]
	}),
	usersInApp: one(usersInApp, {
		fields: [contentVersionsInApp.authorId],
		references: [usersInApp.id]
	}),
}));

export const assetsInAppRelations = relations(assetsInApp, ({one, many}) => ({
	organizationsInApp: one(organizationsInApp, {
		fields: [assetsInApp.organizationId],
		references: [organizationsInApp.id]
	}),
	usersInApp: one(usersInApp, {
		fields: [assetsInApp.createdBy],
		references: [usersInApp.id]
	}),
	assetVersionsInApps: many(assetVersionsInApp),
}));

export const assetVersionsInAppRelations = relations(assetVersionsInApp, ({one}) => ({
	assetsInApp: one(assetsInApp, {
		fields: [assetVersionsInApp.assetId],
		references: [assetsInApp.id]
	}),
	usersInApp: one(usersInApp, {
		fields: [assetVersionsInApp.createdBy],
		references: [usersInApp.id]
	}),
}));

export const checklistTemplatesInAppRelations = relations(checklistTemplatesInApp, ({one, many}) => ({
	organizationsInApp: one(organizationsInApp, {
		fields: [checklistTemplatesInApp.organizationId],
		references: [organizationsInApp.id]
	}),
	usersInApp: one(usersInApp, {
		fields: [checklistTemplatesInApp.createdBy],
		references: [usersInApp.id]
	}),
	checklistsInApps: many(checklistsInApp),
}));

export const checklistsInAppRelations = relations(checklistsInApp, ({one}) => ({
	organizationsInApp: one(organizationsInApp, {
		fields: [checklistsInApp.organizationId],
		references: [organizationsInApp.id]
	}),
	contentItemsInApp: one(contentItemsInApp, {
		fields: [checklistsInApp.contentItemId],
		references: [contentItemsInApp.id]
	}),
	checklistTemplatesInApp: one(checklistTemplatesInApp, {
		fields: [checklistsInApp.templateId],
		references: [checklistTemplatesInApp.id]
	}),
	usersInApp: one(usersInApp, {
		fields: [checklistsInApp.createdBy],
		references: [usersInApp.id]
	}),
}));

export const tasksInAppRelations = relations(tasksInApp, ({one}) => ({
	organizationsInApp: one(organizationsInApp, {
		fields: [tasksInApp.organizationId],
		references: [organizationsInApp.id]
	}),
	contentItemsInApp: one(contentItemsInApp, {
		fields: [tasksInApp.contentItemId],
		references: [contentItemsInApp.id]
	}),
	organizationMembersInApp: one(organizationMembersInApp, {
		fields: [tasksInApp.assignedTo],
		references: [organizationMembersInApp.id]
	}),
	usersInApp: one(usersInApp, {
		fields: [tasksInApp.createdBy],
		references: [usersInApp.id]
	}),
}));

export const commentsInAppRelations = relations(commentsInApp, ({one, many}) => ({
	organizationsInApp: one(organizationsInApp, {
		fields: [commentsInApp.organizationId],
		references: [organizationsInApp.id]
	}),
	usersInApp: one(usersInApp, {
		fields: [commentsInApp.authorId],
		references: [usersInApp.id]
	}),
	commentsInApp: one(commentsInApp, {
		fields: [commentsInApp.parentCommentId],
		references: [commentsInApp.id],
		relationName: "commentsInApp_parentCommentId_commentsInApp_id"
	}),
	commentsInApps: many(commentsInApp, {
		relationName: "commentsInApp_parentCommentId_commentsInApp_id"
	}),
}));

export const revenueTagsInAppRelations = relations(revenueTagsInApp, ({one, many}) => ({
	organizationsInApp: one(organizationsInApp, {
		fields: [revenueTagsInApp.organizationId],
		references: [organizationsInApp.id]
	}),
	revenueEntryTagsInApps: many(revenueEntryTagsInApp),
}));

export const splitRulesInAppRelations = relations(splitRulesInApp, ({one}) => ({
	organizationsInApp: one(organizationsInApp, {
		fields: [splitRulesInApp.organizationId],
		references: [organizationsInApp.id]
	}),
	usersInApp: one(usersInApp, {
		fields: [splitRulesInApp.createdBy],
		references: [usersInApp.id]
	}),
}));

export const revenueAllocationsInAppRelations = relations(revenueAllocationsInApp, ({one}) => ({
	revenueEntriesInApp: one(revenueEntriesInApp, {
		fields: [revenueAllocationsInApp.revenueEntryId],
		references: [revenueEntriesInApp.id]
	}),
	organizationMembersInApp: one(organizationMembersInApp, {
		fields: [revenueAllocationsInApp.payeeMemberId],
		references: [organizationMembersInApp.id]
	}),
}));

export const revenueEntriesInAppRelations = relations(revenueEntriesInApp, ({one, many}) => ({
	revenueAllocationsInApps: many(revenueAllocationsInApp),
	organizationsInApp: one(organizationsInApp, {
		fields: [revenueEntriesInApp.organizationId],
		references: [organizationsInApp.id]
	}),
	contentItemsInApp: one(contentItemsInApp, {
		fields: [revenueEntriesInApp.contentItemId],
		references: [contentItemsInApp.id]
	}),
	usersInApp: one(usersInApp, {
		fields: [revenueEntriesInApp.createdBy],
		references: [usersInApp.id]
	}),
	revenueEntryTagsInApps: many(revenueEntryTagsInApp),
}));

export const forecastsInAppRelations = relations(forecastsInApp, ({one}) => ({
	organizationsInApp: one(organizationsInApp, {
		fields: [forecastsInApp.organizationId],
		references: [organizationsInApp.id]
	}),
	contentItemsInApp: one(contentItemsInApp, {
		fields: [forecastsInApp.contentItemId],
		references: [contentItemsInApp.id]
	}),
}));

export const contactsInAppRelations = relations(contactsInApp, ({one, many}) => ({
	organizationsInApp: one(organizationsInApp, {
		fields: [contactsInApp.organizationId],
		references: [organizationsInApp.id]
	}),
	invoicesInApps: many(invoicesInApp),
	proposalsInApps: many(proposalsInApp),
	contractsInApps: many(contractsInApp),
}));

export const invoicesInAppRelations = relations(invoicesInApp, ({one, many}) => ({
	organizationsInApp: one(organizationsInApp, {
		fields: [invoicesInApp.organizationId],
		references: [organizationsInApp.id]
	}),
	contactsInApp: one(contactsInApp, {
		fields: [invoicesInApp.contactId],
		references: [contactsInApp.id]
	}),
	usersInApp: one(usersInApp, {
		fields: [invoicesInApp.createdBy],
		references: [usersInApp.id]
	}),
	invoicePaymentsInApps: many(invoicePaymentsInApp),
}));

export const gatewaysInAppRelations = relations(gatewaysInApp, ({one, many}) => ({
	organizationsInApp: one(organizationsInApp, {
		fields: [gatewaysInApp.organizationId],
		references: [organizationsInApp.id]
	}),
	gatewayTransactionsInApps: many(gatewayTransactionsInApp),
}));

export const gatewayTransactionsInAppRelations = relations(gatewayTransactionsInApp, ({one, many}) => ({
	gatewaysInApp: one(gatewaysInApp, {
		fields: [gatewayTransactionsInApp.gatewayId],
		references: [gatewaysInApp.id]
	}),
	organizationsInApp: one(organizationsInApp, {
		fields: [gatewayTransactionsInApp.organizationId],
		references: [organizationsInApp.id]
	}),
	invoicePaymentsInApps: many(invoicePaymentsInApp),
}));

export const invoicePaymentsInAppRelations = relations(invoicePaymentsInApp, ({one}) => ({
	invoicesInApp: one(invoicesInApp, {
		fields: [invoicePaymentsInApp.invoiceId],
		references: [invoicesInApp.id]
	}),
	gatewayTransactionsInApp: one(gatewayTransactionsInApp, {
		fields: [invoicePaymentsInApp.gatewayTransactionId],
		references: [gatewayTransactionsInApp.id]
	}),
}));

export const payoutsInAppRelations = relations(payoutsInApp, ({one}) => ({
	organizationsInApp: one(organizationsInApp, {
		fields: [payoutsInApp.organizationId],
		references: [organizationsInApp.id]
	}),
}));

export const proposalsInAppRelations = relations(proposalsInApp, ({one, many}) => ({
	organizationsInApp: one(organizationsInApp, {
		fields: [proposalsInApp.organizationId],
		references: [organizationsInApp.id]
	}),
	contactsInApp: one(contactsInApp, {
		fields: [proposalsInApp.contactId],
		references: [contactsInApp.id]
	}),
	usersInApp: one(usersInApp, {
		fields: [proposalsInApp.createdBy],
		references: [usersInApp.id]
	}),
	contractsInApps: many(contractsInApp),
}));

export const documentsInAppRelations = relations(documentsInApp, ({one, many}) => ({
	organizationsInApp: one(organizationsInApp, {
		fields: [documentsInApp.organizationId],
		references: [organizationsInApp.id]
	}),
	usersInApp: one(usersInApp, {
		fields: [documentsInApp.createdBy],
		references: [usersInApp.id]
	}),
	documentVersionsInApps: many(documentVersionsInApp),
	contractsInApps: many(contractsInApp),
}));

export const documentVersionsInAppRelations = relations(documentVersionsInApp, ({one}) => ({
	documentsInApp: one(documentsInApp, {
		fields: [documentVersionsInApp.documentId],
		references: [documentsInApp.id]
	}),
	usersInApp: one(usersInApp, {
		fields: [documentVersionsInApp.createdBy],
		references: [usersInApp.id]
	}),
}));

export const contractsInAppRelations = relations(contractsInApp, ({one}) => ({
	organizationsInApp: one(organizationsInApp, {
		fields: [contractsInApp.organizationId],
		references: [organizationsInApp.id]
	}),
	contactsInApp: one(contactsInApp, {
		fields: [contractsInApp.contactId],
		references: [contactsInApp.id]
	}),
	proposalsInApp: one(proposalsInApp, {
		fields: [contractsInApp.proposalId],
		references: [proposalsInApp.id]
	}),
	documentsInApp: one(documentsInApp, {
		fields: [contractsInApp.documentId],
		references: [documentsInApp.id]
	}),
	usersInApp: one(usersInApp, {
		fields: [contractsInApp.createdBy],
		references: [usersInApp.id]
	}),
}));

export const templatesInAppRelations = relations(templatesInApp, ({one}) => ({
	organizationsInApp: one(organizationsInApp, {
		fields: [templatesInApp.organizationId],
		references: [organizationsInApp.id]
	}),
	usersInApp: one(usersInApp, {
		fields: [templatesInApp.createdBy],
		references: [usersInApp.id]
	}),
}));

export const automationsInAppRelations = relations(automationsInApp, ({one}) => ({
	usersInApp: one(usersInApp, {
		fields: [automationsInApp.createdBy],
		references: [usersInApp.id]
	}),
	organizationsInApp: one(organizationsInApp, {
		fields: [automationsInApp.organizationId],
		references: [organizationsInApp.id]
	}),
}));

export const notificationsInAppRelations = relations(notificationsInApp, ({one}) => ({
	organizationsInApp: one(organizationsInApp, {
		fields: [notificationsInApp.organizationId],
		references: [organizationsInApp.id]
	}),
	usersInApp: one(usersInApp, {
		fields: [notificationsInApp.userId],
		references: [usersInApp.id]
	}),
}));

export const exportsInAppRelations = relations(exportsInApp, ({one}) => ({
	organizationsInApp: one(organizationsInApp, {
		fields: [exportsInApp.organizationId],
		references: [organizationsInApp.id]
	}),
	usersInApp: one(usersInApp, {
		fields: [exportsInApp.generatedBy],
		references: [usersInApp.id]
	}),
}));

export const subscriptionPlansInAppRelations = relations(subscriptionPlansInApp, ({one, many}) => ({
	organizationsInApp: one(organizationsInApp, {
		fields: [subscriptionPlansInApp.organizationId],
		references: [organizationsInApp.id]
	}),
	subscriptionsInApps: many(subscriptionsInApp),
}));

export const subscriptionsInAppRelations = relations(subscriptionsInApp, ({one}) => ({
	organizationsInApp: one(organizationsInApp, {
		fields: [subscriptionsInApp.organizationId],
		references: [organizationsInApp.id]
	}),
	subscriptionPlansInApp: one(subscriptionPlansInApp, {
		fields: [subscriptionsInApp.planId],
		references: [subscriptionPlansInApp.id]
	}),
}));

export const settingsInAppRelations = relations(settingsInApp, ({one}) => ({
	organizationsInApp: one(organizationsInApp, {
		fields: [settingsInApp.organizationId],
		references: [organizationsInApp.id]
	}),
}));

export const tagsInAppRelations = relations(tagsInApp, ({one, many}) => ({
	organizationsInApp: one(organizationsInApp, {
		fields: [tagsInApp.organizationId],
		references: [organizationsInApp.id]
	}),
	contentTagsInApps: many(contentTagsInApp),
}));

export const rolePermissionsInAppRelations = relations(rolePermissionsInApp, ({one}) => ({
	rolesInApp: one(rolesInApp, {
		fields: [rolePermissionsInApp.roleId],
		references: [rolesInApp.id]
	}),
	permissionsInApp: one(permissionsInApp, {
		fields: [rolePermissionsInApp.permissionId],
		references: [permissionsInApp.id]
	}),
}));

export const permissionsInAppRelations = relations(permissionsInApp, ({many}) => ({
	rolePermissionsInApps: many(rolePermissionsInApp),
}));

export const revenueEntryTagsInAppRelations = relations(revenueEntryTagsInApp, ({one}) => ({
	revenueEntriesInApp: one(revenueEntriesInApp, {
		fields: [revenueEntryTagsInApp.revenueEntryId],
		references: [revenueEntriesInApp.id]
	}),
	revenueTagsInApp: one(revenueTagsInApp, {
		fields: [revenueEntryTagsInApp.tagId],
		references: [revenueTagsInApp.id]
	}),
}));

export const contentTagsInAppRelations = relations(contentTagsInApp, ({one}) => ({
	contentItemsInApp: one(contentItemsInApp, {
		fields: [contentTagsInApp.contentItemId],
		references: [contentItemsInApp.id]
	}),
	tagsInApp: one(tagsInApp, {
		fields: [contentTagsInApp.tagId],
		references: [tagsInApp.id]
	}),
}));

export const teamMembersInAppRelations = relations(teamMembersInApp, ({one}) => ({
	teamsInApp: one(teamsInApp, {
		fields: [teamMembersInApp.teamId],
		references: [teamsInApp.id]
	}),
	organizationMembersInApp: one(organizationMembersInApp, {
		fields: [teamMembersInApp.memberId],
		references: [organizationMembersInApp.id]
	}),
}));