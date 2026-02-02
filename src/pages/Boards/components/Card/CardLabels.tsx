// src/pages/Boards/components/Card/CardLabels.tsx
// 🏷️ LABELS/TAGS DO CARD

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { useState } from 'react';
import { PREDEFINED_LABELS } from '../../../../constants/boards';

// ============================================
// TYPES
// ============================================

interface CardLabelsProps {
  labels: string[];
  onAddLabel: (label: string) => void;
  onRemoveLabel: (label: string) => void;
  editable?: boolean;
  compact?: boolean;
}

// ============================================
// LABEL COMPONENT
// ============================================

interface LabelBadgeProps {
  name: string;
  onRemove?: () => void;
  compact?: boolean;
}

function LabelBadge({ name, onRemove, compact = false }: LabelBadgeProps) {
  const predefinedLabel = PREDEFINED_LABELS.find(l => l.name === name);
  const colorClass = predefinedLabel?.color || 'bg-gray-500';

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`${colorClass} text-white ${compact ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'} rounded-full font-semibold inline-flex items-center gap-1.5 group hover:shadow-md transition-shadow`}
    >
      <span>{name}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="opacity-0 group-hover:opacity-100 hover:bg-white/20 rounded-full p-0.5 transition-opacity"
          title="Remover label"
        >
          <X size={compact ? 12 : 14} />
        </button>
      )}
    </motion.span>
  );
}

// ============================================
// LABEL PICKER COMPONENT
// ============================================

interface LabelPickerProps {
  currentLabels: string[];
  onSelect: (label: string) => void;
  onClose: () => void;
}

function LabelPicker({ currentLabels, onSelect, onClose }: LabelPickerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute left-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50 min-w-[280px]"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-gray-900 text-sm">Adicionar Label</h4>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition"
        >
          <X size={16} className="text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
        {PREDEFINED_LABELS.map((label) => {
          const isSelected = currentLabels.includes(label.name);
          
          return (
            <button
              key={label.name}
              onClick={() => {
                if (!isSelected) {
                  onSelect(label.name);
                }
              }}
              disabled={isSelected}
              className={`${label.color} text-white text-sm px-3 py-2 rounded-lg font-semibold transition-all ${
                isSelected 
                  ? 'opacity-50 cursor-not-allowed ring-2 ring-gray-900' 
                  : 'hover:opacity-90 hover:shadow-md'
              }`}
            >
              {label.name}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function CardLabels({
  labels,
  onAddLabel,
  onRemoveLabel,
  editable = true,
  compact = false,
}: CardLabelsProps) {
  const [showPicker, setShowPicker] = useState(false);

  if (!editable && labels.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Labels List */}
      <div className="flex flex-wrap gap-2 items-center">
        <AnimatePresence mode="popLayout">
          {labels.map((label) => (
            <LabelBadge
              key={label}
              name={label}
              onRemove={editable ? () => onRemoveLabel(label) : undefined}
              compact={compact}
            />
          ))}
        </AnimatePresence>

        {/* Add Label Button */}
        {editable && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPicker(!showPicker)}
            className={`${compact ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'} bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-semibold transition-colors inline-flex items-center gap-1`}
          >
            <Plus size={compact ? 12 : 14} />
            <span>Label</span>
          </motion.button>
        )}
      </div>

      {/* Label Picker */}
      <AnimatePresence>
        {showPicker && (
          <LabelPicker
            currentLabels={labels}
            onSelect={(label) => {
              onAddLabel(label);
              setShowPicker(false);
            }}
            onClose={() => setShowPicker(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}