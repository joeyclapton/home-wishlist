export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      wishlist: {
        Row: {
          id: string
          name: string
          icon: string | null
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          icon?: string | null
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string | null
          color?: string | null
          created_at?: string
        }
      }
      product: {
        Row: {
          id: string
          name: string
          priority: 'low' | 'medium' | 'high' | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          priority?: 'low' | 'medium' | 'high' | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          priority?: 'low' | 'medium' | 'high' | null
          created_at?: string
        }
      }
      wishlist_products: {
        Row: {
          id: string
          wishlist_id: string
          product_id: string
          checked: boolean
          created_at: string
        }
        Insert: {
          id?: string
          wishlist_id: string
          product_id: string
          checked?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          wishlist_id?: string
          product_id?: string
          checked?: boolean
          created_at?: string
        }
      }
    }
  }
}