# 📋 Análise de Arquivos Não Utilizados - Eleveia

**Data da Análise:** 31 de Janeiro de 2026  
**Total de Arquivos:** 119 arquivos TypeScript/TSX

---

## 🔴 ARQUIVOS NÃO UTILIZADOS (Recomendado Remover)

### 1. **Arquivos Completamente Comentados**

#### ✗ `src/hooks/useSchool.ts`
- **Status:** 100% comentado (não funciona)
- **Descrição:** Hook customizado para facilitar uso do RTK Query (nunca implementado)
- **Razão:** Parece ser uma versão antiga/descontinuada
- **Ação:** Pode ser removido com segurança

#### ✗ `src/services/uzapiApi.ts`
- **Status:** 100% comentado (não funciona)
- **Descrição:** API com acesso ao Redux (versão não utilizada)
- **Razão:** Substituído por `src/services/useInstance.ts`
- **Ação:** Pode ser removido - a funcionalidade está em `useInstance.ts`

---

### 2. **Arquivos Exportados mas Não Importados**

#### ✗ `src/pages/Leads/components/LeadsListView.tsx`
- **Status:** Não é importado em nenhum lugar
- **Descrição:** Componente de visualização em lista para Leads
- **Localização:** [src/pages/Leads/components/LeadsListView.tsx](src/pages/Leads/components/LeadsListView.tsx)
- **Importado em:** Nenhum arquivo
- **Utilizado em:** Não está sendo usado
- **Razão:** Página de Leads usa apenas: `LeadStats`, `LeadFilters`, `LeadGridView`, `LeadListView`, e `LeadsKanbanView`
- **Ação:** Pode ser removido se não há planos de usar

---

### 3. **Arquivos de Debug Não Utilizados**

#### ✗ `src/components/debug/TokenDebug.tsx`
- **Status:** 100% comentado (não funciona)
- **Descrição:** Componente para debug visual do token
- **Razão:** Desenvolvimento descontinuado
- **Ação:** Pode ser removido (é um componente de debug)

---

### 4. **Arquivos de Texto (Não São Código)**

#### ⚠️ `src/components/FAQs/inde.txt`
- **Status:** Arquivo .txt em pasta de componentes
- **Descrição:** Parece ser um arquivo de notas/backup (extensão .txt em lugar errado)
- **Razão:** Não é código TypeScript/TSX
- **Ação:** Deveria ser removido do repositório (não é código)

---

## 🟡 ARQUIVOS COMENTADOS (Mantém Infraestrutura)

### ⚠️ `src/services/uzapiApi.ts` (COMENTADO)
- Substituído por: `src/services/useInstance.ts` (versão ativa)
- Este arquivo está completamente comentado e pode ser removido

---

## ✅ RECOMENDAÇÕES

### Remover Imediatamente:
1. **`src/pages/Leads/components/LeadsListView.tsx`** - Não é utilizado
2. **`src/services/uzapiApi.ts`** - Completamente comentado
3. **`src/hooks/useSchool.ts`** - Completamente comentado
4. **`src/components/debug/TokenDebug.tsx`** - Completamente comentado
5. **`src/components/FAQs/inde.txt`** - Arquivo .txt em pasta de código

### Investigar:
- [ ] Se `LeadsListView.tsx` foi substituído por `LeadListView.tsx` (note a diferença no nome)
- [ ] Confirmar se a funcionalidade de `uzapiApi.ts` está 100% transferida para `useInstance.ts`

---

## 📊 Resumo de Saúde do Projeto

| Categoria | Total | Status |
|-----------|-------|--------|
| Arquivos TypeScript/TSX | 119 | ✅ Analisados |
| Arquivos Ativos | 114 | ✅ Em Uso |
| Arquivos Não Utilizados | 4 | ⚠️ Recomendado Remover |
| Arquivos Comentados | 3 | 🟡 Obsoletos |
| Arquivos Problemáticos | 1 | ❌ Deve Remover |

---

## 🔍 Detalhes de Importação

### Imports Mais Comuns:
- ✅ `src/services` - Importado em ~40 arquivos
- ✅ `src/components/common` - Importado em ~30 arquivos
- ✅ `src/hooks` - Importado em ~25 arquivos
- ✅ `src/routes/AppRoutes` - Raiz da aplicação

### Componentes Órfãos Encontrados:
- ❌ `LeadsListView` - Definido mas nunca importado
- ❌ `TokenDebug` - Completamente comentado
- ⚠️ `useSchool` - Completamente comentado
- ⚠️ `uzapiApi` - Completamente comentado

---

## 📝 Notas

1. **Diferença de Nomes:** Note que existe `LeadListView.tsx` (utilizado) vs `LeadsListView.tsx` (não utilizado). Pode haver duplicação intencional ou erro de nomenclatura.

2. **Arquivo .txt:** `src/components/FAQs/inde.txt` parece ser um arquivo de backup/notas que não deveria estar no repositório.

3. **Código Comentado:** Os arquivos `useSchool.ts`, `uzapiApi.ts` e `TokenDebug.tsx` estão 100% comentados, sugerindo que eram versões antigas que foram substituídas.
