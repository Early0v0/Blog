window.onload = function() {
  var OriginTitile = document.title;
  var titleTime;
  document.addEventListener('visibilitychange', function() {
    if(document.hidden) {
      document.title = '(●—●)噢，页面崩溃啦！ ' + OriginTitile;
      clearTimeout(titleTime);
    } else {
      document.title = '(/≧▽≦/)咦！页面又好了！ ' + OriginTitile;
      titleTime = setTimeout(function() {
        document.title = OriginTitile;
	  }, 1500);
    }
  });
};
