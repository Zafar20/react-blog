import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'

import UserModel from '../models/User.js'


export const register =  async (req,res) => {
    console.log('Zafar');
    try {
  
      const password = req.body.password
      // salt - алгоритм шифрования нашего пароля
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      
      // подготовили  пользователя
      const doc = new UserModel({
          email: req.body.email,
          fullName: req.body.fullName,
          avatarUrl: req.body.avatarUrl,
          passwordHash: hash
      })
      
      // создаем пользователя в БД
      const user = await doc.save()
      
     // expiresIn - длительность жизни токена
     const token = jwt.sign({
         _id: user._id,
     }, 'secret123', { expiresIn: '30d'})
     
     const { passwordHash, ...userData } = user._doc
      
      res.json({
         userData,
         token
      })
    } catch (error) {
         console.log(error);
         res.status(500).json({
             message: "Не удалось зарегистрироваться"
         })
    }
     
     
     
}

export const login = async (req,res) => {
    try {
        // если  есть такой email
        const user = await UserModel.findOne({email: req.body.email})
        if(!user) {
            return  res.status(404).json({
                message: 'Пользователь не найден'
            }) 
        }
        
        
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)
       
        
        if(!isValidPass) {
            return  res.status(404).json({
                message: 'Неверный логин или  пароль'
            }) 
        }
        
        const token = jwt.sign({
            _id: user._id
        },'secret123', { expiresIn: '30d'})
        
        const { passwordHash, ...userData } = user._doc
     
        res.json({
           userData,
           token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось авторизоваться"
        })
    }
}

export const getMe = async(req,res) => {
    try {
        // находим пользователя в бд по id
        const user = await UserModel.findById(req.userId)
        
        if(!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }
        
        const { passwordHash, ...userData } = user._doc
     
        res.json({userData})
        
    } catch (error) {
         res.status(404).json({
            message: 'Нет доступа'
        })
    }
}