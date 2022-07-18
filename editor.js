const editor = (function() {
    var editor;

    function init() {

        return {
            currentMode : "tileMode",
            currentEvents : "blank",
            selectedTile : 0,
        }
    };

    return {
        getEditorState: function() {
            if (!editor) {
                editor = init();
            } 
            return editor;
        }
    }
})();

class Tile {
    constructor(info){
        this.x = info.x;
        this.y = info.y;
        this.tileNo =  0;
        this.objectOnTile = null;
        this.movable = false;
        this.event = null;
        this.targetdiv = info.targetdiv;
    }
}

const mapData = (function(){

    var mapData;

    function init() {
        return {
            mapWidth : "",
            mapHeight : "",
            tiles : [],
            mapEvents : [],
            mapObjects : [],
        };
    };

    return {
        getMapData: function() {
            if (!mapData) {
                mapData = init();
            }
            return mapData;
        },
        mapInit : (x, y) => {
            var tiles = [];
            for(i=0;i<y;i++){
                var column = [];
                for(j=0;j<x;j++){
                    $('#editor').append(`
                        <div class='tile' tilex=${j} tiley=${i}></div>
                    `);
                    var targetdiv = $(".tile").toArray().at(-1);
                    column.push(
                    new Tile({x: j, y: i, targetdiv : targetdiv})
                    );   
                }
                $('#editor').append(`</div>`);
                tiles.push(column);
            }
            return tiles;
        },
        tileInfo : (x, y) => {
            return mapData.tiles[y][x];
        }
    }

})();

const MODES = ["tile", "object", "move", "event"];
const EVENTS = ["blank", "image", "link", "sounds", "question", "portal", "spawn"];

mapData.getMapData().tiles = mapData.mapInit(12,12);

let isClicked = false;

$(document).on("contextmenu", (e)=>{
    e.preventDefault();
})

$(".modeChange").on("click" , (e) => {
    var targetMode = e.target.getAttribute('targetMode');
    $("#editor").removeClass('tileMode objectMode moveMode eventMode');
    $("#editor").addClass(targetMode);
    editor.getEditorState().currentMode = targetMode;
});

( () => {
    $(".tile").on("mousedown", (e) => {

        var tile, tilex, tiley, currentMode, selectedTile;

        currentMode = editor.getEditorState().currentMode;
        selectedTile = editor.getEditorState().selectedTile;
        tilex = parseInt($(e.target).attr("tilex"));
        tiley = parseInt($(e.target).attr("tiley"));
        tile = mapData.getMapData().tiles[tiley][tilex];

        if(e.which == 1){

                isClicked = true;

                if(currentMode === "moveMode"){
                    $(e.target).toggleClass("move");
                    tile.movable = !(tile.movable);
                }

                if(currentMode === "tileMode"){
                    tile.tileNo = selectedTile;
                    selectedPaletteTile = $(".paletteTile")[selectedTile];
                    $(e.target).css("background", $(selectedPaletteTile).css("background"));
                }
        }

    }).on("contextmenu", (e) => {
        e.preventDefault();
        
        currentMode = editor.getEditorState().currentMode;
        if(currentMode === "tileMode"){
            
            currentMode = editor.getEditorState().currentMode;
            selectedTile = editor.getEditorState().selectedTile;
            tilex = parseInt($(e.target).attr("tilex"));
            tiley = parseInt($(e.target).attr("tiley"));
            tile = mapData.getMapData().tiles[tiley][tilex];
            $($(".paletteTile")[tile.tileNo]).trigger("click");
        }
            
    }).on("mouseover", (e) => {
        
        currentMode = editor.getEditorState().currentMode;
        if(currentMode === "tileMode" && isClicked == true){
            
            currentMode = editor.getEditorState().currentMode;
            selectedTile = editor.getEditorState().selectedTile;
            tilex = parseInt($(e.target).attr("tilex"));
            tiley = parseInt($(e.target).attr("tiley"));
            tile = mapData.getMapData().tiles[tiley][tilex];
            
            tile.tileNo = selectedTile;
            selectedPaletteTile = $(".paletteTile")[selectedTile];
            $(e.target).css("background", $(selectedPaletteTile).css("background"));
        }

    }).on("mouseup", (e) => {
        isClicked = false;
    });
})();


for (i=0;i<480;i++){
    $("#palette").append(`<div class='paletteTile' tileNo=${i}></div>`)
    var tilediv = $(".paletteTile").toArray().at(-1);
    $(tilediv).css("background",`url(./src/tiles/${i}.png)`)
}

$(".paletteTile").on("click", (e)=>{
    $($(".paletteTile")[editor.getEditorState().selectedTile]).removeClass("selected");
    var tileNo = parseInt($(e.target).attr("tileNo"));
    editor.getEditorState().selectedTile = tileNo;
    $(e.target).addClass("selected");
});



/*
each tile has properties
{
    x: 0,
    y: 0,
    movable: True or False,
    event : eventID,
}

each event has properties
{
    id : ,
    TOE : ,
    title : ,
    content : ,
}

*/

