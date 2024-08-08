import { Lightbulb, Loader2 } from 'lucide-react';
import React from 'react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

export default function GetHints({ onGenerateHint, disabled, loading }) {
    return (
        <div className="relative group">
            <HoverCard>
                <HoverCardTrigger asChild className='w-8 h-8 p-1'>
                    <Button
                        onClick={onGenerateHint}
                        disabled={disabled}
                        className="absolute text-sm bottom-2 right-2 rounded flex items-center"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin text-white text-base w-5 h-5" />
                        ) : (
                            <Lightbulb className="text-white text-base w-5 h-5" />
                        )}
                    </Button>
                </HoverCardTrigger>
                <HoverCardContent className='text-white bg-gray-800 p-1 w-18 text-center text-sm'>
                    <span>
                        Obtener pistas
                    </span>
                </HoverCardContent>
            </HoverCard>
        </div>
    );
}
