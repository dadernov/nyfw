import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ClosetItem, Profile, Trip } from '../data/types';

const KEY = 'nyfw-demo-v1';

interface DemoState { profile: Profile; saved: string[]; closet: ClosetItem[]; trips: Trip[] }

export interface DemoApi extends DemoState {
  setProfile: (patch: Partial<Profile>) => void;
  toggleSave: (lookId: string) => void;
  addItem: (item: Omit<ClosetItem, 'id'>) => void;
  removeItem: (id: string) => void;
  saveTrip: (trip: Trip) => void;
  removeTrip: (id: string) => void;
  reset: () => void;
}

export const emptyProfile: Profile = {
  name: '', onboarded: false, styles: [], budget: '$$', brands: [], scenarios: [], sizes: {},
  consents: { location: false, photos: false, personalization: true },
};

const initial = (): DemoState => ({ profile: emptyProfile, saved: [], closet: [], trips: [] });

function load(): DemoState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...initial(), ...JSON.parse(raw) };
  } catch { /* private mode or corrupt data: start fresh */ }
  return initial();
}

const Ctx = createContext<DemoApi | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* keep working in memory */ }
  }, [state]);

  const setProfile = useCallback((patch: Partial<Profile>) =>
    setState((s) => ({ ...s, profile: { ...s.profile, ...patch } })), []);
  const toggleSave = useCallback((id: string) =>
    setState((s) => ({ ...s, saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [id, ...s.saved] })), []);
  const addItem = useCallback((item: Omit<ClosetItem, 'id'>) =>
    setState((s) => ({ ...s, closet: [{ ...item, id: `c-${Date.now().toString(36)}-${s.closet.length}` }, ...s.closet] })), []);
  const removeItem = useCallback((id: string) =>
    setState((s) => ({ ...s, closet: s.closet.filter((c) => c.id !== id) })), []);
  const saveTrip = useCallback((trip: Trip) =>
    setState((s) => ({ ...s, trips: [trip, ...s.trips.filter((t) => t.id !== trip.id)] })), []);
  const removeTrip = useCallback((id: string) =>
    setState((s) => ({ ...s, trips: s.trips.filter((t) => t.id !== id) })), []);
  const reset = useCallback(() => setState(initial()), []);

  const api = useMemo<DemoApi>(() => ({ ...state, setProfile, toggleSave, addItem, removeItem, saveTrip, removeTrip, reset }),
    [state, setProfile, toggleSave, addItem, removeItem, saveTrip, removeTrip, reset]);
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useDemo(): DemoApi {
  const api = useContext(Ctx);
  if (!api) throw new Error('useDemo outside DemoProvider');
  return api;
}
