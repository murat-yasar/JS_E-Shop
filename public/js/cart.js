// MODULES
import settings from "./settings.js";
import dom from "./dom.js";

// CONSTANTS & VARIABLES
const elements = settings.elements;
let cartList = []; // list of items to buy

const cart = {
  // receive data from local storage to continue the last session
  initCart() {
    cart.appendEventlisteners();
    let prevBuyString = localStorage.getItem("myCart");
    let storedItemsObjectified = prevBuyString ? JSON.parse(prevBuyString) : []; // to fix the error which comes with an empt cartList at the beginning!!!
    cartList = storedItemsObjectified;
    cart.updateCart();
  },

  /* MAIN FUNCTIONS */
  // Event Listeners
  appendEventlisteners(){
    elements.emptyCart && elements.emptyCart.addEventListener("click", cart.emptyCart);
    elements.checkOut && elements.checkOut.addEventListener("click", cart.checkOut);
  },

  // UPDATE cart
  updateCart(){
    // empty cart html to render up-to-date
    elements.table.innerHTML = "";
    let totalPrice = 0;

    // create new html elements to show every item in the cart
    for (let i in cartList) {
      let itemPrice = cartList[i].price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      let newEl = dom.create({
        type: 'tr',
        parent: elements.table
      });

      dom.create({
        content: cartList[i].title,
        type: 'td',
        parent: newEl
      });

      dom.create({
        content: `${itemPrice} €`,
        type: 'td',
        parent: newEl
      });

      const btnDel = dom.create({
        content: `Delete`,
        type: 'td',
        parent: newEl,
        classes: ["btnDel"],
        // listeners: {"click": cart.removeFromCart(i, cartList[i].id)}
      });

      btnDel.addEventListener("click", () => cart.removeFromCart(i, cartList[i].id));
      totalPrice += Number(cartList[i].price);
    }

    elements.quant.innerText = cartList.length;
    elements.total.innerHTML = `${totalPrice.toLocaleString("en-US")} €`;

    cart.saveCart();
  },

  // ADD new item to Cart
  addToCart(id, title, price){
    // create an object to save data for the item to buy
    let itemToBuy = {
      id: id,
      title: title,
      price: price,
    };

    // add item to cart to buy
    cartList.push(itemToBuy);

    cart.printInfoMessage(itemToBuy.title, "ADD");
    cart.updateCart();
  },

  // REMOVE item from Cart
  removeFromCart(index, id){
    for (let i in cartList) {
      if (i === index && cartList[i].id === id) {
        cart.printInfoMessage(cartList[i].title, "REMOVE");

        // remove selected item from cartlist array
        cartList.splice(i, 1);
      }
    }
    cart.updateCart();
  },

  // REMOVE ALL items from Cart
  emptyCart(){
    // empty cartlist array
    cartList = [];
    cart.printInfoMessage("all items", "EMPTY");
    cart.updateCart();
  },

  checkOut(){
    console.log('checkOut() initiated!');
    let confirmMessage = `You have bought ${cartList.length} items: ` + "\n";
    let totalCost = 0;

    console.log(cartList);
    // create a list of bought items for confirmation

    for(let item of cartList) { // we have to use "let" defining "item", to avaid errors in "strict mode"
      let price = Number(item.price);
      totalCost += price;
    }

    let purchaseCost = totalCost
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    confirmMessage += "\n\n" + `Total cost of your purchase is ${purchaseCost} €`;

    // redirect to the cart page
    let redirect = confirm(`${confirmMessage}`);
    redirect && window.location.replace("./cart.html");
  },

  // SAVE the data of bought items into local storage
  saveCart(){
    let cartListString = JSON.stringify(cartList);
    localStorage.setItem("myCart", cartListString);
  },

  // give FEEDBACK MESSAGES to user
  printInfoMessage(itemName, action){
    let message = dom.$("#messageField");
    if (action === "ADD") {
      message.classList.add("infoMessage");
      message.innerHTML = `"${itemName}" has been added to your cart!`;
    } else if (action === "REMOVE") {
      message.classList.add("feedbackMessage");
      message.innerHTML = `"${itemName}" has been removed from your cart!`;
    } else if (action === "EMPTY") {
      message.classList.add("feedbackMessage");
      message.innerHTML = `Your cart is empty!`;
    }
  }
}

export default cart;