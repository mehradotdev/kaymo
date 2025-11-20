import { useState, useEffect } from 'react';
import { searchUsers } from '~/app/actions';

export interface FarcasterUser {
    username: string;
    display_name: string;
    pfp_url: string;
    fid: number;
}

export function useMentions(query: string) {
    const [users, setUsers] = useState<FarcasterUser[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("[MENTIONS HOOK] Query:", query, "Length:", query.length);

        if (!query || query.length < 2) {
            setUsers([]);
            return;
        }

        const fetchUsers = async () => {
            setLoading(true);
            try {
                console.log("[MENTIONS HOOK] Calling searchUsers with:", query);
                const { users: searchResults } = await searchUsers(query);
                console.log("[MENTIONS HOOK] Search results:", searchResults);

                const mappedUsers: FarcasterUser[] = searchResults.map((u: any) => ({
                    username: u.username,
                    display_name: u.display_name,
                    pfp_url: u.pfp_url,
                    fid: u.fid
                }));

                console.log("[MENTIONS HOOK] Mapped users:", mappedUsers);
                setUsers(mappedUsers);
            } catch (error) {
                console.error('Error searching users:', error);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchUsers, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    return { users, loading };
}
