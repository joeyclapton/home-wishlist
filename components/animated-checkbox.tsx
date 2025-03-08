import { useState } from 'react';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';

export function AnimatedCheckbox({ checked, onCheckedChange }) {
  const [showCelebration, setShowCelebration] = useState(false);

  async function handleCheckChange(checked) {
    setShowCelebration(true);

    setTimeout(() => {
      setShowCelebration(false);
      onCheckedChange(checked);
    }, 1000); // Exibe o emoji por 1s antes de voltar ao checkbox
  }

  return (
    <div className="relative">
      {showCelebration ? (
        <motion.span
          className="absolute text-3xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          🎉
        </motion.span>
      ) : (
        <Checkbox
          className="h-10 w-10 rounded-full"
          checked={checked}
          onCheckedChange={handleCheckChange}
        />
      )}
    </div>
  );
}
