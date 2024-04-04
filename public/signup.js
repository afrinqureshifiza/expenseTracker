function submitHandler(event){
    event.preventDefault()

    obj={
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    }

    axios.post('http://localhost:3000/user/signup', obj)
    .then((res)=>{
        const errorP = document.getElementById('signuperror')
        errorP.style.display='none'
        console.log(res.data)
    })
    .catch(err=>{
        console.log('error happend')
        console.log(err)
        const errorP = document.getElementById('signuperror')
        errorP.style.display='block'
        errorP.textContent= `Error : ${err.response.data.message}`
    })
}   