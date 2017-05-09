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
        getNews();
      }
    } else {
      // User is not signed in, segue to login page
      window.location = 'login.html';
    }
  });

  var logoutLink = document.getElementById('logout-link');
  logoutLink.addEventListener('click', handleLogOut, false);

  var arrow = document.getElementById('arrow-container');
  arrow.addEventListener('click', scrollToTop, false);
}

/**
 *
 */
function getNews() {
  var news = [];
  var user = firebase.auth().currentUser;
  if (user) {
    var ref = firebase.database().ref('/users/' + user.uid + '/news');
    ref.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        news.push(childSnapshot.val().url);
      });
      if (news.length == 0) {
        loadEmpty();
      } else {
        loadNews(news);
      }
    });
  }
}

/**
 * Loads the empty news feed message and animated newspaper icon
 */
function loadEmpty() {
  var empty = document.createElement('div');
  empty.className = 'empty-message space bold';
  empty.style.color = '#878787';
  empty.style.textAlign = 'center';
  empty.innerHTML = '<h2>Looks like you haven\'t followed any news sources yet!</h2>' +
  '<br><i class="fa fa-newspaper-o fa-5x faa-float animated"></i><br>' +
  '<h2>Add some sources in the configure page';
  console.log(document.getElementById('grid-container').childNodes.length);
  if (document.getElementById('grid-container').childNodes.length == 1) {
    document.getElementById('grid-container').appendChild(empty);
    document.getElementById('reel-text').style.display = 'none';
  }
}

function loadNews(news) {
  var $grid = $('.grid').masonry({
    // options...
    itemSelector: '.grid-item',
    columnWidth: 300,
    gutter: 25,
    fitWidth: true
  });

  var articles = [];
  var xhrRequests = new Array();
  for (var i = 0; i < news.length; i++) {
    $.get(news[i], function(response) {
      for (var j = 0; j < response.articles.length; j++) {
        var article = document.createElement('div');
        article.className = 'article grid-item';
        var timestamp = response.articles[j].publishedAt;
        if (timestamp == null) { timestamp = '2015-03-17'}
        console.log(timestamp);

        if (response.articles[j].urlToImage != null) {
          var container = document.createElement('div');
          container.className = 'img-container';
          article.appendChild(container);

            var img = document.createElement('div');
            img.className = 'image';
            img.innerHTML = '<a href=\"' + response.articles[j].url +
            '\" target=\"_blank\"><img src=\"' + response.articles[j].urlToImage +
            '\" width=\"100%\"></a>';
            container.appendChild(img);
        }

        var info = document.createElement('div');
        info.className = 'info';
        article.appendChild(info);

        var title = document.createElement('div');
        title.className = 'title';
        title.innerHTML = '<a href=\"' + response.articles[j].url +
        '\" target=\"_blank\"><p class=\"font-nm bold robot\">' +
        response.articles[j].title + '</p></a>';
        info.appendChild(title);

        var description = document.createElement('div');
        description.className = "description";
        description.innerHTML = '<p class=\"font-sm robot gray\">' +
        response.articles[j].description + '.</p>';
        info.appendChild(description);

        var source = document.createElement('div');
        source.className = "source";
        source.innerHTML = '<span class=\"font-sm robot green-dk text-capitalize\">' +
        stripDashes(response.source) + '</span>';

        // <span style=\"float: right;\" class=\"gray-light\">' +
        // '<i class="fa fa-share-square-o"></i></span>';
        info.appendChild(source);

        var reelText = document.getElementById('reel-text').innerHTML;
        var reel = document.getElementById('reel-text');
        reel.innerHTML = reelText + ' <strong><span class=\"text-capitalize\">' +
        stripDashes(response.source) + '</span></strong>: ' +
        '<a href=\"' + response.articles[j].url + '\" target=\"_blank\">' +
        response.articles[j].title + '</a> | ';

        articles.push({
          'time': timestamp,
          'article': article
        });

        // TODO: Sort array
      }
    });
  }
  $(document).ajaxStop(function () {
      // 0 === $.active
      articles.sort(function(a,b) {
        return new Date(a.time).getTime() - new Date(b.time).getTime()
      });
      var sortedArticles = [];
      for (var i = 0; i < articles.length; i++) {
        sortedArticles.push(articles[i].article);
      }
      var $content = $(sortedArticles);
      $grid.append( $content ).masonry('appended', $content);
      $grid.imagesLoaded().progress(function() {
        $grid.masonry('layout');
      });
  });
}

function stripDashes(str) {
  var ret = "";
  switch (str) {
    case 'cnn':
      ret = 'CNN';
      break;
    case 'ign':
      ret = 'IGN';
      break;
    case 'bbc-news':
      ret = 'BBC News';
      break;
    case 'cnbc':
      ret = 'CNBC';
      break;
    case 'nfl-news':
      ret = 'NFL News';
      break;
    default:
      for (var i = 0; i < str.length; i++) {
        if (str[i] != '-') {
          ret += str[i];
        } else {
          ret += ' ';
        }
      }
      break;
  }
  return ret;
}

function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

/**
*
*/
function checkLogin() {
  var page = document.getElementById('page');
  page.style.display = 'none';
  var user = firebase.auth().currentUser;
  console.log(user == null);
  if (user == null) {
    window.location = 'login.html';
  } else {
    page.style.display = 'block';
  }

}

$(document).ready(function() {
  $("body").tooltip({ selector: '[data-toggle=tooltip]' });
  // Cache selectors for faster performance.
  var $window = $(window),
  $reelText = $('#reel-text'),
  $mainMenuBarAnchor = $('#mainMenuBarAnchor');

  // Run this on scroll events.
  $window.scroll(function() {
    var window_top = $window.scrollTop();
    var div_top = $mainMenuBarAnchor.offset().top;
    if (window_top > div_top) {
      // Make the div sticky.
      $reelText.addClass('stick');
      $mainMenuBarAnchor.height($reelText.height());
    } else {
      // Unstick the div.
      $reelText.removeClass('stick');
      $mainMenuBarAnchor.height(0);
    }
  });
});

$(document).scroll(function() {
  var y = $(this).scrollTop();
  if (y > 500) {
    $('#temp-container').fadeIn();
  } else {
    $('#temp-container').fadeOut();
  }
});

function scrollToTop() {
  $('html, body').animate({scrollTop: '0px'}, 300);
}
