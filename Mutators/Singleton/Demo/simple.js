   var Counter = new Class({
         Singleton : true,
 
        initialize : function(){
              this.count = 0;
        },
 
        hit : function(){
             return ++this.count;
       }
  });
 
var a = new Counter();
a.hit(); // returns 1
a.hit(); // return 2
var b = new Counter();
b.hit(); // return 3 !!!