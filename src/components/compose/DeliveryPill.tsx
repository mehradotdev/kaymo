import React from "react";
import { Zap, Rocket } from "lucide-react";

export const DeliveryPill: React.FC = () => {
    return (
        <div className="relative bg-muted rounded-lg h-14 w-[180px] font-sans overflow-hidden">
            {/* Arch icon container */}
            <div className="absolute bg-background rounded-md flex items-center justify-center h-[26px] w-[26px] -rotate-17 left-4 top-5 translate-y-5 shadow-sm border border-border/50">
                <img src="https://workers.paper.design/file-assets/01K62JX21C0KQW7NEXK2EK8WRT/01K664PQB25Z9TZHAXW02GP4FQ.png" className="h-4 w-4 object-contain" alt="Farcaster" />
            </div>

            {/* zora container */}
            <div className="absolute bg-background rounded-md flex items-center justify-center h-[26px] w-[26px] rotate-6 left-[48px] top-[13px] px-0.5 py-0.5 shadow-sm border border-border/50">
                <img src="https://workers.paper.design/file-assets/01K62JX21C0KQW7NEXK2EK8WRT/01K666XFNTTYGFW1VW2QYFJ52P.svg" className="h-5 w-5 object-contain" alt="Zora" />
            </div>

            {/* Text */}
            <div className="absolute text-foreground font-medium text-[32px] leading-[150%] left-0 top-0 translate-x-[90px] translate-y-0.5 whitespace-pre-wrap w-[76px]">
                Zora
            </div>
        </div>
    );
};
