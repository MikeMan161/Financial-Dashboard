import { Input } from '@/components/ui/input'

type AuthFieldProps = {
    id: string
    label: string
    type: string
    value: string
    onChange: (value: string) => void
    /* Short fields (username, income) sit narrower than the full-width ones so
       the form has some rhythm instead of four identical bars. */
    narrow?: boolean
    autoComplete?: string
}

export default function AuthField({
    id,
    label,
    type,
    value,
    onChange,
    narrow = false,
    autoComplete,
}: AuthFieldProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
                {label}
            </label>
            <Input
                id={id}
                type={type}
                value={value}
                autoComplete={autoComplete}
                onChange={(e) => onChange(e.target.value)}
                className={`h-11 rounded-xl px-4 ${narrow ? "max-w-[60%]" : ""}`}
            />
        </div>
    )
}
