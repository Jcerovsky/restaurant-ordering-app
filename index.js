import {menuArray} from "/data.js"

const menuOrderSummary = document.getElementById('menu-order-summary');
const orderBtn = document.getElementById('order-btn');
const payBtn = document.getElementById('pay-btn');
const bodyEl = document.querySelector('body');
const thankYouDiv = document.getElementById('thank-you-msg-div');
const formDiv = document.querySelector('#form-div');

let orderedItemsPrice = [];
let total = 0;
    
// Event listeners 
document.addEventListener('click', function(e) {
    if (e.target.dataset.add) {
        handleAddBtn(e.target.dataset.add)
    }
    else if (e.target.dataset.remove) {
        handleRemoveBtn(e.target)
    }
    else if (e.target.id === 'order-btn') {
        handleOrderBtn()
    }
    else if (e.target.id === 'pay-btn') {
        e.preventDefault();
        handlePayBtn();
    }

})

function handleAddBtn(addedItem) {
    document.getElementById('thank-you-msg-div').classList.add('hidden');
    document.getElementById('order-section').classList.remove('hidden');
    
    let orderSummary = ``;
    
    
    const targetMenuItem = menuArray.filter(function(item) {
        return item.id == addedItem;
    })[0]
    
    // Adding items to order summary
    orderSummary += `
    <div class="order-summary" id="data-order-${targetMenuItem.id}">
        <h3> ${targetMenuItem.name}</h3>
        <button class="remove-btn" data-remove="${targetMenuItem.id}">remove</button>
        <h5 class="order-price">$${targetMenuItem.price}</h5>
    </div>
    `  
    
        menuOrderSummary.innerHTML += orderSummary;
    
    // Creating total price section
    
    orderedItemsPrice.push(targetMenuItem.price);
    total += targetMenuItem.price;
    
    
    document.getElementById('order-total').innerHTML = `
    <div class="order-total-div">
        <h3 class="order-total-text">Total price:</h3>
        <h5 class="order-total-text" id="order-total-price">$${total}</h5>
    </div>
    `
    
    // checking if thank you message is on screen
    const thankYouDivRect = thankYouDiv.getBoundingClientRect();
    if (thankYouDivRect.top >= 0 && thankYouDivRect.top < window.innerHeight) {
        thankYouDiv.style.display = 'none';
    }
}

function handleRemoveBtn(menuId) {
    // removing parentDiv based on the id of the remove button
    const parentDiv = document.getElementById(menuId.parentNode.id)
    
    // removing dollar sign from the item, converting to number and removing the amount from the sum
    const childDiv = parentDiv.querySelector(".order-price");
    childDiv.innerHTML = childDiv.innerHTML.replace('$', '');
    const itemPrice = parseInt(childDiv.innerHTML);
    console.log(itemPrice);
    total -= itemPrice;
    
    // updating total price amount after deducting the removed item price
    let totalPrice = parseInt(document.querySelector('#order-total-price').innerHTML.replace('$', ''));
    totalPrice -= itemPrice;
    
    document.querySelector('#order-total-price').innerHTML = `$${totalPrice}`
    
    parentDiv.remove()
    
    
    
}


function handleOrderBtn() {
    // Changing body background color and disabling buttons
    
    bodyEl.style.background = 'linear-gradient(whitesmoke,grey, whitesmoke)'
    formDiv.classList.remove('hidden')
    orderBtn.disabled = true;
    
    const addItemBtns = document.getElementsByClassName('add-item');
    for (let button of addItemBtns) {
        button.disabled = true;
    };
    
    // After clicking Complete order - create a form
    formDiv.innerHTML = `
    <form class="form" id="order-form">
        <span class="form-div-title">Enter card details</span>
        <input type="text" placeholder="Enter your name" id="name-field" required>
        <input type="text" placeholder="Enter card number" id="card-number-field"required>
        <input type="text" placeholder="Enter CVV" id="cvv-field" required>
        <button class="order-btn" id="pay-btn">Pay</button>
    </form>
    `
};

function handlePayBtn() {
    const name = document.getElementById('name-field')
    const cardDetails = document.getElementById('card-number-field')
    const cvvDetails = document.getElementById('cvv-field')
    
    
    // resetting order summary, order sum and making buttons active again after the loading screen is gone
    
    total = 0;
    
    setTimeout(function() {
        document.getElementById('menu-order-summary').innerHTML = '';
        orderBtn.disabled = false;
        
        const addItemBtns = document.getElementsByClassName('add-item');
        for (let button of addItemBtns) {
            button.disabled = false;
    }
    }, 4000);
    
    
    // Checking if data provided in the form have suffiecient length 
    // and if yes then create a loading page
    
    if (name.value.length < 2) {
        alert('Name must be at least 2 characters long')
    } 
    else if (cardDetails.value.length < 16) {
        alert('Card number must be 16 digits long')
    }
    else if (cvvDetails.value.length < 3) {
        alert('CVV must be 3 digits long')
    }
    else { 
        
        formDiv.innerHTML = `
        <div class="loading-msg-div">
            <h1 class="loading-msg">Stealing all your money...</h1>
            <img src="images/loading.gif" class="loading-img">
        </div>
        `
        
        setTimeout(function(){
                formDiv.classList.add('hidden')
                bodyEl.style.backgroundColor = 'white'
                bodyEl.style.background = ''
                document.getElementById('order-section').classList.add('hidden')
                
                thankYouDiv.style.display = 'flex'
                thankYouDiv.innerHTML = `
                <span class="thank-you-msg">Thanks, ${name.value}! Your order is on the way!</span>
                `
                }, 3000)
        
    }
    
    setTimeout(function(){
        formDiv.classList.remove('hidden')
        formDiv.innerHTML = `
        <div class='rating'>
            <h1>How would you rate your experience?</h1>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <h1> 5 stars? Really? Thank you!</h1>
        </div>
        `
    }, 5000);
    
    setTimeout(function(){
        formDiv.classList.add('hidden')
    }, 8000);
    
};



function getItemHtml() {

let foodHtml = ``;

menuArray.forEach(function(item) {
    foodHtml += `
    <div class="menu-item">
        <span class="icon">${item.emoji}</span>
        <div class="item-details">
            <h3 data-name="${item.id}"> ${item.name}</h3>
            <p data-ingredients="${item.id}"> ${item.ingredients}<p>
            <h5 data-price="${item.id}">$${item.price}</h5>
        </div>
        <div class="btn">
            <button id="add-item" class="add-item" data-add="${item.id}">+</button>
        </div>
    </div>
    `
})
    return foodHtml;
    
}    


function render() {
    document.getElementById('menu-options').innerHTML = getItemHtml();


}

render();