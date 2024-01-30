// Artificially create a wait time

export function Wait(time: number)
{
    return new Promise(resolve => setTimeout(resolve, time))
}