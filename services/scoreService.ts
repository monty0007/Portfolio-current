import { db } from './db';

const TABLE_NAME = 'ninja_scores';

export interface NinjaScore {
    name: string;
    score: number;
}

export const ensureTableExists = async () => {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                score INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    } catch (error) {
        console.error('Error creating scores table:', error);
    }
};

export const getTopScores = async (): Promise<NinjaScore[]> => {
    try {
        await ensureTableExists();
        const result = await db.execute({
            sql: `SELECT name, score FROM ${TABLE_NAME} ORDER BY score DESC LIMIT 5`,
            args: []
        });
        return result.rows.map(row => ({
            name: row.name as string,
            score: row.score as number
        }));
    } catch (error) {
        console.error('Error fetching scores:', error);
        return [];
    }
}

export const saveScore = async (name: string, score: number) => {
    try {
        await ensureTableExists();
        await db.execute({
            sql: `INSERT INTO ${TABLE_NAME} (name, score) VALUES (?, ?)`,
            args: [name, score]
        });
        return true;
    } catch (error) {
        console.error('Error saving score:', error);
        return false;
    }
};
