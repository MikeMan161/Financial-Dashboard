import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription, CardAction } from '@/components/ui/card'
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress'

type BucketProps = {
    name: string
    percent: number
}

type BucketCardProps = {
    name: string;
    spent: number;
    limit: number;
}

export function Bucket({ name, percent}: BucketProps) {
    return <li>{name} = target {percent}%</li>;
}

export function BucketCard( { name, limit, spent }: BucketCardProps) {
    const over = spent - limit
    const isOver = over > 0

    // Phase 1: the bar starts full and depletes as you spend (100% -> 0%).
    // Phase 2: once overspent it refills to show how far over you are, capped
    // at one full envelope's worth, since past that the number tells the story.
    const value =
        limit <= 0 ? 0
        : isOver ? Math.min(over / limit, 1) * 100
        : ((limit - spent) / limit) * 100

    return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress
            value={value}
            className="w-full max-w-sm"
            indicatorClassName={isOver ? "bg-destructive" : "bg-success"}
          >
            <ProgressLabel>{isOver ? "Over Budget" : "Amount Left"}</ProgressLabel>
          </Progress>
        </CardContent>
        <CardFooter>
          {isOver
            ? `$${over.toFixed(2)} over your $${limit.toFixed(2)} limit`
            : `$${(limit - spent).toFixed(2)} left of $${limit.toFixed(2)}`}
        </CardFooter>
      </Card>
    </>
    )
}