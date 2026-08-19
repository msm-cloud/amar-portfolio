/**
 * types/database.ts
 * ------------------
 * Hand-written Supabase database types, matching
 * supabase/migrations/20260819220000_initial_schema.sql.
 *
 * If the Supabase CLI is set up later, this file can be replaced with the
 * output of:
 *   supabase gen types typescript --linked > src/types/database.ts
 * (Keep the shape — `Database['public']['Tables'][...]` — the same so
 * `createClient<Database>()` keeps working either way.)
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProfileRole = 'admin' | 'editor';
export type ContentStatus = 'draft' | 'published';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: ProfileRole;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: ProfileRole;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          role?: ProfileRole;
          avatar_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          title: string;
          title_bn: string | null;
          slug: string;
          description: string | null;
          description_bn: string | null;
          content: string | null;
          content_bn: string | null;
          category: string | null;
          tags: string[];
          cover_image_url: string | null;
          project_url: string | null;
          github_url: string | null;
          is_featured: boolean;
          display_order: number;
          status: ContentStatus;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          title_bn?: string | null;
          slug: string;
          description?: string | null;
          description_bn?: string | null;
          content?: string | null;
          content_bn?: string | null;
          category?: string | null;
          tags?: string[];
          cover_image_url?: string | null;
          project_url?: string | null;
          github_url?: string | null;
          is_featured?: boolean;
          display_order?: number;
          status?: ContentStatus;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          title_bn?: string | null;
          slug?: string;
          description?: string | null;
          description_bn?: string | null;
          content?: string | null;
          content_bn?: string | null;
          category?: string | null;
          tags?: string[];
          cover_image_url?: string | null;
          project_url?: string | null;
          github_url?: string | null;
          is_featured?: boolean;
          display_order?: number;
          status?: ContentStatus;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          id: string;
          name: string;
          name_bn: string | null;
          category: string | null;
          proficiency_level: number | null;
          icon_name: string | null;
          display_order: number;
        };
        Insert: {
          id?: string;
          name: string;
          name_bn?: string | null;
          category?: string | null;
          proficiency_level?: number | null;
          icon_name?: string | null;
          display_order?: number;
        };
        Update: {
          id?: string;
          name?: string;
          name_bn?: string | null;
          category?: string | null;
          proficiency_level?: number | null;
          icon_name?: string | null;
          display_order?: number;
        };
        Relationships: [];
      };
      experience: {
        Row: {
          id: string;
          title: string;
          title_bn: string | null;
          organization: string;
          organization_bn: string | null;
          description: string | null;
          description_bn: string | null;
          start_date: string;
          end_date: string | null;
          is_current: boolean;
          display_order: number;
        };
        Insert: {
          id?: string;
          title: string;
          title_bn?: string | null;
          organization: string;
          organization_bn?: string | null;
          description?: string | null;
          description_bn?: string | null;
          start_date: string;
          end_date?: string | null;
          is_current?: boolean;
          display_order?: number;
        };
        Update: {
          id?: string;
          title?: string;
          title_bn?: string | null;
          organization?: string;
          organization_bn?: string | null;
          description?: string | null;
          description_bn?: string | null;
          start_date?: string;
          end_date?: string | null;
          is_current?: boolean;
          display_order?: number;
        };
        Relationships: [];
      };
      certifications: {
        Row: {
          id: string;
          title: string;
          title_bn: string | null;
          issuing_organization: string;
          issuing_organization_bn: string | null;
          issue_date: string | null;
          credential_url: string | null;
          image_url: string | null;
          display_order: number;
        };
        Insert: {
          id?: string;
          title: string;
          title_bn?: string | null;
          issuing_organization: string;
          issuing_organization_bn?: string | null;
          issue_date?: string | null;
          credential_url?: string | null;
          image_url?: string | null;
          display_order?: number;
        };
        Update: {
          id?: string;
          title?: string;
          title_bn?: string | null;
          issuing_organization?: string;
          issuing_organization_bn?: string | null;
          issue_date?: string | null;
          credential_url?: string | null;
          image_url?: string | null;
          display_order?: number;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          author_name: string;
          author_title: string | null;
          author_title_bn: string | null;
          author_company: string | null;
          content: string;
          content_bn: string | null;
          avatar_url: string | null;
          is_featured: boolean;
          display_order: number;
        };
        Insert: {
          id?: string;
          author_name: string;
          author_title?: string | null;
          author_title_bn?: string | null;
          author_company?: string | null;
          content: string;
          content_bn?: string | null;
          avatar_url?: string | null;
          is_featured?: boolean;
          display_order?: number;
        };
        Update: {
          id?: string;
          author_name?: string;
          author_title?: string | null;
          author_title_bn?: string | null;
          author_company?: string | null;
          content?: string;
          content_bn?: string | null;
          avatar_url?: string | null;
          is_featured?: boolean;
          display_order?: number;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          title_bn: string | null;
          slug: string;
          excerpt: string | null;
          excerpt_bn: string | null;
          content: string | null;
          content_bn: string | null;
          cover_image_url: string | null;
          status: ContentStatus;
          published_at: string | null;
          author: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          title_bn?: string | null;
          slug: string;
          excerpt?: string | null;
          excerpt_bn?: string | null;
          content?: string | null;
          content_bn?: string | null;
          cover_image_url?: string | null;
          status?: ContentStatus;
          published_at?: string | null;
          author?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          title_bn?: string | null;
          slug?: string;
          excerpt?: string | null;
          excerpt_bn?: string | null;
          content?: string | null;
          content_bn?: string | null;
          cover_image_url?: string | null;
          status?: ContentStatus;
          published_at?: string | null;
          author?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject?: string | null;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string | null;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_admin_or_editor: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
  };
}
