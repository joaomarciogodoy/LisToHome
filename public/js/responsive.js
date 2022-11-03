const devTxt = document.querySelectorAll('.dev-txt')
const devPicture = document.querySelectorAll('.dev-picture')
const yesMobile = document.querySelectorAll('#yes-mobile')
const noMobile = document.querySelectorAll('#no-mobile')

let screenWidth = window.screen.width

if (screenWidth < 760) {

    for (var i = 0; i < devPicture.length; i++) {
        devPicture[i].classList.add('dev-picture-cell')
        devPicture[i].classList.remove('dev-picture')
    }

    for (var i = 0; i < devTxt.length; i++) {
        devTxt[i].classList.add('dev-txt-cell')
        devTxt[i].classList.remove('dev-txt')
    }

    for (var i = 0; i < noMobile.length; i++) {
   noMobile[i].style.display = 'none'
    }

    for (var i = 0; i < yesMobile.length; i++) {
    yesMobile[i].style.display = 'grid'
     }

}