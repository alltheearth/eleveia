// src/types/campaigns/message.types.ts

export interface MessageContent {
  whatsapp?: {
    text: string;
    attachments?: Attachment[];
    buttons?: MessageButton[];
  };
  email?: {
    subject: string;
    body_html: string;
    body_text: string;
    from_name?: string;
    reply_to?: string;
    attachments?: Attachment[];
  };
  sms?: {
    text: string;
  };
}

export interface MessageButton {
  type: 'url' | 'quick_reply' | 'phone';
  text: string;
  value: string;
}

export interface Attachment {
  id: string;
  type: 'image' | 'document' | 'video';
  url: string;
  filename: string;
  size: number;
}

export interface MessageTemplate {
  id: number;
  name: string;
  type: string;
  description?: string;
  content: MessageContent;
  variables: string[];
  created_at: string;
  updated_at: string;
}