import { db, isMock } from './db';

export interface BlogPost {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    readTime: string;
    image: string;
    tags: string[];
    // Additional fields for rich content
    category?: string;
    color?: string;
    sections?: any[]; // JSON structure
}

export const createPost = async (post: Omit<BlogPost, 'id' | 'slug'> & { slug?: string }): Promise<{ success: boolean; message: string }> => {
    if (isMock) {
        return { success: false, message: "DB not connected! Add VITE_TURSO_DATABASE_URL to .env" };
    }

    try {
        // Generate base slug from title
        let slug = post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        // Append random suffix to ensure uniqueness (simple fix for now)
        if (!post.slug) {
            slug = `${slug}-${Date.now().toString().slice(-6)}`;
        }

        const sectionsStr = JSON.stringify(post.sections || []);
        const tagsStr = JSON.stringify(post.tags || []);

        await db.execute({
            sql: `INSERT INTO posts (slug, title, created_at, excerpt, category, color, sections, content, author, read_time, image_url, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                slug,
                post.title,
                post.date || new Date().toISOString(),
                post.excerpt,
                post.category || 'General',
                post.color || '#000000',
                sectionsStr,
                post.content || '',
                post.author || 'Manish Yadav',
                post.readTime || '5 min',
                post.image || '',
                tagsStr
            ]
        });
        return { success: true, message: "Post created successfully!" };
    } catch (error: any) {
        console.error("Failed to create post:", error);
        return { success: false, message: error.message || "Failed to create post (SQL Error)" };
    }
};

export const deletePost = async (id: number): Promise<boolean> => {
    try {
        await db.execute({
            sql: "DELETE FROM posts WHERE id = ?",
            args: [id]
        });
        return true;
    } catch (error) {
        console.error("Failed to delete post:", error);
        return false;
    }
};

// Mock interface for now matching current blog structure, will map DB results to this
export const getPosts = async (): Promise<BlogPost[]> => {
    try {
        const result = await db.execute("SELECT * FROM posts ORDER BY id DESC");

        // If DB is empty or table doesn't exist, return empty or mock
        // This is a safety check for the first run before migration
        if (result.rows.length === 0) {
            console.warn("No posts found in database.");
            return [];
        }

        return result.rows.map(row => ({
            id: Number(row.id),
            slug: String(row.slug),
            title: String(row.title),
            excerpt: String(row.excerpt),
            content: String(row.content),
            author: String(row.author),
            date: String(row.created_at), // Adjust column name as needed
            readTime: String(row.read_time),
            image: String(row.image_url),
            tags: parseTags(row.tags),
            category: String(row.category || ''),
            color: String(row.color || ''),
            sections: parseTags(row.sections) // Using same parser for JSON array
        }));
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        return [];
    }
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    try {
        const result = await db.execute({
            sql: "SELECT * FROM posts WHERE slug = ?",
            args: [slug]
        });

        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        return {
            id: Number(row.id),
            slug: String(row.slug),
            title: String(row.title),
            excerpt: String(row.excerpt),
            content: String(row.content),
            author: String(row.author),
            date: String(row.created_at),
            readTime: String(row.read_time),
            image: String(row.image_url),
            tags: parseTags(row.tags),
            category: String(row.category || ''),
            color: String(row.color || ''),
            sections: parseTags(row.sections)
        };
    } catch (error) {
        console.error(`Failed to fetch post ${slug}:`, error);
        return null;
    }
}

const parseTags = (tags: any): any[] => {
    if (!tags) return [];
    if (typeof tags === 'string') {
        try {
            return JSON.parse(tags);
        } catch {
            // handle simple comma separated if needed, but for sections it should be JSON
            return tags.startsWith('[') ? [] : tags.split(',').map(t => t.trim());
        }
    }
    return Array.isArray(tags) ? tags : [];
}
