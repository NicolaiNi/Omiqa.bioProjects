/**
 * Stub implementation of data fetching from DB??
 */

function loadJSON(callback) {    
    const response=[];
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', './data/sample_data.json', false); //true in async mode
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
 }

 export function GetJSONObject() { 
    var JSONObject;
    loadJSON(function(response) {
     // Parse JSON string into object
     JSONObject = JSON.parse(response);
    }); 
    return JSONObject;
   }

// to work in asyn mode

//    function foobar() { 
//     var json;
//     loadJSON("data.json", function(response) {
//         json = JSON.parse(response);
//         // Call another function with json that is now filled with data
//         triggered(json);
//     });
// }

// function triggered(json) {
//     console.log(json[0].name);
//     // Do your work on json
// }