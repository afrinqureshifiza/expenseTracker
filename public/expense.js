// const Razorpay = require("razorpay")


const token = localStorage.getItem('token')

const errorP = document.getElementById('errorpara')
function showError(err){
    errorP.style.display='block'
    errorP.innerText=`Error : ${err.response.data.err}` 
}

function submitHandler(event){
    event.preventDefault()

    obj={
        amount:document.getElementById('amount').value,
        description:document.getElementById('description').value,
        category:document.getElementById('category').value
    }

    console.log(obj)
    const token = localStorage.getItem('token')
    console.log(token)

    axios.post('/expense/add-expense', obj,{headers:{'Authorisation':token}})
    .then(response=>{
      errorP.style.display='none'
      console.log(response.data.exp)
      addExpensetoUI(response.data.exp)
    })
    .catch(err=>{
     console.log(err)
     console.log(`err=> ${err.message}`)
     showError(err)
    })

}

function addExpensetoUI(expense){
    const elementid = `expense-${expense.id}`
    const ul = document.getElementById('expenselist')
    ul.innerHTML+=`<li id=${elementid}>
    amount:${expense.amount} - description:${expense.description} - category:${expense.category}
    <button onclick='deleteExpense(event,${expense.id})'>Delete Expense</button>
    </li>`
}

function deleteExpense(event,id){
    const token = localStorage.getItem('token')
    axios.delete(`/expense/delete-expense/${id}`, {headers: {'Authorisation': token}})
    .then(response=>{
        errorP.style.display='none'
        console.log(response.data.message)
        deleteExpensefromUI(event.target.parentElement)
    })
    .catch(err=>{
        showError(err)
    })

}

function deleteExpensefromUI(e){
    e.remove()
}


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


//buy premium
document.getElementById('rzp-button').addEventListener('click',(e)=>{
    const token = localStorage.getItem('token')
    console.log(token)

    axios.get('/purchase/premiummembership',{ headers: {'Authorisation': token}})
    .then(response=>{
        console.log('paymentid',response.razorpay_payment_id)
        let options={
            "order_id": response.data.order.id,
            "key":response.data.key_id,

            "handler":(response)=>{
                axios.post('/purchase/updateTransactionStatus',{
                    order_id:options.order_id,
                    payment_id: response.razorpay_payment_id
                }, {headers: {'Authorisation': token}})
                .then((response)=>{
                  errorP.style.display='none'
                  alert('You are now a Premium member')
                  document.getElementById('rzp-button').style.display='none'
                  document.getElementById('premiumFeature').style.display='block' 
                  console.log(response)
                  localStorage.setItem('token', response.data.token)
                })
                .catch(err=>{
                    showError(err)                  
                })          
            }
        } 
        const rzp = new Razorpay(options)
        rzp.open()
        e.preventDefault() 

        rzp.on('payment.failed', (response)=>{
            alert('Premium membership failed')
            axios.post('/purchase/failedpremiummembership',{
                order_id:options.order_id,
             }, {headers: {'Authorisation': token}})
             .then(()=>{
                console.log('fail updated')
            }) 
        })
    })
})

//show leaderboard
document.getElementById('show-leaderboard').addEventListener('click',(e)=>{
   e.preventDefault()
   showUsersOnLeaderBoard()
})

function showUsersOnLeaderBoard(){
    
    const ul = document.getElementById('leaderBoard')
    ul.style.display='block'
    console.log(ul)
    axios.get('/premium/showLeaderBoard')
    .then(response=>{
        console.log(response.data.userExpenses)
        errorP.style.display='none'
        const arr =response.data.userExpenses
        for(let i=0;i<arr.length;i++){
            ul.innerHTML+=`<li>Name - ${arr[i].name} Total Expense - ${arr[i].totalExpenses}</li>`  
        }
       
    })
    .catch(err=>{
        showError(err)
    })
}

//download expenses
document.getElementById('download').addEventListener('click', (e)=>{
    const token = localStorage.getItem('token')
    axios.get('/expense/download', {headers: {'Authorisation': token}})
    .then(response=>{
        errorP.style.display='none'
        console.log(response)
        console.log('downloaded') 
        showDownloads(response.data.fileURL)
        const a =document.createElement('a')
        a.href = response.data.fileURL
        a.download = 'expense.txt'
        a.click()
        a.remove()
    })
    .catch((err)=>{
        console.log('Something went wrong-> ',err)
    })
})


function showDownloads(url){
    document.getElementById('downloadedfile').style.display='block'
    const ul = document.getElementById('downloadedfile')
    console.log(ul)
    ul.innerHTML+=`<li><a href='${url}'>downloads</a></li>`
    
}

window.addEventListener('DOMContentLoaded',()=>{
    const token = localStorage.getItem('token')

    const decodedToken = parseJwt(token)
    console.log('decodedToken',decodedToken)
    if(decodedToken.isPremium){
        document.getElementById('rzp-button').style.display='none'
        document.getElementById('premiumFeature').style.display='block'
    }

    const page = 1
    listexpenses(page)
})

function showPagination({
    currentPage,
    hasNextPage,
    nextPage,
    previousPage,
    hasPreviousPage,
    lastPage
}){
    const ul= document.getElementById('expenselist')
  const div = document.getElementById('paginationdiv')
  div.innerHTML=""

  if(hasPreviousPage){
    const btn1 = document.createElement('button')
    btn1.innerHTML = previousPage
    btn1.addEventListener('click',(e)=>{
        ul.innerHTML=''
        listexpenses(previousPage) 
    })
    div.appendChild(btn1)
  }

  const btn = document.createElement('button')
  btn.innerHTML = `${currentPage}`
  btn.style.color='red'
  btn.addEventListener('click',(e)=>{
    ul.innerHTML=''
    listexpenses(currentPage) 
  })
  div.appendChild(btn)

  if(hasNextPage){
    const btn2 = document.createElement('button')
    btn2.innerHTML = nextPage
    btn2.addEventListener('click', (e)=>{
        ul.innerHTML=''
        listexpenses(nextPage)
    })
    div.appendChild(btn2)
  }

  const label = document.createElement('label')
  label.innerHTML='Rows Per Page: '
  label.setAttribute('for','rowsperpage')

  const select = document.createElement('select')
  select.setAttribute("id", "rowsperpage");

  let min = 5
  for(let i=0;i<4;i++){
    const option = document.createElement('option')
    option.setAttribute('value',`${min}`)
    option.innerText=min
    select.add(option)
    min=min*2
    console.log(option)
  }
  console.log(select)
  label.appendChild(select)
  div.appendChild(label)

  let storedRows= localStorage.getItem('rowsperpage')
  if(storedRows){
    select.value=storedRows
  }
  
  select.addEventListener('change',(e)=>{
    ul.innerHTML=""
    const rowperpage = select.value
    console.log(rowperpage)
    localStorage.setItem('rowsperpage', rowperpage)
    listexpenses(currentPage)
  })


}

function listexpenses(page){
    const rowsperpage = localStorage.getItem('rowsperpage')|| 5
    axios.get(`/expense/show-expense?page=${page}`,{ headers: {'Authorisation' : token, 'rowsperpage':rowsperpage }})
    .then((response)=>{
        console.log(response.data)
        errorP.style.display='none'
        const array = response.data.arr
        const {currentPage, hasNextPage, nextPage, previousPage, hasPreviousPage, lastPage} = response.data
        console.log({currentPage, hasNextPage, nextPage, previousPage, hasPreviousPage, lastPage})

        for(let i=0;i<array.length;i++){
            console.log(array[i])
         addExpensetoUI(array[i])
         showPagination({currentPage, hasNextPage, nextPage, previousPage, hasPreviousPage, lastPage})
        }
    })
    .catch(err=>{
        showError(err)
    })
}
