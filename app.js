const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        
      cb(null, Date.now() + file.originalname);
    }
  })
   
const upload = multer({ storage: storage })
const fileStore = require("session-file-store")(session);
const ejs = require("ejs");

const app = express();

const fs = require("fs").promises;
const { readFile } = require("fs");
const { send } = require("process");

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

app.get("/",async (req,res)=>{


    await fs
    .readdir("./uploads",(err,file)=>{file})
    .then(file=>{
        user = req.session;
        user.file=file;

        res.render(`home`,user);
        })

})

app.get("/login",(req,res)=>{
    user = req.session;
    res.render(`login`,user);

})

app.get("/register",(req,res)=>{
    user = req.session;
    res.render(`register`,user);

})

app.get("/logout",(req,res)=>{
    req.session.destroy(()=>{
        res.redirect("/");
    })
})

app.get("/write",(req,res)=>{

    user = req.session;

    res.render(`write`,user);
})

app.get("/upload",(req,res)=>{

    user = req.session;

    res.render(`upload`,user);
})

app.get("/written",(req,res)=>{

    fs.readFile("./written.json")
    .then(data=>{
        const temp = JSON.parse(data);
        written={
            id:temp.id,
            text:temp.text,
            background:req.session.background,
        }

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
                req.session.background=req.body.background;

                return res.json({success:true})
            }
            else{ return res.json({success:"pwFalse"})}
        }
        else{
            return res.json({success:"idFalse"});
        }
    })
})
app.post("/background",(req,res)=>{
    req.session.background = req.body.background;
    return res.json({});
})


app.post("/register", (req,res)=>{
    fs.readFile("./user.json").then(async data=>{
        const user = JSON.parse(data);
        const id = req.body.id;
        const pw = req.body.pw;
        const confirmPw = req.body.confirmPw;

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
        req.session.background=req.body.background;

        const written = JSON.parse(data);

        written.id.push(id);
        written.text.push(text);
        await fs.writeFile("./written.json",JSON.stringify(written));

        return res.json({});
    })
})

app.post("/upload",upload.single('userFile'),async(req,res)=>{

    res.redirect("./");


//    var arr=[1];
//     fs.readdir("./uploads/",(err,fileList)=>{

//         console.log(fileList)

//     }).then(()=>
//     {
//         res.send(arr);
//     })

})


app.listen(3000,()=>{
    console.log("3000번 포트 가동");
})