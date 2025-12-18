import apiClient from "../client";

interface Ticket {
    id: number;
    shcool: number;
    title: string;
    description: string;
    status: 'open' | 'in_progress' | 'closed';
    createdAt: string;
    updatedAt: string;
}

export interface TicketCreateData {
    school: number;
    title: string;
    description: string;
}

export interface TicketUpdateData {
    title?: string;
    description?: string;
    status?: 'open' | 'in_progress' | 'closed';
}

export const ticketsService = {
    async list(params?: {
    status?: string;
    origem?: string;
    search?: string;
  }): Promise<Ticket[]> {
    const response = await apiClient.get<Ticket[]>('/tickets/', { params });
    return response.data;
  },
  async get(id: number): Promise<Ticket> {
    const response = await apiClient.get<Ticket>(`/tickets/${id}/`);
    return response.data;
  },
}

