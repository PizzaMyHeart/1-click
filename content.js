window.onload = function() {
  if (window.location.href.indexOf('https://www.sciencedirect.com/science/article/pii/') > -1) {
    fullpdf();
  } else if (window.location.href.indexOf('https://onlinelibrary.wiley.com/doi') > -1) {
    wiley();
  } else if (window.location.href.indexOf('https://www.nature.com/articles/') > -1) {
    nature();
  }
}



