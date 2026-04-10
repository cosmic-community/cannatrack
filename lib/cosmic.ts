import { createBucketClient } from '@cosmicjs/sdk';
import type {
  AppSettings,
  Medication,
  SymptomTarget,
  SideEffect,
  EducationalContent,
} from '@/types';

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
});

function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

export function getMetafieldValue(field: unknown): string {
  if (field === null || field === undefined) return '';
  if (typeof field === 'string') return field;
  if (typeof field === 'number' || typeof field === 'boolean') return String(field);
  if (typeof field === 'object' && field !== null && 'value' in field) {
    return String((field as { value: unknown }).value);
  }
  if (typeof field === 'object' && field !== null && 'key' in field) {
    return String((field as { key: unknown }).key);
  }
  return '';
}

export async function getAppSettings(): Promise<AppSettings | null> {
  try {
    const response = await cosmic.objects
      .find({ type: 'app-settings' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    const obj = response.objects[0];
    if (!obj) return null;
    return obj as unknown as AppSettings;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) return null;
    console.error('Error fetching app settings:', error);
    return null;
  }
}

export async function getMedications(): Promise<Medication[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'medications' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    return response.objects as unknown as Medication[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) return [];
    console.error('Error fetching medications:', error);
    return [];
  }
}

export async function getMedication(slug: string): Promise<Medication | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'medications', slug })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    return response.object as unknown as Medication;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) return null;
    console.error('Error fetching medication:', error);
    return null;
  }
}

export async function getSymptomTargets(): Promise<SymptomTarget[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'symptom-targets' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    const targets = response.objects as unknown as SymptomTarget[];
    return targets.sort((a, b) => {
      const orderA = Number(a.metadata?.sort_order) || 999;
      const orderB = Number(b.metadata?.sort_order) || 999;
      return orderA - orderB;
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) return [];
    console.error('Error fetching symptom targets:', error);
    return [];
  }
}

export async function getSideEffects(): Promise<SideEffect[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'side-effects' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    const effects = response.objects as unknown as SideEffect[];
    return effects.sort((a, b) => {
      const orderA = Number(a.metadata?.sort_order) || 999;
      const orderB = Number(b.metadata?.sort_order) || 999;
      return orderA - orderB;
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) return [];
    console.error('Error fetching side effects:', error);
    return [];
  }
}

export async function getEducationalContent(): Promise<EducationalContent[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'educational-content' })
      .props(['id', 'title', 'slug', 'metadata', 'content'])
      .depth(1);
    const content = response.objects as unknown as EducationalContent[];
    return content.sort((a, b) => {
      const orderA = Number(a.metadata?.sort_order) || 999;
      const orderB = Number(b.metadata?.sort_order) || 999;
      return orderA - orderB;
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) return [];
    console.error('Error fetching educational content:', error);
    return [];
  }
}

export async function getEducationalArticle(slug: string): Promise<EducationalContent | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'educational-content', slug })
      .props(['id', 'title', 'slug', 'metadata', 'content'])
      .depth(1);
    return response.object as unknown as EducationalContent;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) return null;
    console.error('Error fetching article:', error);
    return null;
  }
}