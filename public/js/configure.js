var newsSources = [];
function handleLogOut() {
  var user = firebase.auth().currentUser;
  if (user) {
    // Sign out the user
    firebase.auth().signOut().then(function() {
      // Sign out successful
    }).catch(function() {
      // Error occurred
    });
  }
}

function initHome() {
    firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // Populate username info
      var profile = document.getElementById('profile-link');
      var body = document.getElementById('body-text');

      // Get the current user
      var user = firebase.auth().currentUser;
      if (user) {
        profile.innerHTML = user.email + " <span class=\"caret\"></span>";
        loadConfigurations();
        getNews();
      }
    } else {
      // User is not signed in, segue to login page
      window.location = 'index.html';
    }
  });

  // Event listener for logout button
  var logout = document.getElementById('logout-link');
  logout.addEventListener('click', handleLogOut, false);

  // Event listener for save new button
  var save = document.getElementById('save-new');
  save.addEventListener('click', saveNew, false);

  // Event listenter for clear button
  var clear = document.getElementById('clear');
  clear.addEventListener('click', clearSources, false);

  // Event listener for save button
  var saveConfig = document.getElementById('save-config');
  saveConfig.addEventListener('click', saveTouched, false);
}

function loadSources(news) {
  for (var i = 0; i < sources.length; i++) {
    var source = document.createElement('div');
    source.className = 'source hvr-float-shadow';
    var alreadySelected = false;
    for (var j = 0; j < news.length; j++) {
      if (sources[i].name == news[j]) {
        alreadySelected = true;
      }
    }
    if (alreadySelected) {
      source.style.backgroundColor = 'orange';
    } else {
      var index = Math.round(Math.random() * 3);
      source.style.backgroundColor = greens[index];
    }
    source.innerHTML = sources[i].name;
    document.getElementById('sources-list').appendChild(source);
    newsSources.push(source);
  }
}

/**
 * Handles a clicked source div by adding/removing source in Firebase
 */
$(document).on('click', '.source', function(){
  if ($(this).css('background-color') == 'rgb(255, 165, 0)') {
    var index = Math.round(Math.random() * 3);
    $(this).css('background-color', greens[index]);
    removeSource($(this).text());
  } else {
    $(this).css('background-color', 'orange');
    saveSource($(this).text(), '/news');
  }
});

$(document).on('click', '.config', function() {
  var user = firebase.auth().currentUser;
  var selected = [];
  if (user) {
    console.log($(this).text());
    var ref = firebase.database().ref('/users/' + user.uid + '/configurations/' +
    $(this).text());
    ref.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        selected.push(childSnapshot.val().name);
      });
      clearSources();
      for (var i = 0; i < selected.length; i++) {
        saveSource(selected[i], '/news');
      }
      updateSources(selected);
    });
  }
});

function updateSources(selected) {
  for (var i = 0; i < newsSources.length; i++) {
    for (var j = 0; j < selected.length; j++) {
      if (newsSources[i].innerHTML == selected[j]) {
        newsSources[i].style.backgroundColor = 'orange';
      }
    }
  }
}

/**
 * Saves a source to Firebase with path
 */
function saveSource(source, path) {
  var user = firebase.auth().currentUser;
  var url;
  for (var i = 0; i < sources.length; i++) {
    if (sources[i].name == source) {
      url = sources[i].url;
    }
  }
  if (user) {
    firebase.database().ref('/users/' + user.uid + path).push({
      name: source,
      url: url
    });
  }
};

/**
 * Removes a news source from Firebase
 */
function removeSource(source) {
  var user = firebase.auth().currentUser;
  if (user) {
    // Get the firebase ref of the news array
    var ref = firebase.database().ref('/users/' + user.uid + '/news');
    ref.once('value', function(snapshot) {
      // Iterate over the children of the news array
      snapshot.forEach(function(childSnapshot) {
        // If there is a source name match with source param delete it
        if (source == childSnapshot.val().name) {
          var key = childSnapshot.key;
          var refToDelete = firebase.database().ref('/users/' + user.uid +
          '/news/' + key);
          refToDelete.remove();
        }
      });
    });
  }
}

/**
 * Get the names pf the news sources from Firebase and populate local array
 * to load sources divs in page
 */
function getNews() {
  var news = [];
  var user = firebase.auth().currentUser;
  if (user) {
    var ref = firebase.database().ref('/users/' + user.uid + '/news');
    ref.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var name = childSnapshot.val().name;
        news.push(name);
      });
      var parent = document.getElementById('sources-list');
      if (!parent.hasChildNodes()) {
        loadSources(news);
      }
    });
  }
}

/**
 *
 */
function saveNew() {
  var selected = [];
  for (var i = 0; i < newsSources.length; i++) {
    if (newsSources[i].style.backgroundColor == 'orange') {
      selected.push(newsSources[i].innerHTML);
    }
  }
  var modal = document.getElementById('modal-sources');
  for (var i = 0; i < selected.length; i++) {
    var source = document.createElement('div');
    source.className = 'source';
    source.style.backgroundColor = 'orange';
    source.innerHTML = selected[i];
    modal.appendChild(source);
  }
}

// TODO: Refactor this!
/**
 *
 */
function saveTouched() {
  var saveName = document.getElementById('save-config-input').value;
  if (saveName == '') {
    alert("need a config name");
    clearModal();
    return;
  }
  var selected = [];
  for (var i = 0; i < newsSources.length; i++) {
    if (newsSources[i].style.backgroundColor == 'orange') {
      selected.push(newsSources[i].innerHTML);
    }
  }
  var path = '/configurations/' + saveName;
  for (var i = 0; i < selected.length; i++) {
    saveSource(selected[i], path);
  }
  clearModal();
  var parent = document.getElementById('saved');
  var child = document.createElement('div');
  child.className = 'config';
  child.style.backgroundColor = '#878787';
  child.innerHTML = saveName;
  parent.appendChild(child);
}

/**
 *
 */
function clearModal() {
  var modal = document.getElementById('modal-sources');
  while(modal.firstChild) {
    modal.removeChild(modal.firstChild);
  }
}

/**
 *
 */
function clearSources() {
  // Remove all sources from user's primary feed in the database
  var user = firebase.auth().currentUser;
  if (user) {
    var ref = firebase.database().ref('/users/' + user.uid + '/news');
    ref.remove();
  }
  // Update on the client side
  for (var i = 0; i < newsSources.length; i++) {
    // If the source's background color is orange, change to green
    if (newsSources[i].style.backgroundColor == 'orange') {
      var index = Math.round(Math.random() * 3);
      newsSources[i].style.backgroundColor = greens[index];
    }
  }
}

/**
 *
 */
function loadConfigurations() {
  // Get the configuration names from firebase
  var parent = document.getElementById('saved');
  if (parent.childElementCount == 0) {
    var user = firebase.auth().currentUser;
    if (user) {
      var ref = firebase.database().ref('/users/' + user.uid + '/configurations');
      ref.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var name = childSnapshot.key;
          var config = document.createElement('div');
          config.className = 'config';
          config.style.backgroundColor = '#878787';
          config.innerHTML = name;
          parent.appendChild(config);
        });
      });
    }
  }
}
