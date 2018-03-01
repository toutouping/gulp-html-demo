//设置图片  
node.append("svg:image")  
.attr("class", "circle")  
.attr("xlink:href", "http://localhost:8080/spring/imgs/myself.PNG")  
.attr("x", "-8px")  
.attr("y", "-8px")  
.attr("width", "16px")  
.attr("height", "16px");  
//设置提示  
node.append("svg:title")  
.text(function(d) { return d.name; });  