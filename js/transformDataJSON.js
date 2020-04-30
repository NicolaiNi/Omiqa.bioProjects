import { GetJSONObject } from "./fetchData.js";

const data = GetJSONObject();

var genes = Object.keys(data).map(item => item);
var uniqueConditions =[]; // x-axis for heat map
var transformedData = []; //reordered data structure

for (let index = 0; index < genes.length; index++) {
    var conditions = d3.keys(data[genes[index]]);
    for (let j = 0; j < conditions.length; j++) {
        if(!uniqueConditions.includes(conditions[j])){
            uniqueConditions.push(conditions[j]);
        }
    }
};

//reoder json file to use as input for heatmap           
uniqueConditions.forEach(cond => {
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

export function GetTransformedDataHeatMap(){
    return transformedData;
};

export function GetConditions(){
    return uniqueConditions;
}
export function GetGenes(){
    return genes; 
}
export function GetTransformedDataBarChart(){
  return sumByCondition;
};