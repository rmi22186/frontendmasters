//Write a function that takes an argument and returns the argument
var identity = function(x) {
  return x;
};

//write a function that returns 
var add = function(x, y) {
  return (x+y);
};
console.log('add(3,4) = '+ add(3, 4));

var mul = function(x, y) {
  return (x*y);
};
console.log('mul(3,4) = '+ mul(3, 4));

//write a function that takes an argument, and returns a function that returns the argument
var identityf = function(x) {
  return function() {
    return x;
  };
};
console.log('identityf(3) = '+ identity(3));

//write a function that adds from two invocations
var addf = function(x) {
  return function(y) {
    return x+y;
  };
};
console.log('addf(3)(4) = '+ addf(3)(4));

//Write a function that takes a binary function, and makes it callable with two invocations
var applyf = function(func) {
  return function(x) {
    return function(y) {
      return func(x, y);
    };
  };
};

console.log('applyf(mul)(3)(4) = ' + applyf(mul)(3)(4));
console.log('applyf(add)(3)(4) = ' + applyf(add)(3)(4));

//Write a function that takes a function and an argument, and returns a function that can supply a second argument (also called a curry function)

//ex. add3 = curry(add, 3);
// add3(4) // 7

//curry(mul, 5)(6) // 30

var curry = function(func, x) {
  return function(y) {
    return func(x,y);
  };
};

console.log('curry(add,3)(4) = ' + curry(add,3)(4));
console.log('curry(mul,3)(4) = ' + curry(mul,3)(4));

// where is the second function here?

// var alternativeCurry = function(func, first) {
//   return applyf(func)(first);
// };

// console.log('alternativeCurry(add)(3)(4) = ' + alternativeCurry(add)(3)(4));


//without writing any new functions, show three ways to create the inc function
//inc(5) //6
//inc(inc(5)) //7
var inc = addf(1);
console.log('inc addf(5) = ' + inc(5));
var inc = applyf(add)(1);
console.log('inc applyf(add)(1) = ' + inc(5));
var inc = curry(add,1);
console.log('inc curry(add,1) = ' + inc(5));

//write methodize, a function that converts a binary function to a method
//Number.prototype.add = methodize(add); --> (3).add(4) //7

var methodize = function(func) {
  return function(y) {
    return func(this, y);
  };
};

Number.prototype.add = methodize(add);
console.log('(3).add(4) = ' + (3).add(4));

//write demethodize, a function that converts a method to a binary function
//ex. demethodize(Number.prototype.add)(5,6) // 11

var demethodize = function(func){
  return function(that,y) {
    return func.call(that,y);
  };
};
console.log('demethodize(Number.prototype.add)(5,6)) = ' + demethodize(Number.prototype.add)(5,6));


//write a function 'twice' that takes a binary function and returns a unary function that passes its argument to the binary function twice
//ex. var double = twice(add); double(11) //22
//ex. var square = twice(mul); square(11) //121

var twice = function(func) {
  return function(x) {
    return func(x,x);
  };
};

var double = twice(add);
console.log('double(11) = ' + double(11));
var square = twice(mul);
console.log('square(11) = ' + square(11));

//write a function 'composeu' that takes two unary functions and returns a unary function that calls them both
//ex. exmposeu(double, square)(3) //36

var composeu = function(func1, func2) {
  return function(x) {
    return func2(func1(x));
  };
};

console.log('composeu(double,square)(3) = '+ composeu(double,square)(3));

//write a function that takes two binary functions and returns a function that calls them both
//composeb(add,mul)(2, 3, 5) // 25

var composeb = function(func1, func2) {
  return function(x, y, z) {
    return func2(func1(x, y),z);
  };
};

console.log('composeb(add,mul)(2, 3, 5) = '+ composeb(add,mul)(2, 3, 5));

//write a function that allows another function to only be called once
// add_once = once(add)
// add_once(3, 4) // 7
// add_once(3, 4) // throw!

var once = function(func) {
  var called = false;
  return function(){
    if (called) {
      return 'error!';
    } else {
      called = true;
      return func.apply(this,arguments);
    }
  };
};

var add_once = once(add);
console.log('add_once(3, 4) = ' + add_once(3, 4)); // 7
console.log('add_once(3, 4) = ' + add_once(3, 4)); // throw!

//write a factory function that returns two functions that implement an up/down counter

// counter = counterf(10);
// counter.inc(); //11;
// counter.dec(); //10;

var counterf = function(x) {
  return {
    inc: function() {
      return x+=1;
    },
    dec: function() {
      return x-=1;
    }
  };
};


counter = counterf(10);
console.log(counter.inc());
console.log(counter.dec());


var revocable = function(func) {
  var revoked = false;
  return {
    invoke: function(x) {
      if (!this.revoked) {
        return func.apply(this,arguments);
      } else {
        return 'error!';
      }
    },
    revoke: function() {
      this.revoked = true;
    }
  };
};

var temp = revocable('alert');
temp.invoke(7);
temp.revoke();
temp.invoke(8);