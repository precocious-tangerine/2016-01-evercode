export default class UrlEncoding {
	decodeId(base62String) {
    let charMap = {'e':0,'d':1,'i':2,'s':3,'o':4,'n':5,'g':6,'h':7,'c':8,'j':9, 'k':10,'l':11,'m':12,'f':13,'a':14,'p':15,'q':16,'r':17,'b':18,'t':19,'u':20,'v':21,'w':22,'x':23,'y':24,'z':25,'E':26,'D':27,'I':28,'S':29,'O':30,'N':31,'A':32,'B':33,'C':34,'F':35,'G':36,'H':37,'J':38,'K':39,'L':40,'M':41,'P':42,'Q':43,'R':44,'T':45,'U':46,'V':47,'W':48,'X':49,'Y':50,'Z':51,'0':52,'1':53,'2':54,'3':55,'4':56,'5':57,'6':58,'7':59,'8':60,'9':61,};
    let base62Chunks = [];
    let id = '';
    for (let i = 0; i < base62String.length; i += 8){
      if(base62String[i + 8]){
        base62Chunks.push(base62String.slice(i, i + 8));
      } else {
        base62Chunks.push(base62String.slice(i));
      }
    }                      
    for (let i = 0; i < base62Chunks.length; i++){
      let n = 0;
      for (let j = 0; j < base62Chunks[i].length ; j++) {
        let val = charMap[base62Chunks[i][base62Chunks[i].length - (1+j)]];
        n += (val) * Math.pow(62, j);
      }
      id = n.toString(16) + id;  
    }
    return id;

	}
	shorten(hexString) {
	  let charSet = ['e','d','i','s','o','n','g','h','c','j','k','l','m','f','a','p','q','r','b','t','u','v','w','x','y','z','E','D','I','S','O','N','A','B','C','F','G','H','J','K','L','M','P','Q','R','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9','#','$'];
	  let hexChunks = [];
	  let result = '';

	  for (let i = 0; i < hexString.length; i += 12){
	    if(hexString[i + 12]) {
	      hexChunks.push(hexString.slice(i, i + 12));
	    } else {
	      hexChunks.push(hexString.slice(i));
	    }
	  }

	  for (let j = 0; j < hexChunks.length; j++) {
	    let n = parseInt(hexChunks[j],16);
	    while (n > 0) {
	      let charCode = n % 62;
	      result = charSet[charCode] + result;
	      n = (n-charCode) /62;
	    }
	  }

	 return result;
	}

}