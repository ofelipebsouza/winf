import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useWinf } from '../contexts/WinfContext';
import { RayKnowledge } from '../types';

export const useKnowledgeBase = () => {
  const { user } = useWinf();
  const [knowledge, setKnowledge] = useState<RayKnowledge[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchKnowledge = useCallback(async () => {
    if (!user?.id) return [];
    
    setIsLoading(true);
    try {
      const q = query(
        collection(db, 'wno_knowledge'),
        where('user_id', '==', user.id),
        where('status', '==', 'APPROVED'),
        orderBy('created_at', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RayKnowledge[];
      
      setKnowledge(data);
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error("Error fetching knowledge base:", error);
      setIsLoading(false);
      return [];
    }
  }, [user?.id]);

  useEffect(() => {
    fetchKnowledge();
  }, [fetchKnowledge]);

  const getKnowledgeContext = useCallback(() => {
    if (knowledge.length === 0) return "";
    
    return knowledge
      .map(k => `Tópico: ${k.topic}\nConteúdo: ${k.content}`)
      .join('\n\n---\n\n');
  }, [knowledge]);

  return {
    knowledge,
    isLoading,
    fetchKnowledge,
    getKnowledgeContext
  };
};
