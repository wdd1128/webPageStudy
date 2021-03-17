
function wr(idName){
    const text = document.querySelector("#text").value;
    
    console.log(idName);
    console.log(text);

    const req = {
        id:idName,
        text:text,
        background:document.querySelector("body").style.backgroundColor,
    };

    fetch("/write",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(req),
    })
    .then(res=>res.json())
    .then(res=>{
        alert("작성 되었습니다.");
        location.href="/";
    })
}
