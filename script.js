var expenseInfo;
var notification;

function displayExpenses()
{
    let data = JSON.parse(localStorage.getItem("data"));
    data.forEach((expense) => {
        const parentDiv = document.createElement("div");
        parentDiv.classList.add("expense");

        const childDiv1 = document.createElement("div");
        const childDiv2 = document.createElement("div");

        childDiv1.classList.add("expense-content");
        childDiv2.classList.add("expense-content");

        childDiv1.innerHTML = `<p>${expense.expense}</p>`;
        childDiv2.innerHTML = `
            <span>₹${expense.amount}</span>
            <div class="options">
                <div class="edit-btn" title="Edit">
                    <lord-icon
                        src="https://cdn.lordicon.com/lyrrgrsl.json"
                        trigger="hover"
                        colors="primary:#545454"
                        style="width:25px;height:25px">
                    </lord-icon>
                </div>
                <div class="delete-btn" title="Delete">
                    <lord-icon
                        src="https://cdn.lordicon.com/wpyrrmcq.json"
                        trigger="hover"
                        colors="primary:#ee6d66"
                        style="width:23px;height:23px">
                    </lord-icon>
                </div>
            </div>
        `

        parentDiv.appendChild(childDiv1);
        parentDiv.appendChild(childDiv2);
        
        document.querySelector(".expenses-list").appendChild(parentDiv);
    })
}

function emptyInputFields()
{
    document.querySelectorAll(".expense-input input")[0].value = "";
    document.querySelectorAll(".expense-input input")[1].value = "";
}

function showToast()
{
    Toastify({
        text: notification,
        duration: 1800,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: false,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function(){} // Callback after click
      }).showToast();
}

function addExpense()
{
    const inputs = document.querySelectorAll(".expense-input input");
    const expense = inputs[0].value;
    const amount = inputs[1].value;
    let data = localStorage.getItem("data") || [];
    if(typeof data === typeof "")
    {
        data = JSON.parse(data);
    }
    data.push({
        "expense": expense,
        "amount": amount
    })
    localStorage.setItem('data', JSON.stringify(data));
   
    notification = ` ${expense} is added!!`;

    showToast();
}


function editExpense(data) 
{
    document.getElementById("expense-input-container-id").style.display = "flex";
    document.querySelectorAll(".expense-input input")[0].value = data.expense;
    document.querySelectorAll(".expense-input input")[1].value = data.amount;
    document.querySelector(".expense-input .button").innerHTML = "Edit Expense";
    expenseInfo = data;
}

function deleteExpense(data)
{
    const localData = JSON.parse(localStorage.getItem("data"));
    for(var i=0; i<localData.length; i++)
    {
        let element = localData[i];
        if(element.expense == data.expense) break;
    }
    localData.splice(i, 1);
    localStorage.setItem("data", JSON.stringify(localData));
    location.reload();
}

function displayChart()
{

    const data = JSON.parse(localStorage.getItem("data"));
    let expenses = [];
    let amounts = [];
    let colors = [];

    for (let i = 1; i <= data.length; i++) {
        const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
        colors.push(randomColor);
    }

    for(let i=0; i<data.length; i++)
    {
        const elem = data[i];
        expenses.push(elem.expense);
        amounts.push(elem.amount);
    }

    const ctx = document.getElementById('chart');
    new Chart(ctx, {
        type: 'bar',
        data: {
        labels: expenses,
        datasets: [{
            label: 'Expenses',
            data: amounts,
            borderWidth: 2,
            backgroundColor: colors,
        }]
        },
        options: {
            scales: {
                y: {
                beginAtZero: true
                }
            }
        }
    });
}

function totalExpenses()
{
    let total = 0;
    
    const data = JSON.parse(localStorage.getItem("data"));
    data.forEach((elem) => {
        total += parseInt(elem.amount);
    });

    document.querySelector(".total-exp").childNodes[3].innerHTML = `₹${total}`
}

window.addEventListener("load", () => {
    const data = localStorage.getItem("data") || []
    // console.log(data);
    if(data.length == 0)
    {
        localStorage.setItem("data", []);
        return;
    }

    totalExpenses();
    displayExpenses();
    displayChart();
});

document.querySelector(".add-expense .button").addEventListener("click", () => {
    document.getElementById("expense-input-container-id").style.display = "flex";
});

document.querySelector(".expense-input-container .button").addEventListener("click", () => {
    if(document.querySelector(".expense-input-container .button").innerHTML == "Add Expense")
    {
       addExpense();
    }
    else if(document.querySelector(".expense-input-container .button").innerHTML == "Edit Expense")
    {
        let data = JSON.parse(localStorage.getItem("data"));
        console.log(data);
        for(var i=0; i<data.length; i++)
        {
            let element = data[i];
            if(element.expense == expenseInfo.expense) break;
        }
        const inputs = document.querySelectorAll(".expense-input input");
        const expense = inputs[0].value;
        const amount = inputs[1].value;
        data[i] = {
            "expense": expense,
            "amount": amount
        };
    
        localStorage.setItem("data", JSON.stringify(data));
        notification = ` ${expense} is edited!!`;
        showToast();
    }

    emptyInputFields();
    document.getElementById("expense-input-container-id").style.display = "none";

    setTimeout(() => {
        location.reload();
    }, 2200)
});

document.getElementById("close-btn").addEventListener("click", () => {
    emptyInputFields();
    document.getElementById("expense-input-container-id").style.display = "none";
});

setTimeout(() => {
    document.querySelectorAll(".expense").forEach((expense) => {
        const elem = expense.childNodes[1].childNodes[3];
        const data = {
            "expense": expense.childNodes[0].childNodes[0].innerHTML,
            "amount": expense.childNodes[1].childNodes[1].innerHTML.substring(1)
        }
        elem.childNodes[1].addEventListener("click", () => {
            editExpense(data);
        })
        elem.childNodes[3].addEventListener("click", () => {
            deleteExpense(data);
        })
    });
}, 500)