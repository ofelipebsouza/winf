# MANIFESTO E GUIA DE INTEGRAÇÃO DE SÃO PAULO/SANTOS: DIRECTIVE PARA FELIPE (WINF DEVELOPER)

Fala, Felipe! Este documento foi estruturado especificamente para você assumir a engenharia do **Ecossistema WINF System™** e migrar a máquina do estado simulado local para um banco de dados real em produção contínua. 

O Web App está inteiramente modularizado, limpo astronomicamente do lado do cliente com **React 19 + Vite + Tailwind CSS v4 + TypeScript**, e utiliza o **Zustand** para gerenciamento de fluxo global de memória.

Abaixo, você encontrará o roteiro estrutural exato de onde plugar as conexões e como orquestrar tanto a arquitetura relacional (PostgreSQL / Supabase) quanto não-relacional em tempo real (Firebase).

---

## 1. Mapeamento Arquitetônico do Código (Onde estão as Joias?)

O ecossistema divide-se de maneira modular para evitar limites de processamento e arquivos gigantescos:

*   **Definições Gerais e Interfaces:** `/src/types.ts`
    *   Aqui residem todas as tipagens fortes de dados (ex: `User`, `Lead`, `Product`, `Order`, `Installation`, `WarrantyRegistration`, `ParadoxAnalysis`).
*   **Central do Estado (Memory Base):** `/src/store/useWinfStore.ts`
    *   Este é o **coração** do seu gerenciamento de dados no cliente. O estado atual possui os arrays de `leads`, `orders`, `installations`, e `warranties` indexados de forma limpa.
*   **Painel e Cadernos Comerciais:** `/src/components/ModuleExecutiveDocs.tsx`
    *   Integrado com um motor de exportação de dados (.TXT em formato de caderno corporativo unificado) para apresentar a investidores, franqueados e licenciados asset light sobre os rendimentos corporativos e políticas reguladoras.
*   **Serviços e Conectividade:** `/src/services`
    *   Guarda as lógicas do `mqttService.ts` (para telemetria de sensores de fluxo e bobina), `socket.ts` (para redes dinâmicas) e `winfApi.ts` (sua camada HTTP para conexão futura com um Express ou sua própria API).

---

## 2. Abordagem de Banco de Dados: Suas Duas Opções Preparadas

Para te poupar dias de desenho lógico de modelagem, já criei os dois escopos e plantas de arquitetura. Escolha o que melhor se adapta à sua esteira atual:

### Opção A: PostgreSQL / Supabase Relacional
Se você optar por escalabilidade de banco SQL com triggers rápidos e excelente rastreabilidade de DRE:
1.  **Acesse o arquivo físico:** `/db_schema.sql` na raiz do projeto.
2.  **O que há lá:** Contém o banco completo projetado com Enums nativos (`winf_role`, `business_model`), relacionamentos rigorosos de FK, triggers automáticos para `updated_at`, e tipos customizados para orçamentos, dados precisos calculados pelo algoritmo **WINF Precision™** e tabelas do ecossistema do **Dark Pool** (Investidores e Dividendos).

### Opção B: Firebase Firestore / NoSQL em Tempo Real
Se você optar pela flexibilidade de coleções e sincronia nativa em tempo real com regras baseadas em papéis (`User.role`):
1.  **Acesse o arquivo físico:** `/firebase-blueprint.json` na raiz do projeto.
2.  **O que há lá:** O mapeamento exato das estruturas das coleções (`/users`, `/investments`, `/dividends`, `/agent_insights`, `/core_ai_chats`) prontas para replicação.
3.  **Segurança das Coleções:** Já providenciei o `/firestore.rules` pronto com travas precisas de proteção de propriedade intelectual.

---

## 3. Guia Prático: Como Sincronizar o Zustand do Web App com APIs Reais

Todas as suas queries devem idealmente ser disparadas ou resolvidas dentro do Zustand, encapsulando os dados e mantendo a renderização transparente para as dezenas de módulos visuais.

### Exemplo de Migração no Zustand (`/src/store/useWinfStore.ts`)

#### 🛑 Como está hoje (Simulação em Memória do Cliente):
```typescript
setLeads: (leads) => set({ leads }),
setOrders: (orders) => set({ orders }),
distributeLead: async (leadData) => {
  // Simula timeout e joga o lead na fila
  await new Promise((resolve) => setTimeout(resolve, 1500));
  // Adiciona ao chat local...
}
```

#### ✅ Como você deve estruturar para Supabase (Exemplo PostgreSQL):
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Dentro de useWinfStore actions:
fetchLeads: async () => {
  set({ isLoading: true });
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (!error && data) {
    set({ leads: data });
  }
  set({ isLoading: false });
},

addLead: async (newLead) => {
  const { data, error } = await supabase
    .from('leads')
    .insert([newLead])
    .select();
    
  if (!error && data) {
    set((state) => ({ leads: [data[0], ...state.leads] }));
    return { success: true };
  }
  return { success: false, error };
}
```

#### ✅ Como você deve estruturar para Firebase Firestore (Exemplo NoSQL):
```typescript
import { db } from '../config/firebase'; // Sua inicialização padrão
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';

// Dentro de useWinfStore actions:
fetchLeadsFirebase: async () => {
  set({ isLoading: true });
  try {
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const leadsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    set({ leads: leadsList });
  } catch (err) {
    console.error("Erro ao buscar leads via Firebase:", err);
  } finally {
    set({ isLoading: false });
  }
}
```

---

## 4. Onde Configurar os Segredos (Environment Variables)

A plataforma já possui escopo isolado de variáveis. Preparei o arquivo `/.env.example` para você mapear com os segredos de produção:

1.  Crie um arquivo `.env` ou `.env.local` na raiz de seu diretório de trabalho.
2.  Configure as credenciais e APIs que os SDKs utilizarão do lado do cliente (use o prefixo `VITE_` requerido pelo Vite):
    *   `VITE_SUPABASE_URL` ou conexões correspondentes do Firebase.

---

## 5. Fluxo de Deploy de Segurança de Banco (Pronto no Workspace)
Se optar pelo Firebase, observe os arquivos de conformidade de infraestrutura presentes:
*   Use as regras de proteção do `/firestore.rules` usando a CLI do Firebase (`firebase deploy --only firestore:rules`) ou copiando diretamente no Console Administrativo para evitar vazamento de auditoria e manter os dados de aportes financeiros protegidos de acessos não autenticados.

---

### Mensagem de Sucesso do Time de Desenvolvimento do Workspace AI Studio:
*Felipe, o sistema visual está 100% polido, responsivo e compilado com sucesso na tecnologia do React 19. Você tem agora a infraestrutura modelar de banco e o guia tático em mãos para fazer esta rede decolar juridicamente e operacionalmente por todo o Brasil. Bom código!*
