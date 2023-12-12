import mongoose from "mongoose";

// описываем пользователя
const PostSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
            unique: true,
        },
        tags: {
            type: Array,
            default: [],
        },
        viewsCount: {
            type: Number,
            default: 0,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // связь между моделью User
            required: true,
        },
        imageUrl: String
    },
    {
        // добавляет дату создания и обновления этого элемента
        timestamps: true,
    }
)

export default mongoose.model('Post', PostSchema)