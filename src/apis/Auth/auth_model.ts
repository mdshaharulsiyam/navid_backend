import { Schema, model, CallbackError } from 'mongoose';
import config from '../../DefaultConfig/config';
import hashText from '../../utils/hashText';
import { IAuth, } from './auth_types';




// Create the Auth schema
const auth_schema = new Schema<IAuth>(
    {
        name: {
            type: String,
            required: [true, ' name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'email is required'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: false,
            default: null
        },
        img: {
            type: String,
            required: false,
            default: null
        },
        password: {
            type: String,
            required: function (this: IAuth) {
                return this.provider === "CREDENTIAL";
            },
            validate: [
                {
                    validator: function (value: string) {
                        return (value && value.length >= 8) ? true : false;
                    },
                    message: 'Password must be at most 8 characters long',
                },
                {
                    validator: function (value: string) {
                        return !value || /[A-Z]/.test(value);
                    },
                    message: 'Password must contain at least one uppercase letter',
                },
            ],
        },
        role: {
            type: String,
            enum: config.USER,
            default: 'USER',
        },
        block: {
            type: Boolean,
            default: false,
        },
        is_verified: {
            type: Boolean,
            default: false,
        },
        provider: {
            type: String,
            enum: ["GOOGLE", "CREDENTIAL", "FACEBOOK", "GITHUB", "APPLE"],
            default: "CREDENTIAL"
        },
        accessToken: {
            type: String,
            default: ''
        },
        use_type: {
            type: String,
            enum: ["FREE", "BASIC", "PREMIUM"],
            default: "BASIC"
        },
        is_identity_verified: {
            type: Boolean,
            default: false
        },
        documents: {
            type: [String],
            default: []
        },
        date_of_birth: {
            type: Date,
            required: [true, 'date of birth is required']
        }
    },
    {
        timestamps: true,
    }
);

auth_schema.pre('save', async function (next) {
    const age = calculateAge(this.date_of_birth.toString())
    console.log(age)
    if (age < 21) throw new Error('age must be more then 21')

    if (this && this.provider == "CREDENTIAL" && this.isModified('password')) {
        try {
            this.password = await hashText(this.password)
        } catch (error) {
            return next(error as CallbackError)
        }
    }
    next();
})
// Create the Auth model
const auth_model = model<IAuth>('auth', auth_schema);


export function calculateAge(birthDateString: string) {
    const birthDate = new Date(birthDateString);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    const dayDiff = today.getDate() - birthDate.getDate();

    // Adjust if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}

// Example usage
console.log(calculateAge("2000-02-18")); // Replace with your date of birth


export default auth_model;
