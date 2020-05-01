import { GetJSONObject } from "./fetchData.js";

const data = GetJSONObject();

function Genes (d){
  return Object.keys(d).map(item => item);
}

export function GetGenes (){
  var genes = Genes(data);
  return genes; 
}

function Conditions (sel, d, g){
 var conditions = [];
  if (sel.length === 0){
    conditions = UniqueConditions(d,g); 
  }
  else {
    conditions = sel;
  }
  
  function UniqueConditions (d,g){
    var uniqueConditions =[]
    for (let i = 0; i < g.length; i++) {
      var conds = d3.keys(d[g[i]]);
      for (let j = 0; j < conds.length; j++) {
          if(!uniqueConditions.includes(conds[j])){
              uniqueConditions.push(conds[j]);
          }
      }
    };
    return uniqueConditions;
  }
  return conditions; 
}

export function GetConditions(selectedConditions){
  var conditions = Conditions (selectedConditions, data, Genes(data));
  return conditions;
}

export function GetTransformedDataHeatMap(selectionConditions){
var transformedData = []; //reordered data structure
var genes = Genes(data);  //y-axis for heat map
var conditions = Conditions(selectionConditions,data,genes);      // x-axis for heat map

//reoder json file to use as input for heatmap           
conditions.forEach(cond => {
  for (let g = 0; g < genes.length; g++) {
    var aGene = genes[g];
    var aCondition = cond;
    var aExpression = NaN;         
     var geneExpression = d3.entries(data[aGene]); 
     
     for (let j = 0; j < geneExpression.length; j++) {
      if (aCondition === geneExpression[j].key) {
        aExpression = geneExpression[j].value; 
        break;
      }; 
     }
     var entry = {"condition": aCondition, "gene": aGene, "expression": aExpression};
    transformedData.push(entry);
   }
});
return transformedData;
};

// 
const groupBy = (array, key) => {
    // Return the end result
    return array.reduce((result, currentValue) => {
      // If an array already present for key, push it to the array. Else create an array and push the object
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
      return result;
    }, {}); // empty object is the initial value for result object
  };


export function GetTransformedDataBarChart(){

var selectionDefault = [];
var transformedData = GetTransformedDataHeatMap(selectionDefault);
var groupByCondition = groupBy(transformedData,"condition");

var groupByConditionArray = Object.keys(groupByCondition).map(function(key) {
  return [key, groupByCondition[key]];
});

var sumByCondition = [];
groupByConditionArray.forEach(condition => {
  var object = condition[1];
  var entry = {condition: condition[0], sum:0};
  object.forEach(gene => {
    entry.sum += gene.expression;
  });
  sumByCondition.push(entry);
});

    return sumByCondition;
};





