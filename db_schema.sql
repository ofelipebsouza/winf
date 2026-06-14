-- =============================================================================
-- WINF SYSTEM™ DB SCHEMA (PostgreSQL / Supabase compatible)
-- Mapeamento completo e fidedigno do Frontend (React / Zustand Types)
-- Projetado para Felipe (Desenvolvedor da WINF)
-- Data: 20/05/2026
-- =============================================================================

-- Habilitar extensões comuns necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. ENUMS E DOMÍNIOS (Mapeamento de Types)
-- -----------------------------------------------------------------------------
CREATE TYPE winf_role AS ENUM (
  'Licenciado', 'Admin', 'Member', 'Collaborator', 'Instalador', 
  'Arquiteto', 'Architect', 'Investor', 'ADMIN', 'ARCHITECT', 
  'ASSET_LIGHT', 'INVESTOR'
);

CREATE TYPE business_model AS ENUM ('STUDIO', 'ONLINE', 'KIOSK', 'CORPORATE', 'ASSET_LIGHT');
CREATE TYPE doc_category AS ENUM ('Estratégia', 'Marca', 'Técnico', 'Equity', 'Operacional');
CREATE TYPE technical_lvl AS ENUM ('Iniciante', 'Intermediário', 'Avançado', 'Master');
CREATE TYPE col_lvl AS ENUM ('Operador', 'Especialista', 'Master');
CREATE TYPE t_lvl AS ENUM ('Authorized', 'Specialist', 'Master');

-- -----------------------------------------------------------------------------
-- 2. TABELA DE USUÁRIOS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY, -- id único vindo do Auth (Firebase uid ou Supabase uuid)
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role winf_role DEFAULT 'Member',
  avatar TEXT,
  winf_coins INT DEFAULT 0,
  company VARCHAR(255),
  phone VARCHAR(20),
  cnpj VARCHAR(20),
  business_model business_model,
  territory VARCHAR(100),
  city VARCHAR(100),
  technical_level technical_lvl,
  certifications TEXT[], -- Array de certificados
  installation_history_count INT DEFAULT 0,
  w_rank_xp INT DEFAULT 0,
  w_rank_level VARCHAR(50) DEFAULT 'Starter',
  collaborator_level col_lvl,
  tech_level t_lvl DEFAULT 'Authorized',
  is_active BOOLEAN DEFAULT TRUE,
  winf_knowledge INT DEFAULT 0,
  cortex_influence INT DEFAULT 0,
  neural_memory INT DEFAULT 0,
  tactical_assets INT DEFAULT 0,
  plan VARCHAR(50) DEFAULT 'nivel1',
  
  -- Campos de folga de arquitetura (arch_clearance)
  arch_clearance_invisible BOOLEAN DEFAULT FALSE,
  arch_clearance_blackpro BOOLEAN DEFAULT FALSE,
  arch_clearance_dualreflect BOOLEAN DEFAULT FALSE,
  
  -- Endereço
  address_street TEXT,
  address_city VARCHAR(100),
  address_state VARCHAR(50),
  address_zip VARCHAR(20),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crir gatilho para atualização automática de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE PROCEDURE update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 3. TABELA DE LEADS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  contact VARCHAR(255) NOT NULL,
  source VARCHAR(100) NOT NULL, -- 'Google Ads', 'Instagram', 'Kiosk', 'Architect' etc.
  campaign_name VARCHAR(150),
  interest TEXT, -- Produto ou serviço de interesse
  status VARCHAR(100) DEFAULT 'Novo',
  ai_score INT DEFAULT 50,
  dominance_score INT DEFAULT 50,
  city VARCHAR(100),
  value DECIMAL(12, 2) DEFAULT 0.00,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_leads_modtime 
  BEFORE UPDATE ON leads 
  FOR EACH ROW 
  EXECUTE PROCEDURE update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 4. TABELA DE PRODUTOS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(100) PRIMARY KEY, -- SKU ou ID de Catálogo
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  type VARCHAR(50),
  heat_rejection INT DEFAULT 0,
  uv_rejection INT DEFAULT 0,
  vlt INT DEFAULT 0, -- Transmissão de Luz Visível
  thickness VARCHAR(50),
  durability_years INT,
  price_m2 DECIMAL(10, 2) DEFAULT 0.00,
  stock_m2 DECIMAL(12, 2) DEFAULT 0.00,
  rating DECIMAL(3,2) DEFAULT 5.00,
  benefits TEXT[], -- Array de benefícios em texto
  description TEXT,
  specifications JSONB, -- Propriedades e coeficientes adicionais de engenhosidade
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 5. TABELA DE ORDENS (ORDERS) E ORÇAMENTOS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_contact VARCHAR(255),
  total_value DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  sub_total DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  taxes DECIMAL(12, 2) DEFAULT 0.00,
  profit_margin DECIMAL(5,2) DEFAULT 0.00,
  status VARCHAR(50) DEFAULT 'Orçamento',
  is_synced_kiosk BOOLEAN DEFAULT FALSE,
  
  -- Cálculo de Corte Integrado WINF Precision™
  m2_applied DECIMAL(10,2) DEFAULT 0.00,
  nesting_saving_percent DECIMAL(5,2) DEFAULT 0.00, -- Otimização gerada pelo algoritmo
  nesting_saving_val DECIMAL(12, 2) DEFAULT 0.00,
  waste_percentage DECIMAL(5,2) DEFAULT 0.00,
  
  -- Identificação e prazos
  worker_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
  installation_date DATE,
  notes TEXT,
  items JSONB, -- Array de itens comprados/medidas e película usada [{sku, width, height, qty}]
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_orders_modtime 
  BEFORE UPDATE ON orders 
  FOR EACH ROW 
  EXECUTE PROCEDURE update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 6. TABELA DE MONITORAMENTO E INSTALAÇÕES (CHECK-IN)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS installations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  technician_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
  client_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'Agendado',
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_date TIMESTAMP WITH TIME ZONE,
  
  -- Dados de Check-in de Campo (Regulado por W-Rank)
  checkin_latitude DECIMAL(9,6),
  checkin_longitude DECIMAL(9,6),
  checkin_address TEXT,
  checkin_photos TEXT[], -- Array de URLs das fotos do check-in
  checkpoint_passed BOOLEAN DEFAULT FALSE,
  
  -- Avaliação
  client_rating INT CHECK (client_rating >= 1 AND client_rating <= 5),
  client_feedback TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_installations_modtime 
  BEFORE UPDATE ON installations 
  FOR EACH ROW 
  EXECUTE PROCEDURE update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 7. REGISTRO DE GARANTIAS EMITIDAS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS warranties (
  id VARCHAR(255) PRIMARY KEY, -- Código do certificado (ex: CERT-2026-XXXX)
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  product_sku VARCHAR(100) REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  m2_applied DECIMAL(10,2) NOT NULL,
  m2_price_unit DECIMAL(12,2),
  
  installation_date DATE NOT NULL,
  expiration_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Ativa', -- 'Ativa', 'Expirada', 'Revogada'
  pdf_url TEXT, -- Arquivo assinado e selado
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_warranties_modtime 
  BEFORE UPDATE ON warranties 
  FOR EACH ROW 
  EXECUTE PROCEDURE update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 8. MATRIZ DE APORTES, INVESTIMENTOS E DIVIDENDOS (DARK POOL SYSTEM)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  pool_id VARCHAR(100) NOT NULL DEFAULT 'DARK_POOL_MAIN',
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'active', 'completed'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE CONSTRAINT TRIGGER check_investment_status_enum 
  AFTER INSERT OR UPDATE ON investments
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TABLE IF NOT EXISTS dividends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  investment_id UUID REFERENCES investments(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processed'
  payout_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 9. LOGS DE AUTOMAÇÕES E CHATS (WHATSAPP HUB & WINF BRAIN)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS active_chats (
  id VARCHAR(255) PRIMARY KEY, -- WA Chat ID ou hash
  customer_name VARCHAR(255) NOT NULL,
  last_message TEXT,
  last_message_time TIMESTAMP WITH TIME ZONE NOT NULL,
  city VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'bot_handling', -- 'bot_handling', 'routed', 'waiting'
  whatsapp_config_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agent_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL, -- 'ALERT', 'OPPORTUNITY', 'NEURAL_LINK'
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  related_entity_id VARCHAR(255),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agent_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  agent_type VARCHAR(100) NOT NULL, -- 'WINF_BRAIN', 'WHATSAPP_BOT', 'PRECISION_CUTTER'
  action VARCHAR(255) NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 10. RECOMPENSAS E SEÇÃO DE GAMIFICAÇÃO (W-RANK LOG)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wrank_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  action_type VARCHAR(100) NOT NULL, -- 'SALE_CLOSED', 'CHECKIN_UPLOAD', etc.
  xp_gained INT DEFAULT 0,
  coins_gained INT DEFAULT 0,
  description VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
