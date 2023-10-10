import { prop, getModelForClass, Ref } from "@typegoose/typegoose"

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

    @prop({ required: true, default: [] })
    discs: Ref<DVDClass>[];
}

export const ReferenceDVD = getModelForClass(ReferenceDVDClass);
export const DVD = getModelForClass(DVDClass);
export const DiscCollection = getModelForClass(DiscCollectionClass);