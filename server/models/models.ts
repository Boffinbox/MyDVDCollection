import { prop, getModelForClass, Ref, setGlobalOptions, Severity } from "@typegoose/typegoose"

setGlobalOptions(
    {
        options:
        {
            allowMixed: Severity.ERROR,
        }
    }
)

export class ReferenceDVD
{
    @prop({ required: true })
    title!: string;

    @prop({ required: true })
    barcode!: string;
}

export class DVD
{
    @prop({ ref: () => ReferenceDVD })
    referenceDVD!: Ref<ReferenceDVD>;

    @prop({ required: true, default: 0 })
    rating!: number;

    @prop({ required: true, default: false })
    watched!: boolean
}

export class DiscCollection
{
    @prop({ required: true })
    title!: string

    @prop({ required: true, default: [], ref: () => DVD })
    discs!: Ref<DVD>[];
}

export const ReferenceDVDModel = getModelForClass(ReferenceDVD);
export const DVDModel = getModelForClass(DVD);
export const DiscCollectionModel = getModelForClass(DiscCollection)