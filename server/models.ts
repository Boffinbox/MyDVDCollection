import
{
    prop,
    getModelForClass,
    Ref,
    setGlobalOptions,
    Severity,
    post,
    plugin,
    modelOptions
} from "@typegoose/typegoose"

const passportLocalMongoose = require("passport-local-mongoose")

setGlobalOptions(
    {
        options:
        {
            allowMixed: Severity.ERROR,
        }
    }
)

class ReferenceDVD
{
    @prop({ required: true })
    barcode!: string;

    @prop({ required: true, default: "unknown" })
    title!: string;

    @prop({ required: true, default: "unknown" })
    upcitemdb_title!: string;

    @prop({ default: "" })
    ean: string;

    @prop({ default: "" })
    upc: string;

    @prop({ default: "" })
    gtin: string;

    @prop({ default: "" })
    asin: string;

    @prop({ default: "" })
    description: string;

    @prop({ default: "" })
    brand: string;

    @prop({ default: "" })
    model: string;

    @prop({ default: "" })
    dimension: string;

    @prop({ default: "" })
    weight: string;

    @prop({ default: "" })
    category: string;

    @prop({ default: "" })
    currency: string;

    @prop({ default: 0 })
    lowest_recorded_price: number

    @prop({ default: 0 })
    highest_recorded_price: number

    @prop({ type: () => [String], default: [] })
    images: string[];
}

class UserDVD
{
    @prop({ ref: () => ReferenceDVD })
    referenceDVD!: Ref<ReferenceDVD>;

    @prop({ required: true, default: 0 })
    rating!: number;

    @prop({ required: true, default: false })
    watched!: boolean
}

// when a collection is deleted, also delete it's associated dvds
@post<DiscCollection>("findOneAndDelete", async function (doc)
{
    if (doc)
    {
        await UserDVDModel.deleteMany({
            _id: {
                $in: doc.discs
            }
        })
    }
})
class DiscCollection
{
    @prop({ required: true })
    title!: string

    @prop({ required: true, default: [], ref: () => UserDVD })
    discs!: Ref<UserDVD>[];
}

class Session
{
    @prop({ required: true, default: "" })
    refreshToken!: string

    @prop({ required: true, default: 1 })
    refreshCount!: number;
}

const emailRegExpLiteral =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

@modelOptions({
    schemaOptions: {
        toJSON: {
            transform: function (doc, ret, options)
            {
                delete ret.refreshToken;
                return ret;
            }
        }
    }
})
@plugin(passportLocalMongoose,
    {
        usernameField: "email",
        usernameLowerCase: true,
        usernameUnique: true
    })
class User
{
    @prop({ required: true, default: "" })
    username!: string

    @prop({
        required: true,
        default: "",
        validate: {
            validator: function (v: string): boolean
            {
                return emailRegExpLiteral.test(v)
            },
            message: "not a valid email"
        }
    })
    email!: string

    @prop({ required: true, default: "local" })
    authStrategy!: string

    @prop({ required: true, default: [], type: () => [Session] })
    refreshTokens!: Session[]

    @prop({ required: true, default: [], ref: () => DiscCollection })
    collections!: Ref<DiscCollection>[];

    // i have to list these here or else typescript doesn't recognize
    // the passport-local-mongoose methods :(
    static createStrategy
    static serializeUser
    static deserializeUser
    static register
}

export const ReferenceDVDModel = getModelForClass(ReferenceDVD);
export const UserDVDModel = getModelForClass(UserDVD);
export const DiscCollectionModel = getModelForClass(DiscCollection)
export const SessionModel = getModelForClass(Session);
export const UserModel = getModelForClass(User);