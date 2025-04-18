/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onDocumentCreated } from 'firebase-functions/firestore'
import { onRequest } from 'firebase-functions/https'
import { DOCUMENT_MATCHER } from './constants'

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const hello = onRequest(async (_req, res) => {
	res.json('Success')
})
export const onTagCreated = onDocumentCreated(DOCUMENT_MATCHER.TAGS, (_event) => {})
