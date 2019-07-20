/* eslint-disable no-console */
var pokemonRepository = (function() {
  // Array of every pokemonObject
  var pokemonList = [];

  // API URL to fetch
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  //Load the list from the API
  function loadList() {
    return fetch(apiUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        json.results.forEach(function(item) {
          var pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          pokemonRepository.add(pokemon);
        });
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  function loadDetails(pokemon) {
    var url = pokemon.detailsUrl;
    return fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(details) {
        // Now we add the details to the item
        pokemon.imageUrl = details.sprites.front_default;
        pokemon.height = details.height;
        //pokemon.types =details.types;
        pokemon.types = Object.values(details.types);
        console.log(pokemon.types[0].type.name);
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  // display the details after event listener
  function showDetails(pokemon) {
    var $modalContainer = document.querySelector('#modal-container');

    $modalContainer.innerHTML = '';

    var modal = document.createElement('div');
    modal.classList.add('modal');

    // Add the new modal content
    // close button
    var closeButtonElement = document.createElement('button');
    closeButtonElement.classList.add('modal-close');
    closeButtonElement.innerText = 'Close';
    closeButtonElement.addEventListener('click', pokemonRepository.hideModal);

    // Title, name of the pokemonList
    var titleElement = document.createElement('h1');
    titleElement.innerText = 'Name:   ' + pokemon.name;

    // height
    var heightElement = document.createElement('p');
    heightElement.innerText = 'Height   ' + pokemon.height + 'm';
    // type   pokemon.types
    var typeElement = document.createElement('p');
    //var array = pokemon.types.slice();

    //typeElement.innerText = 'Types   '  + array.forEach(function(item){
    //return pokemon.types[item]}) ;
    //picture
    var pictureElement = document.createElement('Img');
    pictureElement.src = pokemon.imageUrl;
    pictureElement.classList.add('image');

    modal.appendChild(closeButtonElement);
    modal.appendChild(titleElement);
    modal.appendChild(heightElement);
    modal.appendChild(typeElement);
    modal.appendChild(pictureElement);
    $modalContainer.appendChild(modal);

    $modalContainer.classList.add('is-visible');
  }

  // add pokemon to the array
  function add(pokemon) {
    if (typeof pokemon === 'object') {
      pokemonList.push(pokemon);
    } else {
      console.log(' not an object');
    }
  }

  // return the complete array of pokemon
  function getAll() {
    return pokemonList;
  }

  // add li,button and event listener to the list
  function addItem(pokemon) {
    var $pokemonList = document.querySelector('.pokemonList');

    var $listItem = document.createElement('li');
    var $button = document.createElement('button');
    $button.addEventListener('click', function() {
      pokemonRepository.showDetails(pokemon);
    });

    $button.addEventListener('click', function() {
      pokemonRepository.showDetails(pokemon);
    });

    $button.classList.add('button');
    $button.innerText = pokemon.name;

    $listItem.appendChild($button);
    $pokemonList.appendChild($listItem);
  }

  function hideModal() {
    var $modalContainer = document.querySelector('#modal-container');
    $modalContainer.classList.remove('is-visible');
  }

  // Display them on the DOM as a list
  function renderAll() {
    pokemonRepository.loadList().then(function() {
      // Now the data is loaded!
      pokemonRepository.getAll().forEach(function(pokemon) {
        pokemonRepository.addItem(pokemon);
        pokemonRepository.loadDetails(pokemon);
      });
    });
    pokemonRepository.moveModalWhenScrolling();
    pokemonRepository.addGlobalEvent();
  }

  // Move the modal higher up when scrolling
  function moveModalWhenScrolling() {
    window.onscroll = function() {
      myFunction();
    };

    // Get the header
    var modalContainer = document.getElementById('modal-container');

    // Get the offset position of the navbar
    var sticky = modalContainer.offsetTop;

    // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
    function myFunction() {
      if (window.pageYOffset - 100 > sticky) {
        modalContainer.classList.add('sticky');
      } else {
        modalContainer.classList.remove('sticky');
      }
    }
  }
  function addGlobalEvent() {
    var $modalContainer = document.querySelector('#modal-container');
    window.addEventListener('keydown', e => {
      if (
        e.key === 'Escape' &&
        $modalContainer.classList.contains('is-visible')
      ) {
        pokemonRepository.hideModal();
      }
    });

    var allScreen = document.querySelector('body');

    allScreen.addEventListener('click', e => {
      console.log(target);
      // Since this is also triggered when clicking INSIDE the modal container,
      // We only want to close if the user clicks directly on the overlay
      var target = e.target.type;
      var targetBis = e.target;

      if (
        $modalContainer.classList.contains('is-visible') &&
        target !== 'submit' &&
        targetBis.classList.contains('container')
      ) {
        pokemonRepository.hideModal();
      }
      console.log(targetBis);
    });
  }

  /// Function globaly accessible
  return {
    add: add,
    getAll: getAll,
    renderAll: renderAll,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
    addItem: addItem,
    moveModalWhenScrolling: moveModalWhenScrolling,
    hideModal: hideModal,
    addGlobalEvent: addGlobalEvent
  };
})();

pokemonRepository.renderAll();
