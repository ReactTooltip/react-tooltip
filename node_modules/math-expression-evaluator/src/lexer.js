'use strict'
var Mexp = require('./math_function.js')
function inc(arr, val) {
	for (var i = 0; i < arr.length; i++) {
		arr[i] += val
	}
	return arr
}
var tokens = [
	{ token: 'sin', show: 'sin', type: 0, value: Mexp.math.sin },
	{ token: 'cos', show: 'cos', type: 0, value: Mexp.math.cos },
	{ token: 'tan', show: 'tan', type: 0, value: Mexp.math.tan },
	{ token: 'pi', show: '&pi;', type: 3, value: 'PI' },
	{ token: '(', show: '(', type: 4, value: '(' },
	{ token: ')', show: ')', type: 5, value: ')' },
	{ token: 'P', show: 'P', type: 10, value: Mexp.math.P },
	{ token: 'C', show: 'C', type: 10, value: Mexp.math.C },
	{ token: ' ', show: ' ', type: 14, value: ' '.anchor },
	{ token: 'asin', show: 'asin', type: 0, value: Mexp.math.asin },
	{ token: 'acos', show: 'acos', type: 0, value: Mexp.math.acos },
	{ token: 'atan', show: 'atan', type: 0, value: Mexp.math.atan },
	{ token: '7', show: '7', type: 1, value: '7' },
	{ token: '8', show: '8', type: 1, value: '8' },
	{ token: '9', show: '9', type: 1, value: '9' },
	{ token: 'int', show: 'Int', type: 0, value: Math.floor },
	{ token: 'cosh', show: 'cosh', type: 0, value: Mexp.math.cosh },
	{ token: 'acosh', show: 'acosh', type: 0, value: Mexp.math.acosh },
	{ token: 'ln', show: ' ln', type: 0, value: Math.log },
	{ token: '^', show: '^', type: 10, value: Math.pow },
	{ token: 'root', show: 'root', type: 0, value: Math.sqrt },
	{ token: '4', show: '4', type: 1, value: '4' },
	{ token: '5', show: '5', type: 1, value: '5' },
	{ token: '6', show: '6', type: 1, value: '6' },
	{ token: '/', show: '&divide;', type: 2, value: Mexp.math.div },
	{ token: '!', show: '!', type: 7, value: Mexp.math.fact },
	{ token: 'tanh', show: 'tanh', type: 0, value: Mexp.math.tanh },
	{ token: 'atanh', show: 'atanh', type: 0, value: Mexp.math.atanh },
	{ token: 'Mod', show: ' Mod ', type: 2, value: Mexp.math.mod },
	{ token: '1', show: '1', type: 1, value: '1' },
	{ token: '2', show: '2', type: 1, value: '2' },
	{ token: '3', show: '3', type: 1, value: '3' },
	{ token: '*', show: '&times;', type: 2, value: Mexp.math.mul },
	{ token: 'sinh', show: 'sinh', type: 0, value: Mexp.math.sinh },
	{ token: 'asinh', show: 'asinh', type: 0, value: Mexp.math.asinh },
	{ token: 'e', show: 'e', type: 3, value: 'E' },
	{ token: 'log', show: ' log', type: 0, value: Mexp.math.log },
	{ token: '0', show: '0', type: 1, value: '0' },
	{ token: '.', show: '.', type: 6, value: '.' },
	{ token: '+', show: '+', type: 9, value: Mexp.math.add },
	{ token: '-', show: '-', type: 9, value: Mexp.math.sub },
	{ token: ',', show: ',', type: 11, value: ',' },
	{ token: 'Sigma', show: '&Sigma;', type: 12, value: Mexp.math.sigma },
	{ token: 'n', show: 'n', type: 13, value: 'n' },
	{ token: 'Pi', show: '&Pi;', type: 12, value: Mexp.math.Pi },
	{ token: 'pow', show: 'pow', type: 8, value: Math.pow, numberOfArguments: 2 },
	{ token: '&', show: '&', type: 9, value: Mexp.math.and },
]
var preced = {
	0: 11,
	1: 0,
	2: 3,
	3: 0,
	4: 0,
	5: 0,
	6: 0,
	7: 11,
	8: 11,
	9: 1,
	10: 10,
	11: 0,
	12: 11,
	13: 0,
	14: -1,
	15: 11, // will be filtered after lexer
} // stores precedence by types
for (var i = 0; i < tokens.length; i++) {
	tokens[i].precedence = preced[tokens[i].type]
}
var type0 = {
	0: true,
	1: true,
	3: true,
	4: true,
	6: true,
	8: true,
	9: true,
	12: true,
	13: true,
	14: true,
	15: true,
} // type2:true,type4:true,type9:true,type11:true,type21:true,type22
var type1 = {
	0: true,
	1: true,
	2: true,
	3: true,
	4: true,
	5: true,
	6: true,
	7: true,
	8: true,
	9: true,
	10: true,
	11: true,
	12: true,
	13: true,
	15: true,
} // type3:true,type5:true,type7:true,type23
var type1Asterick = {
	0: true,
	3: true,
	4: true,
	8: true,
	12: true,
	13: true,
	15: true,
}
var empty = {}
var type3Asterick = {
	0: true,
	1: true,
	3: true,
	4: true,
	6: true,
	8: true,
	12: true,
	13: true,
	15: true,
} // type_5:true,type_7:true,type_23
var type6 = {
	1: true,
}
var newAr = [
	[],
	[
		'1',
		'2',
		'3',
		'7',
		'8',
		'9',
		'4',
		'5',
		'6',
		'+',
		'-',
		'*',
		'/',
		'(',
		')',
		'^',
		'!',
		'P',
		'C',
		'e',
		'0',
		'.',
		',',
		'n',
		' ',
		'&',
	],
	['pi', 'ln', 'Pi'],
	['sin', 'cos', 'tan', 'Del', 'int', 'Mod', 'log', 'pow'],
	['asin', 'acos', 'atan', 'cosh', 'root', 'tanh', 'sinh'],
	['acosh', 'atanh', 'asinh', 'Sigma'],
]

function match(str1, str2, i, x) {
	for (var f = 0; f < x; f++) {
		if (str1[i + f] !== str2[f]) {
			return false
		}
	}
	return true
}
Mexp.tokenTypes = {
	FUNCTION_WITH_ONE_ARG: 0,
	NUMBER: 1,
	BINARY_OPERATOR_HIGH_PRECENDENCE: 2,
	CONSTANT: 3,
	OPENING_PARENTHESIS: 4,
	CLOSING_PARENTHESIS: 5,
	DECIMAL: 6,
	POSTFIX_FUNCTION_WITH_ONE_ARG: 7,
	FUNCTION_WITH_N_ARGS: 8,
	BINARY_OPERATOR_LOW_PRECENDENCE: 9,
	BINARY_OPERATOR_PERMUTATION: 10,
	COMMA: 11,
	EVALUATED_FUNCTION: 12,
	EVALUATED_FUNCTION_PARAMETER: 13,
	SPACE: 14,
}
/**
  
  0 : function with syntax function_name(Maths_exp)
  1 : numbers
  2 : binary operators like * / Mod left associate and same precedence
  3 : Math constant values like e,pi,Cruncher ans
  4 : opening bracket
  5 : closing bracket
  6 : decimal
  7 : function with syntax (Math_exp)function_name
  8: function with syntax function_name(Math_exp1,Math_exp2)
  9 : binary operator like +,-
  10: binary operator like P C or ^
  11: ,
  12: function with , seperated three parameters and third parameter is a string that will be mexp string
  13: variable of Sigma function
 */
Mexp.addToken = function (newTokens) {
	for (var i = 0; i < newTokens.length; i++) {
		var x = newTokens[i].token.length
		var temp = -1
		if (newTokens[i].type === Mexp.tokenTypes.FUNCTION_WITH_N_ARGS && newTokens[i].numberOfArguments === undefined) {
			newTokens[i].numberOfArguments = 2
		}

		// newAr is a specially designed data structure index of 1d array = length of tokens
		newAr[x] = newAr[x] || []
		for (var y = 0; y < newAr[x].length; y++) {
			if (newTokens[i].token === newAr[x][y]) {
				temp = indexOfToken(newAr[x][y], tokens)
				break
			}
		}
		if (temp === -1) {
			tokens.push(newTokens[i])
			newTokens[i].precedence = preced[newTokens[i].type]
			if (newAr.length <= newTokens[i].token.length) {
				newAr[newTokens[i].token.length] = []
			}
			newAr[newTokens[i].token.length].push(newTokens[i].token)
		} else {
			// overwrite
			tokens[temp] = newTokens[i]
			newTokens[i].precedence = preced[newTokens[i].type]
		}
	}
}

function indexOfToken(key, tokens) {
	for (var search = 0; search < tokens.length; search++) {
		if (tokens[search].token === key) return search
	}
	return -1
}
function tokenize(string) {
	var nodes = []
	var length = string.length
	var key, x, y
	for (var i = 0; i < length; i++) {
		if (i < length - 1 && string[i] === ' ' && string[i + 1] === ' ') {
			continue
		}
		key = ''
		for (x = string.length - i > newAr.length - 2 ? newAr.length - 1 : string.length - i; x > 0; x--) {
			if (newAr[x] === undefined) continue
			for (y = 0; y < newAr[x].length; y++) {
				if (match(string, newAr[x][y], i, x)) {
					key = newAr[x][y]
					y = newAr[x].length
					x = 0
				}
			}
		}
		i += key.length - 1
		if (key === '') {
			throw new Mexp.Exception("Can't understand after " + string.slice(i))
		}
		nodes.push(tokens[indexOfToken(key, tokens)])
	}
	return nodes
}

var changeSignObj = {
	value: Mexp.math.changeSign,
	type: 0,
	pre: 21,
	show: '-',
}
var closingParObj = {
	value: ')',
	show: ')',
	type: 5,
	pre: 0,
}
var openingParObj = {
	value: '(',
	type: 4,
	pre: 0,
	show: '(',
}
Mexp.lex = function (inp, tokens) {
	'use strict'

	var str = [openingParObj]

	var ptc = [] // Parenthesis to close at the beginning is after one token
	var inpStr = inp
	var allowed = type0
	var bracToClose = 0
	var asterick = empty
	var prevKey = ''
	var i
	if (typeof tokens !== 'undefined') {
		Mexp.addToken(tokens)
	}
	var obj = {}
	var nodes = tokenize(inpStr)
	for (i = 0; i < nodes.length; i++) {
		var node = nodes[i]
		if (node.type === 14) {
			if (
				i > 0 &&
				i < nodes.length - 1 &&
				nodes[i + 1].type === 1 &&
				(nodes[i - 1].type === 1 || nodes[i - 1].type === 6)
			) {
				throw new Mexp.Exception('Unexpected Space')
			}
			continue
		}
		var cToken = node.token
		var cType = node.type
		var cEv = node.value
		var cPre = node.precedence
		var cShow = node.show
		var pre = str[str.length - 1]
		var j
		for (j = ptc.length; j--; ) {
			// loop over ptc
			if (ptc[j] === 0) {
				if ([0, 2, 3, 4, 5, 9, 11, 12, 13].indexOf(cType) !== -1) {
					if (allowed[cType] !== true) {
						throw new Mexp.Exception(cToken + ' is not allowed after ' + prevKey)
					}
					str.push(closingParObj)
					allowed = type1
					asterick = type3Asterick
					ptc.pop()
				}
			} else break
		}
		if (allowed[cType] !== true) {
			throw new Mexp.Exception(cToken + ' is not allowed after ' + prevKey)
		}
		if (asterick[cType] === true) {
			cType = 2
			cEv = Mexp.math.mul
			cShow = '&times;'
			cPre = 3
			i = i - 1
		}
		obj = {
			value: cEv,
			type: cType,
			pre: cPre,
			show: cShow,
			numberOfArguments: node.numberOfArguments,
		}
		if (cType === 0) {
			allowed = type0
			asterick = empty
			inc(ptc, 2)
			str.push(obj)
			if (nodes[i + 1].type !== 4) {
				str.push(openingParObj)
				ptc.push(2)
			}
			// bracToClose++
		} else if (cType === 1) {
			if (pre.type === 1) {
				pre.value += cEv
				inc(ptc, 1)
			} else {
				str.push(obj)
			}
			allowed = type1
			asterick = type1Asterick
		} else if (cType === 2) {
			allowed = type0
			asterick = empty
			inc(ptc, 2)
			str.push(obj)
		} else if (cType === 3) {
			// constant
			str.push(obj)
			allowed = type1
			asterick = type3Asterick
		} else if (cType === 4) {
			inc(ptc, 1)
			bracToClose++
			allowed = type0
			asterick = empty
			str.push(obj)
		} else if (cType === 5) {
			if (!bracToClose) {
				throw new Mexp.Exception('Closing parenthesis are more than opening one, wait What!!!')
			}
			bracToClose--
			allowed = type1
			asterick = type3Asterick
			str.push(obj)
			inc(ptc, 1)
		} else if (cType === 6) {
			if (pre.hasDec) {
				throw new Mexp.Exception('Two decimals are not allowed in one number')
			}
			if (pre.type !== 1) {
				pre = {
					value: 0,
					type: 1,
					pre: 0,
				} // pre needs to be changed as it will the last value now to be safe in later code
				str.push(pre)
				// inc(ptc, 1)
			}
			allowed = type6
			inc(ptc, 1)
			asterick = empty
			pre.value += cEv
			pre.hasDec = true
		} else if (cType === 7) {
			allowed = type1
			asterick = type3Asterick
			inc(ptc, 1)
			str.push(obj)
		}
		if (cType === 8) {
			allowed = type0
			asterick = empty
			inc(ptc, node.numberOfArguments + 2)
			str.push(obj)
			// str.push(openingParObj)
			if (nodes[i + 1].type !== 4) {
				str.push(openingParObj)
				ptc.push(node.numberOfArguments + 2)
			}
		} else if (cType === 9) {
			if (pre.type === 9) {
				if (pre.value === Mexp.math.add) {
					pre.value = cEv
					pre.show = cShow
					inc(ptc, 1)
				} else if (pre.value === Mexp.math.sub && cShow === '-') {
					pre.value = Mexp.math.add
					pre.show = '+'
					inc(ptc, 1)
				}
			} else if (pre.type !== 5 && pre.type !== 7 && pre.type !== 1 && pre.type !== 3 && pre.type !== 13) {
				// changesign only when negative is found
				if (cToken === '-') {
					// do nothing for + token
					// don't add with the above if statement as that will run the else statement of parent if on Ctoken +
					allowed = type0
					asterick = empty
					inc(ptc, 2).push(2)
					str.push(changeSignObj)
					str.push(openingParObj)
				}
			} else {
				str.push(obj)
				inc(ptc, 2)
			}
			allowed = type0
			asterick = empty
		} else if (cType === 10) {
			allowed = type0
			asterick = empty
			inc(ptc, 2)
			str.push(obj)
		} else if (cType === 11) {
			allowed = type0
			asterick = empty
			str.push(obj)
		} else if (cType === 12) {
			allowed = type0
			asterick = empty
			inc(ptc, 6)
			str.push(obj)
			if (nodes[i + 1].type !== 4) {
				str.push(openingParObj)
				ptc.push(6)
			}
		} else if (cType === 13) {
			allowed = type1
			asterick = type3Asterick
			str.push(obj)
		}

		inc(ptc, -1)
		prevKey = cToken
	}
	for (j = ptc.length; j--; ) {
		// loop over ptc
		str.push(closingParObj)
	}
	if (allowed[5] !== true) {
		throw new Mexp.Exception('complete the expression')
	}
	while (bracToClose--) {
		str.push(closingParObj)
	}

	str.push(closingParObj)
	//        console.log(str);
	return new Mexp(str)
}
module.exports = Mexp
