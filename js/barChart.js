var selectedBarsIdx = [];

function unique (value, index, self){
  return self.indexOf(value) === index; 
};

function BarChart () {
// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 200, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#barChart").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  
var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
var y = d3.scaleLinear().rangeRound([height, 0]);
  

  d3.json("data/sample_data.json").then(function(data) {
    
      genes = d3.keys(data);
    
      var allConditions = [];
      var uniqueConditions =[]; // x-axis for heat map

      var geneExpressionConditionVsGenes = []; //data for heatmap
      for (let index = 0; index < genes.length; index++) {
        allConditions.push(d3.keys(data[genes[index]])); 
      };

      uniqueConditions = allConditions.flat().filter(unique);

      var geneExpressionCondition = [];
      uniqueConditions.forEach(cond => {
        var entry = {condition: cond, sum:0};
        geneExpressionCondition.push(entry);
      });

      for (let id = 0; id < genes.length; id++) {
        var geneExpression = d3.entries(data[genes[id]]); 
        geneExpression.forEach(object => {
          var entry = geneExpressionCondition.find(i => i.condition === object.key);
          entry.sum += object.value;
        });    
      };
      
      // here 
      x.domain(geneExpressionCondition.map(function(d) { return d.condition; }));
      y.domain([0, d3.max(geneExpressionCondition, function(d) { return d.sum; })]);
  
      g.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
          .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
                });
  
      g.append("g")
          .attr("class", "axis axis--y")
          .call(d3.axisLeft(y).ticks(10, ".1e"))
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Sum");
  

      var div = d3.select("body").append("div")
          .attr("class", "tooltip-barChart")
          .style("opacity", 0);

      g.selectAll(".bar")
        .data(geneExpressionCondition)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.condition); })
          .attr("y", function(d) { return y(d.sum); })
          .attr("width", x.bandwidth())
          .attr("height", function(d) { return height - y(d.sum); })
          .on('mouseover', function (d, i) {
            d3.select(this).transition()
                 .duration('50')
                 .attr('opacity', '.6');
            div.transition()
                 .duration(50)
                 .style("opacity", 1);
            div.html(d.sum)
                 .style("left", (d3.event.pageX + 10) + "px")
                 .style("top", (d3.event.pageY - 15) + "px");
                })
          .on('mouseout', function (d, i) {
                  d3.select(this).transition()
                       .duration('50')
                       .attr('opacity', '1');
                  div.transition()
                       .duration('50')
                       .style("opacity", 0);})
           .on('click', function(d, i){
              if (selectedBarsIdx.includes(i)) {
                d3.select(this).transition()
                .duration('50')
                .style("fill", "LightSteelblue");

                selectedBarsIdx.splice( selectedBarsIdx.indexOf(i), 1 );
              } else {
                d3.select(this).transition()
                .duration('50')
                .attr("class", "barSelected")
                .style('fill', 'SteelBlue');

                selectedBarsIdx.push(i);
              }
              });
  });
};

BarChart();



function HeatMap (){
// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 200, left: 50},
  width = 1000 - margin.left - margin.right,
  height = 1000 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#heatMap")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

d3.json("data/sample_data.json").then(function(data) {
            var genes = [];           //y-axis for heat map
            genes = d3.keys(data);

            var allConditions = [];
            var uniqueConditions =[]; // x-axis for heat map
            
            var geneExpressionConditionVsGenes = []; //data for heatmap
            
            for (let index = 0; index < genes.length; index++) {
              allConditions.push(d3.keys(data[genes[index]])); 

            };
           
            uniqueConditions = allConditions.flat().filter(unique);      
            
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

                geneExpressionConditionVsGenes.push(entry);
               }
            });

            // var test = geneExpressionConditionVsGenes.filter(function (geneExp){
            //   return geneExp.condition == uniqueConditions[0];
            // });          
// Build X scales and axis:
var x = d3.scaleBand()
          .range([ 0, width ])
          .domain(uniqueConditions)
          .padding(0.01);

svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
           .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
                });        

        
// Build Y scales and axis:
var y = d3.scaleBand()
          .range([ height, 0 ])
          .domain(genes)
          .padding(0.01); //0.01

svg.append("g")
          .call(d3.axisLeft(y))
          .selectAll("text")
          .style("font", "1.5px times");


var minValue = geneExpressionConditionVsGenes.reduce(function(prev, curr) {
            return prev.expression < curr.expression ? prev : curr;
        });          
var maxValue = geneExpressionConditionVsGenes.reduce(function(prev, curr) {
          return prev.expression > curr.expression ? prev : curr;
      });  


        // Build color scale
var myColor = d3.scaleLog() //d3.scaleLinear
          .range(["white", "blue"])
          .domain([minValue.expression,maxValue.expression]);

  // create a tooltip
var tooltip = d3.select("#heatMap")
    .append("div")
    .style("opacity", 0)
    .style("position", "absolute")
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(d) {
  tooltip.style("opacity", 1)
}
var mousemove = function(d) {
  tooltip
    .html("condition: "+ d.condition + "<br>gene: "+ d.gene + "<br> value: "+ Math.round(d.expression))
    .style("left", d3.event.pageX + "px")
    .style("top", d3.event.pageY + "px")
}
var mouseleave = function(d) {
  tooltip.style("opacity", 0)
}

// add the squares
svg.selectAll()
  .data(geneExpressionConditionVsGenes, function(d){return d.condition+':'+d.gene;})
  .enter()
  .append("rect")
    .attr("x", function(d){return x(d.condition)})
    .attr("y", function(d){return y(d.gene)})
    .attr("width", x.bandwidth() )
    .attr("height", y.bandwidth() )
    .style("fill", function(d) { return myColor( d.expression)})
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave);
});
};

HeatMap();
  
