function dayNight(){
    const color = document.querySelector("body").style.backgroundColor;
    if(color==="white"){
        document.querySelector("#dn").innerText="밝게"
        document.querySelector("body").style.backgroundColor="rgb(41, 41, 41)";
        document.querySelector("body").style.color="white";

    }
    else{
        document.querySelector("#dn").innerText="어둡게"
        document.querySelector("body").style.backgroundColor="white";
        document.querySelector("body").style.color="black";

    }
}

function move(address){

    req={
        background:document.querySelector("body").style.backgroundColor
    }

    fetch("/background",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(req),
    })
    .then(res=>res.json())
    .then(res=>{
        location.href=address;
    })
}
