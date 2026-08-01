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
    const value= (limit - spent) / limit * 100;
    return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={value} className="w-full max-w-sm">
            <ProgressLabel>Amount Left</ProgressLabel>
          </Progress>
        </CardContent>
        <p>${limit - spent} left of ${limit}</p>
      </Card>
    </>
    )
}