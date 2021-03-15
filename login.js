const id=document.querySelector("#id");
const pw=document.querySelector("#pw");
const login=document.querySelector("#loginBt");

login.addEventListener("click",()=>{
    req={
        id:id.value,
        pw:pw.value,
    }

    fetch("/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(req),
    })
    .then(res=>res.json())
    .then(res=>{
        if(res.success===true) location.href='/';
        else if(res.success==="idFalse") alert("없는 아이디 입니다.");
        else if(res.success==="pwFalse") alert("비밀번호 불일치.");
    })
});
