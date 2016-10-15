//>>> TOP MENU
var topMenuHead = document.getElementById("topMenuHead");
var topContainer = document.getElementById("topContainer");
var topImgWrapper = document.getElementById("topImgWrapper");
var topMenuBtn = document.getElementById("topMenuBtn");
var topMenuHeadBtnContainer = document.getElementById("topMenuHeadBtnContainer"); 

function topMenuResize(){
    topMenuBtn.style.width = topMenuBtn.clientHeight + "px";
    topMenuHead.style.width = (topContainer.offsetWidth - (topImgWrapper.offsetWidth + topMenuBtn.offsetWidth) - 1) + "px";
}
window.onresize = function(){
  window.setTimeout(topMenuResize, 10);
}
topMenuResize();

var topMenuBtnOut = false;
topMenuBtn.onclick = function(){
    if(topMenuBtnOut){
        topMenuHeadBtnContainer.style.left = "100%";
        topMenuBtnOut = false;
    }else{
        topMenuHeadBtnContainer.style.left = "0%";
        topMenuBtnOut = true;
    }
}

//>>> FULL POPUP
var fullPopup = document.getElementById("fullPopup");
var fullMask = document.getElementById("fullMask");
var Popup = new Object();

fullMask.onclick = function(){Popup.pushOut()};

var popupToggleable = true;
var popupOpen = false;
var currentPopup, currentPopupContainer;

Popup.pushIn = function(whichPopup){
    if(popupToggleable){
        if(!popupOpen){
            if(whichPopup != undefined){
                if(Popup.list[whichPopup] != undefined){
                    currentPopup = whichPopup;
                    currentPopupContainer = document.getElementById(Popup.list[currentPopup].id);                    
                }else{
                    throw new Error("The Popup was not defined in 'popup.list'");
                    return;
                }
            }else{
                throw new Error("'whichPopup' was not specified");
                return;
            }
            
            popupOpen = true;
            popupToggleable = false;
            
            if(Popup.list[currentPopup].func != undefined){
                Popup.list[currentPopup].func();   
            }
            
            fullPopup.style.display = "block";
            window.setTimeout(function(){currentPopupContainer.style.top = "50%";fullMask.style.opacity = "0.7";}, 10);
            window.setTimeout(function(){popupToggleable = true;}, 400);
            
        }else{
            if(whichPopup != undefined){
                if(Popup.list[whichPopup] != undefined){
                    
                }else{
                    throw new Error("The Popup was not defined in 'popup.list'");
                    return;
                }
            }else{
                throw new Error("'whichPopup' was not specified");
                return;
            }
            
            if(whichPopup != currentPopup){
                popupToggleable = false;
                
                currentPopupContainer.style.top = "-50%";
                window.setTimeout(function(){
                    
                    currentPopup = whichPopup;
                    currentPopupContainer = document.getElementById(Popup.list[currentPopup].id); 
                    
                    if(Popup.list[currentPopup].func != undefined){
                        Popup.list[currentPopup].func();   
                    }
                    
                    currentPopupContainer.style.top = "50%";
                    window.setTimeout(function(){popupToggleable = true;}, 400);
                }, 400);
            }else{
                return;
            }
        }
    }
}

Popup.pushOut = function(){
    if(popupToggleable){
        if(popupOpen){
            popupOpen = false;
            popupToggleable = false;
            
            currentPopupContainer.style.top = "-50%";
            fullMask.style.opacity = "0";
            window.setTimeout(function(){fullPopup.style.display = "none";popupToggleable = true;}, 400);
        }
    }
}

function Pop(id,func){
    this.id = id;
    this.func = func;
}

Popup.list = new Object();
Popup.list.download = new Pop("download_popupContainer",function(){
    var popupImageContainer = document.getElementById("download_popupImageContainer");
    var popupImageWrapper = document.getElementById("download_popupImageWrapper");
    var popupImage = document.getElementById("download_popupImage");
    
    popupImage.setAttribute("src",download());
    window.setTimeout(function(){
        if(popupImage.clientWidth / popupImageWrapper.clientWidth > popupImage.clientHeight / popupImageWrapper.clientHeight){
            popupImage.style.width = popupImageWrapper.clientWidth + "px";
            popupImage.style.height = "auto";
        }else{
            popupImage.style.height = popupImageWrapper.clientHeight + "px";
            popupImage.style.width = "auto"; 
        }
    },10);
});

var statWidth = document.getElementById("sw");
var statHeight = document.getElementById("sh");

var inputLeft = document.getElementById("inputLeft");
var inputRight = document.getElementById("inputRight");
var inputTop = document.getElementById("inputTop");
var inputBottom = document.getElementById("inputBottom");

function updateStatWidth(){
    statWidth.innerHTML = (surfacesWidth + parseInt(inputLeft.value) + parseInt(inputRight.value)) + "px";
}
function updateStatHeight(){
    statHeight.innerHTML = (surfacesHeight + parseInt(inputTop.value) + parseInt(inputBottom.value)) + "px";
}

inputLeft.onchange = updateStatWidth;
inputRight.onchange = updateStatWidth;
inputTop.onchange = updateStatHeight;
inputBottom.onchange = updateStatHeight;

var resize_popupButton = document.getElementById("resize_popupButton");

resize_popupButton.onclick = function(){
    var targetWidth = surfacesWidth + parseInt(inputLeft.value) + parseInt(inputRight.value);
    var targetHeight = surfacesHeight + parseInt(inputTop.value) + parseInt(inputBottom.value);

    resizeSurfaces(targetWidth,targetHeight,parseInt(inputLeft.value),parseInt(inputTop.value));

    inputLeft.value = 0;
    inputRight.value = 0;
    inputTop.value = 0;
    inputBottom.value = 0;

    Popup.pushOut();
}

Popup.list.resize = new Pop("resize_popupContainer",function(){
    updateStatHeight();
    updateStatWidth();
});