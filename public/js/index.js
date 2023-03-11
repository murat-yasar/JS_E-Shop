"use strict";

// MODULES
import settings from "./settings.js";
import dom from "./dom.js";
import cart from "./cart.js";


// CONSTANTS & VARIABLES
const elements = settings.elements;
let products = [];
let frameIndex = 1;
let totalPrice;
let numOfCartItems;


// FUNCTIONS
const domMapping = () => {
  elements.slides = dom.$(".slideDiv");
  elements.details = dom.$(".mainFrameDiv");
  elements.arrowLeft = dom.$("#left");
  elements.arrowRight = dom.$("#right");

  elements.main = dom.$(".main");
  elements.addButtons = dom.$(".btnAdd");

  elements.cart = dom.$(".cart-container");
  elements.table = dom.$("#cart-table");
  elements.quant = dom.$("#items-quantity");
  elements.total = dom.$("#total");
  elements.emptyCart = dom.$("#emptycart");
  elements.checkOut = dom.$("#checkout");
};

const appendEventlisteners = () => {
  elements.arrowLeft && elements.arrowLeft.addEventListener("click", toPrevSlide);
  elements.arrowRight && elements.arrowRight.addEventListener("click", toNextSlide);
};

// FUNCTIONS - SLIDER
// create first three images from product list
const createSlide = (index, title, url) => {
  let el = dom.create({
    parent: elements.slides,
    classes: ["div", "imgDiv"]
  });

  let elImg = dom.create({
    // content: title,
    type: 'img',
    parent: el,
    classes: ["slideImg"]
  });

  let text = dom.create({
    content: title,
    type: 'p',
    parent: el,
    classes: ["imgText"]
  });

  elImg.src = `${url}`;
  el.addEventListener("click", () => getSlides(index));
};

const toNextSlide = () => {
  if (frameIndex + 1 > products.length - 1) {
    frameIndex = 0;
    getSlides(0);
  } else getSlides(++frameIndex);
};

const toPrevSlide = () => {
  if (frameIndex - 1 < 0) {
    frameIndex = products.length - 1;
    getSlides(products.length - 1);
  } else getSlides(--frameIndex);
};

// list the detailed info of the item at the center
const createMainFrame = (index, url) => {
  elements.details && (elements.details.innerHTML = "");

  let el = dom.create({
    type: 'div',
    parent: elements.details,
    classes: ["infoDiv"]
  });

  let img = dom.create({      
    type: 'img',
    parent: el,
    classes: ["mainImgDiv"]
  });
  
  let title = dom.create({
    content: products[index].name,
    type: 'h2',
    parent: el,
    classes: ["infoHeader"]
  });

  let info = dom.create({
    type: 'p',
    parent: el,
    classes: ["productDetails"]
  });

  let price = dom.create({
    content: products[index].price + " €",
    type: 'h3',
    parent: el,
    classes: ["productPreis"]
  });

  let btnDiv = dom.create({
    type: 'div',
    parent: el,
    classes: ["btnDiv"]
  });

  let button = dom.create({
    content: 'Add to Cart',
    type: 'div',
    parent: btnDiv,
    classes: ["btnAdd"]
  });

  // assign product properties
  info.innerText = `
     ${products[index].os}
     ${products[index].cpu}
     ${products[index].vga}
     ${products[index].scr}
     ${products[index].hdd}
     ${products[index].ram}
  `;

  img.src = url;
  price.innerHTML = `<h3>${parseFloat(products[index].price).toFixed(2)} €<h3/>`;

  button.addEventListener("click", () =>
    cart.addToCart(
      products[index].id,
      products[index].name,
      products[index].price
    )
  );
};

// initialize first three slides at the top
const getSlides = (index = frameIndex) => {
  // console.log('getSlides() initiated!');
  // console.log(products);

  elements.slides && (elements.slides.innerHTML = "");
  let slides = [];
  let indexArray = [];

  frameIndex = index;

  (index - 1 < 0) ? (indexArray[0] = products.length - 1)  : (indexArray[0] = index - 1);
  indexArray[1] = index;
  (index + 1 > products.length - 1)  ? (indexArray[2] = 0)  : (indexArray[2] = index + 1);

  let url = products[index].src;

  indexArray.forEach((element) => {
    slides.push(products[element]);
  });

  createMainFrame(index, url);

  slides.map((item) => {
    createSlide(products.indexOf(item), item.name, item.src);
  });
};

// FUNCTIONS - MAIN (SHOWROOM)
// list all products in the main section
const listItems = (id, imgUrl, title, details, price) => {

  let el = dom.create({
    type: 'div',
    parent: elements.main,
    classes: ["item"]
  });

  let elImg = dom.create({
    type: 'img',
    parent: el
  });

  let elTitle = dom.create({
    content: title,
    type: 'h2',
    parent: el
  });

  let elInfo = dom.create({
    type: 'p',
    parent: el,
    classes: ["infoText"]
  });

  let elPrice = dom.create({
    type: 'h3',
    parent: el
  });

  let button = dom.create({
    content: 'Add to Cart',
    type: 'div',
    parent: el,
    classes: ["btnAdd"]
  });

  // assign product properties
  elInfo.innerText = "";
  Object.entries(details).forEach((val, key) => {
    elInfo.innerText += val[1] ? val[1] + "\n" : ""; // It takes the val as an array key is val[0] and val is val[1]
  });

  elImg.src = `${imgUrl}`;

  elPrice.innerHTML = `</br><h3>${price.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  )} €<h3/>`;
  // elPrice.innerHTML = `</br><h3>${parseFloat(price).toFixed(2)} €<h3/>`; // Alternative

  // Add event-listener
  button.addEventListener("click", () => cart.addToCart(id, title, price));
};

// get all products from server
const getProducts = () => {
  return fetch("/load_all_items")
    .then((res) => res.json())
    .then((res) => {
      products = [...res];  // Create an array of product which is received from server
      products.forEach((item) => {
        listItems(
          item.id,
          item.src,
          item.name,
          [item.os, item.cpu, item.vga, item.scr, item.hdd, item.ram, item.bLife],
          item.price
        );
      });
    })
    .catch(console.warn);
};

// INIT
const init = () => {
  domMapping();
  appendEventlisteners();
  cart.initCart();
  getProducts().then(getSlides);  // To prevent side-effects of Asyn&Await characteristics of fetch().then()
};

// INITIALIZE
init();
