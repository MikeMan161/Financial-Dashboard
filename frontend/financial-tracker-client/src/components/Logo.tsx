import { MessageCircle } from 'lucide-react'

type LogoProps = {
    className?: string
    size?: "sm" | "lg"
}

const SIZES = {
    sm: { icon: "size-5", text: "text-xl", gap: "gap-2" },
    lg: { icon: "size-10", text: "text-5xl", gap: "gap-3" },
}

// Placeholder for the real mark, which puts a speech bubble where the dot of the
// "j" goes. That needs a hand-drawn SVG path; until then the bubble sits beside
// the wordmark, which keeps the same two elements in the same relationship.
export default function Logo({ className = "", size = "sm" }: LogoProps) {
    const scale = SIZES[size]

    return (
        <span className={`inline-flex items-center ${scale.gap} ${className}`}>
            <MessageCircle className={`${scale.icon} text-primary`} aria-hidden="true" />
            <span className={`${scale.text} font-semibold tracking-tight lowercase`}>jot</span>
        </span>
    )
}
