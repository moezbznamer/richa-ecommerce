export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_audit: {
        Row: {
          action_type: string
          admin_user_id: string
          created_at: string
          id: string
          new_values: Json | null
          old_values: Json | null
          record_id: string
          table_name: string
        }
        Insert: {
          action_type: string
          admin_user_id: string
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id: string
          table_name: string
        }
        Update: {
          action_type?: string
          admin_user_id?: string
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string
          table_name?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      commande: {
        Row: {
          adresse_livraison: string | null
          date_commande: string | null
          id_commande: number
          id_utilisateur: number | null
          methode_paiement: string | null
          numero_telephone: string | null
          statut: string | null
          total: number | null
          updated_at: string | null
        }
        Insert: {
          adresse_livraison?: string | null
          date_commande?: string | null
          id_commande?: number
          id_utilisateur?: number | null
          methode_paiement?: string | null
          numero_telephone?: string | null
          statut?: string | null
          total?: number | null
          updated_at?: string | null
        }
        Update: {
          adresse_livraison?: string | null
          date_commande?: string | null
          id_commande?: number
          id_utilisateur?: number | null
          methode_paiement?: string | null
          numero_telephone?: string | null
          statut?: string | null
          total?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commande_id_utilisateur_fkey"
            columns: ["id_utilisateur"]
            isOneToOne: false
            referencedRelation: "utilisateur"
            referencedColumns: ["id_utilisateur"]
          },
        ]
      }
      commande_details: {
        Row: {
          color: string | null
          created_at: string | null
          id_commande: number | null
          id_detail: number
          id_produit: number | null
          prix_unitaire: number
          quantite: number
          size: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id_commande?: number | null
          id_detail?: number
          id_produit?: number | null
          prix_unitaire: number
          quantite?: number
          size?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id_commande?: number | null
          id_detail?: number
          id_produit?: number | null
          prix_unitaire?: number
          quantite?: number
          size?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commande_details_id_commande_fkey"
            columns: ["id_commande"]
            isOneToOne: false
            referencedRelation: "commande"
            referencedColumns: ["id_commande"]
          },
          {
            foreignKeyName: "commande_details_id_produit_fkey"
            columns: ["id_produit"]
            isOneToOne: false
            referencedRelation: "produit"
            referencedColumns: ["id_produit"]
          },
        ]
      }
      custom_design_requests: {
        Row: {
          color_preferences: string | null
          created_at: string
          customer_email: string
          customer_name: string
          design_concept: string
          fabric_preference: string | null
          fit_description: string | null
          id: string
          phone_number: string | null
          size_preference: string | null
          special_instructions: string | null
          status: string
          updated_at: string
          uploaded_files: string[] | null
          user_id: string | null
        }
        Insert: {
          color_preferences?: string | null
          created_at?: string
          customer_email: string
          customer_name: string
          design_concept: string
          fabric_preference?: string | null
          fit_description?: string | null
          id?: string
          phone_number?: string | null
          size_preference?: string | null
          special_instructions?: string | null
          status?: string
          updated_at?: string
          uploaded_files?: string[] | null
          user_id?: string | null
        }
        Update: {
          color_preferences?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          design_concept?: string
          fabric_preference?: string | null
          fit_description?: string | null
          id?: string
          phone_number?: string | null
          size_preference?: string | null
          special_instructions?: string | null
          status?: string
          updated_at?: string
          uploaded_files?: string[] | null
          user_id?: string | null
        }
        Relationships: []
      }
      historique_achat: {
        Row: {
          date_achat: string | null
          id_historique: number
          id_produit: number | null
          id_utilisateur: number | null
          quantite: number | null
        }
        Insert: {
          date_achat?: string | null
          id_historique?: number
          id_produit?: number | null
          id_utilisateur?: number | null
          quantite?: number | null
        }
        Update: {
          date_achat?: string | null
          id_historique?: number
          id_produit?: number | null
          id_utilisateur?: number | null
          quantite?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "historique_achat_id_produit_fkey"
            columns: ["id_produit"]
            isOneToOne: false
            referencedRelation: "produit"
            referencedColumns: ["id_produit"]
          },
          {
            foreignKeyName: "historique_achat_id_utilisateur_fkey"
            columns: ["id_utilisateur"]
            isOneToOne: false
            referencedRelation: "utilisateur"
            referencedColumns: ["id_utilisateur"]
          },
        ]
      }
      images_produit: {
        Row: {
          color: string
          created_at: string | null
          id: number
          id_produit: number
          image_url: string
          updated_at: string | null
        }
        Insert: {
          color: string
          created_at?: string | null
          id?: number
          id_produit: number
          image_url: string
          updated_at?: string | null
        }
        Update: {
          color?: string
          created_at?: string | null
          id?: number
          id_produit?: number
          image_url?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_images_produit_produit"
            columns: ["id_produit"]
            isOneToOne: false
            referencedRelation: "produit"
            referencedColumns: ["id_produit"]
          },
        ]
      }
      niveau: {
        Row: {
          created_at: string
          email: string
          id_client: number
          montant_spent: number
          niveau: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id_client?: number
          montant_spent?: number
          niveau?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id_client?: number
          montant_spent?: number
          niveau?: number
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          id: number
          id_utilisateur: number | null
          order_date: string
          status: string
          total_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          id_utilisateur?: number | null
          order_date?: string
          status?: string
          total_price?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          id_utilisateur?: number | null
          order_date?: string
          status?: string
          total_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_id_utilisateur_fkey"
            columns: ["id_utilisateur"]
            isOneToOne: false
            referencedRelation: "utilisateur"
            referencedColumns: ["id_utilisateur"]
          },
        ]
      }
      panier: {
        Row: {
          color: string | null
          date_ajout: string | null
          id_commande: number | null
          id_panier: number
          id_produit: number | null
          id_utilisateur: number | null
          prix_unitaire: number | null
          quantite: number | null
          size: string | null
          statut: string | null
        }
        Insert: {
          color?: string | null
          date_ajout?: string | null
          id_commande?: number | null
          id_panier?: number
          id_produit?: number | null
          id_utilisateur?: number | null
          prix_unitaire?: number | null
          quantite?: number | null
          size?: string | null
          statut?: string | null
        }
        Update: {
          color?: string | null
          date_ajout?: string | null
          id_commande?: number | null
          id_panier?: number
          id_produit?: number | null
          id_utilisateur?: number | null
          prix_unitaire?: number | null
          quantite?: number | null
          size?: string | null
          statut?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "panier_id_produit_fkey"
            columns: ["id_produit"]
            isOneToOne: false
            referencedRelation: "produit"
            referencedColumns: ["id_produit"]
          },
          {
            foreignKeyName: "panier_id_utilisateur_fkey"
            columns: ["id_utilisateur"]
            isOneToOne: false
            referencedRelation: "utilisateur"
            referencedColumns: ["id_utilisateur"]
          },
        ]
      }
      produit: {
        Row: {
          couleur_disponible: string | null
          description: string | null
          id_produit: number
          nom: string | null
          nombre_en_stock: number | null
          prix: number
          taille: string | null
          type_produit: string | null
        }
        Insert: {
          couleur_disponible?: string | null
          description?: string | null
          id_produit?: number
          nom?: string | null
          nombre_en_stock?: number | null
          prix: number
          taille?: string | null
          type_produit?: string | null
        }
        Update: {
          couleur_disponible?: string | null
          description?: string | null
          id_produit?: number
          nom?: string | null
          nombre_en_stock?: number | null
          prix?: number
          taille?: string | null
          type_produit?: string | null
        }
        Relationships: []
      }
      produit_offer: {
        Row: {
          date_debut: string | null
          date_fin: string | null
          discount_percentage: number | null
          id_offer: number
          id_produit: number | null
          image_url: string | null
          nombre_disponible: number | null
          taille: string | null
        }
        Insert: {
          date_debut?: string | null
          date_fin?: string | null
          discount_percentage?: number | null
          id_offer?: number
          id_produit?: number | null
          image_url?: string | null
          nombre_disponible?: number | null
          taille?: string | null
        }
        Update: {
          date_debut?: string | null
          date_fin?: string | null
          discount_percentage?: number | null
          id_offer?: number
          id_produit?: number | null
          image_url?: string | null
          nombre_disponible?: number | null
          taille?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "produit_offer_id_produit_fkey"
            columns: ["id_produit"]
            isOneToOne: false
            referencedRelation: "produit"
            referencedColumns: ["id_produit"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      utilisateur: {
        Row: {
          created_at: string | null
          date_creation_compte: string | null
          email: string
          id_utilisateur: number
          mot_de_passe: string
          nom: string | null
          numero_telephone: string | null
          phone_verified: boolean | null
          prenom: string | null
          total_spent: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_creation_compte?: string | null
          email: string
          id_utilisateur?: number
          mot_de_passe: string
          nom?: string | null
          numero_telephone?: string | null
          phone_verified?: boolean | null
          prenom?: string | null
          total_spent?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_creation_compte?: string | null
          email?: string
          id_utilisateur?: number
          mot_de_passe?: string
          nom?: string | null
          numero_telephone?: string | null
          phone_verified?: boolean | null
          prenom?: string | null
          total_spent?: number
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_order_total: { Args: { order_id: number }; Returns: number }
      get_current_user_role: { Args: never; Returns: string }
      get_user_level_info: {
        Args: { user_email: string }
        Returns: {
          badge_name: string
          current_level: number
          next_milestone: number
          progress_percentage: number
          total_spent: number
        }[]
      }
      get_utilisateur_id: { Args: never; Returns: number }
      is_admin: { Args: { user_id: string }; Returns: boolean }
      log_admin_action: {
        Args: {
          p_action_type: string
          p_new_values?: Json
          p_old_values?: Json
          p_record_id: string
          p_table_name: string
        }
        Returns: undefined
      }
      simulate_spending_change: {
        Args: { amount_change: number; user_email: string }
        Returns: {
          badge_name: string
          current_level: number
          next_milestone: number
          progress_percentage: number
          total_spent: number
        }[]
      }
      sync_profiles_to_utilisateur: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
