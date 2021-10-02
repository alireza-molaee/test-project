import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
    },
    family: {
        type: String,
    },
    role: {
        type: String,
        enum: ["admin", "reporter"],
        default: "reporter"
    }
});

const User = mongoose.model('User', userSchema);

export default User;