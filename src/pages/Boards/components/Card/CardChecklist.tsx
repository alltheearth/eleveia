// src/pages/Boards/components/Card/CardChecklist.tsx
// ✅ CHECKLIST PROFISSIONAL DENTRO DO CARD

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  X, 
  Trash2,
  GripVertical,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ============================================
// TYPES
// ============================================

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  position: number;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

interface CardChecklistProps {
  checklists: Checklist[];
  onUpdate: (checklists: Checklist[]) => void;
}

// ============================================
// CHECKLIST ITEM COMPONENT
// ============================================

interface ChecklistItemComponentProps {
  item: ChecklistItem;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (text: string) => void;
}

function ChecklistItemComponent({ 
  item, 
  onToggle, 
  onDelete, 
  onUpdate 
}: ChecklistItemComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(item.text);

  const handleSave = () => {
    if (text.trim()) {
      onUpdate(text.trim());
      setIsEditing(false);
    } else {
      toast.error('Texto não pode estar vazio');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setText(item.text);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="group flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
    >
      {/* Drag Handle */}
      <div className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing">
        <GripVertical size={14} className="text-gray-400" />
      </div>

      {/* Checkbox */}
      <button
        onClick={onToggle}
        className="flex-shrink-0"
      >
        {item.completed ? (
          <CheckSquare size={20} className="text-green-600" />
        ) : (
          <Square size={20} className="text-gray-400 hover:text-gray-600" />
        )}
      </button>

      {/* Text */}
      {isEditing ? (
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyPress}
          autoFocus
          className="flex-1 px-2 py-1 border border-blue-500 rounded focus:outline-none text-sm"
        />
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          className={`flex-1 text-sm cursor-pointer ${
            item.completed 
              ? 'line-through text-gray-500' 
              : 'text-gray-700'
          }`}
        >
          {item.text}
        </span>
      )}

      {/* Delete */}
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-colors"
      >
        <Trash2 size={14} className="text-red-600" />
      </button>
    </motion.div>
  );
}

// ============================================
// CHECKLIST COMPONENT
// ============================================

interface ChecklistComponentProps {
  checklist: Checklist;
  onUpdate: (checklist: Checklist) => void;
  onDelete: () => void;
}

function ChecklistComponent({ 
  checklist, 
  onUpdate, 
  onDelete 
}: ChecklistComponentProps) {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(checklist.title);

  // Calculate progress
  const totalItems = checklist.items.length;
  const completedItems = checklist.items.filter(i => i.completed).length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const handleAddItem = () => {
    if (newItemText.trim()) {
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        text: newItemText.trim(),
        completed: false,
        position: checklist.items.length,
      };

      onUpdate({
        ...checklist,
        items: [...checklist.items, newItem],
      });

      setNewItemText('');
      setIsAddingItem(false);
      toast.success('✅ Item adicionado!');
    }
  };

  const handleToggleItem = (itemId: string) => {
    const updatedItems = checklist.items.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    onUpdate({ ...checklist, items: updatedItems });
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = checklist.items.filter(item => item.id !== itemId);
    onUpdate({ ...checklist, items: updatedItems });
    toast.success('Item removido!');
  };

  const handleUpdateItem = (itemId: string, text: string) => {
    const updatedItems = checklist.items.map(item =>
      item.id === itemId ? { ...item, text } : item
    );
    onUpdate({ ...checklist, items: updatedItems });
  };

  const handleSaveTitle = () => {
    if (title.trim()) {
      onUpdate({ ...checklist, title: title.trim() });
      setIsEditingTitle(false);
    } else {
      setTitle(checklist.title);
      setIsEditingTitle(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <CheckSquare size={20} className="text-blue-600" />
          {isEditingTitle ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyPress={(e) => e.key === 'Enter' && handleSaveTitle()}
              autoFocus
              className="flex-1 px-2 py-1 border border-blue-500 rounded font-semibold focus:outline-none"
            />
          ) : (
            <h4 
              onClick={() => setIsEditingTitle(true)}
              className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
            >
              {checklist.title}
            </h4>
          )}
        </div>

        <button
          onClick={onDelete}
          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
          title="Deletar checklist"
        >
          <Trash2 size={16} className="text-red-600" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>{Math.round(progress)}%</span>
          <span>{completedItems}/{totalItems}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className={`h-full rounded-full ${
              progress === 100 
                ? 'bg-green-500' 
                : 'bg-blue-500'
            }`}
          />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-1">
        <AnimatePresence>
          {checklist.items.map(item => (
            <ChecklistItemComponent
              key={item.id}
              item={item}
              onToggle={() => handleToggleItem(item.id)}
              onDelete={() => handleDeleteItem(item.id)}
              onUpdate={(text) => handleUpdateItem(item.id, text)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Add Item */}
      {isAddingItem ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
            placeholder="Adicionar item..."
            autoFocus
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <button
            onClick={handleAddItem}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
          >
            Adicionar
          </button>
          <button
            onClick={() => {
              setNewItemText('');
              setIsAddingItem(false);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingItem(true)}
          className="w-full flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm font-semibold"
        >
          <Plus size={16} />
          Adicionar item
        </button>
      )}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function CardChecklist({ checklists, onUpdate }: CardChecklistProps) {
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');

  const handleAddChecklist = () => {
    if (newChecklistTitle.trim()) {
      const newChecklist: Checklist = {
        id: Date.now().toString(),
        title: newChecklistTitle.trim(),
        items: [],
      };

      onUpdate([...checklists, newChecklist]);
      setNewChecklistTitle('');
      setIsAddingChecklist(false);
      toast.success('✅ Checklist criada!');
    }
  };

  const handleUpdateChecklist = (checklistId: string, updatedChecklist: Checklist) => {
    onUpdate(
      checklists.map(c => c.id === checklistId ? updatedChecklist : c)
    );
  };

  const handleDeleteChecklist = (checklistId: string) => {
    if (window.confirm('Deletar esta checklist?')) {
      onUpdate(checklists.filter(c => c.id !== checklistId));
      toast.success('Checklist removida!');
    }
  };

  return (
    <div className="space-y-4">
      {/* Existing Checklists */}
      {checklists.map(checklist => (
        <ChecklistComponent
          key={checklist.id}
          checklist={checklist}
          onUpdate={(updated) => handleUpdateChecklist(checklist.id, updated)}
          onDelete={() => handleDeleteChecklist(checklist.id)}
        />
      ))}

      {/* Add Checklist Button */}
      {isAddingChecklist ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={newChecklistTitle}
            onChange={(e) => setNewChecklistTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddChecklist()}
            placeholder="Título da checklist..."
            autoFocus
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <button
            onClick={handleAddChecklist}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Adicionar
          </button>
          <button
            onClick={() => {
              setNewChecklistTitle('');
              setIsAddingChecklist(false);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingChecklist(true)}
          className="w-full flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg transition-colors font-semibold text-gray-700"
        >
          <Plus size={20} />
          Adicionar Checklist
        </button>
      )}
    </div>
  );
}