var imgArr = ["/images/background1.webp", "/images/background2.webp"];
var imgArrDark = ["/images/background-dark1.webp", "/images/background-dark2.webp", "/images/background-dark3.webp"];
let darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (darkMode) {
  var rand = Math.floor(Math.random() * imgArrDark.length);
  document.body.style.backgroundImage = "url(" + imgArrDark[rand] + ')';
} else {
  var rand = Math.floor(Math.random() * imgArr.length);
  document.body.style.backgroundImage = "url(" + imgArr[rand] + ')';
}
