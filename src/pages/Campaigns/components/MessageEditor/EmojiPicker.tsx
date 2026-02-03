// src/pages/Campaigns/components/MessageEditor/EmojiPicker.tsx
// 😊 SELETOR DE EMOJIS

import { motion } from 'framer-motion';
import { Smile, X } from 'lucide-react';
import { useState } from 'react';

// ============================================
// TYPES
// ============================================

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

// ============================================
// EMOJI CATEGORIES
// ============================================

const EMOJI_CATEGORIES = {
  'Sorrisos': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗'],
  'Gestos': ['👍', '👎', '👌', '✌️', '🤞', '🤝', '👏', '🙌', '👐', '🤲', '🙏', '✍️', '💪', '🦾'],
  'Objetos': ['📚', '📖', '📝', '✏️', '📌', '📍', '🎓', '🏫', '🏆', '🎯', '⭐', '✨', '💡', '📱', '💻', '📧'],
  'Símbolos': ['✅', '❌', '⚠️', '📢', '🔔', '💰', '🎉', '🎊', '🎈', '🎁', '❤️', '💙', '💚', '💛'],
};

// ============================================
// COMPONENT
// ============================================

export default function EmojiPicker({
  onSelect,
  onClose,
}: EmojiPickerProps) {
  
  const [selectedCategory, setSelectedCategory] = useState('Sorrisos');

  return (
    <div className="bg-white rounded-xl border-2 border-yellow-200 shadow-lg p-4 max-w-md">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Smile className="text-yellow-600" size={20} />
          <h4 className="font-bold text-gray-900">Emojis</h4>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={18} className="text-gray-400" />
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
        {Object.keys(EMOJI_CATEGORIES).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Emojis Grid */}
      <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
        {EMOJI_CATEGORIES[selectedCategory as keyof typeof EMOJI_CATEGORIES].map((emoji, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSelect(emoji)}
            className="text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {emoji}
          </motion.button>
        ))}
      </div>
    </div>
  );
}