import mongoose from "mongoose";

// описываем пользователя
const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    avatarUrl: String
    
    },
    {
        // добавляет дату создания и обновления этого элемента
        timestamps: true
    }
)

export default mongoose.model('User', UserSchema)