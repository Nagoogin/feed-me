var news = ["https://newsapi.org/v1/articles?source=techcrunch&sortBy=top&apiKey=e7f157684e404d84aa814fa4691fc77e",
"https://newsapi.org/v1/articles?source=espn&sortBy=top&apiKey=e7f157684e404d84aa814fa4691fc77e",
"https://newsapi.org/v1/articles?source=national-geographic&sortBy=top&apiKey=e7f157684e404d84aa814fa4691fc77e"];
var xhrRequests = new Array();
var articles = [];
for (var i = 0; i < news.length; i++) {
	(function(i) {
		xhrRequests[i] = new XMLHttpRequest();
		xhrRequests[i].open('GET', news[i], true);
		xhrRequests[i].send();

		xhrRequests[i].onreadystatechange = function () {
    		if (xhrRequests[i].readyState == 4 && xhrRequests[i].status == 200) {
				var response = JSON.parse(xhrRequests[i].responseText);
				for (var j = 0; j < response.articles.length; j++) {
					var article = document.createElement('div');
					article.className = 'article';
					var index = Math.round(Math.random()*2) + 1;
					// document.getElementById('col-' + (i + 1)).appendChild(article);
					articles.push(article);

					// alert(response.articles[i].urlToImage == null);
					if (response.articles[j].urlToImage != null) {
						var container = document.createElement('div');
						container.className = 'img-container';
						article.appendChild(container);

    					var img = document.createElement('div');
    					img.className = 'image';
    					img.innerHTML = '<a href=\"' + response.articles[j].url + '\" target=\"_blank\"><img src=\"' + response.articles[j].urlToImage + '\" width=\"100%\"></a>';
    					container.appendChild(img);
					}

					var info = document.createElement('div');
					info.className = 'info';
					article.appendChild(info);


					var title = document.createElement('div');
					title.className = 'title';
					title.innerHTML = '<a href=\"' + response.articles[j].url + '\" target=\"_blank\"><p class=\"font-nm bold robot\">' + response.articles[j].title + '</p></a>';
					info.appendChild(title);

					var description = document.createElement('div');
					description.className = "description";
					description.innerHTML = '<p class=\"font-sm robot gray\">' + response.articles[j].description + '.</p>';
					info.appendChild(description);

					var source = document.createElement('div');
					source.className = "source";
					source.innerHTML = '<p class=\"font-sm robot green-dk text-capitalize\">' + stripDashes(response.source) + '</p>';
					info.appendChild(source);
				}

			}
		};
	})(i);
	// Append articles to column divs
	for (var i = 0, j = 0; i < articles.length; i++, j++) {
		document.getElementById('col-' + (j + 1)).appendChild(articles[i]);
	}
}

function stripDashes(str) {
		var ret = "";
		for (var i = 0; i < str.length; i++) {
			if (str[i] != '-') {
				ret += str[i];
			} else {
				ret += ' ';
			}
		}
		return ret;
	}
