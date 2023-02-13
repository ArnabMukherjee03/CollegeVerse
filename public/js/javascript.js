function show(anything){
    document.querySelector('.textBox').value = anything;

}

const dropdown = document.querySelector('.dropdown');
dropdown.onclick = function(){
    dropdown.classList.toggle('active');
}

function show2(anything){
    document.querySelector('.textBox2').value = anything;

}

const dropdown2 = document.querySelector('.drop-2');
dropdown2.onclick = function(){
    dropdown2.classList.toggle('active');
}


const btn = document.querySelector('.notes-btn');
btn.onclick=function() {
    const semester = document.querySelector('.textBox').value;
    const year = document.querySelector('.textBox2').value;
    let list = semester+"-"+year;
    list = list.toLowerCase();
    const x = document.querySelectorAll(".search-div");
    let flag = "null";
    for (i = 0; i < x.length; i++) {
        value = x[i].querySelector('span').innerHTML;
        if(value.toLowerCase()==list){
            x[i].style.display = "block";
            flag = "got";
        }
    }
    
    console.log(flag);

    const error = document.querySelector(".pyq-error");
    if(flag=="null"){
        error.style.display = "block";
    }

}
