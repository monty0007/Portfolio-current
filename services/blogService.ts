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
    liveLink?: string; // External project link
    isDraft?: boolean;
    scheduledDate?: string;
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
            sql: `INSERT INTO posts (slug, title, created_at, excerpt, category, color, sections, content, author, read_time, image_url, tags, live_link, is_draft, scheduled_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                tagsStr,
                post.liveLink || '',
                post.isDraft ? 1 : 0,
                post.scheduledDate || null
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

export const updatePost = async (id: number, post: Partial<Omit<BlogPost, 'id' | 'slug'>>): Promise<{ success: boolean; message: string }> => {
    if (isMock) {
        return { success: false, message: "DB not connected! Add VITE_TURSO_DATABASE_URL to .env" };
    }

    try {
        const sectionsStr = post.sections ? JSON.stringify(post.sections) : undefined;
        const tagsStr = post.tags ? JSON.stringify(post.tags) : undefined;

        await db.execute({
            sql: `UPDATE posts SET 
                title = COALESCE(?, title),
                created_at = COALESCE(?, created_at),
                excerpt = COALESCE(?, excerpt),
                category = COALESCE(?, category),
                color = COALESCE(?, color),
                sections = COALESCE(?, sections),
                content = COALESCE(?, content),
                author = COALESCE(?, author),
                read_time = COALESCE(?, read_time),
                image_url = COALESCE(?, image_url),
                tags = COALESCE(?, tags),
                live_link = COALESCE(?, live_link),
                is_draft = COALESCE(?, is_draft),
                scheduled_date = COALESCE(?, scheduled_date)
            WHERE id = ?`,
            args: [
                post.title ?? null,
                post.date ?? null,
                post.excerpt ?? null,
                post.category ?? null,
                post.color ?? null,
                sectionsStr ?? null,
                post.content ?? null,
                post.author ?? null,
                post.readTime ?? null,
                post.image ?? null,
                post.tags ? tagsStr : null,
                post.liveLink ?? null,
                post.isDraft !== undefined ? (post.isDraft ? 1 : 0) : null,
                post.scheduledDate !== undefined ? (post.scheduledDate || null) : null,
                id
            ]
        });
        return { success: true, message: "Post updated successfully!" };
    } catch (error: any) {
        console.error("Failed to update post:", error);
        return { success: false, message: error.message || "Failed to update post (SQL Error)" };
    }
};

// Mock interface for now matching current blog structure, will map DB results to this
export const getPosts = async (): Promise<BlogPost[]> => {
    try {
        const result = await db.execute("SELECT * FROM posts");

        // If DB is empty or table doesn't exist, return empty or mock
        // This is a safety check for the first run before migration
        if (result.rows.length === 0) {
            console.warn("No posts found in database.");
            return [];
        }

        // Helper to parse date string to timestamp for sorting
        const parseDateToTimestamp = (dateStr: string): number => {
            try {
                const date = new Date(dateStr);
                if (!isNaN(date.getTime())) {
                    return date.getTime();
                }
            } catch (e) {
                // Fall through
            }
            return 0; // Put unparseable dates at the end
        };

        // Helper to format date for display
        const formatDateForDisplay = (dateStr: string): string => {
            try {
                const date = new Date(dateStr);
                if (!isNaN(date.getTime())) {
                    const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    // Convert month to uppercase: "Jan 14, 2026" -> "JAN 14, 2026"
                    return formatted.replace(/^[A-Za-z]+/, (match) => match.toUpperCase());
                }
            } catch (e) {
                // Fall through to return original string
            }
            return dateStr; // Return as-is if parsing fails (legacy format)
        };

        const posts = result.rows.map(row => ({
            id: Number(row.id),
            slug: String(row.slug),
            title: String(row.title),
            excerpt: String(row.excerpt),
            content: String(row.content),
            author: String(row.author),
            date: formatDateForDisplay(String(row.created_at)),
            rawDate: String(row.created_at), // Keep raw date for sorting
            readTime: String(row.read_time),
            image: String(row.image_url),
            tags: parseTags(row.tags),
            category: String(row.category || ''),
            color: String(row.color || ''),
            sections: parseTags(row.sections), // Using same parser for JSON array
            liveLink: String(row.live_link || ''),
            isDraft: Boolean(row.is_draft),
            scheduledDate: String(row.scheduled_date || '')
        }));

        // Sort by date descending (newest first) using parsed timestamps
        posts.sort((a, b) => {
            const timeA = parseDateToTimestamp(a.rawDate);
            const timeB = parseDateToTimestamp(b.rawDate);
            return timeB - timeA; // Descending order
        });

        // Remove rawDate before returning (it was only for sorting)
        return posts.map(({ rawDate, ...rest }) => rest);
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        return [];
    }
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    // Helper to format date for display  
    const formatDateForDisplay = (dateStr: string): string => {
        try {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                // Convert month to uppercase: "Jan 14, 2026" -> "JAN 14, 2026"
                return formatted.replace(/^[A-Za-z]+/, (match) => match.toUpperCase());
            }
        } catch (e) {
            // Fall through to return original string
        }
        return dateStr;
    };

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
            date: formatDateForDisplay(String(row.created_at)),
            readTime: String(row.read_time),
            image: String(row.image_url),
            tags: parseTags(row.tags),
            category: String(row.category || ''),
            color: String(row.color || ''),
            sections: parseTags(row.sections),
            liveLink: String(row.live_link || ''),
            isDraft: Boolean(row.is_draft),
            scheduledDate: String(row.scheduled_date || '')
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
