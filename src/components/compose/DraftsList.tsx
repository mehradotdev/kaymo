import React from "react";
import { format } from "date-fns";
import { Trash2, Edit3 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Draft } from "~/hooks/useDrafts";

interface DraftsListProps {
    drafts: Draft[];
    onSelect: (draft: Draft) => void;
    onDelete: (id: string) => void;
    onClose: () => void;
}

export const DraftsList: React.FC<DraftsListProps> = ({ drafts, onSelect, onDelete, onClose }) => {
    if (drafts.length === 0) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                <Edit3 className="mx-auto h-12 w-12 opacity-20 mb-4" />
                <p>No drafts yet.</p>
            </div>
        );
    }

    return (
        <div className="divide-y max-h-[60vh] overflow-y-auto">
            {drafts.map((draft) => (
                <div
                    key={draft.id}
                    className="p-4 hover:bg-accent/50 transition-colors cursor-pointer group flex items-start justify-between gap-4"
                    onClick={() => {
                        onSelect(draft);
                        onClose();
                    }}
                >
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate mb-1">
                            {draft.title || draft.body || "Untitled Draft"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {draft.body}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                            <span>{format(draft.timestamp, "MMM d, h:mm a")}</span>
                            {draft.mode && (
                                <>
                                    <span>•</span>
                                    <span>{draft.mode}</span>
                                </>
                            )}
                            {draft.media.length > 0 && (
                                <>
                                    <span>•</span>
                                    <span>{draft.media.length} attachment{draft.media.length > 1 ? 's' : ''}</span>
                                </>
                            )}
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(draft.id);
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
        </div>
    );
};
