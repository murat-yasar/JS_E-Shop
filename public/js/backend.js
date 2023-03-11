"use strict";

// MODULES
import dom from "./dom.js";
import settings from "./settings.js";

// CONSTANTS & VARIABLES
const elements = settings.elements;
const oSystems = [
  "Windows 10 Home",
  "Windows 10 Pro",
  "Windows 11 Home",
  "Windows 11 Pro",
  "MacOS",
  "Linux / Unix"
];

// FUNCTIONS
const domMapping = () => {
  elements.formItem = dom.$("#formItem");
  elements.selOS = dom.$('select[name="os"]');
  elements.table = dom.$("table");
};

const sendItem = (evt) => {
  evt.preventDefault();

  // Submit form-input to server
  fetch("/save_item", {
    method: "post",
    body: new FormData(elements.formItem),
  })
    .then((res) => res.json())  // .then((res) => console.log(res))
    .then(loadAllItems)
    .catch(console.warn);
  
    elements.formItem.querySelector('[name="_id"]').value = "";
    elements.formItem.querySelector('[name="_rev"]').value = "";
    elements.formItem.querySelector('[name="name"]').value = "";
    // elements.formItem.querySelector('[name="url"]').value = "";
    elements.formItem.querySelector('[name="cpu"]').value = "";
    elements.formItem.querySelector('[name="vga"]').value = "";
    elements.formItem.querySelector('[name="scr"]').value = "";
    elements.formItem.querySelector('[name="hdd"]').value = "";
    elements.formItem.querySelector('[name="ram"]').value = "";
    elements.formItem.querySelector('[name="bLife"]').value = "";
    elements.formItem.querySelector('[name="price"]').value = "";
};

// Event-listeners
const appendEventlisteners = () => {
  elements.formItem.addEventListener("submit", sendItem);
};

// Display all data as a table
const renderAllItems = (items) => {
  elements.table.innerHTML = "";  // Empty Table

  const rowHeader = dom.create({
    parent: elements.table,
    type: 'tr',
  });
  
  Object.keys(items[0]).forEach(key => {
    dom.create({
      parent: rowHeader,
      type: 'th',
      content: key,
    });
  })
  
  items.forEach((item) => {
    const row = dom.create({
      parent: elements.table,
      type: 'tr',
    });
    
    const imgItem = dom.create({
      parent: row,
      type: 'td',
    });
    
    dom.create({
      parent: imgItem,
      type: 'img',
      classes: ["imgBE"],
      attr: {src: `./${item.src}`},
    });
    
    dom.create({
      parent: row,
      type: 'td',
      content: `${(item._id)}`
    });
    

    dom.create({
      parent: row,
      type: 'td',
      content: `${item.name}`
    });

    dom.create({
      parent: row,
      type: 'td',
      content: `${item.os}`
    });

    dom.create({
      parent: row,
      type: 'td',
      content: `${item.cpu}`
    });

    dom.create({
      parent: row,
      type: 'td',
      content: `${item.vga}`
    });

    dom.create({
      parent: row,
      type: 'td',
      content: `${item.scr}`
    });

    dom.create({
      parent: row,
      type: 'td',
      content: `${item.hdd}`
    });

    dom.create({
      parent: row,
      type: 'td',
      content: `${item.ram}`
    });

    dom.create({
      parent: row,
      type: 'td',
      content: `${item.bLife}`
    });

    dom.create({
      parent: row,
      type: 'td',
      content: `${item.price} €`
    });

    const cellBtnDel = dom.create({
      parent: row,
      type: 'td',
    });

    const btnDel = dom.create({
      parent: cellBtnDel,
      type: 'button',
      content: `DEL`,
      listeners: {"click": () => delItem(item._id, item._rev)}
    });

    const cellBtnUpdate = dom.create({
      parent: row,
      type: 'td',
    });

    const btnUpdate = dom.create({
      parent: cellBtnUpdate,
      type: 'button',
      content: `UPDATE`,
      listeners: {"click": () => initSubmitForm(item)}
    });

  });
};

// Delete an item from DB
const delItem = (id, rev) => {
  fetch("/del_item", {
    method: "delete",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({id, rev}),
  })
    .then(res => res.json())
    .then(loadAllItems)
    .catch(console.warn);
}

const initSubmitForm = (item) => {
  elements.formItem.querySelector('[name="_id"]').value = item._id;
  elements.formItem.querySelector('[name="_rev"]').value = item._rev;
  elements.formItem.querySelector('[name="name"]').value = item.name;
  // elements.formItem.querySelector('[name="url"]').value = item.url;
  elements.formItem.querySelector('[name="cpu"]').value = item.cpu;
  elements.formItem.querySelector('[name="vga"]').value = item.vga;
  elements.formItem.querySelector('[name="scr"]').value = item.scr;
  elements.formItem.querySelector('[name="hdd"]').value = item.hdd;
  elements.formItem.querySelector('[name="ram"]').value = item.ram;
  elements.formItem.querySelector('[name="bLife"]').value = item.bLife;
  elements.formItem.querySelector('[name="price"]').value = item.price;
}

// Load all records
const loadAllItems = () => {
  fetch("/load_all_items")
    .then((res) => res.json())
    .then(renderAllItems)
    .catch(console.warn);
};

// Initialize form fields
const initFormOS = () => {
  oSystems.forEach(os => {
    dom.create({
      content: os,
      parent: elements.selOS,
      type: "option",
    });
  });
};

const init = () => {
  domMapping();
  appendEventlisteners();
  initFormOS();
  loadAllItems();
};

// INIT
document.addEventListener('DOMContentLoaded', init);
