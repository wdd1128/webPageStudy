const id = document.querySelector("#id");
const pw = document.querySelector("#pw");
const confirmPw = document.querySelector("#confirmPw");

const register = document.querySelector("#registerBt");

register.addEventListener("click",()=>{
    
    const res = {
        id:id.value,
        pw:pw.value,
        confirmPw:confirmPw.value,
    };

    fetch("/register",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(res),
    })
    .then(res=>res.json())
    .then(res=>{
        if(res.success === true) location.href="/login";
        else if(res.success === "idfalse") alert("아이디 중복");
        else if(res.success === "pwfalse") alert("비밀번호 불일치");
    })
});
