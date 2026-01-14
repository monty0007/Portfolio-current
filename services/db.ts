import { createClient } from '@libsql/client';

const url = import.meta.env.VITE_TURSO_DATABASE_URL;
const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

const createDbClient = () => {
    if (!url || (!url.startsWith('libsql:') && !url.startsWith('https:') && !url.startsWith('http:') && !url.startsWith('wss:') && !url.startsWith('ws:'))) {
        console.warn("VITE_TURSO_DATABASE_URL is missing or invalid. Using safe mock client.");
        return {
            execute: async () => {
                console.warn("Database operation skipped: No valid connection URL.");
                return { rows: [] };
            }
        };
    }

    return createClient({
        url,
        authToken,
    });
};

// Export status for checking connection
export const isMock = !url || (!url.startsWith('libsql:') && !url.startsWith('https:') && !url.startsWith('http:') && !url.startsWith('wss:') && !url.startsWith('ws:'));

export const db = createDbClient();

