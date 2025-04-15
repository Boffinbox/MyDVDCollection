export default function DevLog(message?: any, ...optionalParams: any[]): void
{
    if (process.env.NODE_ENV !== "production")
    {
        console.log(message, ...optionalParams)
        // break glass to stack trace
        // console.trace()
    }
}