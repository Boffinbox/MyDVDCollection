export { };

export function getRefreshTokenCookieFromArray(cookies: string[])
{
    return cookies[cookies.findIndex((cookie) => cookie.includes("refreshToken"))];
}

function convertCookieStringToObject(cookie: string)
{
    return cookie.split('; ').reduce((prev, current) =>
    {
        const [name, ...value] = current.split('=');
        prev[name] = value.join('=');
        return prev;
    }, {});
}

function getRefreshTokenFromCookieObject(cookie): string
{
    const stringWeCareAbout = cookie.refreshToken;
    const fourSliced = stringWeCareAbout.slice(4);
    const splitString = fourSliced.split(".")
    const theFirstThreeParts = splitString[0] + "." + splitString[1] + "." + splitString[2];
    return theFirstThreeParts;
}

export function getRefreshTokenFromResponseHeader(cookies: string[]): string
{
    const cookieOfInterest = getRefreshTokenCookieFromArray(cookies);
    const cookieOfInterestObject = convertCookieStringToObject(cookieOfInterest);
    const actualRefreshToken = getRefreshTokenFromCookieObject(cookieOfInterestObject);
    return actualRefreshToken;
}

module.exports;