'use strict';

const deep = require('deep-diff');

let lhsLowDiff, lhsLowMedDiff, lhsMedDiff, lhsHighMedDiff, lhsHighDiff,
    rhsLowDiff, rhsLowMedDiff, rhsMedDiff, rhsHighMedDiff, rhsHighDiff,
    lowDiffTotal, lowMedDiffTotal, medDiffTotal, highMedDiffTotal, highDiffTotal


let resetParams = function(){
  lowDiffTotal = 0
  lowMedDiffTotal = 0
  medDiffTotal = 0
  highMedDiffTotal = 0
  highDiffTotal = 0
}


let findDiff = function(ref, unknown) {
  let lhs = ref
  let rhs = unknown

  let lhsDiff = []
  let rhsDiff = []

  resetParams();

  for ( let i = 0; i < 200; i++ ) {

    rhsLowDiff = Math.abs(rhs[i]['measurement'][0] - rhs[i + 1]['measurement'][0]);
    rhsLowMedDiff = Math.abs(rhs[i]['measurement'][1] - rhs[i + 1]['measurement'][1]);
    rhsMedDiff = Math.abs(rhs[i]['measurement'][2] - rhs[i + 1]['measurement'][2]);
    rhsHighMedDiff = Math.abs(rhs[i]['measurement'][3] - rhs[i + 1]['measurement'][3]);
    rhsHighDiff = Math.abs(rhs[i]['measurement'][4] - rhs[i + 1]['measurement'][4]);

    lhsLowDiff = Math.abs(lhs[i]['measurement'][0] - lhs[i + 1]['measurement'][0]);
    lhsLowMedDiff = Math.abs(lhs[i]['measurement'][1] - lhs[i + 1]['measurement'][1]);
    lhsMedDiff = Math.abs(lhs[i]['measurement'][2] - lhs[i + 1]['measurement'][2]);
    lhsHighMedDiff = Math.abs(lhs[i]['measurement'][3] - lhs[i + 1]['measurement'][3]);
    lhsHighDiff = Math.abs(lhs[i]['measurement'][4] - lhs[i + 1]['measurement'][4]);

    lowDiffTotal += (rhsLowDiff - lhsLowDiff)
    lowMedDiffTotal += (rhsLowMedDiff - lhsLowMedDiff)
    medDiffTotal += (rhsMedDiff - lhsMedDiff)
    highMedDiffTotal += (rhsHighMedDiff - lhsHighMedDiff)
    highDiffTotal += (rhsHighDiff - lhsHighDiff)

  };


  console.log([(lowDiffTotal/200), (lowMedDiffTotal/200), (medDiffTotal/200), (highMedDiffTotal/200), (highDiffTotal/200)]);
  return [(lowDiffTotal/200), (lowMedDiffTotal/200), (medDiffTotal/200), (highMedDiffTotal/200), (highDiffTotal/200)];
}

module.exports = findDiff;
