// src/types/boards.ts
// 🎯 TIPOS DO SISTEMA DE BOARDING

export type BoardColor = 
  | 'blue' 
  | 'purple' 
  | 'green' 
  | 'orange' 
  | 'red' 
  | 'pink' 
  | 'indigo' 
  | 'teal';

export type CardPriority = 'low' | 'medium' | 'high';

export interface Board {
  id: number;
  school: number;
  title: string;
  description?: string;
  color?: BoardColor;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface BoardList {
  id: number;
  board: number;
  title: string;
  position: number;
  is_archived: boolean;
  created_at: string;
}

export interface BoardCard {
  id: number;
  list: number;
  board: number;
  title: string;
  description?: string;
  position: number;
  due_date?: string;
  priority?: CardPriority;
  labels?: string[];
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface BoardFormData {
  title: string;
  description: string;
  color: BoardColor;
  school: number;
}

export interface ListFormData {
  title: string;
  board: number;
  position: number;
}

export interface CardFormData {
  title: string;
  description: string;
  list: number;
  board: number;
  position: number;
  due_date?: string;
  priority?: CardPriority;
  labels?: string[];
}