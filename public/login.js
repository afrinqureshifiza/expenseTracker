const errorP = document.getElementById('loginerror')

function submitHandler(event){
    event.preventDefault()
    // console.log(event.target.email)

    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    obj={
        email:email,
        password:password
    }

    axios.post(`/user/login`, obj)
    .then((response)=>{
        errorP.style.display='none'
         alert(response.data.message)
         localStorage.setItem('token', response.data.token)
         window.location.href='../expense/show-expenseform'   
    })
    .catch(err=>{
        console.log('error happend')
        errorP.style.display='block'
        errorP.textContent = `Error : ${err.response.data.message}`
    })
}

const forgotpwd = document.getElementById('forget-pwd')
console.log(forgotpwd)
forgotpwd.addEventListener('click',(e)=>{
    e.preventDefault()
    console.log('click')
    window.location.href='../user/forgotpasswordform'
})