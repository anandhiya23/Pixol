//>>> INITIALIZE
var displayScale; //defined later @ adjustScale()

var surfacesWidth = 100;
var surfacesHeight = 100;

//CONECT ALL CANVAS TO JS
var mainCanvas = document.getElementById('mainCanvas');
var mainContext = mainCanvas.getContext('2d');

var editCanvas = document.getElementById('editCanvas');
var editContext = editCanvas.getContext('2d');

var clearCanvas = document.getElementById('clearCanvas');
var clearContext = clearCanvas.getContext('2d');

var canvasContainer = document.getElementById('canvasContainer');
var canvasWrapper = document.getElementById("canvasWrapper");
var editorContainer = document.getElementById('editorContainer');
var fullContainer = document.getElementById('fullContainer');
var coordDisplay = document.getElementById("coordDisplay");

//SET THE SIZE OF EVERY CANVAS
mainCanvas.setAttribute("width", surfacesWidth + "px");
mainCanvas.setAttribute("height", surfacesHeight + "px");
editCanvas.setAttribute("width", surfacesWidth + "px");
editCanvas.setAttribute("height", surfacesHeight + "px");
clearCanvas.setAttribute("width", surfacesWidth + "px");
clearCanvas.setAttribute("height", surfacesHeight + "px");

//> SURFACE CONSTRUCTOR
function Surface(width, height, color){
    this.map;
    this.width;
    this.height;
    this.baseColor = color || null;
    this.createMap = function(mapWidth,mapHeight){
        var resultMap = [];
        this.width = mapWidth;
        this.height = mapHeight;
        
        for(var a=0; a<this.width;a++){
            resultMap.splice(a,0,[]);
            
            for(var b=0; b<this.height;b++){
                resultMap[a].splice(b,0,{color:this.baseColor}); 
            }
            
        }
        this.map = resultMap;
        
    }
    this.clear = function(){
        var thisSurface = this;
        for(var a=0;a<thisSurface.width;a++){
            for(var b=0;b<thisSurface.height;b++){
                thisSurface.map[a][b].color = null;
            }
        }
    }
    this.genLines = function(x1,y1,x2,y2,autoUpdate,color){
        var thisSurface = this;
        var autoUpdate = autoUpdate || false;
        var colr = color === null ? color : color || selectedColor;
        
        var deltaX = x2 - x1;
        var deltaY = y2 - y1;
        
        var shiftY = function(y){
            return Math.round(((deltaX*y) - (deltaX*y1) + (deltaY*x1)) / deltaY);
        }
        var shiftX = function(x){
            return Math.round(((deltaY*x) - (deltaY*x1) + (deltaX*y1)) / deltaX);
        }
        
        if(deltaX !== 0 || deltaY !== 0){
            if(deltaX == 0 || deltaY == 0){
                if(Math.abs(deltaX) > Math.abs(deltaY)){
                    for(var i = 0; i <= Math.abs(deltaX); i++){
                        b = i + (x1 < x2 ? x1 : x2);
                        thisSurface.map[b][y1].color = colr;
                        if(autoUpdate){
                            tool.updateCanvas.mainBox(b,y1);
                        }
                    }
                }else{
                    for(var i = 0; i <= Math.abs(deltaY); i++){
                        b = i + (y1 < y2 ? y1 : y2);
                        thisSurface.map[x1][b].color = colr;
                        if(autoUpdate){
                            tool.updateCanvas.mainBox(x1,b);
                        }
                    }
                }
            }else{
                if(Math.abs(deltaX) > Math.abs(deltaY)){
                    for(var i = 0; i <= Math.abs(deltaX); i++){
                        b = i + (x1 < x2 ? x1 : x2);
                        var shift = shiftX(b);
                        thisSurface.map[b][shift].color = colr;
                        if(autoUpdate){
                            tool.updateCanvas.mainBox(b,shift);
                        }
                    }
                }else{
                    for(var i = 0; i <= Math.abs(deltaY); i++){
                        b = i + (y1 < y2 ? y1 : y2);
                        var shift = shiftY(b);
                        thisSurface.map[shift][b].color = colr;
                        if(autoUpdate){
                            tool.updateCanvas.mainBox(shift,b);
                        }
                    }
                }
            }
        }else{
            thisSurface.map[x1][y1].color = selectedColor;
        }
    }
    this.stampIn = function(surface,x,y){
        var surface = surface;
        var offsetX = x || 0;
        var offsetY = y || 0;

        for(var a=0;a<surface.width;a++){
            if((a + offsetX) >= 0 && (a + offsetX) < this.width){
                for(var b=0;b<surface.height;b++){
                    if((b + offsetY) >= 0 && (b + offsetY) < this.height){
                        var col = surface.map[a][b].color;
                        if(col !== null){
                            this.map[a+offsetX][b+offsetY].color = col;
                        }
                    }
                }          
            }
        }

    }
    this.stampOn = function(targetSurface,x,y){
        var surface = targetSurface;
        var offsetX = x || 0;
        var offsetY = y || 0;

        for(var a=0;a<this.width;a++){
            if((a + offsetX) >= 0 && (a + offsetX) < surface.width){
                for(var b=0;b<this.height;b++){
                    if((b + offsetY) >= 0 && (b + offsetY) < surface.height){
                        var col = this.map[a][b].color;
                        if(col !== null){
                            surface.map[a+offsetX][b+offsetY].color = col;
                        }
                    }
                }          
            }
        }
    }
    this.resize = function(newWidth,newHeight,offsetX,offsetY){
        var offsetX = offsetX || 0;
        var offsetY = offsetY || 0;
        
        var lastMap = clone(this.map);
        var lastWidth = this.width;
        var lastHeight = this.height;
        
        
        this.createMap(newWidth,newHeight);
        
        for(var a=0;a<lastWidth;a++){
            if((a + offsetX) >= 0 && (a + offsetX) < this.width){
                for(var b=0;b<lastHeight;b++){
                    if((b + offsetY) >= 0 && (b + offsetY) < this.height){
                        var col = lastMap[a][b].color;
                        if(col !== null){
                            this.map[a+offsetX][b+offsetY].color = col;
                        }
                    }
                }          
            }
        }
        
    }
    this.paint = function(cont,scale){
        for(var a=0;a<this.width;a++){
            for(var b=0;b<this.height;b++){
                var col = this.map[a][b].color;
                if(col != null){
                    cont.fillStyle = col;
                    cont.fillRect(a*scale, b*scale, 1*scale, 1*scale);
                } 
            }
        }

    }
    this.paintBox = function(x,y,cont,scale){
        var col = this.map[x][y].color;
        if(col != null){
            cont.fillStyle = col;
            cont.fillRect(x*scale, y*scale, 1*scale, 1*scale);
        } 
    }
    this.createMap(width,height);
}

function checkered(surface){
    var thisSurface = surface;
    for(var a=0;a<thisSurface.width;a++){
        for(var b=0;b<thisSurface.height;b++){
            var check1 = b % 2 == 0;
            var check2 = a % 2 == 0 ? check1  : !check1;
            var check3 = check2 ? "#DFDFDF" : "#FFFFFF";
            thisSurface.map[a][b].color = check3;
        }
    }
}
//>>> INITIALIZE 2
var mainSurface = new Surface(surfacesWidth,surfacesHeight);
var editSurface = new Surface(surfacesWidth,surfacesHeight);
var clearSurface = new Surface(surfacesWidth,surfacesHeight);

function resizeSurfaces(newWidth,newHeight,offsetX,offsetY){
    surfacesWidth = newWidth;
    surfacesHeight = newHeight;
    
    mainSurface.resize(surfacesWidth,surfacesHeight,offsetX,offsetY);
    editSurface.resize(surfacesWidth,surfacesHeight,offsetX,offsetY);
    clearSurface.resize(surfacesWidth,surfacesHeight,offsetX,offsetY);
    
    mainCanvas.setAttribute("width", surfacesWidth + "px");
    mainCanvas.setAttribute("height", surfacesHeight + "px");
    editCanvas.setAttribute("width", surfacesWidth + "px");
    editCanvas.setAttribute("height", surfacesHeight + "px");
    clearCanvas.setAttribute("width", surfacesWidth + "px");
    clearCanvas.setAttribute("height", surfacesHeight + "px");
    
    adjustDisplayScale(1);

    checkered(clearSurface);
    clearSurface.paint(clearContext,1);
    tool.updateCanvas.mainAll();
}

function adjustDisplayScale(scale){
    if (scale >= 1) {
        displayScale = scale;
        
        mainCanvas.style.width = (surfacesWidth * displayScale) + "px";
        mainCanvas.style.height = (surfacesHeight * displayScale) + "px";
        editCanvas.style.width = (surfacesWidth * displayScale) + "px";
        editCanvas.style.height = (surfacesHeight * displayScale) + "px";
        clearCanvas.style.width = (surfacesWidth * displayScale) + "px";
        clearCanvas.style.height = (surfacesHeight * displayScale) + "px";

        canvasContainer.style.width = (surfacesWidth * displayScale) + "px";
        canvasContainer.style.height = (surfacesHeight * displayScale) + "px";
    }
}
adjustDisplayScale(1);

checkered(clearSurface);
clearSurface.paint(clearContext,1);

centerEditor();

//> CANVAS MOUSE OBJECT
var mouse = {x:0,y:0,xRelative:0,yRelative:0,xRelativeSub:0,yRelativeSub:0,down:false,over:false};

editCanvas.onmousemove = function(e){
    mouse.x = (e.clientX + scrollX + editorContainer.scrollLeft) - canvasContainer.offsetLeft;
    mouse.y = (e.clientY + scrollY + editorContainer.scrollTop) - canvasContainer.offsetTop;
    
    var calcXRelativeSub = Math.floor((mouse.x - (displayScale / 2)) / displayScale);
    var calcYRelativeSub = Math.floor((mouse.y - (displayScale / 2)) / displayScale);
    
    mouse.xRelativeSub = calcXRelativeSub > 0 ? calcXRelativeSub : 0;
    mouse.yRelativeSub = calcYRelativeSub > 0 ? calcYRelativeSub : 0;
    
    var calcXRelative = Math.floor((mouse.x) / displayScale);
    var calcYRelative = Math.floor((mouse.y) / displayScale);
    
    mouse.xRelative = calcXRelative > 0 ? calcXRelative : 0;
    mouse.yRelative = calcYRelative > 0 ? calcYRelative : 0;
    
    coordDisplay.innerHTML = "X: <span>"+mouse.xRelativeSub+"</span> Y: <span>"+mouse.yRelativeSub+"</span>";
    
}
editCanvas.onmousedown = function(e){
    if( e.which != 2 && e.which != 3){
      mouse.down = true;
   }
}
editCanvas.onmouseup = function(){mouse.down = false;}
editCanvas.onmouseover = function(){mouse.over = true;}
editCanvas.onmouseout = function(){mouse.over = false;mouse.down = false;}

//> EDITOR MOUSE OBJECT
var mouseEditor = {x:0,y:0,midleDown:false,initialMiddleDownX:0,initialMiddleDownY:0,initialScrollTop:0,initialScrollLeft:0};

editorContainer.onmousemove = function(e){
    mouseEditor.x = (e.clientX + scrollX) - editorContainer.offsetLeft;
    mouseEditor.y = (e.clientY + scrollY) - editorContainer.offsetTop;
    
    if(mouseEditor.midleDown){
        var deltaX  = mouseEditor.initialMiddleDownX - mouseEditor.x;
        var deltaY  = mouseEditor.initialMiddleDownY - mouseEditor.y;
        
        editorContainer.scrollLeft = mouseEditor.initialScrollLeft + deltaX;
        editorContainer.scrollTop = mouseEditor.initialScrollTop + deltaY;
    }
}
editorContainer.onmousedown = function(e){
    if(e.which == 2){
        e.preventDefault();
        mouseEditor.midleDown = true;
        mouseEditor.initialMiddleDownX = mouseEditor.x;
        mouseEditor.initialMiddleDownY = mouseEditor.y;
        
        mouseEditor.initialScrollLeft = clone(editorContainer.scrollLeft);
        mouseEditor.initialScrollTop = clone(editorContainer.scrollTop);
        
        editorContainer.style.cursor = 'move';
    }
}
editorContainer.onmouseup = function(){
    mouseEditor.midleDown = false;
    editorContainer.style.cursor = 'default';
    
}
//> HANDLE WIERD MOUSE OUT & IN BETWEEN CHILD/PARENT ELEMENT
var mouseOut = false;
var mouseOutTimeout
function mouseOutVerify/*in 10 secconds*/(){
    mouseOutTimeout = window.setTimeout(function(){
        mouseOut = false;
        mouseEditor.midleDown = false;
        editorContainer.style.cursor = "default";
        //console.log("out");
    },10)
}
editorContainer.onmouseout = function(){
    mouseOut = true;
    mouseOutVerify();
}
editorContainer.onmouseover = function(){
    clearTimeout(mouseOutTimeout);
    if(mouseOut){
        //console.log("still in");   
        mouseOut = false;
    }else{
        //console.log("in");      
    }
}
//> = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
editorContainer.oncontextmenu = function(){
    return false;
}
editorContainer.onmousewheel = function(e){
    
    var currentWrapperX = clone(mouseWrapper.x);
    var currentWrapperY = clone(mouseWrapper.y);
    var currentWrapperWidth = clone(canvasWrapper.offsetWidth);
    var currentWrapperHeight = clone(canvasWrapper.offsetHeight);
    
    e.preventDefault();
    var scrollAmount = e.deltaY;
    var scrollDirection = (scrollAmount / Math.abs(scrollAmount)) * -1;
    adjustDisplayScale(displayScale + scrollDirection);
    
    /*
    //ZOOM CENTER ON MOUSE
    var nextWrapperWidth = canvasWrapper.offsetWidth;
    var targetMouseX = (currentWrapperX / currentWrapperWidth)*nextWrapperWidth;
    
    var nextWrapperHeight = canvasWrapper.offsetHeight;
    var targetMouseY = (currentWrapperY / currentWrapperHeight)*nextWrapperHeight;
    
    editorContainer.scrollLeft -= Math.round(mouseWrapper.x - targetMouseX);
    editorContainer.scrollTop -= Math.round(mouseWrapper.y - targetMouseY);
    */
    
}
//> CANVAS WRAPPER MOUSE OBJECT
var mouseWrapper = {x:0,y:0}

canvasWrapper.onmousemove = function(e){
    mouseWrapper.x = (e.clientX + scrollX) + editorContainer.scrollLeft - canvasWrapper.offsetLeft;
    mouseWrapper.y = (e.clientY + scrollY) + editorContainer.scrollTop - canvasWrapper.offsetTop;
}
//> TOOL OBJECT
var selectedColor
var selectedTool

function bgUpdate(color){
    fullContainer.style.backgroundColor = "#" + color;
}
function colorUpdate(color,updateColorPicker){
    var updateCP = updateColorPicker || false
    selectedColor = "#" + color;
    
    bgUpdate(color);
    if(updateCP){
        document.getElementById("colorPicker").jscolor.fromString(selectedColor);
    }    
}
var lastSelectedTool = null;
function toolUpdate(tool){
    selectedTool = tool || "none";
    
    document.getElementById(tool + "Btn").setAttribute("class","selected"); 
    if(lastSelectedTool !== null && lastSelectedTool !== tool){
        document.getElementById(lastSelectedTool + "Btn").setAttribute("class","");
    }
    lastSelectedTool = tool;
}

document.addEventListener("DOMContentLoaded", function(e){
    colorUpdate("21D5CE",true);
});
toolUpdate("pencil");


var tool = new Object();

//> TOOL CALLBACKS
tool.updateCanvas = new Object();
tool.updateCanvas.mainAll = function(){
    mainContext.clearRect(0,0,surfacesWidth,surfacesHeight);
    mainSurface.paint(mainContext,1);
}
tool.updateCanvas.editAll = function(){
    editContext.clearRect(0,0,surfacesWidth,surfacesHeight);
    editSurface.paint(editContext,1);
}
tool.updateCanvas.mainBox = function(x,y){
    mainContext.clearRect(x,y,1,1);
    mainSurface.paintBox(x,y,mainContext,1);
}
tool.updateCanvas.editBox = function(x,y){
    editContext.clearRect(x,y,1,1);
    editSurface.paintBox(x,y,mainContext,1);
}



//> TOOLS
var lastPenciledBoxX,lastPenciledBoxY;
var pencilHoverLock = true;
tool.pencil = function(){
    var thisSurface = mainSurface;
    if(mouse.down){
        var selectedBoxX = mouse.xRelative;
        var selectedBoxY = mouse.yRelative;
        
        if(lastPenciledBoxX !== selectedBoxX || lastPenciledBoxY !== selectedBoxY){
            thisSurface.map[selectedBoxX][selectedBoxY].color = selectedColor;
            
            //console.log(lastPenciledBoxX + "," + lastPenciledBoxY + " > " + selectedBoxX + "," + selectedBoxY);
            if(lastPenciledBoxX !== null){
                
                var offsetX = selectedBoxX - lastPenciledBoxX;
                var offsetY = selectedBoxY - lastPenciledBoxY;
                if(Math.abs(offsetX) > 1 || Math.abs(offsetY) > 1){ //< LEAP PREVENTION!
                    //console.log("LEAP!!");
                    thisSurface.genLines(lastPenciledBoxX,lastPenciledBoxY,selectedBoxX,selectedBoxY,true);
                }
            }
            
            lastPenciledBoxX = selectedBoxX;
            lastPenciledBoxY = selectedBoxY;
        }
        
        //tool.updateCanvas.mainAll();
        tool.updateCanvas.mainBox(selectedBoxX,selectedBoxY);
        pencilHoverLock = false;
        
    }
    if(!mouse.down && !pencilHoverLock){
        lastPenciledBoxX = null;
        lastPenciledBoxY = null;
        pencilHoverLock = true;
        
        editorHistory.save("pencil");
    }
}

var lastErasedBoxX,lastErasedBoxY;
var eraserHoverLock = true;
tool.eraser = function(){
    var thisSurface = mainSurface;
    if(mouse.down){
        var selectedBoxX = mouse.xRelative;
        var selectedBoxY = mouse.yRelative;
        
        if(lastErasedBoxX !== selectedBoxX || lastErasedBoxY !== selectedBoxY){
            thisSurface.map[selectedBoxX][selectedBoxY].color = null;
            
            //console.log(lastErasedBoxX + "," + lastErasedBoxY + " > " + selectedBoxX + "," + selectedBoxY);
            if(lastErasedBoxX !== null){
                
                var offsetX = selectedBoxX - lastErasedBoxX;
                var offsetY = selectedBoxY - lastErasedBoxY;
                if(Math.abs(offsetX) > 1 || Math.abs(offsetY) > 1){ //< LEAP PREVENTION!
                    //console.log("LEAP!!");
                    thisSurface.genLines(lastErasedBoxX,lastErasedBoxY,selectedBoxX,selectedBoxY,true,null);
                }
            }
            
            lastErasedBoxX = selectedBoxX;
            lastErasedBoxY = selectedBoxY;
        }
        
        //tool.updateCanvas.mainAll();
        tool.updateCanvas.mainBox(selectedBoxX,selectedBoxY);
        eraserHoverLock = false;
        
    }
    if(!mouse.down && !eraserHoverLock){
        lastErasedBoxX = null;
        lastErasedBoxY = null;
        eraserHoverLock = true;
        
        editorHistory.save("eraser");
    }
}

var clickLock = false;
tool.bucketFill = function(){
    var thisSurface = mainSurface;
    var initialX,initialY;
    if(mouse.down && !clickLock){
        initialX = mouse.xRelative;
        initialY = mouse.yRelative;
        initialColor = thisSurface.map[initialX][initialY].color;
        
        thisSurface.map[initialX][initialY].color = selectedColor;
        suround(initialX,initialY,initialColor);
        suroundStackShifter();
        clickLock = true;
        
        tool.updateCanvas.mainAll();
        editorHistory.save("bucketFill");
    }
    if(!mouse.down){
        clickLock = false
    }
}
var suroundStack = [];
function suroundStackShifter(){
   while(suroundStack.length > 0){
        var selectedStack = suroundStack[0];
        suround(selectedStack[0],selectedStack[1],selectedStack[2]);
    }
}
function suround(initX,initY,initColor){
    if(initColor != selectedColor){
        suroundStack.splice(0,1);
        var thisSurface = mainSurface;
        var offsetArray = [{x:1,y:0},{x:-1,y:0},{x:0,y:+1},{x:0,y:-1}];

        for(var a=0;a<offsetArray.length;a++){
            var targetX = initX + offsetArray[a].x;
            var targetY = initY + offsetArray[a].y;


            if(0 <= targetX && targetX < thisSurface.width){
                if(0 <= targetY && targetY < thisSurface.height){  
                    if(thisSurface.map[targetX][targetY].color == initColor){
                        if(thisSurface.map[targetX][targetY].color != selectedColor){
                            suroundStack.splice(suroundStack.length,0,[targetX,targetY,initColor]);
                            thisSurface.map[targetX][targetY].color = selectedColor;
                        }
                    }
                }
            }
        }
    }
}

var clickLockB = false;
tool.colorPicker = function(){
    var thisSurface = mainSurface;
    if(mouse.down && !clickLockB){
        
        clickLockB = true;
        var colr = thisSurface.map[mouse.xRelative][mouse.yRelative].color;
        colorUpdate(colr.substring(1),true);
        
    }
    if(!mouse.down){
        clickLockB = false
    }
}

var hoverLock = true;
var initialBoxX,initialBoxY,lastSelectedBoxX,lastSelectedBoxY,selectedBoxX,selectedBoxY;
tool.line = function(){
    var thisSurface = editSurface;
    var nextSurface = mainSurface;
    if(mouse.down && !clickLock){
        clickLock = true;
        hoverLock = false;
        initialBoxX = mouse.xRelative
        initialBoxY = mouse.yRelative
        tool.updateCanvas.editAll();
        //console.log(">>>INIT: "+initialBoxX+","+initialBoxY);
    }
    if(mouse.down && clickLock){
        
        selectedBoxX = mouse.xRelative
        selectedBoxY = mouse.yRelative
        if(selectedBoxX !== lastSelectedBoxX || selectedBoxY !== lastSelectedBoxY){
            lastSelectedBoxX = selectedBoxX;
            lastSelectedBoxY = selectedBoxY;
            //console.log("INIT: "+initialBoxX+","+initialBoxY+" CRNT-COORD: "+selectedBoxX+","+selectedBoxY);
            thisSurface.clear();
            thisSurface.genLines(initialBoxX,initialBoxY,selectedBoxX,selectedBoxY);
            tool.updateCanvas.editAll();
        }
    }
    if(!mouse.down && !hoverLock){
        clickLock = false;
        thisSurface.stampOn(nextSurface);
        thisSurface.clear();
        hoverLock = true;
        tool.updateCanvas.editAll();
        tool.updateCanvas.mainAll();
        
        editorHistory.save("line");
    } 
}
tool.box = function(){
    var thisSurface = editSurface;
    var nextSurface = mainSurface;
    if(mouse.down && !clickLock){
        clickLock = true;
        hoverLock = false;
        initialBoxX = mouse.xRelative
        initialBoxY = mouse.yRelative
        tool.updateCanvas.editAll();
        //console.log(">>>INIT: "+initialBoxX+","+initialBoxY);
    }
    if(mouse.down && clickLock){
        
        selectedBoxX = mouse.xRelative
        selectedBoxY = mouse.yRelative
        if(selectedBoxX !== lastSelectedBoxX || selectedBoxY !== lastSelectedBoxY){
            lastSelectedBoxX = selectedBoxX;
            lastSelectedBoxY = selectedBoxY;
            //console.log("INIT: "+initialBoxX+","+initialBoxY+" CRNT-COORD: "+selectedBoxX+","+selectedBoxY);
            thisSurface.clear();
            thisSurface.genLines(initialBoxX,initialBoxY,initialBoxX,selectedBoxY);
            thisSurface.genLines(initialBoxX,initialBoxY,selectedBoxX,initialBoxY);
            
            thisSurface.genLines(initialBoxX,selectedBoxY,selectedBoxX,selectedBoxY);
            thisSurface.genLines(selectedBoxX,initialBoxY,selectedBoxX,selectedBoxY);
            
            tool.updateCanvas.editAll();
        }
    }
    if(!mouse.down && !hoverLock){
        clickLock = false;
        thisSurface.stampOn(nextSurface);
        thisSurface.clear();
        hoverLock = true;
        tool.updateCanvas.editAll();
        tool.updateCanvas.mainAll();
        
        editorHistory.save("box");
    } 
}

//> CLONE OBJECT FUNCTION (used in HISTORY)
function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;
    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }
    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
}

//> HISTORY
var editorHistory = new Object();

editorHistory.list = [];
editorHistory.undoCount = 0;

editorHistory.save = function(tool){
    var currentMap = clone(mainSurface.map);
    var toolInEffect = tool || selectedTool;
    var historyObject = {tool: toolInEffect,map: currentMap};
    
    if(editorHistory.undoCount > 0){
        editorHistory.list.splice(0,0 + editorHistory.undoCount);
        editorHistory.undoCount = 0;
    }
    editorHistory.list.splice(0,0,historyObject);
}

editorHistory.undo = function(){
    if(editorHistory.undoCount < (editorHistory.list.length - 1)){
        editorHistory.undoCount += 1;
        var historyMap = clone(editorHistory.list[editorHistory.undoCount].map);
        mainSurface.map = historyMap;
        tool.updateCanvas.mainAll();
    }
}
editorHistory.redo = function(){
    if(editorHistory.undoCount > 0){
        editorHistory.undoCount -= 1;
        var historyMap = clone(editorHistory.list[editorHistory.undoCount].map);
        mainSurface.map = historyMap;
        tool.updateCanvas.mainAll();
    } 
}

editorHistory.save("none");
//> LAYERS
/*
var DEF_LAYER_WIDTH = surfacesWidth/1;
var DEF_LAYER_HEIGHT = surfacesHeight/1;
var DEF_LAYER_COLOR = "clear";

var layers = []

layers.createLayer = function(zIndex){
    this.splice(zIndex,0,new Surface(DEF_LAYER_WIDTH,DEF_LAYER_HEIGHT,DEF_LAYER_COLOR));
}
layers.deleteLayer = function(zIndex){
    this.splice(zIndex,1);
}

function updateMainSurface(){
    for(var a=0;a<layers.length;a++){
        mainSurface.stamp(layers[a],0,0);
    }
}

function initLayerSelector(){
    var surfaceSelector = document.getElementById("surfaceSelect");
    for(var a=0; a<surfaceArray.length; a++){
        surfaceSelector.innerHTML = surfaceSelector.innerHTML + "<option value='"+a+"'>"+a+"</option>"
    }
}*/
//> KEYBOARD SHORTCUTS
document.onkeypress = function(e){
    switch(e.which){
        case 98:
            toolUpdate('pencil');
        break;
        case 103:
            toolUpdate('bucketFill');
        break;
        case 105:
            toolUpdate('colorPicker');
        break;
        case 101:
            toolUpdate('eraser');
        break;
        case 111:
            toolUpdate('box');
        break;
        case 108:   
            toolUpdate('line');
        break;
    }
} 

var ctrlDown = false;
var ctrlKey = 17, yKey = 89, zKey = 90;

document.body.onkeydown = function(e) {
    if(e.keyCode == 17 || e.keyCode == 91){
        ctrlDown = true;
    }
    if(ctrlDown && e.keyCode == zKey){
        e.preventDefault();
        editorHistory.undo();
        return false;
    }
    if(ctrlDown && e.keyCode == yKey){
        e.preventDefault();
        editorHistory.redo();
        return false;
    }
}

document.body.onkeyup = function(e) {
  if (e.keyCode == 17 || e.keyCode == 91) {
    ctrlDown = false;
  };
};

//> CENTER EDITOR FUNCTION
function centerEditor(){
    editorContainer.scrollTop = (editorContainer.scrollHeight - editorContainer.clientHeight)/2;
    editorContainer.scrollLeft = (editorContainer.scrollWidth - editorContainer.clientWidth)/2;
};

//> DOWNLOAD FUNCTION
function download(){
    var dataURL = mainCanvas.toDataURL();
    //window.location = dataURL;
    return dataURL;
}

//>>> MAIN LOOP
function main(){
    tool[selectedTool]();
    requestAnimationFrame(main);
};
requestAnimationFrame(main);

