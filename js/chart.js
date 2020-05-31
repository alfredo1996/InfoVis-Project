//Margine dallo schermo
var margin = {top: 20, right: 20, bottom: 30, left: 40};

//Grandezza dello schermo
var width = window.innerWidth - margin.left - margin.right;
var height = window.innerHeight - margin.top - margin.bottom;

//Coordinate del centro dello schermo
var windowCenterWidth = width/2
var windowCenterHeight = height/2

//Lunghezza degli assi
var axisLenght = 0.4 * height

//Scale sugli assi
var x1 = d3.scaleLinear().range([axisLenght,0])                
var x2 = d3.scaleLinear().range([0,axisLenght])
var x3 = d3.scaleLinear().range([0,axisLenght])
var x4 = d3.scaleLinear().range([0,axisLenght])
var x5 = d3.scaleLinear().range([0,axisLenght])

//Disegnamo gli assi e aggiungiamogli i tick 
var x1Axis = d3.axisRight(x1).tickValues([0.2,0.4,0.6,0.8,1.0])     			
var x2Axis = d3.axisRight(x2).tickValues([0.2,0.4,0.6,0.8,1.0])     
var x3Axis = d3.axisRight(x3).tickValues([0.2,0.4,0.6,0.8,1.0])    
var x4Axis = d3.axisLeft(x4).tickValues([0.2,0.4,0.6,0.8,1.0])    
var x5Axis = d3.axisLeft(x5).tickValues([0.2,0.4,0.6,0.8,1.0])    

//Contenitore SVG
var svg = d3.select("body")
            .append("svg")
            .attr("width", width + margin.left + margin.right)    
            .attr("height", height + margin.top + margin.bottom)   
            .append("g")                                         
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");                                                    

//Funzione che disegna gli assi dentro il contenitore SVG
//Portandoli tutti al centro dello schermo
function drawAxes(){

    //Primo Asse
    svg.append("g")
        .attr("class", "x1 axis")
        .attr("transform", "translate(" + windowCenterWidth + "," + windowCenterHeight * 0.2 +")")
        .call(x1Axis);
    
    svg.append("text")
    .attr("transform", "translate(" + (windowCenterWidth - 5)+ "," + (windowCenterHeight * 0.2 -5) +")")
    .style("font-size","12px")
    .text("X1")
    
    //Secondo asse
    svg.append("g")
        .attr("class", "x2 axis")
        .attr("transform", "translate(" + windowCenterWidth + "," + windowCenterHeight +") rotate(-108)")
        .call(x2Axis);
    
    svg.append("text")
    .attr("transform", "translate(" + (windowCenterWidth + axisLenght - 5)+ "," + (windowCenterHeight*0.75) +")")
    .style("font-size","12px")
    .text("X2")
    
    //Terzo Asse
    svg.append("g")
        .attr("class", "x3 axis")
        .attr("transform", "translate(" + windowCenterWidth + "," + windowCenterHeight +") rotate(-36)")
        .call(x3Axis);

    svg.append("text")
    .attr("transform", "translate(" + (windowCenterWidth + windowCenterHeight/2 - 5)+ "," + (windowCenterHeight*1.7 - 5) +")")
    .style("font-size","12px")
    .text("X3")
    
    //Quarto Asse
    svg.append("g")
        .attr("class", "x4 axis")
        .attr("transform", "translate(" + windowCenterWidth + "," + windowCenterHeight +") rotate(36)")
        .call(x4Axis);

    svg.append("text")
        .attr("transform", "translate(" + (windowCenterWidth - windowCenterHeight/2 - 5)+ "," + (windowCenterHeight*1.7 - 5) +")")
        .style("font-size","12px")
        .text("X4")
    
    //Quinto Asse
    svg.append("g")
        .attr("class", "x5 axis")
        .attr("transform", "translate(" + windowCenterWidth + "," + windowCenterHeight +") rotate(108)")
        .call(x5Axis);

    svg.append("text")
        .attr("transform", "translate(" + (windowCenterWidth - axisLenght - 5)+ "," + (windowCenterHeight*0.75) +")")
        .style("font-size","12px")
        .text("X5")
    
    }


//Funzione che disegna il path del singolo punto che viene cliccato
function drawPath(input){

    //Per pulizia, facciamo che su schermo ci può essere solo un path per volta
    d3.select("g").selectAll(".current_path").remove()

    //Estraiamo le features del punto per poter calcolare le singole componenti
    values = input.features
    keys = Object.keys(values)

    var i = 0

    value_scaled = []

    //Calcoliamo il punto scalato rispetto agli assi
    keys.forEach(function(k){
        value = values[k]
        scaled_val = -axisLenght * value
        value_scaled.push(scaled_val)
        i = i+1
    })
    
    //Calcoliamo il contributo del primo punto
    contributoX1 = windowCenterWidth
    contributoY1 = windowCenterHeight + value_scaled[0]
    
    //Disegnamo il relativo path
    path1 = svg.append("g")
        .append("path")
        .attr("class", "current_path")
        .attr("d", "M " + windowCenterWidth +  " " + windowCenterHeight + " " +" L "+contributoX1+ " "+ contributoY1+"")
        .style("animation", "hideshow 5s ease")
        .style("stroke", "red")
        .style("stroke-width",3)
        .attr("fill","None")
	
    //Prendiamo la lunghezza del path per animarlo
    var totalLength1 = path1.node().getTotalLength();

        path1
            .attr("stroke-dasharray", totalLength1 + " " + totalLength1)
            .attr("stroke-dashoffset", totalLength1)
            .transition()
                .duration(400)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0)
        
    //Calcoliamo il contributo del secondo punto
    angolo =  162 * Math.PI / 180 
    contributoX2  = contributoX1 + Math.cos(angolo) * value_scaled[1]
    contributoY2 = contributoY1 + Math.sin(angolo) * value_scaled[1]
    
    //Disegnamo il relativo path
    path2 = svg.append("g")
        .append("path")
        .attr("class", "current_path")
        .attr("d", "M " + contributoX1 +  " " + contributoY1 + " " +" L "+contributoX2+ " "+ contributoY2+"")
        .style("stroke", "green")
        .style("stroke-width",3)
        .attr("fill","None")

    var totalLength2 = path2.node().getTotalLength();

    path2
        .attr("stroke-dasharray", totalLength2 + " " + totalLength2)
        .attr("stroke-dashoffset", totalLength2)
        .transition()
        .delay(400)
            .duration(400)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)

    //Calcoliamo il contributo del terzo punto
    var angolo = 234 * Math.PI / 180 
    contributoX3  = contributoX2 + Math.cos(angolo) * value_scaled[2]
    contributoY3 = contributoY2 + Math.sin(angolo) * value_scaled[2]

    //Disegnamo il relativo path
    path3 = svg.append("g")
    .append("path")
    .attr("class", "current_path")
    .attr("d", "M " + contributoX2 +  " " + contributoY2 + " " +" L "+contributoX3+ " "+ contributoY3+"")
    .style("stroke", "blue")
    .style("stroke-width",3)
    .attr("fill","None")

    var totalLength3 = path3.node().getTotalLength();

    path3
        .attr("stroke-dasharray", totalLength3 + " " + totalLength3)
        .attr("stroke-dashoffset", totalLength3)
        .transition()
        .delay(800)
            .duration(400)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)

    
    //Calcoliamo il contributo del quarto punto
    var angolo = 234 * Math.PI / 180 
    contributoX4  = contributoX3 - Math.cos(angolo) * value_scaled[3]
    contributoY4 = contributoY3 + Math.sin(angolo) * value_scaled[3]

    //Disegnamo il relativo path
    path4 = svg.append("g")
    .append("path")
    .attr("class", "current_path")
    .attr("d", "M " + contributoX3 +  " " + contributoY3 + " " +" L "+contributoX4+ " "+ contributoY4+"")
    .style("stroke", "magenta")
    .style("stroke-width",3)
    .attr("fill","None")

    var totalLength4 = path4.node().getTotalLength();

    path4
        .attr("stroke-dasharray", totalLength4+ " " + totalLength4)
        .attr("stroke-dashoffset", totalLength4)
        .transition()
        .delay(1200)
            .duration(400)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)


    //Calcoliamo il contributo del quinto punto
    var angolo = 162 * Math.PI / 180 
    contributoX5  = contributoX4 - Math.cos(angolo) * value_scaled[4]
    contributoY5 = contributoY4 + Math.sin(angolo) * value_scaled[4]

    //Disegnamo il relativo path
    path5 = svg.append("g")
    .append("path")
    .attr("class", "current_path")
    .attr("d", "M " + contributoX4 +  " " + contributoY4 + " " +" L "+contributoX5+ " "+ contributoY5+"")
    .style("stroke", "orange")
    .style("stroke-width",3)
    .attr("fill","None")

    var totalLength5 = path5.node().getTotalLength();

    path5
        .attr("stroke-dasharray", totalLength5 + " " + totalLength5)
        .attr("stroke-dashoffset", totalLength5)
        .transition()
        .delay(1600)
            .duration(400)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)


}
//Disegna i singoli punti nello spazio, aggiungendo a loro
//I dati relativi al punto e i vari eventi
function drawDataPoint(data){

   i = 0

   data.forEach(function(d){
       label = d.label
       features = d.features
       coordinate = calcoloCoordinate(features)
       d3.select("g")
         .append("circle")
         .attr("class", "circle"+label)
         .attr("id",i)
         .attr("cx",coordinate[0])
         .attr("cy",coordinate[1])
         .attr("r", 6)
         .datum(d)
         .on("click",function(d){
             d3.selectAll(".value_on_axis").remove()
             drawPath(d)
            })
         .on("mouseover",function(d){
             d3.selectAll(".current_path").remove()
            var cx = parseFloat(event.target.attributes.cx.nodeValue)
            var cy = parseFloat(event.target.attributes.cy.nodeValue)
            showAttributes(d,cx,cy)
            createPointAxis(d)
         })
         .on("mouseout", function(){
             d3.selectAll(".current_text").remove()
             d3.selectAll(".value_on_axis").remove()
         })
        i = i + 1
    })
}

//Funzione che ritorna le coordinate di un punto nello spazio
function calcoloCoordinate(input){
    
    //Calcoliamo i valori scalati dei punti
    keys = Object.keys(input)
    var i = 0
    
    value_scaled = []

    keys.forEach(function(k){
        value = input[k]
        scaled_val = -axisLenght * value
        value_scaled.push(scaled_val)
    })
    
    //Calcoliamo il contributo su ogni asse

    contributoX1 = windowCenterWidth
    contributoY1 = windowCenterHeight + value_scaled[0]

    angolo =  162 * Math.PI / 180 
    contributoX2  = contributoX1 + Math.cos(angolo) * value_scaled[1]
    contributoY2 = contributoY1 + Math.sin(angolo) * value_scaled[1]

    var angolo = 234 * Math.PI / 180 
    contributoX3  = contributoX2 + Math.cos(angolo) * value_scaled[2]
    contributoY3 = contributoY2 + Math.sin(angolo) * value_scaled[2]
    
    var angolo = 234 * Math.PI / 180 
    contributoX4  = contributoX3 - Math.cos(angolo) * value_scaled[3]
    contributoY4 = contributoY3 + Math.sin(angolo) * value_scaled[3]

    var angolo = 162 * Math.PI / 180 
    contributoX5  = contributoX4 - Math.cos(angolo) * value_scaled[4]
    contributoY5 = contributoY4 + Math.sin(angolo) * value_scaled[4]

    return [contributoX5, contributoY5]
}

//Mostra la label del punto passandoci sopra con il mouse
function showAttributes(point, cx,cy){
    svg.append("text")
       .attr("class","current_text")
       .attr("x", cx - 15)
       .attr("y", cy - 15)
       .text("Label : " + point.label)

}

//Genera i valori delle singole features sugli assi quando si passa sopra il punto
//Per visualizzare le sue features direttamente sull'asse
function createPointAxis(input){ 
    
    //Calcoliamo i valori scalati dei punti
    values = input.features
    keys = Object.keys(values)

    var i = 0
    
    value_scaled = []

    keys.forEach(function(k){
        value = values[k]
        scaled_val = -axisLenght * value
        value_scaled.push(scaled_val)
        i = i+1
    })

    //Creiamo i singoli contributi come path verticali 
    //poi li trasliamo e li roteiamo sui singoli assi
    path1 =  svg.append("g")
    .append("path")
    .attr("class", "value_on_axis")
    .attr("d", "M" +0 + " " + 0 + " " +" L 0 "+ value_scaled[0] +"")
    .attr("transform", "translate(" + windowCenterWidth + "," + windowCenterHeight +") rotate(0)")
    .style("stroke", "red")
    .style("stroke-width", "3");

    var totalLength1 = path1.node().getTotalLength();

    path1
        .attr("stroke-dasharray", totalLength1 + " " + totalLength1)
        .attr("stroke-dashoffset", totalLength1)
        .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)

   
    path2 = svg.append("g")
    .append("path")
    .attr("class", "value_on_axis")
    .attr("d", "M" +0 + " " + 0 + " " +" L 0 "+ value_scaled[1] +"")
    .attr("transform", "translate(" + windowCenterWidth + "," + windowCenterHeight +") rotate(72)")
    .style("stroke", "green")
    .style("stroke-width", "3");

    var totalLength2 = path2.node().getTotalLength()

    path2
        .attr("stroke-dasharray", totalLength2 + " " + totalLength2)
        .attr("stroke-dashoffset", totalLength2)
        .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)

    
    path3 = svg.append("g")
    .append("path")
    .attr("class", "value_on_axis")
    .attr("d", "M" +0 + " " + 0 + " " +" L 0 "+ value_scaled[2] +"")
    .attr("transform", "translate(" + windowCenterWidth + "," + windowCenterHeight +") rotate(144)")
    .style("stroke", "blue")
    .style("stroke-width", "3");

    var totalLength3 = path3.node().getTotalLength()

    path3
        .attr("stroke-dasharray", totalLength3 + " " + totalLength3)
        .attr("stroke-dashoffset", totalLength3)
        .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)


    path4 = svg.append("g")
    .append("path")
    .attr("class", "value_on_axis")
    .attr("d", "M" +0 + " " + 0 + " " +" L 0 "+ value_scaled[3] +"")
    .attr("transform", "translate(" + windowCenterWidth + "," + windowCenterHeight +") rotate(216)")
    .style("stroke", "magenta")
    .style("stroke-width", "3");
    var totalLength4= path4.node().getTotalLength();

    path4
        .attr("stroke-dasharray", totalLength4 + " " + totalLength4)
        .attr("stroke-dashoffset", totalLength4)
        .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)


    path5 = svg.append("g")
    .append("path")
    .attr("class", "value_on_axis")
    .attr("d", "M" +0 + " " + 0 + " " +" L 0 "+ value_scaled[4] +"")
    .attr("transform", "translate(" + windowCenterWidth + "," + windowCenterHeight +") rotate(288)")
    .style("stroke", "orange")
    .style("stroke-width", "3");
    var totalLength5 = path5.node().getTotalLength();

    path5
        .attr("stroke-dasharray", totalLength5 + " " + totalLength5)
        .attr("stroke-dashoffset", totalLength5)
        .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)


    

}

//Carichiamo il JSON 
d3.json("data/dataset.json")
	.then(function(data) {
        drawAxes()
        drawDataPoint(data)
   	})
	.catch(function(error) {
		console.log(error); // Some error handling here
  	});

