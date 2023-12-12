import PostModel from '../models/Post.js'

export const getLastTags = async(req,res) => {
    try {
        // получи последние 5 статей
        const posts = await PostModel.find().limit(5).exec()
        
        const tags = posts.map(obj => obj.tags).flat().slice(0,5)
        
        res.json(tags)
    } catch (error) {
        console.log(err);
            res.status(500).json({
                message: 'Не удалост получить статьи'
            })
    }
}


export const getAll = async(req,res) => {
    try {
        // берем все посты
        // populate - подключается к другой таблице
        const posts = await PostModel.find().populate('user').exec()

        res.json(posts)
    } catch (error) {
        console.log(err);
            res.status(500).json({
                message: 'Не удалост получить статьи'
            })
    }
}
export const getOne = async(req,res) => {
    try {
        const postId = req.params.id

        let find = { _id: postId}
        let update = {  $inc: { viewsCount: 1 } }

        let doc = await PostModel.findOneAndUpdate(find, update, {
            returnOriginal: false
        }).populate('user');

        if(!doc) {
            return res.status(404).json({
                 message: 'Статья не найдена'
            })
        }

        res.json(doc)
        
       

    } catch (error) {
        console.log(error);
            res.status(500).json({
                message: 'Не удалост получить статьи'
            })
    }
}
export const remove = async(req,res) => {
    try {
        const postId = req.params.id

        let find = { _id: postId}

        let doc = await PostModel.findOneAndDelete(find);

        if(!doc) {
            return res.status(404).json({
                 message: 'Статья не найдена'
            })
        }

        res.json({
            success: true
        })

       

      
       

    } catch (error) {
        console.log(error);
            res.status(500).json({
                message: 'Не удалось удалить статьи'
            })
    }
}

export const update = async(req,res) => {
    try {
        const postId = req.params.id

        let find = { _id: postId}
        let update = {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user: req.userId,
            tags: req.body.tags,
        }

        await PostModel.findOneAndUpdate(find, update);


        res.json({
            success: true
        })
       

    } catch (error) {
        console.log(error);
            res.status(500).json({
                message: 'Не удалост обновить статью'
            })
    }
}

export const create = async(req,res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        })
        
        const post = await doc.save()
        
        res.json(post)
    } catch (error) {
            console.log(err);
            res.status(500).json({
                message: 'Не удалост создать статью'
            })
    }
}