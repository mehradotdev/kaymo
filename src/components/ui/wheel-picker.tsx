import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { cn } from '~/lib/utils'

interface WheelPickerProps {
    items: string[]
    value: string
    onChange: (value: string) => void
    label?: string
}

export const WheelPicker: React.FC<WheelPickerProps> = ({ items, value, onChange, label }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        axis: 'y',
        dragFree: true,
        containScroll: false,
        loop: true,
        watchDrag: true,
    })

    const [selectedIndex, setSelectedIndex] = useState(0)

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        const index = emblaApi.selectedScrollSnap()
        setSelectedIndex(index)
        onChange(items[index])
    }, [emblaApi, items, onChange])

    useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on('select', onSelect)
        emblaApi.on('reInit', onSelect)
    }, [emblaApi, onSelect])

    // Sync external value change
    useEffect(() => {
        if (!emblaApi) return
        const index = items.indexOf(value)
        if (index !== -1 && index !== selectedIndex) {
            emblaApi.scrollTo(index)
        }
    }, [value, items, emblaApi, selectedIndex])

    return (
        <div className="relative h-[160px] w-full overflow-hidden flex flex-col items-center justify-center">
            {label && <div className="absolute top-0 left-0 w-full text-center text-xs font-medium text-muted-foreground z-10 bg-background/90 py-1">{label}</div>}

            {/* Selection Highlight */}
            <div className="absolute top-1/2 left-0 w-full h-[40px] -translate-y-1/2 bg-accent/20 border-y border-accent pointer-events-none z-10" />

            <div className="embla h-full w-full" ref={emblaRef}>
                <div className="embla__container h-full">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className={cn(
                                "embla__slide flex items-center justify-center h-[40px] text-sm transition-all duration-200 select-none cursor-grab active:cursor-grabbing",
                                index === selectedIndex ? "font-bold text-foreground scale-110" : "text-muted-foreground scale-90 opacity-50"
                            )}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
