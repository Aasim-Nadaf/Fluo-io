import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva('cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none active:scale-98 duration-200 [&_svg]:size-4 [&_svg]:shrink-0', {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-[#cdffad]',
            destructive: 'bg-destructive text-white hover:bg-[#a72027]',
            outline: 'bg-card text-foreground border border-foreground hover:bg-muted/50',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-[#c5edab]',
            ghost: 'hover:bg-muted hover:text-foreground',
            link: 'text-primary underline-offset-4 hover:underline',
        },
        size: {
            default: 'h-12 px-6 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5',
            xs: "h-7 px-3 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
            sm: "h-9 px-4 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
            lg: 'h-14 px-8 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5',
            icon: 'size-9',
            'icon-xs': "size-6 [&_svg:not([class*='size-'])]:size-3",
            'icon-sm': 'size-8',
            'icon-lg': 'size-10',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
})

function Button({ className, variant = 'default', size = 'default', ...props }: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
    return (
        <ButtonPrimitive
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    )
}

export { Button, buttonVariants }
