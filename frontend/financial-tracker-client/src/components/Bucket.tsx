type BucketProps = {
    name: string
    percent: number
}

export default function Bucket({ name, percent}: BucketProps) {
    return <li>{name} = target {percent}%</li>;
}