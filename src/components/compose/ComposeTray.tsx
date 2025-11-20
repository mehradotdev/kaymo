"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/ui/command";
import {
    X,
    Send,
    Image as ImageIcon,
    UserRound,
    Edit3,
    Trash2,
    Check,
    Calendar as CalendarIcon,
    Hash
} from "lucide-react";
import { Calendar } from "~/components/ui/calendar";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { useDrafts } from "~/hooks/useDrafts";
import { DraftsList } from "~/components/compose/DraftsList";
import { useMentions } from "~/hooks/useMentions";
import { useChannels, FarcasterChannel } from "~/hooks/useChannels";
import { WheelPicker } from "~/components/ui/wheel-picker";
import { format, addDays } from "date-fns";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "~/components/ui/drawer"
import { useMediaQuery } from "~/hooks/useMediaQuery"

// Types
export type DeliveryMode = "zora" | "farcaster" | "both";

export interface DraftData {
    id?: string;
    body: string;
    title?: string;
    media?: { id: string; url: string; file?: File; }[];
    mode?: DeliveryMode;
    channel?: FarcasterChannel;
}

export interface ComposeTrayProps {
    draft?: DraftData;
    onPublish: (data: DraftData & { scheduledTime?: Date }) => Promise<void> | void;
    onCancel?: () => void;
}

// Hooks
function useDebouncedValue<T>(value: T, delay = 150) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

function useOnline() {
    const [online, setOnline] = useState<boolean>(true);
    useEffect(() => {
        if (typeof navigator !== "undefined") {
            setOnline(navigator.onLine);
            const on = () => setOnline(true);
            const off = () => setOnline(false);
            window.addEventListener("online", on);
            window.addEventListener("offline", off);
            return () => {
                window.removeEventListener("online", on);
                window.removeEventListener("offline", off);
            };
        }
    }, []);
    return online;
}

// Component
export const ComposeTray: React.FC<ComposeTrayProps> = ({ draft, onPublish, onCancel }) => {
    const [mode, setMode] = useState<DeliveryMode>(draft?.mode || "both");
    const [body, setBody] = useState<string>(draft?.body || "");
    const [title, setTitle] = useState<string>(draft?.title || "");
    const [media, setMedia] = useState<NonNullable<DraftData["media"]>>(draft?.media || []);
    const [selectedChannel, setSelectedChannel] = useState<FarcasterChannel | undefined>(draft?.channel);
    const [draftsOpen, setDraftsOpen] = useState<boolean>(false);
    const [uploadOpen, setUploadOpen] = useState<boolean>(false);

    // Mentions
    const [mentionOpen, setMentionOpen] = useState<boolean>(false);
    const [mentionQuery, setMentionQuery] = useState<string>("");
    const { users: mentionUsers } = useMentions(mentionQuery);

    // Channels
    const [channelOpen, setChannelOpen] = useState<boolean>(false);
    const [channelQuery, setChannelQuery] = useState<string>("");
    const { channels: searchChannels } = useChannels(channelQuery);

    // Schedule
    const [scheduleOpen, setScheduleOpen] = useState<boolean>(false);
    const [scheduledDate, setScheduledDate] = useState<Date>(new Date());
    const [scheduledHour, setScheduledHour] = useState<string>(format(new Date(), "HH"));
    const [scheduledMinute, setScheduledMinute] = useState<string>(format(new Date(), "mm"));

    const { drafts, saveOrUpdateDraft, deleteDraft } = useDrafts();
    const [activeDraftId, setActiveDraftId] = useState<string | undefined>(draft?.id);

    const isDesktop = useMediaQuery("(min-width: 768px)")
    const online = useOnline();
    const bodyRef = useRef<HTMLTextAreaElement | null>(null);
    const charCount = body.length;
    const overLimit = charCount > 320; // Farcaster limit
    const canPost = !overLimit && (body.trim().length > 0 || media.length > 0);

    // Autosave
    const debouncedBody = useDebouncedValue(body, 1000);
    const debouncedTitle = useDebouncedValue(title, 1000);

    useEffect(() => {
        if ((debouncedBody.trim() || media.length > 0) && online) {
            const draftToSave = {
                id: activeDraftId,
                body: debouncedBody,
                title: debouncedTitle,
                mode,
                media: media.map(m => ({ id: m.id, url: m.url })), // Strip files for storage
                channel: selectedChannel
            };
            const id = saveOrUpdateDraft(draftToSave);
            if (!activeDraftId) setActiveDraftId(id);
        }
    }, [debouncedBody, debouncedTitle, media, mode, activeDraftId, saveOrUpdateDraft, online, selectedChannel]);


    // Mentions detection
    useEffect(() => {
        const atIndex = body.lastIndexOf("@");
        if (atIndex >= 0) {
            const trailing = body.slice(atIndex + 1);
            // open mention when trailing has no spaces and length < 24
            const shouldOpen = !trailing.includes(" ") && trailing.length >= 0 && trailing.length <= 24;
            console.log("[MENTION DEBUG]", { atIndex, trailing, shouldOpen, bodyLength: body.length });
            setMentionOpen(shouldOpen);
            setMentionQuery(trailing);
        } else {
            setMentionOpen(false);
            setMentionQuery("");
        }
    }, [body]);


    const insertMention = (username: string) => {
        const atIndex = body.lastIndexOf("@");
        if (atIndex === -1) return;
        const before = body.slice(0, atIndex);
        const next = `${before}@${username} `;
        setBody(next);
        setMentionOpen(false);
        bodyRef.current?.focus();
    };

    // Media handlers
    const onPickFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const items: NonNullable<DraftData["media"]> = [];
        for (const file of Array.from(files).slice(0, 4)) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error(`File ${file.name} too large (max 5MB)`);
                continue;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            await new Promise((resolve, reject) => {
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
            });
            const url = reader.result as string;
            const id = crypto.randomUUID();
            items.push({ id, url, file });
        }
        setMedia((m) => [...m, ...items].slice(0, 4));
        setUploadOpen(false);
        toast.success(`${items.length} media added`);
    };

    const removeMedia = (id: string) => {
        setMedia((m) => m.filter((x) => x.id !== id));
    };

    const handlePublish = async () => {
        if (!canPost) return;

        // Construct scheduled date if set
        let scheduledTime: Date | undefined;
        if (scheduledDate) {
            scheduledTime = new Date(scheduledDate);
            scheduledTime.setHours(parseInt(scheduledHour));
            scheduledTime.setMinutes(parseInt(scheduledMinute));

            // If scheduled time is in the past, don't allow
            if (scheduledTime < new Date()) {
                // If it's just a few seconds/minutes behind, maybe default to now? 
                // For now, let's just ignore scheduling if it's past
                scheduledTime = undefined;
            }
        }

        await onPublish({
            id: activeDraftId,
            body,
            title,
            media,
            mode,
            channel: selectedChannel,
            scheduledTime: scheduleOpen ? scheduledTime : undefined
        });

        // Clear form after publish
        setBody("");
        setTitle("");
        setMedia([]);
        setSelectedChannel(undefined);
        setActiveDraftId(undefined);
    };

    // Toggle Mode
    const toggleMode = () => {
        const modes: DeliveryMode[] = ["farcaster", "zora", "both"];
        const nextIndex = (modes.indexOf(mode) + 1) % modes.length;
        setMode(modes[nextIndex]);
    };

    // Wheel Picker Data
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const dates = Array.from({ length: 30 }, (_, i) => {
        const d = addDays(new Date(), i);
        return format(d, 'MMM dd');
    });

    return (
        <div className="mx-auto min-h-[600px] bg-background text-foreground shadow-sm ring-1 ring-border rounded-xl overflow-hidden flex flex-col w-full max-w-2xl">
            {/* Offline banner */}
            {!online && (
                <div className="bg-yellow-500/10 text-yellow-600 text-sm px-3 py-1 flex items-center justify-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                    Offline Mode - Changes saved locally
                </div>
            )}

            {/* TOP BAR */}
            <div className="h-14 flex items-center justify-between px-4 border-b bg-background/80 backdrop-blur sticky top-0 z-10">
                <Button variant="ghost" size="sm" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                </Button>

                <div className="flex items-center gap-2">
                    <Dialog open={draftsOpen} onOpenChange={setDraftsOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                                <Edit3 className="h-3 w-3" />
                                Drafts
                                {drafts.length > 0 && <Badge variant="secondary" className="ml-1 h-5 px-1.5">{drafts.length}</Badge>}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Saved Drafts</DialogTitle>
                            </DialogHeader>
                            <DraftsList
                                drafts={drafts}
                                onSelect={(d) => {
                                    setBody(d.body);
                                    setTitle(d.title || "");
                                    setMode(d.mode || "both");
                                    setMedia(d.media);
                                    setSelectedChannel(d.channel);
                                    setActiveDraftId(d.id);
                                }}
                                onDelete={deleteDraft}
                                onClose={() => setDraftsOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>

                    <Button size="sm" onClick={handlePublish} disabled={!canPost} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm">
                        {scheduleOpen ? "Schedule" : "Post"}
                        <Send className="h-3 w-3" />
                    </Button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex gap-4">
                    <Avatar className="h-10 w-10 mt-1">
                        <AvatarImage src="/default-avatar.png" />
                        <AvatarFallback><UserRound className="h-5 w-5" /></AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-4">
                        {/* Title for Zora/Both modes */}
                        {(mode === "zora" || mode === "both") && (
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title (required for Zora)"
                                className="text-lg font-bold border-none px-0 shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50"
                            />
                        )}

                        <div className="relative">
                            <Textarea
                                ref={bodyRef}
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="What's happening?"
                                className="min-h-[150px] resize-none text-lg leading-relaxed border-none px-0 shadow-none focus-visible:ring-0 p-0"
                            />

                            {/* Mentions Popover */}
                            {mentionOpen && mentionUsers.length > 0 && (
                                <div className="absolute top-full left-0 z-50 w-64 bg-popover rounded-md shadow-md border p-1 animate-in fade-in zoom-in-95 duration-100">
                                    {mentionUsers.map(user => (
                                        <button
                                            key={user.fid}
                                            className="w-full flex items-center gap-2 p-2 hover:bg-accent rounded-sm text-left text-sm"
                                            onClick={() => insertMention(user.username)}
                                        >
                                            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                                {user.pfp_url ? <img src={user.pfp_url} alt={user.username} /> : <UserRound className="h-3 w-3" />}
                                            </div>
                                            <div>
                                                <div className="font-bold">{user.display_name}</div>
                                                <div className="text-muted-foreground">@{user.username}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Media Grid */}
                        {media.length > 0 && (
                            <div className="grid grid-cols-2 gap-2">
                                {media.map((item) => (
                                    <div key={item.id} className="relative group aspect-video rounded-lg overflow-hidden bg-muted border">
                                        {item.url.startsWith("data:video") || item.file?.type.startsWith("video") ? (
                                            <video src={item.url} className="w-full h-full object-cover" />
                                        ) : (
                                            <img src={item.url} alt="Media" className="w-full h-full object-cover" />
                                        )}
                                        <button
                                            onClick={() => removeMedia(item.id)}
                                            className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* BOTTOM BAR */}
            <div className="p-4 border-t bg-muted/5 space-y-4">
                {/* Mode Toggle & Char Count */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={toggleMode}
                        className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-accent transition-colors"
                    >
                        <div className="flex items-center -space-x-2">
                            <div className={cn("h-6 w-6 rounded-full flex items-center justify-center border-2 border-background z-10 transition-colors", mode === "zora" ? "bg-muted text-muted-foreground" : "bg-[#855DCD] text-white")}>
                                <img src="https://workers.paper.design/file-assets/01K62JX21C0KQW7NEXK2EK8WRT/01K664PQB25Z9TZHAXW02GP4FQ.png" className="h-3 w-3 object-contain" alt="Farcaster" />
                            </div>
                            <div className={cn("h-6 w-6 rounded-full flex items-center justify-center border-2 border-background transition-colors", mode === "farcaster" ? "bg-muted text-muted-foreground" : "bg-blue-500 text-white")}>
                                <img src="https://workers.paper.design/file-assets/01K62JX21C0KQW7NEXK2EK8WRT/01K666XFNTTYGFW1VW2QYFJ52P.svg" className="h-3 w-3 object-contain" alt="Zora" />
                            </div>
                        </div>
                        <span className="text-sm font-medium">
                            {mode === "both" ? "Farcaster + Zora" : mode === "farcaster" ? "Farcaster Only" : "Zora Only"}
                        </span>
                    </button>

                    <span className={cn("text-xs font-medium", overLimit ? "text-destructive" : "text-muted-foreground")}>
                        {charCount}/320
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                                    <ImageIcon className="h-5 w-5" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Upload Media</DialogTitle></DialogHeader>
                                <Input type="file" accept="image/*,video/*" multiple onChange={(e) => onPickFiles(e.target.files)} />
                            </DialogContent>
                        </Dialog>

                        {/* Channel Picker */}
                        {(mode === "farcaster" || mode === "both") && (
                            <Popover open={channelOpen} onOpenChange={setChannelOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="sm" className={cn("h-9 px-2 gap-1 text-muted-foreground hover:text-primary", selectedChannel && "text-primary bg-primary/10")}>
                                        {selectedChannel ? (
                                            <>
                                                <img src={selectedChannel.image_url} className="h-4 w-4 rounded-full" alt={selectedChannel.name} />
                                                <span className="max-w-[100px] truncate">{selectedChannel.name}</span>
                                            </>
                                        ) : (
                                            <Hash className="h-5 w-5" />
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Search channels..." value={channelQuery} onValueChange={setChannelQuery} />
                                        <CommandList>
                                            <CommandEmpty>No channels found.</CommandEmpty>
                                            <CommandGroup>
                                                {searchChannels.map((channel) => (
                                                    <CommandItem
                                                        key={channel.id}
                                                        onSelect={() => {
                                                            setSelectedChannel(channel);
                                                            setChannelOpen(false);
                                                        }}
                                                        className="gap-2 cursor-pointer"
                                                    >
                                                        <img src={channel.image_url} className="h-5 w-5 rounded-full" alt={channel.name} />
                                                        <span>{channel.name}</span>
                                                        {selectedChannel?.id === channel.id && <Check className="ml-auto h-4 w-4" />}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        )}

                        {isDesktop ? (
                            <Popover open={scheduleOpen} onOpenChange={setScheduleOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon" className={cn("text-muted-foreground hover:text-primary", scheduleOpen && "text-primary bg-primary/10")}>
                                        <CalendarIcon className="h-5 w-5" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <ScheduleContent
                                        date={scheduledDate}
                                        setDate={setScheduledDate}
                                        hour={scheduledHour}
                                        setHour={setScheduledHour}
                                        minute={scheduledMinute}
                                        setMinute={setScheduledMinute}
                                        hours={hours}
                                        minutes={minutes}
                                        onClear={() => setScheduleOpen(false)}
                                    />
                                </PopoverContent>
                            </Popover>
                        ) : (
                            <Drawer open={scheduleOpen} onOpenChange={setScheduleOpen}>
                                <DrawerTrigger asChild>
                                    <Button variant="ghost" size="icon" className={cn("text-muted-foreground hover:text-primary", scheduleOpen && "text-primary bg-primary/10")}>
                                        <CalendarIcon className="h-5 w-5" />
                                    </Button>
                                </DrawerTrigger>
                                <DrawerContent>
                                    <DrawerHeader className="text-left">
                                        <DrawerTitle>Schedule Post</DrawerTitle>
                                        <DrawerDescription>
                                            Pick a date and time to publish your post.
                                        </DrawerDescription>
                                    </DrawerHeader>
                                    <div className="px-4 pb-4">
                                        <ScheduleContent
                                            date={scheduledDate}
                                            setDate={setScheduledDate}
                                            hour={scheduledHour}
                                            setHour={setScheduledHour}
                                            minute={scheduledMinute}
                                            setMinute={setScheduledMinute}
                                            hours={hours}
                                            minutes={minutes}
                                            onClear={() => setScheduleOpen(false)}
                                            isDrawer
                                        />
                                    </div>
                                    <DrawerFooter className="pt-2">
                                        <DrawerClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DrawerClose>
                                    </DrawerFooter>
                                </DrawerContent>
                            </Drawer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

function ScheduleContent({
    date, setDate,
    hour, setHour,
    minute, setMinute,
    hours, minutes,
    onClear,
    isDrawer = false
}: {
    date: Date, setDate: (d: Date) => void,
    hour: string, setHour: (h: string) => void,
    minute: string, setMinute: (m: string) => void,
    hours: string[], minutes: string[],
    onClear: () => void,
    isDrawer?: boolean
}) {
    return (
        <div className={cn("space-y-4", !isDrawer && "p-4")}>
            {!isDrawer && (
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold leading-none">Schedule Post</h4>
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-destructive hover:bg-transparent" onClick={onClear}>Clear</Button>
                </div>
            )}

            <div className={cn("border rounded-md p-1 flex justify-center", isDrawer && "border-none shadow-none")}>
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    className={cn(isDrawer && "w-full flex justify-center")}
                />
            </div>

            <div className="flex items-center gap-4 pt-2 border-t">
                <div className="flex items-center gap-2 flex-1 justify-center">
                    <div className="w-[70px]">
                        <WheelPicker items={hours} value={hour} onChange={setHour} label="Hour" />
                    </div>
                    <div className="text-xl font-light text-muted-foreground pt-4">:</div>
                    <div className="w-[70px]">
                        <WheelPicker items={minutes} value={minute} onChange={setMinute} label="Min" />
                    </div>
                </div>
            </div>

            <div className="text-xs text-center text-muted-foreground bg-muted/50 py-2 rounded-md">
                Will post on <span className="font-medium text-foreground">{format(date, 'MMM dd')}</span> at <span className="font-medium text-foreground">{hour}:{minute}</span>
            </div>
        </div>
    );
}
