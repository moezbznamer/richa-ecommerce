# Guide de Configuration - Panneau Admin Séparé

## 🎯 Architecture

Le panneau d'administration est conçu comme un projet **indépendant** qui partage la même base de données Supabase que l'application principale.

```
┌─────────────────────┐     ┌─────────────────────┐
│   Application       │     │   Panneau Admin     │
│   Principale        │     │   (Projet Séparé)   │
│   (Ce projet)       │     │                     │
└──────────┬──────────┘     └──────────┬──────────┘
           │                           │
           └───────────┬───────────────┘
                       │
              ┌────────▼────────┐
              │    Supabase     │
              │  (Base partagée)│
              └─────────────────┘
```

## 📋 Étapes pour créer le projet Admin

### 1. Initialiser le projet Admin

1. Créez un nouveau projet React/Vite nommé "RICHA Admin Panel"
2. Initialisez votre structure de projet autonome

### 2. Connecter à la même base Supabase

Dans le nouveau projet admin, utilisez ces credentials Supabase :

```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://oqxsjmyqolozjyibruxb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xeHNqbXlxb2xvemp5aWJydXhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MDM1MTcsImV4cCI6MjA3NzQ3OTUxN30.2_1A04zq6_twITCCcQqNCUdeqgUqn_ebEX05Tk4u9XA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
```

### 3. Copier les fichiers Admin

Copiez ces fichiers/dossiers dans le nouveau projet :

#### Fichiers requis :
- `src/pages/admin/AdminDashboard.tsx`
- `src/pages/admin/AddProduct.tsx`
- `src/pages/admin/ViewOrders.tsx`
- `src/components/AdminRoute.tsx`
- `src/hooks/useAuth.tsx`
- `src/contexts/AuthContext.tsx`
- `src/integrations/supabase/types.ts` (copier tel quel)

### 4. Configuration de l'URL de redirection

Dans Supabase Dashboard > Authentication > URL Configuration, ajoutez l'URL du nouveau projet admin :

- Site URL: `https://admin.richa-boutique.com`
- Redirect URLs: 
  - `https://admin.richa-boutique.com`
  - `https://richa-boutique.com`

### 5. Mettre à jour le lien dans l'application principale

Une fois le projet admin déployé, mettez à jour `ADMIN_PANEL_URL` dans :
- `src/components/Navbar.tsx`
- `src/components/mobile/MobileHeader.tsx`

## 🔐 Sécurité

La vérification admin est faite côté serveur via la fonction RPC `is_admin` :

```sql
-- Cette fonction existe déjà dans votre base
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = $1
  );
$$ LANGUAGE sql SECURITY DEFINER;
```

## 📱 Structure recommandée pour le projet Admin

```
admin-project/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Products.tsx
│   │   ├── Orders.tsx
│   │   └── Settings.tsx
│   ├── components/
│   │   ├── AdminLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── AdminRoute.tsx
│   ├── hooks/
│   │   └── useAuth.tsx
│   └── integrations/
│       └── supabase/
│           ├── client.ts
│           └── types.ts
```

## 🚀 Déploiement

1. Déployez le projet admin sur votre hébergeur (Vercel, Netlify, etc.)
2. Copiez l'URL déployée
3. Mettez à jour `ADMIN_PANEL_URL` dans l'application principale
4. Déployez l'application principale

## ❓ FAQ

**Q: Les sessions sont-elles partagées entre les deux apps ?**
R: Oui, car elles utilisent le même Supabase. Un admin connecté sur l'app principale sera reconnu sur le panneau admin.

**Q: Puis-je avoir des domaines personnalisés ?**
R: Oui, configurez-les dans les paramètres DNS de votre hébergeur.
