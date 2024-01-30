export async function Partial(fn: any, ...args: any[])
{
    return async function (...moreArgs: any[])
    {
        return await fn(...args, ...moreArgs)
    }
}