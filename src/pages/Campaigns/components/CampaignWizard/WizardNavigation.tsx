// src/pages/Campaigns/components/CampaignWizard/WizardNavigation.tsx
// 🧭 NAVEGAÇÃO DO WIZARD - Barra de Progresso Visual

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface Step {
  number: number;
  title: string;
  icon: string;
}

interface WizardNavigationProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

// ============================================
// COMPONENT
// ============================================

export default function WizardNavigation({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}: WizardNavigationProps) {
  
  const isStepCompleted = (stepNumber: number) => completedSteps.includes(stepNumber);
  const isStepCurrent = (stepNumber: number) => stepNumber === currentStep;
  const isStepAccessible = (stepNumber: number) => stepNumber <= currentStep || isStepCompleted(stepNumber);

  return (
    <div className="border-b border-gray-200 bg-white px-6 py-4">
      
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const completed = isStepCompleted(step.number);
            const current = isStepCurrent(step.number);
            const accessible = isStepAccessible(step.number);

            return (
              <div key={step.number} className="flex items-center flex-1">
                {/* Step Circle */}
                <button
                  onClick={() => accessible && onStepClick(step.number)}
                  disabled={!accessible}
                  className={`relative flex flex-col items-center gap-2 ${
                    accessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                  }`}
                >
                  {/* Circle */}
                  <motion.div
                    whileHover={accessible ? { scale: 1.05 } : {}}
                    whileTap={accessible ? { scale: 0.95 } : {}}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      completed
                        ? 'bg-gradient-to-r from-green-500 to-green-600 border-green-600'
                        : current
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-600'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    {completed ? (
                      <Check className="text-white" size={24} />
                    ) : (
                      <span className={`text-xl ${current ? 'filter grayscale-0' : ''}`}>
                        {step.icon}
                      </span>
                    )}
                  </motion.div>

                  {/* Label */}
                  <div className="text-center">
                    <p className={`text-xs font-semibold ${
                      current ? 'text-blue-600' : completed ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      Passo {step.number}
                    </p>
                    <p className={`text-sm font-bold max-w-[120px] ${
                      current ? 'text-gray-900' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </p>
                  </div>

                  {/* Active Indicator */}
                  {current && (
                    <motion.div
                      layoutId="activeStep"
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 relative">
                    <div className="absolute inset-0 bg-gray-300" />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: completed || (current && index < currentStep - 1) ? '100%' : '0%',
                      }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
              isStepCompleted(currentStep)
                ? 'bg-gradient-to-r from-green-500 to-green-600 border-green-600'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-600'
            }`}>
              {isStepCompleted(currentStep) ? (
                <Check className="text-white" size={20} />
              ) : (
                <span className="text-lg">{steps[currentStep - 1].icon}</span>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-600 font-semibold">
                Passo {currentStep} de {steps.length}
              </p>
              <p className="text-sm font-bold text-gray-900">
                {steps[currentStep - 1].title}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
          />
        </div>

        {/* Mini Steps Dots */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {steps.map((step) => (
            <button
              key={step.number}
              onClick={() => isStepAccessible(step.number) && onStepClick(step.number)}
              disabled={!isStepAccessible(step.number)}
              className={`w-2 h-2 rounded-full transition-all ${
                isStepCompleted(step.number)
                  ? 'bg-green-600 w-3'
                  : isStepCurrent(step.number)
                  ? 'bg-blue-600 w-4'
                  : isStepAccessible(step.number)
                  ? 'bg-gray-300 hover:bg-gray-400'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}