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

// the following are added because
// passport local mongoose functions
// dont seem to have correct typing?
import { Document } from "mongoose";
interface T extends Document { };
interface INewUser
{
    username: string;
    email: string;
}

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

@post<DiscCollection>("findOneAndDelete", async function (doc)
{
    if (doc)
    {
        await DVDModel.deleteMany({
            _id: {
                $in: doc.discs
            }
        })
    }
})
export class DiscCollection
{
    @prop({ required: true })
    title!: string

    @prop({ required: true, default: [], ref: () => DVD })
    discs!: Ref<DVD>[];
}

export class Session
{
    @prop({ required: true, default: "" })
    refreshToken!: string
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
        usernameLowerCase: true
    })
export class User
{
    @prop({ required: true, default: "" })
    username!: string

    @prop({
        required: true,
        unique: true,
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
    refreshToken!: Session[]

    // this is disgusting usage of any, but i have no other options at this point in time
    // the user inside the function is supposed to be of type "UserModel", but that
    // cannot be set until after this user class is, so... ???
    //
    // i am not yet a smart enough typescript user to understand what to do.
    static register: (user: INewUser, password: string, fn: (err: any, user: any) => void) => Promise<T>
}

export const ReferenceDVDModel = getModelForClass(ReferenceDVD);
export const DVDModel = getModelForClass(DVD);
export const DiscCollectionModel = getModelForClass(DiscCollection)
export const SessionModel = getModelForClass(Session);
export const UserModel = getModelForClass(User);