import { db, isMock } from './db';
import { Project } from '../types';
import { PROJECTS } from '../constants';

const ORDER_KEY = 'Manish_portfolio_projects_order';

export const saveProjectOrder = (orderedIds: string[]): void => {
    localStorage.setItem(ORDER_KEY, JSON.stringify(orderedIds));
};

const applyOrder = (projects: Project[]): Project[] => {
    const raw = localStorage.getItem(ORDER_KEY);
    if (!raw) return projects;
    try {
        const order: string[] = JSON.parse(raw);
        const map = new Map(projects.map(p => [p.id, p]));
        const sorted: Project[] = [];
        order.forEach(id => { if (map.has(id)) sorted.push(map.get(id)!); });
        projects.forEach(p => { if (!order.includes(p.id)) sorted.push(p); });
        return sorted;
    } catch {
        return projects;
    }
};

export const getProjects = async (): Promise<Project[]> => {
    if (isMock) return applyOrder(PROJECTS);
    try {
        const result = await db.execute('SELECT * FROM projects ORDER BY id ASC');
        if (result.rows.length === 0) return applyOrder(PROJECTS);

        return applyOrder(result.rows.map((row: any) => ({
            id: String(row.id),
            title: row.title || '',
            description: row.description || '',
            image: row.image_url || '',
            tags: (() => { try { return JSON.parse(row.tags || '[]'); } catch { return []; } })(),
            color: row.color || '#FFD600',
            link: row.live_link || '',
            githubLink: row.github_link || '',
            disabled: row.disabled === 1 || row.disabled === true,
        })));
    } catch (error) {
        console.error('Failed to fetch projects:', error);
        return applyOrder(PROJECTS);
    }
};

export const createProject = async (
    project: Omit<Project, 'id'>
): Promise<{ success: boolean; message: string }> => {
    if (isMock) {
        return { success: false, message: 'DB not connected! Add VITE_TURSO_DATABASE_URL to .env' };
    }
    try {
        const tagsStr = JSON.stringify(project.tags || []);
        await db.execute({
            sql: `INSERT INTO projects (title, description, image_url, tags, color, live_link, github_link, disabled)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                project.title,
                project.description,
                project.image || '',
                tagsStr,
                project.color || '#FFD600',
                project.link || '',
                project.githubLink || '',
                project.disabled ? 1 : 0,
            ],
        });
        return { success: true, message: 'Project created successfully!' };
    } catch (error: any) {
        console.error('Failed to create project:', error);
        return { success: false, message: error.message || 'Failed to create project' };
    }
};

export const updateProject = async (
    id: string,
    project: Partial<Omit<Project, 'id'>>
): Promise<{ success: boolean; message: string }> => {
    if (isMock) {
        return { success: false, message: 'DB not connected!' };
    }
    try {
        const tagsStr = project.tags ? JSON.stringify(project.tags) : undefined;
        await db.execute({
            sql: `UPDATE projects SET
                    title       = COALESCE(?, title),
                    description = COALESCE(?, description),
                    image_url   = COALESCE(?, image_url),
                    tags        = COALESCE(?, tags),
                    color       = COALESCE(?, color),
                    live_link   = COALESCE(?, live_link),
                    github_link = COALESCE(?, github_link),
                    disabled    = COALESCE(?, disabled)
                  WHERE id = ?`,
            args: [
                project.title ?? null,
                project.description ?? null,
                project.image ?? null,
                tagsStr ?? null,
                project.color ?? null,
                project.link ?? null,
                project.githubLink ?? null,
                project.disabled !== undefined ? (project.disabled ? 1 : 0) : null,
                id,
            ],
        });
        return { success: true, message: 'Project updated!' };
    } catch (error: any) {
        console.error('Failed to update project:', error);
        return { success: false, message: error.message || 'Failed to update project' };
    }
};

export const deleteProject = async (id: string): Promise<boolean> => {
    try {
        await db.execute({ sql: 'DELETE FROM projects WHERE id = ?', args: [id] });
        return true;
    } catch (error) {
        console.error('Failed to delete project:', error);
        return false;
    }
};
