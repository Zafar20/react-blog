import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import cors from 'cors'

import { registerValidation, loginValidation, postCreateValidation } from './validations.js'

import {checkAuth, handleValidationErrors} from './utils/index.js'

import { UserController, PostController} from './controllers/index.js'


mongoose.connect('mongodb+srv://Zafar3250:9803250Zaf@cluster0.pjqqqxv.mongodb.net/blog?retryWrites=true&w=majority')
.then(() => console.log('DB ok'))
.catch((err) => console.log('db error', err))

const app = express()

// позволяет нашему запросу читать json формат
app.use(express.json())
app.use(cors())
// нужно для того чтобы express находил static папку  uploads
app.use('/uploads/', express.static('uploads'))


// хранилище для картинок

const storage = multer.diskStorage({
    destination: (_,a, cb) => {
        // говорим сохраняй файлы в папку uploads
        cb(null, 'uploads')
    },
    // указываем как назвать файл
    filename: (_,file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({storage})

// когда я делаю запрос на главную страницу я говорю что делать
// req - что прислал клиент
// res - что я буду передовать клиенту
app.get('/', (req,res) => {
    res.send('Hello world!')
})


// login
app.post('/auth/login',  loginValidation, handleValidationErrors, UserController.login)
// если вторым параметром передали элемент то проверяем если в registerValidation есть то что передали то функция сработает
app.post('/auth/register',   registerValidation, handleValidationErrors, UserController.register )

app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req,res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.get('/tags', PostController.getLastTags)

app.get('/posts', PostController.getAll)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.get('/posts/:id', PostController.getOne)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)




// запускаем сервер
app.listen(4444, (err) => {
    if(err) {
        return console.log(err);
    }
    console.log('Server OK');
})