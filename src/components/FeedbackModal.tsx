import React, { useState } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTool: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, currentTool }) => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    // Simulando o envio do feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFeedback('');
        onClose();
      }, 2000);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#131314]/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#131314] border border-[#444746] p-6 rounded-none w-full max-w-md relative shadow-2xl"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-none bg-white/5 border border-[#444746] flex items-center justify-center text-white">
              <MessageSquare size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Enviar Feedback</h2>
              <p className="text-xs md:text-[10px] text-white/40 uppercase tracking-widest">Ferramenta: {currentTool}</p>
            </div>
          </div>

          {submitted ? (
            <div className="py-8 text-center animate-fade-in">
              <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-none flex items-center justify-center mx-auto mb-4 text-green-400">
                <Send size={24} />
              </div>
              <h3 className="text-white font-bold mb-2">Feedback Enviado!</h3>
              <p className="text-white/40 text-sm">Sua contribuição ajuda a evoluir nossa operação.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs md:text-[10px] font-bold text-white/60 uppercase tracking-widest mb-2">
                  Sua Experiência / Sugestão
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="O que achou desta ferramenta? Encontrou algum problema ou tem sugestões de melhoria?"
                  className="w-full bg-[#131314] border border-[#444746] rounded-none p-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 min-h-[120px] resize-none"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || !feedback.trim()}
                className="w-full bg-white text-black py-3 rounded-none text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-none animate-spin"></span>
                ) : (
                  <>
                    <Send size={14} /> Enviar Feedback
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FeedbackModal;
