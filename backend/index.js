const express = require('express');
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require('cors');
const Product = require('./Product');
const User = require('./User');
const Review = require('./Review');

const app = express();
app.use(cors());
app.use(express.json());

app.get("/product", async(req,res)=>{
    try{
        const products = await Product.find();
        res.status(200).json(products)
    }catch(e){
        console.log(e)
    }
})

app.post('/product', async(req,res)=>{
    try{
        const {name,cost,category,unit,imgSRC} = req.body;

        if(!name || !cost || !category || !unit || !imgSRC){
            return res.status(400).json({message: "Введите все данные"})
        }
        const newproduct = new Product({name,cost,category,unit,imgSRC});
        await newproduct.save();

        res.status(200).json({message:"Товар добавлен!"})

    }catch(e){
        res.status(500).json({message:"Ошибка с добавлением продуктов"})
    }
})

app.post("/review", async(req,res)=>{
    try{
            const {login, text} = req.body;
            if(!text){
                return res.status(500).json({message: "Нету данных"})
            }
            if(text.length >= 300){
                  return res.status(500).json({message: "Много символов"})
            }

        if(text.length <= 5){
            return res.status(400).json({message: "Введите больше символов"})
        }
        const reviewNew = new Review({
            login, text
        })
        await reviewNew.save();
        res.status(200).json({message: "Отзыв отправлен"})
    }catch(e){
        res.status(500).json({message: "Отзыв не отправлен из-за проблем с бэком"})
    }
})

app.get("/review", async(req,res)=>{
    try{
        const reviews = await Review.find();
        res.status(200).json(reviews);
    }catch(e){
        console.log(e)
    }
})

app.post('/register', async(req,res)=>{
    try{
            const {login, password, email, fullname} = req.body;
            if(!login || !password || !email || !fullname){
                return    res.status(400).json({message:'Введите все данные'})
            }
            const loginMatch = await User.findOne({login});
            if(loginMatch){
                return res.status(400).json({message:"Логин уже зарегистирован"})
            }
            const emailMatch = await User.findOne({email});
            if(emailMatch){
                return res.status(400).json({message:"Почта уже зарегистрирована"})
            }
            const newuser = new User({
                login,
                password,
                email,
                fullname
            })
            await newuser.save();
            res.status(200).json({message:'Вы зарегистировались!'})
    }catch(e){
        res.status(500).json({message:'Проблемы на стороне бекенде'})
    }
})

app.post('/auth', async(req,res)=>{
    try{
            const {login, password} = req.body;
            if(!login || !password){
                return    res.status(400).json({message:'Введите все данные'})
            }
            const loginMatch = await User.findOne({login});
            if(!loginMatch){
                return res.status(400).json({message:"Логин не зарегистирован"})
            }
           if(password !== loginMatch.password){
            return res.status(400).json({message: "Пароли не совпадают"})
           }
           const token = jwt.sign({id:loginMatch._id, role: loginMatch.role, login: loginMatch.login }, "SECRET_KEY", {expiresIn: "24h"})
            res.status(200).json({message:'Вы авторизовались!', token})
    }catch(e){
        res.status(500).json({message:'Проблемы на стороне бекенде'})
    }
})

app.get("/profile/:id", async(req,res)=>{
    try{
        const id = req.params.id;
        const user = await User.findById(id);
        res.status(200).json(user);
    }catch(e){
        console.log(e)
    }
})

async function Start(){
    try{
        await mongoose.connect("mongodb://localhost:27017/Shop")
        app.listen(9000,()=>{console.log('Запущен')})
    }catch(e){
        console.log(e)
    }
}
Start();