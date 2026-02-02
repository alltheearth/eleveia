// src/pages/Boards/components/Card/CardComments.tsx
// 💬 COMENTÁRIOS E ATIVIDADES DO CARD

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Edit2, 
  Trash2,
  User,
  Clock,
  Activity,
  CheckSquare,
  Tag,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ============================================
// TYPES
// ============================================

export type ActivityType = 
  | 'comment' 
  | 'card_created' 
  | 'card_moved'
  | 'label_added'
  | 'label_removed'
  | 'due_date_added'
  | 'due_date_changed'
  | 'checklist_added'
  | 'checklist_item_completed';

export interface Comment {
  id: string;
  user: string;
  user_avatar?: string;
  text: string;
  created_at: string;
  updated_at?: string;
  is_edited: boolean;
}

export interface ActivityLog {
  id: string;
  type: ActivityType;
  user: string;
  description: string;
  created_at: string;
  metadata?: Record<string, any>;
}

interface CardCommentsProps {
  comments: Comment[];
  activities: ActivityLog[];
  currentUser: string;
  onAddComment: (text: string) => void;
  onUpdateComment: (commentId: string, text: string) => void;
  onDeleteComment: (commentId: string) => void;
  showActivities?: boolean;
}

// ============================================
// ACTIVITY ICON
// ============================================

function getActivityIcon(type: ActivityType) {
  const iconProps = { size: 16, className: "text-white" };
  
  switch (type) {
    case 'comment':
      return <MessageSquare {...iconProps} />;
    case 'card_created':
      return <Activity {...iconProps} />;
    case 'card_moved':
      return <ArrowRight {...iconProps} />;
    case 'label_added':
    case 'label_removed':
      return <Tag {...iconProps} />;
    case 'due_date_added':
    case 'due_date_changed':
      return <Calendar {...iconProps} />;
    case 'checklist_added':
    case 'checklist_item_completed':
      return <CheckSquare {...iconProps} />;
    default:
      return <Activity {...iconProps} />;
  }
}

function getActivityColor(type: ActivityType) {
  switch (type) {
    case 'comment':
      return 'bg-blue-500';
    case 'card_created':
      return 'bg-green-500';
    case 'card_moved':
      return 'bg-purple-500';
    case 'label_added':
    case 'label_removed':
      return 'bg-orange-500';
    case 'due_date_added':
    case 'due_date_changed':
      return 'bg-pink-500';
    case 'checklist_added':
    case 'checklist_item_completed':
      return 'bg-teal-500';
    default:
      return 'bg-gray-500';
  }
}

// ============================================
// FORMAT TIME
// ============================================

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Agora';
  if (diffMins < 60) return `${diffMins}m atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 7) return `${diffDays}d atrás`;

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

// ============================================
// COMMENT COMPONENT
// ============================================

interface CommentItemProps {
  comment: Comment;
  currentUser: string;
  onUpdate: (text: string) => void;
  onDelete: () => void;
}

function CommentItem({ comment, currentUser, onUpdate, onDelete }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(comment.text);
  const [showActions, setShowActions] = useState(false);

  const isOwnComment = comment.user === currentUser;

  const handleSave = () => {
    if (text.trim()) {
      onUpdate(text.trim());
      setIsEditing(false);
    } else {
      toast.error('Comentário não pode estar vazio');
    }
  };

  const handleCancel = () => {
    setText(comment.text);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-3 group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md">
        {comment.user_avatar ? (
          <img src={comment.user_avatar} alt={comment.user} className="w-full h-full rounded-full" />
        ) : (
          <User size={16} className="text-white" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-gray-900">{comment.user}</span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock size={12} />
                {formatTime(comment.created_at)}
                {comment.is_edited && <span className="italic">(editado)</span>}
              </span>
            </div>

            {/* Actions */}
            {isOwnComment && (
              <div className={`flex items-center gap-1 transition-opacity ${
                showActions ? 'opacity-100' : 'opacity-0'
              }`}>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 hover:bg-gray-200 rounded transition"
                  title="Editar"
                >
                  <Edit2 size={14} className="text-gray-600" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Deletar este comentário?')) {
                      onDelete();
                    }
                  }}
                  className="p-1 hover:bg-red-100 rounded transition"
                  title="Deletar"
                >
                  <Trash2 size={14} className="text-red-600" />
                </button>
              </div>
            )}
          </div>

          {/* Text */}
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                autoFocus
                className="w-full px-3 py-2 border border-blue-500 rounded-lg text-sm focus:outline-none resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                >
                  Salvar
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
              {comment.text}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// ACTIVITY ITEM COMPONENT
// ============================================

interface ActivityItemProps {
  activity: ActivityLog;
}

function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="flex gap-3 items-start"
    >
      {/* Icon */}
      <div className={`w-7 h-7 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center flex-shrink-0 shadow-sm`}>
        {getActivityIcon(activity.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-gray-900">{activity.user}</span>{' '}
            {activity.description}
          </p>
          <span className="text-xs text-gray-500 flex-shrink-0 flex items-center gap-1">
            <Clock size={11} />
            {formatTime(activity.created_at)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function CardComments({
  comments,
  activities,
  currentUser,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  showActivities = true,
}: CardCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'comments' | 'activity'>('comments');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
      toast.success('💬 Comentário adicionado!');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleAddComment();
    }
  };

  return (
    <div>
      {/* Tabs */}
      {showActivities && (
        <div className="flex items-center gap-2 mb-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex items-center gap-2 px-4 py-2 font-semibold transition-all border-b-2 ${
              activeTab === 'comments'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare size={18} />
            Comentários
            {comments.length > 0 && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                {comments.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-2 px-4 py-2 font-semibold transition-all border-b-2 ${
              activeTab === 'activity'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Activity size={18} />
            Atividades
            {activities.length > 0 && (
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                {activities.length}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Add Comment Form */}
      {activeTab === 'comments' && (
        <div className="mb-6">
          <div className="flex gap-3">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-md">
              <User size={16} className="text-white" />
            </div>

            {/* Input */}
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Adicionar um comentário... (Ctrl+Enter para enviar)"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">
                  💡 Use <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Enter</kbd> para enviar
                </p>
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <Send size={16} />
                  Comentar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {activeTab === 'comments' ? (
          <AnimatePresence>
            {comments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-semibold">Nenhum comentário ainda</p>
                <p className="text-sm text-gray-400">Seja o primeiro a comentar!</p>
              </motion.div>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  currentUser={currentUser}
                  onUpdate={(text) => onUpdateComment(comment.id, text)}
                  onDelete={() => onDeleteComment(comment.id)}
                />
              ))
            )}
          </AnimatePresence>
        ) : (
          <AnimatePresence>
            {activities.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Activity size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-semibold">Nenhuma atividade registrada</p>
                <p className="text-sm text-gray-400">As ações no card aparecerão aqui</p>
              </motion.div>
            ) : (
              activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}