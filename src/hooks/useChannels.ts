import { useState, useEffect } from 'react';
import { searchChannels } from '~/app/actions';

export interface FarcasterChannel {
    id: string;
    name: string;
    image_url: string;
    parent_url: string;
}

export function useChannels(query: string) {
    const [channels, setChannels] = useState<FarcasterChannel[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) {
            setChannels([]);
            return;
        }

        const fetchChannels = async () => {
            setLoading(true);
            try {
                const { channels: searchResults } = await searchChannels(query);

                const mappedChannels: FarcasterChannel[] = searchResults.map((c: any) => ({
                    id: c.id,
                    name: c.name,
                    image_url: c.image_url,
                    parent_url: c.parent_url
                }));

                setChannels(mappedChannels);
            } catch (error) {
                console.error('Error searching channels:', error);
                setChannels([]);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchChannels, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    return { channels, loading };
}
