console.log(1)
function forgotpassword(e){
    e.preventDefault();
    // console.log(e.target.name)
    const form = new FormData(e.target)
    
    const obj={
        email:form.get('email')
    }
    
    
    axios.post('/password/forgotpassword',obj)
    .then((response)=>{
        console.log(response)
    })
}