import React, { useState, useMemo } from 'react';
import { User, Phone, Mail, MapPin, CheckCircle, ArrowLeft, Search } from 'lucide-react';
import { motion } from 'framer-motion';

import { useWinf } from '../contexts/WinfContext';

interface CustomerFormData {
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
  categoria: 'Cliente Final' | 'Arquiteto' | 'Vidraceiro' | 'Serralheiro' | 'Síndico' | 'Licenciado';
  isRecorrente: boolean;
  isEspecial: boolean;
}

interface ModuleCustomerRegistrationProps {
  onBack: () => void;
}

interface Customer extends CustomerFormData {
  id: string;
}

const ModuleCustomerRegistration: React.FC<ModuleCustomerRegistrationProps> = ({ onBack }) => {
  const { addLead } = useWinf();
  const [formData, setFormData] = useState<CustomerFormData>({
    nome: '',
    telefone: '',
    email: '',
    endereco: '',
    categoria: 'Cliente Final',
    isRecorrente: false,
    isEspecial: false,
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [errors, setErrors] = useState<Partial<CustomerFormData>>({});
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  const validate = () => {
    const newErrors: Partial<CustomerFormData> = {};
    if (!formData.nome.trim()) newErrors.nome = 'O nome é obrigatório';
    if (!formData.telefone.trim()) newErrors.telefone = 'O telefone é obrigatório';
    if (!formData.email.trim()) {
      newErrors.email = 'O email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.endereco.trim()) newErrors.endereco = 'O endereço é obrigatório';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (formData.isEspecial && customers.filter(c => c.isEspecial).length >= 100) {
          alert('Limite de 100 clientes especiais atingido!');
          return;
      }
      setIsSubmitting(true);
      
      // Simulating DB add and local state update for search
      const newCustomer: Customer = { ...formData, id: Date.now().toString() };
      setCustomers([...customers, newCustomer]);

      const res = await addLead({
        name: formData.nome,
        phone: formData.telefone,
        city: formData.endereco,
        service_type: formData.isEspecial ? 'WINF Especial' : 'WINF Select™',
        status: 'new',
        is_public: false,
        source: 'Manual - App Registration',
        vehicle_model: 'Residencial/Comercial'
      });
      setIsSubmitting(false);

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setFormData({ nome: '', telefone: '', email: '', endereco: '', isRecorrente: false, isEspecial: false });
        }, 3000);
      } else {
        alert(res.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#131314] text-white p-6 pb-24 md:pb-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-none transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-white">Winf™ | Gestão de Clientes</h1>
            <p className="text-zinc-400 text-sm mt-1">Cadastro e consulta de clientes</p>
          </div>
        </div>

        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-green-500/10 border border-green-500/20 rounded-none text-center space-y-4"
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-none flex items-center justify-center mx-auto text-green-500">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-green-500 uppercase tracking-widest">Cliente Registrado</h2>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#121212] border border-[#444746] p-6 md:p-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Categoria de Acesso / Tipo</label>
                <select 
                  value={formData.categoria} 
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value as any })}
                  className="w-full bg-[#131314] border border-[#444746] rounded-none px-4 py-3 text-white focus:outline-none focus:border-winf-primary transition-colors appearance-none cursor-pointer"
                >
                  <option value="Cliente Final">Cliente Final (Comprador)</option>
                  <option value="Arquiteto">Parceiro: Arquiteto (Gratuito)</option>
                  <option value="Vidraceiro">Parceiro: Vidraceiro (Gratuito)</option>
                  <option value="Serralheiro">Parceiro: Serralheiro (Gratuito)</option>
                  <option value="Síndico">Parceiro: Síndico (Gratuito)</option>
                  <option value="Licenciado">Operador Autorizado / Licenciado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Nome Completo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-zinc-600" />
                  </div>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className={`w-full bg-[#131314] border ${errors.nome ? 'border-red-500' : 'border-[#444746]'} rounded-none pl-12 pr-4 py-3 text-white focus:outline-none focus:border-winf-primary transition-colors`}
                    placeholder="Nome"
                  />
                </div>
                {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Telefone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="w-5 h-5 text-zinc-600" />
                    </div>
                    <input
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      className={`w-full bg-[#131314] border ${errors.telefone ? 'border-red-500' : 'border-[#444746]'} rounded-none pl-12 pr-4 py-3 text-white focus:outline-none focus:border-winf-primary transition-colors`}
                      placeholder="(XX) XXXXX-XXXX"
                    />
                  </div>
                  {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone}</p>}
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-zinc-600" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full bg-[#131314] border ${errors.email ? 'border-red-500' : 'border-[#444746]'} rounded-none pl-12 pr-4 py-3 text-white focus:outline-none focus:border-winf-primary transition-colors`}
                      placeholder="cliente@email.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Endereço Completo</label>
                <div className="relative">
                  <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                    <MapPin className="w-5 h-5 text-zinc-600" />
                  </div>
                  <textarea
                    value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    className={`w-full bg-[#131314] border ${errors.endereco ? 'border-red-500' : 'border-[#444746]'} rounded-none pl-12 pr-4 py-3 text-white focus:outline-none focus:border-winf-primary transition-colors min-h-[100px]`}
                    placeholder="Endereço completo"
                  />
                </div>
                {errors.endereco && <p className="text-red-500 text-xs mt-1">{errors.endereco}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#444746] pt-4 mt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.isRecorrente} 
                  onChange={(e) => setFormData({...formData, isRecorrente: e.target.checked})}
                  className="w-5 h-5 bg-[#131314] border-[#444746] rounded-none accent-winf-primary focus:ring-0"
                />
                <span className="text-sm text-zinc-300">Cliente Recorrente</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.isEspecial} 
                  onChange={(e) => setFormData({...formData, isEspecial: e.target.checked})}
                  className="w-5 h-5 bg-[#131314] border-[#444746] rounded-none accent-amber-500 focus:ring-0"
                />
                <div>
                  <span className="block text-sm text-amber-500 font-medium">Cliente Especial 100</span>
                  <span className="block text-[10px] text-zinc-500">Faz parte do grupo seleto (Máximo 100)</span>
                </div>
              </label>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-widest py-4 rounded-none transition-all">
              {isSubmitting ? 'Registrando...' : 'Registrar Cliente'}
            </button>
          </form>
        )}

        <div className="bg-[#121212] border border-[#444746] p-6 lg:p-8">
            <h2 className="text-xl font-light text-white mb-6 uppercase tracking-widest flex items-center gap-2">
              <User size={20} className="text-zinc-500" />
              Gestão de Clientes e Parceiros (Asset Light)
            </h2>
            <div className="relative mb-6">
                <Search className="absolute left-4 top-3.5 text-zinc-600" size={20} />
                <input 
                  type="text" 
                  placeholder="Buscar por nome, email ou telefone..." 
                  className="w-full bg-[#131314] border border-[#444746] pl-12 pr-4 py-3 text-white focus:outline-none focus:border-winf-primary transition-colors rounded-none" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
            </div>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredCustomers.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500 font-mono text-sm uppercase tracking-widest border border-dashed border-[#444746]">
                    Nenhum registro encontrado
                  </div>
                ) : (
                  filteredCustomers.map(c => (
                      <div key={c.id} className="p-4 bg-[#131314] border border-[#444746] flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-zinc-500 transition-colors">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-lg">{c.nome}</span>
                              <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 text-[10px] uppercase font-bold tracking-widest border border-zinc-700">{c.categoria}</span>
                              {c.isEspecial && <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] uppercase font-bold tracking-widest border border-amber-500/20">Especial 100</span>}
                              {c.isRecorrente && <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] uppercase font-bold tracking-widest border border-blue-500/20">Recorrente</span>}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-400 font-mono">
                              <span className="flex items-center gap-1"><Mail size={12} /> {c.email}</span>
                              <span className="flex items-center gap-1"><Phone size={12} /> {c.telefone}</span>
                            </div>
                          </div>
                          <div className="text-xs text-zinc-500 flex items-start gap-1 max-w-xs">
                            <MapPin size={14} className="shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{c.endereco}</span>
                          </div>
                      </div>
                  ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleCustomerRegistration;
