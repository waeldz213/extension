# 🔒 DSFGenius — Prospection IA pour Agences Web

Plateforme SaaS de prospection intelligente qui audite les sites de vos prospects, détecte leurs failles techniques, et génère des pitchs personnalisés.

## ✨ Fonctionnalités

### 📊 Dashboard (Command Center)
- Vue d'ensemble de tous vos leads
- Heat Score calculé par IA (0-100)
- Statistiques en temps réel (taux de conversion, prospects contactés, etc.)
- Activité récente

### 🔍 Site Auditor
- **Lighthouse API** (Google, 100% gratuit) — Performance, Accessibilité, SEO
- **Scraping HTML** — Analyse du code source, détection de technologies
- **Détection de failles** — jQuery obsolète, pas de HTTPS, CVE connues
- **Tech Stack** — Framework, CMS, librairies JS, analytics

### 💬 Smart Pitcher
- 3 variantes d'emails générées par IA :
  - **Agressif** — Direct, chiffres choc, urgence
  - **Empathique** — Bienveillant, sans pression
  - **Expert** — Technique, précis, professionnel
- Utilise Claude API si disponible, sinon templates locaux

### 📋 CRM Kanban
- Drag & drop des prospects
- Colonnes : Nouveau → Contacté → RDV Pris → Proposition → Signé
- **CRUD complet** : Ajout, modification, suppression de leads
- Détail de chaque lead avec actions (audit, pitch, edit, delete)

### 🔥 Heat Score IA
- Algorithme local (pas d'API nécessaire)
- Basé sur : Lighthouse (25%) + SEO (25%) + Sécurité (30%) + Dette technique (20%)
- Score 0-100 avec labels : Froid / Tiède / Chaud / Brûlant

### 🗄️ Base de Données (Supabase)
- Persistance des leads dans Supabase (PostgreSQL)
- Taux de conversion calculé en temps réel
- Prospects contactés trackés
- Fallback sur données mock si Supabase non configuré

## 🛠 Stack Technique

| Technologie | Usage | Coût |
|---|---|---|
| **Next.js 16** (App Router) | Frontend + API Routes | Gratuit |
| **Tailwind CSS 4** | Styling dark theme | Gratuit |
| **TypeScript** | Type safety | Gratuit |
| **Supabase** | Base de données PostgreSQL | Gratuit (tier free) |
| **Lucide Icons** | Icônes | Gratuit |
| **Google PageSpeed API** | Lighthouse scores | Gratuit (25 req/jour) |
| **Cheerio** | HTML scraping | Gratuit |
| **Claude API** (optionnel) | IA Deep Analysis | $5 crédit gratuit |

## 🚀 Démarrage Rapide

```bash
cd leadgenius

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Ouvrir http://localhost:3000
```

## 🗄️ Configuration Supabase

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Exécutez le script `supabase-schema.sql` dans l'éditeur SQL de Supabase
3. Copiez `.env.local.example` en `.env.local` et renseignez vos clés :

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Sans Supabase, l'app fonctionne quand même** avec les données mock en mémoire.

## 🔑 Variables d'Environnement

Créez un fichier `.env.local` dans le dossier `leadgenius/` :

```env
# Supabase (recommandé)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optionnel - Pour l'IA Deep Analysis des pitchs
ANTHROPIC_API_KEY=sk-ant-...

# Optionnel - Pour augmenter les limites Lighthouse
GOOGLE_API_KEY=...
```

## 📁 Structure du Projet

```
leadgenius/
├── supabase-schema.sql          # Script SQL pour créer la table leads
├── .env.local.example           # Template des variables d'environnement
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Thème dark futuriste
│   │   ├── dashboard/page.tsx    # Command Center
│   │   ├── auditor/page.tsx      # Site Auditor
│   │   ├── pitcher/page.tsx      # Smart Pitcher
│   │   ├── kanban/page.tsx       # CRM Kanban (CRUD complet)
│   │   └── api/
│   │       ├── leads/route.ts    # API CRUD Leads (GET, POST)
│   │       ├── leads/[id]/route.ts # API Lead (GET, PUT, DELETE)
│   │       ├── stats/route.ts    # API Dashboard Stats
│   │       ├── audit/route.ts    # API Lighthouse + Scraping
│   │       ├── pitch/route.ts    # API Génération pitchs
│   │       └── score/route.ts    # API Heat Score
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx      # Layout avec/sans sidebar
│   │   │   ├── Sidebar.tsx       # Menu latéral rétractable
│   │   │   └── TopBar.tsx        # Barre supérieure
│   │   └── ui/
│   │       └── ScoreRing.tsx     # Composants UI (scores, badges, cards)
│   ├── lib/
│   │   ├── supabase.ts           # Client Supabase
│   │   ├── leads.ts              # Data access layer (Supabase + fallback)
│   │   ├── heat-score.ts         # Algorithme Heat Score
│   │   └── mock-data.ts          # Données de démo (fallback)
│   └── types/
│       ├── index.ts              # Types TypeScript
│       └── database.ts           # Types Supabase
```

## 🚀 Déploiement sur Vercel

1. Push le code sur GitHub
2. Allez sur [vercel.com](https://vercel.com)
3. Importez le repo
4. Root Directory : `leadgenius`
5. Ajoutez les variables d'environnement Supabase
6. Deploy → Votre SaaS est en ligne

## 🔮 Prochaines Étapes

- [x] Intégration Supabase (base de données persistante)
- [ ] Authentification utilisateur (Supabase Auth)
- [ ] Prévisualisation en direct du site "corrigé" par IA
- [ ] Export PDF des rapports d'audit
- [ ] Intégration Zapier / Make
- [ ] Mode multi-utilisateurs
- [ ] Système de facturation (Stripe)