// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, unknown>;
  type: string;
  created_at: string;
  modified_at: string;
}

// App Settings
export interface AppSettings extends CosmicObject {
  type: 'app-settings';
  metadata: {
    app_name?: string;
    tagline?: string;
    privacy_statement?: string;
    accent_color?: string;
    medbud_base_url?: string;
    external_references?: string;
    default_symptom_list?: string;
    default_side_effect_list?: string;
    default_intake_methods?: string;
  };
}

// Medications
export interface Medication extends CosmicObject {
  type: 'medications';
  metadata: {
    product_name?: string;
    brand?: string;
    product_image?: {
      url: string;
      imgix_url: string;
    };
    category?: string;
    thc_percentage?: string | number;
    cbd_percentage?: string | number;
    strain_type?: string;
    terpene_profile?: string;
    cultivar_name?: string;
    price_per_unit?: string | number;
    unit_size?: string;
    formulary_availability?: string;
    medbud_link?: string;
    description?: string;
    active?: boolean | string;
  };
}

// Symptom Targets
export interface SymptomTarget extends CosmicObject {
  type: 'symptom-targets';
  metadata: {
    symptom_name?: string;
    icon_emoji?: string;
    description?: string;
    body_area?: string;
    sort_order?: string | number;
  };
}

// Side Effects
export interface SideEffect extends CosmicObject {
  type: 'side-effects';
  metadata: {
    effect_name?: string;
    icon_emoji?: string;
    severity_category?: string;
    description?: string;
    sort_order?: string | number;
  };
}

// Educational Content
export interface EducationalContent extends CosmicObject {
  type: 'educational-content';
  metadata: {
    hero_image?: {
      url: string;
      imgix_url: string;
    };
    category?: string;
    content?: string;
    source_name?: string;
    source_url?: string;
    featured?: boolean | string;
    sort_order?: string | number;
  };
}

// Local session data (stored in IndexedDB)
export interface Session {
  id: string;
  medicationId: string;
  medicationName: string;
  medicationBrand: string;
  date: string;
  timeOfDay: string;
  dose: string;
  intakeMethod: string;
  symptomsTargeted: string[];
  sideEffectsExperienced: string[];
  reliefRating: number;
  overallRating: number;
  wouldUseAgain: 'yes' | 'no' | 'maybe';
  valueRating: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Insight types
export interface MedicationInsight {
  medicationName: string;
  medicationBrand: string;
  sessionCount: number;
  avgRelief: number;
  avgOverall: number;
  avgValue: number;
  topSymptoms: string[];
  topSideEffects: string[];
  wouldUseAgain: { yes: number; no: number; maybe: number };
}