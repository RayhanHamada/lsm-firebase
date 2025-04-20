import type {
	Change,
	FirestoreEvent,
	QueryDocumentSnapshot,
} from 'firebase-functions/firestore'
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import process from 'node:process'
import { algoliasearch } from 'algoliasearch'

import {
	onDocumentCreated,
	onDocumentDeleted,
	onDocumentUpdated,
} from 'firebase-functions/firestore'
import { DOCUMENT_MATCHER } from './constants'
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

type OnCreateEvent = FirestoreEvent<QueryDocumentSnapshot | undefined>
type OnUpdateEvent = FirestoreEvent<Change<QueryDocumentSnapshot> | undefined>
type OnDeleteEvent = FirestoreEvent<QueryDocumentSnapshot | undefined>

function onCreated<const T extends `${string}/${string}`>(document: T) {
	return async function (event: OnCreateEvent) {
		const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_KEY!, {})

		const data = event.data
		if (!data)
			return

		const objectID = data.id
		const payload = data.data()
		const indexName = document.split('/').at(0) ?? ''

		await client.addOrUpdateObject({
			indexName,
			objectID,
			body: {
				...payload,
			},
		})
	}
}

function onUpdated<const T extends `${string}/${string}`>(document: T) {
	return async function (event: OnUpdateEvent) {
		const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_KEY!, {})

		const data = event.data
		if (!data)
			return

		const objectID = data.after.id
		const payload = data.after.data()
		const indexName = document.split('/').at(0) ?? ''

		await client.addOrUpdateObject({
			indexName,
			objectID,
			body: {
				...payload,
			},
		})
	}
}

function onDeleted(document: string) {
	return async function (event: OnDeleteEvent) {
		const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_KEY!, {})

		const data = event.data
		if (!data)
			return

		const objectID = data.id
		const indexName = document.split('/').at(0) ?? ''

		await client.deleteObject({
			indexName,
			objectID,
		})
	}
}

function createHandlers<T extends `${string}/${string}`>(matcher: T) {
	return ({
		created: onDocumentCreated(matcher, onCreated(matcher)),
		updated: onDocumentUpdated(matcher, onUpdated(matcher)),
		deleted: onDocumentDeleted(matcher, onDeleted(matcher)),
	})
}

export const {
	created: onTagCreated,
	updated: onTagUpdated,
	deleted: onTagDeleted,
} = createHandlers(DOCUMENT_MATCHER.TAGS)

export const {
	created: onCategoryCreated,
	updated: onCategoryUpdated,
	deleted: onCategoryDeleted,
} = createHandlers(DOCUMENT_MATCHER.CATEGORY)

export const {
	created: onContentCreated,
	updated: onContentUpdated,
	deleted: onContentDeleted,
} = createHandlers(DOCUMENT_MATCHER.CONTENT)

export const {
	created: onStaffCreated,
	updated: onStaffUpdated,
	deleted: onStaffDeleted,
} = createHandlers(DOCUMENT_MATCHER.STAFF)
