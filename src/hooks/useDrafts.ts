import { useState, useEffect } from 'react';

import { FarcasterChannel } from './useChannels';

export interface Draft {
    id: string;
    body: string;
    title?: string;
    media: { id: string; url: string; file?: File }[];
    mode?: 'farcaster' | 'zora' | 'both';
    channel?: FarcasterChannel;
    timestamp: number;
    snippet?: string;
    thumb?: string;
}

const STORAGE_KEY = 'kaymo_drafts';

export function useDrafts() {
    const [drafts, setDrafts] = useState<Draft[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setDrafts(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse drafts', e);
            }
        }
    }, []);

    const saveOrUpdateDraft = (draft: Omit<Draft, 'id' | 'timestamp'> & { id?: string }) => {
        const id = draft.id || crypto.randomUUID();
        const timestamp = Date.now();
        const newDraft: Draft = { ...draft, id, timestamp };

        setDrafts((prev) => {
            const existingIndex = prev.findIndex((d) => d.id === id);
            let next;
            if (existingIndex >= 0) {
                next = [...prev];
                next[existingIndex] = newDraft;
            } else {
                next = [newDraft, ...prev];
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });

        return id;
    };

    const deleteDraft = (id: string) => {
        setDrafts((prev) => {
            const next = prev.filter((d) => d.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    };

    return { drafts, saveOrUpdateDraft, deleteDraft };
}
