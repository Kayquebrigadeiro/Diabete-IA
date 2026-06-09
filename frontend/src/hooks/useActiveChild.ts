import { useEffect, useMemo, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useChildren } from './useChildren';
import type { Child } from '../types';

const ACTIVE_CHILD_STORAGE_KEY = 'active_child_id';

export function useActiveChild() {
  const { userId } = useAuthContext();
  const childrenQuery = useChildren(userId);
  const storageKey = `${ACTIVE_CHILD_STORAGE_KEY}:${userId || 'guest'}`;
  const [activeChildId, setActiveChildId] = useState(() => localStorage.getItem(storageKey) ?? '');

  useEffect(() => {
    setActiveChildId(localStorage.getItem(storageKey) ?? '');
  }, [storageKey]);

  const activeChild = useMemo<Child | null>(() => {
    const children = childrenQuery.data ?? [];
    if (!children.length) return null;
    return children.find((child) => child.id === activeChildId) ?? children[0] ?? null;
  }, [activeChildId, childrenQuery.data]);

  useEffect(() => {
    const children = childrenQuery.data ?? [];
    if (!children.length) return;

    const nextActive = children.some((child) => child.id === activeChildId) ? activeChildId : children[0]?.id ?? '';
    if (!nextActive) return;

    if (nextActive !== activeChildId) {
      setActiveChildId(nextActive);
    }
    localStorage.setItem(storageKey, nextActive);
  }, [activeChildId, childrenQuery.data, storageKey]);

  const updateActiveChild = (childId: string) => {
    setActiveChildId(childId);
    localStorage.setItem(storageKey, childId);
  };

  return {
    ...childrenQuery,
    children: childrenQuery.data ?? [],
    activeChild,
    activeChildId: activeChild?.id ?? activeChildId,
    setActiveChildId: updateActiveChild,
  };
}
