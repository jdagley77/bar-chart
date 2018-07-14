var req = new XMLHttpRequest();
req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
req.send();


req.onload = function() {
  var data = JSON.parse(req.responseText),
      json = data['data'];
  if (req.status >= 200 && req.status < 400) {
    var html = '';
    
    
  dataset = json.map(arr => 
    [convertToDate(arr[0]), arr[1]]
  )
}
  

  const w = 960;
  const h = 500;
  const padding = 50;

  var yScale = d3.scaleLinear()
    .range([h, 0])
    .domain([0, d3.max(dataset, (d)=>d[1])])

  var xScale = d3.scaleLinear()
    .range([0, w])
    .domain([0, d3.max(dataset, (d)=>d[0])])
  
  var chart = d3.select('body')
    .append('svg')
    .attr('height', h)
    .attr('width', w)
    .style('padding', padding)

  var tooltip = d3.select("body").append("div")
    .attr("class", "toolTip")


  chart.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('x', (d,i) => i * (w / dataset.length) )
    .attr('y', (d) => yScale(d[1]))
    .attr('height', (d) => h - yScale(d[1]))
    .attr('width', (d) => (w / dataset.length ) - 0)
    .on("mousemove", function(d){
      tooltip
        .style("left", d3.event.pageX - 50 + "px")
        .style("top", d3.event.pageY - 70 + "px")
        .style("display", "inline-block")
        .html('<strong>'+formatDateToYear(d[0])+' '+ formatData(d[0].getMonth()) +'</strong>' + '<br>' + '$'+d[1].toLocaleString('en')+' Billion')
        d3.select(this).style('opacity', '1')
        d3.select(this).style('fill', 'darkgreen')
    })
    .on("mouseout", function(d){ 
      tooltip.style("display", "none")
      d3.select(this).style('opacity', '0.9')
      d3.select(this).style('fill', 'green')
    });

    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    chart.append('g')
      .attr('class', 'xaxis')
      .attr('transform', "translate(0,"+ (h)+')')
      .call(xAxis.tickFormat(d3.timeFormat("%Y")).ticks(10));

    chart.append('g')
      .attr('transform', 'translate(0, 0)')
      .call(yAxis)

    chart.selectAll('.xaxis text')
      .attr("transform", function(d) {
           return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
       });

    chart.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'translate('+(padding/2) + ','+(h/2)+')rotate(-90)')
      .attr('class', 'axis-text')
      .text('Annual GDP')

    chart.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'translate('+(w/2)+','+(h + padding)+')')
      .text('Year')
        .attr('class', 'axis-text')

    chart.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'translate('+(w/2)+','+0+')')
      .text('United States GDP')
        .attr('id', 'title')
}

function formatData(rawQuarterData) {
  var quarter;
  switch(rawQuarterData) {
    case 0:
      quarter = 'Q1'
      break;
    case 3:
      quarter = 'Q2'
      break;
    case 6:
      quarter = 'Q3'
      break;
    case 9:
      quarter = 'Q4'
      break;
  }
  return quarter;
}

function convertToDate(dateString) {
  var parser = d3.timeParse("%Y-%m-%d")
  var dateObject = parser(dateString)
  return dateObject;
}

function formatDateToYear(dateObject) {
  var year = 1900 + dateObject.getYear()
  console.log(year)
  return year;
}

function formatDateToString(dateObject) {
  var format = d3.timeFormat("%Y-%d-%m");
  console.log(format(dateObject)); // returns a string
}



