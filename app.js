// Storage Controller
const StorageCtrl = (function() {
  // private methods
  
  
  
  // public methods
  return {
    storeItem: function(item) {
      let items;
      
      // array to string to objects
      if(localStorage.getItem('items') === null) {
        items = [];
        items.push(item);

        localStorage.setItem('items', JSON.stringify(items));
      } else {
          items = JSON.parse(localStorage.getItem('items'));

          items.push(item);

          localStorage.setItem('items', JSON.stringify(items));
        }
    },
    getItemsFromStorage: function() {
     let items;
      if(localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index) {
        if(updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index) {
        if(id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: function() {
      localStorage.removeItem('items');
    }
  }
})();


// Ieem Controller
const ItemCtrl = (function() {
        // Item Constructor
  const Item = function(id, name, calories) {
    this.id  = id;
    this.name = name;
    this.calories = calories;
  }

       // Data Structure / State
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

        //Public
  return {
    getItems: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      // Create ID
      if(data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories string to number
      calories = parseInt(calories);

      // Create new Items
      newItem = new Item(ID, name, calories);
      data.items.push(newItem);

      return newItem;
    },

    // get total calories
    getTotalCalories: function() {
      let total = 0;

      data.items.forEach(function(item) {
        total += item.calories;
      });

      // set total in data structure
      data.totalCalories = total;

      return data.totalCalories;
    },

    getItemById: function(id) {
      let found = null;
      data.items.forEach(function(item) {
        if(item.id === id) {
          found = item;
        }
      });
      return found;
    },

    updateItem: function(name, calories) {
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item) {
        if(item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found
    },

    deleteItem: function(id) {
      ids = data.items.map(function(item) {
        return item.id;
      });

      const index = ids.indexOf(id);

      data.items.splice(index, 1);
    },

    clearAllItems: function() {
      data.items = [];
    },


    setCurrentItem: function(item) {
      data.currentItem = item;
    },

    getCurrentItem: function() {
      return data.currentItem;
    },

    logData: function() {
      return data;
    }
  }
})();




// UI controller
const UICtrl = (function() {

  // In future projects if ul gets renamed
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',

  }
      // Public
  return {
    populateItemList: function(items) {
      let html = '';

      items.forEach(function(item) {
        html += `
        <li class="collection-item" id="item-${item.id}">
        <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content"><i class=" edit-item fa fa-pencil"></i></a>
        </li>
        `;
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name:document.querySelector(UISelectors.itemNameInput).value,
        calories:document.querySelector(UISelectors.itemCaloriesInput).value,
      }
    },
    addListItem: function(item) {
      // Show the list 
      document.querySelector(UISelectors.itemList).style.display = 'block';


      // Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      // Add ID
      li.id = `item-${item.id}`;

      // Add html
      li.innerHTML = `
      <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content"><i class=" edit-item fa fa-pencil"></i></a>
      `;
      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
    },

    updateListItem: function(item) {
      //gives a node list
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // turn node into array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
          <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class=" edit-item fa fa-pencil"></i>
          </a>
          `;
        }
      });

    },

    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },

    removeItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // turn nodelist into array
      listItems = Array.from(listItems);

      listItems.forEach(function(item) {
        item.remove();
      });
    },

    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },

    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },

    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },

    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },



    getSelectors: function() {
      return UISelectors;
    }
  }
})();


// App controller
const AppCtrl = (function(ItemCtrl, StorageCtrl, UICtrl) {
           // Load event listeners
  const loadEventListeners = function() {
            // private to public
    const UISelectors = UICtrl.getSelectors();

            // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // disable enter key
    document.addEventListener('keypress', function(e) {
      if(e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

      // Edit icon click
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
  
    // update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // back item event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    // clear all event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

  }
  
        // Add item submit
  const itemAddSubmit = function(e) {
           // get form input from uicontroller
    const input = UICtrl.getItemInput();

    // check for name and calories input
    if(input.name !== '' && input.calories !== '') {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
    
      // Add item to UI list
      UICtrl.addListItem(newItem);

    // get total caloires
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Store to LS
    StorageCtrl. storeItem(newItem);

      // Clear search fields after enter
      UICtrl.clearInput();
    }
    e.preventDefault();
  }


  // Update Item submit after dom loads with event delegation
  const itemEditClick = function(e) {
    if(e.target.classList.contains('edit-item')) {
      // get list item id
      const listId = e.target.parentNode.parentNode.id;
      
      // turn into array
      const listIdArr = listId.split('-');
      // get id
      const id = parseInt(listIdArr[1]);

      // get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }

  
    e.preventDefault();
  }

  //Update item submit
  const itemUpdateSubmit  = function(e) {
    // get item input
    const input = UICtrl.getItemInput();

    // update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // update ui after edit
    UICtrl.updateListItem(updatedItem);
      // get total caloires
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // update ls
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

      e.preventDefault();
  }

  // Delete button event
  const itemDeleteSubmit = function(e) {
    // get id form current item
    const currentItem = ItemCtrl.getCurrentItem();

    ItemCtrl.deleteItem(currentItem.id);

    // delete from ui
    UICtrl.deleteListItem(currentItem.id);

    // get total caloires
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete form ls
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();


    e.preventDefault();
  }

  // Clear all button event
  const clearAllItemsClick = function() {
    ItemCtrl.clearAllItems();

    // get total caloires
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // update ui
    UICtrl.removeItems();

    // clear from ls
    StorageCtrl.clearItemsFromStorage();

    // hide list
    UICtrl.hideList();
  }

         // Public
  return {
    init: function() {
      // Set initial state
      UICtrl.clearEditState();
      // Fetch Items from data
      const items = ItemCtrl.getItems();

      // Check if any items
      if(items.length === 0) {
        UICtrl.hideList();
      } else {
        UICtrl.populateItemList(items);
      }

// get total caloires
const totalCalories = ItemCtrl.getTotalCalories();
// Add total calories to UI
UICtrl.showTotalCalories(totalCalories);
      
      // Load event listeners
      loadEventListeners();
    }
  }
  
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
AppCtrl.init();

/* future projects
ask for body weight 
ask for gain or lose
gain x 13
lose x 9
subtracts from those numbers
*/