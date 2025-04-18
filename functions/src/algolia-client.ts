import { algoliasearch } from 'algoliasearch'
import { defineString } from 'firebase-functions/params'

const ALGOLIA_API_KEY = defineString('ALGOLIA_API_KEY')
const ALGOLIA_APP_ID = defineString('ALGOLIA_APP_ID')

export const client = algoliasearch(ALGOLIA_APP_ID.value(), ALGOLIA_API_KEY.value(), {})
