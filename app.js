const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const fileStore = require("session-file-store")(session);
const ejs = require("ejs");

const app = express();

const fs = require("fs").promises;
const { Session } = require("inspector");
app.set('view engine','ejs');
app.set('views','./views');
app.use(express.static(`${__dirname}`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new fileStore(),
  }))

app.get("/",(req,res)=>{

    user = req.session;
    console.log(user)
    console.log(user.idName)

    res.render(`home`,user);
})

app.get("/login",(req,res)=>{
    res.render(`login`);

})

app.get("/register",(req,res)=>{
    res.render(`register`);

})

app.get("/logout",(req,res)=>{
    req.session.destroy(()=>{
        res.redirect("/");
    })
})

app.get("/write",(req,res)=>{
    user = req.session;
    console.log(user);
    res.render(`write`,user);
})

app.get("/written",(req,res)=>{

    fs.readFile("./written.json")
    .then(data=>{
        const temp = JSON.parse(data);
        written={
            id:temp.id,
            text:temp.text,
        }
        console.log(temp);
        console.log(written);

        res.render(`written`,written);

    })
})

app.post("/login",(req,res)=>{
    fs.readFile("./user.json")
    .then(data=>{
        const id = req.body.id;
        const pw = req.body.pw;
        const user = JSON.parse(data);

        if(user.id.includes(id)){
            const idx = user.id.indexOf(id);
            if(user.pw[idx]===pw){
                
                req.session.idName=id;

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


app.post("/write", (req,res)=>{
    fs.readFile("./written.json")
    .then(async data=>{
        const id = req.body.id;
        const text = req.body.text;
        console.log(id)
        console.log(text)
        const written = JSON.parse(data);

        written.id.push(id);
        written.text.push(text);
        await fs.writeFile("./written.json",JSON.stringify(written));

        return res.json({});
    })
})


app.listen(3000,()=>{
    console.log("3000번 포트 가동");
})