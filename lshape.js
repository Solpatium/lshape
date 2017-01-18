"use strict"

// In case of nodejs
if (typeof require == 'function') {
  var math = require('math.js');
}

var matrice,
    pointsCords,
    pointsValue=[[2/3,-1/6,-1/3,-1/6],[-1/6,2/3,-1/6,-1/3],[-1/3,-1/6,2/3,-1/6], [-1/6,-1/3,-1/6,2/3]];

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  plusX(x) {
    return new Point(this.x+x, this.y);
  }

  plusY(y) {
    return new Point(this.x, this.y+y);
  }
}

function g(point) {
  var alfa = Math.atan(point.y/point.x);
  var r = Math.sqrt(point.x*point.x+point.y*point.y);
  var result = Math.pow(r,(2/3))* Math.pow(Math.sin(alfa+(Math.PI/2)),(2/3));
  return result;
}

function lShape(n) {
  var pointsCount = 3*n*n+4*n+1; // 3(n+1)^2 -2(n+1)

  // Create a matrice of points filled with 0
  matrice = new Array(pointsCount);
  for( let i=0; i<pointsCount; i++ ) {
    matrice[i] = new Array(pointsCount).fill(0);
  }

  // Create an array of point positions
  pointsCords = new Array(pointsCount);

  // Itearate throught all squares above
  // [*][*]
  //    [ ]
  var rowLength = (2*n+1);
  var inc = 1/n;
  var points = new Array(4),
      upLeft, upRight, downLeft, downRight,
      x=-1, y=-1;

  for( let i=0; i<2*n*n; i++) {
    points[3] = upLeft = (i%(2*n))+Math.floor(i/2/n)*rowLength;
    points[2] = upRight = upLeft+1;
    points[0] = downLeft = upLeft+rowLength;
    points[1] = downRight = downLeft+1;

    mapPointsToMatrice(points);

    // Set coords
    pointsCords[upLeft] = new Point(x,y);
    pointsCords[upRight] = new Point(x+inc, y);
    pointsCords[downLeft] = new Point(x, y+inc);
    pointsCords[downRight] = new Point(x+inc, y+inc);

    // If it is last item in a row
    if( i%(2*n) == 2*n-1 ) {
      x=-1;
      y+=inc;
    } else {
      x+=inc;
    }
  }

  // var LShape = { solve: lshape };

  // Iterate throught all squares below
  // [ ][ ]
  //    [*]
  x = 0;
  y = 0;
  var beginning = downRight - n;
  for( let i=0; i<n*n; i++ ) {
    points[3] = upLeft = beginning+ (i%n)+Math.floor(i/n)*(n+1);
    points[2] = upRight = upLeft+1;
    points[0] = downLeft = upLeft+(n+1);
    points[1] = downRight = downLeft+1;

    // Set coords
    pointsCords[upLeft] = new Point(x,y);
    pointsCords[upRight] = new Point(x+inc, y);
    pointsCords[downLeft] = new Point(x, y+inc);
    pointsCords[downRight] = new Point(x+inc, y+inc);

    mapPointsToMatrice(points);


    // If it is last item in a row
    if( i%n == n-1 ) {
      x= 0;
      y += inc;
    } else {
      x += inc;
    }
  }

  // print2dArray(matrice);

  // Clear the right rows and add 1
  var verticalZeroLine = n*(2*n+1)
  for( let i=0; i<=n; i++ ) clearRow(i+verticalZeroLine);
  var horizontalZeroLine = n*(2*n+1)+n;
  for( let i=0; i<=n; i++ ) {
    clearRow(i+verticalZeroLine);
    clearRow(i*(n+1)+horizontalZeroLine);
  }

  // Right side
  var rightSide = getRightSide(n, pointsCount);
  var solve = math.lusolve(matrice, rightSide);

  var Z = new Array(pointsCount);
  // math.js wraps values into arrays, we must unwrap them
  solve.forEach(function (value, index, matrix) {
    Z[index] = value[0];
  });
  var X = new Array(pointsCount);
  var Y = new Array(pointsCount);
  for( let i=0; i<pointsCount; i++ ) {
    X[i] = pointsCords[i].x;
    Y[i] = pointsCords[i].y;
  }
  return {x: X, y: Y, z: Z};
}

function getRightSide(n, pointsCount) {
  var rightSide = new Array(pointsCount).fill(0);
  var len = 1/n;
  var mid = len/2;
  var i = 1;
  const lineLength = (2*n+1);
  var prevPoint = new Point(-1, 0 - mid),
      point = prevPoint.plusY(-len);
  while( point.y > -1 ) { // Left side
    rightSide[lineLength*(n-i)] = len*(g(prevPoint)+g(point))/2;
    // console.log( lineLength*(n-i), ": ", len*(g(prevPoint)+g(point))/2);
    prevPoint = point;
    point = point.plusY(-len);
    i++;
  }
  point = new Point(-1+mid, -1);
  i = 0;
  while( point.x < 1) { // Top side
    rightSide[i] = len*(g(prevPoint)+g(point))/2;
    // console.log( i, ": ", len*(g(prevPoint)+g(point))/2);
    prevPoint = point;
    point = point.plusX(len);
    i++;
  }
  point = new Point(1, -1+mid);
  i = 1;
  while( prevPoint.y < 0) { // Right upper side
    rightSide[lineLength*i-1] = len*(g(prevPoint)+g(point))/2;
    // console.log( lineLength*i-1, ": ", len*(g(prevPoint)+g(point))/2);
    prevPoint = point;
    point = point.plusY(len);
    i++;
  }
  i = 1;
  while( point.y < 1) { // Right down side
    rightSide[lineLength*(n+1)-1 + i*(n+1)] = len*(g(prevPoint)+g(point))/2;
    // console.log( lineLength*(n+1)-1 + i*(n+1), ": ", len*(g(prevPoint)+g(point))/2);
    prevPoint = point;
    point = point.plusY(len);
    i++;
  }
  point = new Point(1-mid, 1);
  i = 1;
  while( point.x > 0 ) { // Down side
    rightSide[pointsCount-i] = len*(g(prevPoint)+g(point))/2;
    // console.log( pointsCount-i, ": ", len*(g(prevPoint)+g(point))/2);
    prevPoint = point;
    point = point.plusX(-len);
    i++;
  }
  return rightSide;
}

function clearRow( row ) {
  for( let i=0; i<matrice.length; i++ ) matrice[row][i] = 0;
  matrice[row][row] = 1;
}

function mapPointsToMatrice( points ) {
  for( let i=0; i<points.length; i++ ) {
    for( let j=0; j<points.length; j++ ) {
      matrice[points[i]][points[j]] += pointsValue[i][j];
    }
  }
}

function print2dArray( array ) {
  var string = "";

  function times(what, n) {
    while( n-->0 ) {
      string += what;
    }
  }

  function nl() {
    string += '\n';
  }

  for( let i=0; i<array.length; i++ ) {
    times('-', array.length*6+1);
    nl();
    string+='|';
    for( let j=0; j<array[i].length; j++ ) {
      string += (array[i][j] >= 0?" ":"")+ array[i][j].toFixed(2) + '|';
    }
    nl();
  }
  times('-', array.length*6+1);
  console.log( string );
}
