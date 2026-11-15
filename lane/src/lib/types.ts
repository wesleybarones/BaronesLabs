export type Photo = {
  id: string; google_id: string; full_path: string; thumb_path: string;
  taken_at: string; width: number | null; height: number | null; added_by: string | null;
};
export type Memory = { id: string; date: string; title: string; body: string; added_by: string | null };
export type Poem = { id: string; title: string; body: string; author: string; created_at: string; updated_at: string };
export type Song = { path: string; title: string };
