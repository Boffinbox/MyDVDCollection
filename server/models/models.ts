import { prop, getModelForClass, Ref, setGlobalOptions, Severity } from "@typegoose/typegoose"

setGlobalOptions(
    {
        options:
        {
            allowMixed: Severity.ERROR,
        }
    }
)

export class ReferenceDVDClass
{
    @prop({ required: true })
    title!: string;

    @prop({ required: true })
    barcode!: string;
}

export class DVDClass
{
    @prop({ ref: () => ReferenceDVDClass })
    referenceDVD!: Ref<ReferenceDVDClass>;

    @prop({ required: true, default: 0 })
    rating!: number;

    @prop({ required: true, default: false })
    watched!: boolean
}

export class DiscCollectionClass
{
    @prop({ required: true })
    title!: string

    @prop({ required: true, default: [], ref: () => DVDClass })
    discs!: Ref<DVDClass>[];
}

export const ReferenceDVD = getModelForClass(ReferenceDVDClass);
export const DVD = getModelForClass(DVDClass);
export const DiscCollection = getModelForClass(DiscCollectionClass)