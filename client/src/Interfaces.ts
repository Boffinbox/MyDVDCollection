export interface ICollection
{
    _id: string;
    title: string;
    discs: [string];
}

export interface ICollectionHydrated
{
    _id: string;
    title: string;
    discs: [IDisc]
}

export interface IDisc
{
    _id: string;
    rating: number;
    watched: boolean;
    referenceDVD:
    {
        _id: string;
        title: string;
        barcode: string;
    }
}