const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const fs = require("fs").promises;

app.use(express.static(`${__dirname}`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.get("/",(req,res)=>{
    res.sendFile(`${__dirname}/home.html`);
})

app.get("/login",(req,res)=>{
    res.sendFile(`${__dirname}/login.html`);
})

app.get("/register",(req,res)=>{
    res.sendFile(`${__dirname}/register.html`);
})

app.post("/login",(req,res)=>{
    fs.readFile("./user.json")
    .then(data=>{
        const id = req.body.id;
        const pw = req.body.pw;
        const user = JSON.parse(data);

        console.log(user.id.indexOf(id));
        if(user.id.includes(id)){
            const idx = user.id.indexOf(id);
            if(user.pw[idx]===pw){
                return res.json({success:true})
            }
            else{ return res.json({success:"pwFalse"})}
        }
        else{
            return res.json({success:"idFalse"});
        }
    })
})

app.post("/register", (req,res)=>{
    fs.readFile("./user.json").then(async data=>{
        const user = JSON.parse(data);
        const id = req.body.id;
        const pw = req.body.pw;
        const confirmPw = req.body.confirmPw;

        console.log(user.id.includes(id))
        if(pw !== confirmPw){
            return res.json({success:"pwfalse"})
        }
        if(user.id.includes(id)){
            return res.json({success:"idfalse"})
        }
        
        user.id.push(id);
        user.pw.push(pw);  
        await fs.writeFile("./user.json",JSON.stringify(user));
        res.json({success:true})
    });
})

app.listen(3000,()=>{
    console.log("3000번 포트 가동");
})