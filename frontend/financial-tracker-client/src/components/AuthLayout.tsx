import { Link } from 'react-router'
import Logo from '@/components/Logo'

type AuthLayoutProps = {
    title: string
    /* The "already have an account? / new here?" line. Both auth pages carry one
       pointing at the other, which is the whole reason they share a shell. */
    switchPrompt: string
    switchLabel: string
    switchTo: string
    children: React.ReactNode
}

export default function AuthLayout({
    title,
    switchPrompt,
    switchLabel,
    switchTo,
    children,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col bg-background text-foreground">
            <header className="p-6">
                <Link to="/">
                    <Logo />
                </Link>
            </header>

            {/* pb-24 rather than centring on the full height: an optically centred
                form sits slightly above the true middle, and the header already
                pulls the eye upward. */}
            <main className="flex flex-1 items-center justify-center px-6 pb-24">
                <div className="w-full max-w-sm">
                    <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {switchPrompt}{" "}
                        <Link to={switchTo} className="font-medium text-primary hover:underline">
                            {switchLabel}
                        </Link>
                    </p>

                    <div className="mt-8">{children}</div>
                </div>
            </main>
        </div>
    )
}
