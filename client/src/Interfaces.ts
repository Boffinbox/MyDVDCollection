export interface ICollection
{
    _id: string;
    discs: [string];
    title: string;
}

export interface ICollectionHydrated
{
    _id: string;
    title: string;
    discs: [{
        _id: string;
        rating: number;
        watched: boolean;
        referenceDVD:
        {
            _id: string;
            title: string;
            barcode: string;
        }
    }]
}