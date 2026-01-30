import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> { }

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn(
                    'flex h-10 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2',
                    'text-sm text-neutral-100 placeholder:text-neutral-500',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    className
                )}
                {...props}
            />
        )
    }
)

Input.displayName = 'Input'
