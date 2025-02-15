export interface ICollection
{
    _id: string;
    title: string;
    discs: string[] | IDisc[]
}

export interface IDisc
{
    _id: string;
    rating: number;
    watched: boolean;
    referenceDVD: string | IReferenceDisc
}

export interface IReferenceDisc
{
    _id: string;
    barcode: string;
    title: string;
    upcitemdb_title: string;
    upcitemdb_truedata: boolean;
    ean: string;
    upc: string;
    gtin: string;
    asin: string;
    description: string;
    brand: string;
    model: string;
    dimension: string;
    weight: string;
    category: string;
    currency: string;
    lowest_recorded_price: number;
    highest_recorded_price: number;
    images: string[]
}