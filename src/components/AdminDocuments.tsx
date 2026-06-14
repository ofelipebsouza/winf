import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ChevronLeft, Plus, Edit, Trash2, Save, X, FileText, Download } from 'lucide-react';
import { useWinf } from '../contexts/WinfContext';
import { DocumentItem } from '../types';
import { DEFAULT_WINF_DOCUMENTS } from '../lib/documentSeeder';
import { generateDocPDF } from '../lib/pdfGenerator';
import ReactMarkdown from 'react-markdown';

interface AdminDocumentsProps {
  onBack: () => void;
}

const AdminDocuments: React.FC<AdminDocumentsProps> = ({ onBack }) => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useWinf();

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'documents_master'));
      const data = querySnapshot.docs.map(doc => {
        const docData = doc.data() as DocumentItem;
        const localMatched = DEFAULT_WINF_DOCUMENTS.find(d => d.title === docData.title);
        if (localMatched) {
          docData.category = localMatched.category;
          docData.access_level = localMatched.access_level;
        }
        return { id: doc.id, ...docData };
      });
      setDocuments(data);
    } catch (e) {
      console.error("Error fetching documents: ", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleCreate = async () => {
    if (!editingDoc) return;
    try {
      await addDoc(collection(db, 'documents_master'), {
        ...editingDoc,
        created_at: new Date().toISOString()
      });
      setIsCreating(false);
      setEditingDoc(null);
      fetchDocuments();
    } catch (e) {
      console.error("Error adding document: ", e);
      alert('Erro ao criar documento.');
    }
  };

  const handleUpdate = async () => {
    if (!editingDoc?.id) return;
    try {
      const docRef = doc(db, 'documents_master', editingDoc.id);
      await updateDoc(docRef, { ...editingDoc });
      setEditingDoc(null);
      fetchDocuments();
    } catch (e) {
      console.error("Error updating document: ", e);
      alert('Erro ao atualizar documento.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este documento?')) return;
    try {
      await deleteDoc(doc(db, 'documents_master', id));
      fetchDocuments();
    } catch (e) {
      console.error("Error deleting document: ", e);
      alert('Erro ao excluir documento.');
    }
  };

  const handleSeed = async () => {
    if (!confirm('Deseja gerar os documentos padrão do WINF? Isso adicionará novos registros.')) return;
    setLoading(true);
    try {
      for (const d of DEFAULT_WINF_DOCUMENTS) {
        await addDoc(collection(db, 'documents_master'), {
          ...d,
          created_at: new Date().toISOString()
        });
      }
      alert('Documentos gerados com sucesso!');
      fetchDocuments();
    } catch (e) {
      console.error("Error seeding documents: ", e);
      alert('Erro ao gerar documentos.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in text-white p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-winf-primary/10 border border-winf-primary/20 flex items-center justify-center">
              <FileText className="text-winf-primary" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter shadow-sm">Arsenal Tático Admin</h2>
              <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-medium">Gestão de Documentos WINF™</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={handleSeed} className="flex items-center gap-2 bg-zinc-900 border border-white/20 px-4 py-2 text-[10px] uppercase font-black tracking-widest hover:bg-white/5 transition-all">
            Gerar Documentos WINF (Seed)
          </button>
          <button onClick={() => { setIsCreating(true); setEditingDoc({ id: '', title: '', content: '', category: 'General', access_role: 'Licensee' } as DocumentItem); }} className="flex items-center gap-2 bg-winf-primary text-black px-4 py-2 text-[10px] uppercase font-black tracking-widest hover:bg-emerald-500 transition-all">
            <Plus size={16} /> Novo Documento
          </button>
        </div>
      </div>

      {(editingDoc || isCreating) ? (
        <div className="bg-[#131314] border border-white/10 p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <h3 className="text-lg font-black uppercase tracking-widest italic">{isCreating ? 'Novo Documento' : 'Editar Documento'}</h3>
            <button onClick={() => { setEditingDoc(null); setIsCreating(false); }} className="text-white/50 hover:text-white"><X size={20} /></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] text-white/60 mb-2 uppercase tracking-widest font-bold">Título</label>
                <input type="text" value={editingDoc?.title || ''} onChange={e => setEditingDoc({ ...editingDoc!, title: e.target.value })} className="w-full bg-[#0a0a0b] border border-white/10 p-3 text-sm text-white focus:border-winf-primary outline-none" />
              </div>
              <div>
                <label className="block text-[10px] text-white/60 mb-2 uppercase tracking-widest font-bold">Categoria</label>
                <input type="text" value={editingDoc?.category || ''} onChange={e => setEditingDoc({ ...editingDoc!, category: e.target.value })} className="w-full bg-[#0a0a0b] border border-white/10 p-3 text-sm text-white focus:border-winf-primary outline-none" />
              </div>
              <div>
                <label className="block text-[10px] text-white/60 mb-2 uppercase tracking-widest font-bold">Nível de Acesso</label>
                <select value={editingDoc?.access_level || 'Licensee'} onChange={e => setEditingDoc({ ...editingDoc!, access_level: e.target.value as any })} className="w-full bg-[#0a0a0b] border border-white/10 p-3 text-sm text-white focus:border-winf-primary outline-none">
                  <option value="Admin">Apenas Admin</option>
                  <option value="Licensee">Licenciado (Visível no Arsenal)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-white/60 mb-2 uppercase tracking-widest font-bold">Conteúdo (Markdown)</label>
                <textarea rows={15} value={editingDoc?.content || ''} onChange={e => setEditingDoc({ ...editingDoc!, content: e.target.value })} className="w-full bg-[#0a0a0b] border border-white/10 p-3 text-[12px] text-white font-mono focus:border-winf-primary outline-none custom-scrollbar" />
              </div>
              <button onClick={isCreating ? handleCreate : handleUpdate} className="flex items-center justify-center w-full gap-2 bg-winf-primary text-black py-4 font-black uppercase text-[12px] tracking-widest hover:bg-emerald-500 transition-all">
                <Save size={18} /> {isCreating ? 'Salvar Novo' : 'Atualizar'}
              </button>
            </div>

            <div className="border border-white/10 bg-[#0a0a0b] p-6 h-full flex flex-col">
              <h4 className="text-[10px] text-white/60 uppercase tracking-widest font-bold mb-4 border-b border-white/10 pb-2">Preview do PDF</h4>
              <div className="bg-white text-black p-8 flex-1 overflow-y-auto custom-scrollbar text-sm markdown-body prose max-w-none">
                <ReactMarkdown>{editingDoc?.content || '*Sem conteúdo*'}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             <div className="col-span-full py-20 text-center text-white/50 text-sm font-black uppercase tracking-widest animate-pulse">Carregando documentos...</div>
          ) : documents.length === 0 ? (
             <div className="col-span-full py-20 text-center text-white/50 text-sm font-black uppercase tracking-widest bg-white/5 border border-white/10">Nenhum documento encontrado. Utilize "Gerar Documentos" ou adicione um novo.</div>
          ) : (
            documents.map((doc, index) => {
               const colors = [
                 { accent: 'border-amber-500', gradient: 'from-amber-600/20' },
                 { accent: 'border-winf-primary', gradient: 'from-emerald-600/20' },
                 { accent: 'border-blue-500', gradient: 'from-blue-600/20' },
                 { accent: 'border-purple-500', gradient: 'from-purple-600/20' },
                 { accent: 'border-rose-500', gradient: 'from-rose-600/20' },
               ];
               const colorTheme = colors[index % colors.length];
               const wordCount = doc.content ? doc.content.split(' ').length : 0;
               const pages = Math.max(1, Math.ceil(wordCount / 250));

               return (
                 <div key={doc.id} className={`bg-[#131314] border border-white/5 p-6 flex flex-col justify-between hover:border-white/20 transition-all ${colorTheme.accent} border-t-4 relative group`}>
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                         <div className={`w-12 h-12 bg-gradient-to-br ${colorTheme.gradient} via-[#131314] to-black border border-white/5 flex items-center justify-center text-white/70 group-hover:text-white transition-all transform group-hover:scale-105`}>
                            <FileText size={20} />
                         </div>
                         <span className={`text-[8px] px-2 py-1 uppercase font-black tracking-widest ${doc.access_level === 'Admin' ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'}`}>
                           {doc.access_level || 'Licensee'}
                         </span>
                      </div>
                      
                      <div className="space-y-1">
                        <span className="text-[8px] uppercase tracking-[0.3em] text-white/30 font-black block">
                          {doc.category || 'Geral'}
                        </span>
                        <h4 className="text-white font-black text-base leading-tight uppercase italic tracking-tighter">
                          {doc.title}
                        </h4>
                      </div>

                      <p className="text-[11px] text-white/40 leading-relaxed font-medium line-clamp-3">
                        {doc.content.substring(0, 150)}...
                      </p>
                      
                      <div className="flex items-center gap-3 text-[9px] font-mono text-white/30 uppercase font-black tracking-widest">
                        <span className="flex items-center gap-1.5"><FileText size={10} /> {pages} {pages === 1 ? 'Página' : 'Páginas'}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-6 mt-6 border-t border-white/5">
                       <button onClick={() => {
                            const { id, title, content, category, access_level, access_role } = doc;
                            setEditingDoc({ id, title, content, category, access_level, access_role } as DocumentItem); 
                            setIsCreating(false);
                         }} className="flex-1 flex justify-center items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 p-2.5 text-[10px] uppercase font-black tracking-widest transition-all">
                         <Edit size={14} /> Editar
                       </button>
                       <button onClick={() => generateDocPDF(doc)} className="flex-1 flex justify-center items-center gap-2 bg-white text-black hover:bg-zinc-200 p-2.5 text-[10px] uppercase font-black tracking-widest transition-all">
                         <Download size={14} /> PDF
                       </button>
                       <button onClick={() => handleDelete(doc.id)} className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all border border-red-500/20">
                         <Trash2 size={14} />
                       </button>
                    </div>
                 </div>
               );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDocuments;
