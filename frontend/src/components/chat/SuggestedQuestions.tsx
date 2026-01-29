import { motion } from "framer-motion";

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
  questions: string[];
}

export function SuggestedQuestions({
  onSelect,
  questions,
}: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center py-4">
      {questions.map((q, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => onSelect(q)}
          className="bg-white hover:bg-gray-50 text-primary border border-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm hover:shadow-md"
        >
          {q}
        </motion.button>
      ))}
    </div>
  );
}
