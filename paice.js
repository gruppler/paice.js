(function(){
	var NOTAPPLY = -1,
		STOP = 0,
		INTACT = 1,
		CONTINUE = 2,
		CONTINT = 3,
		PROTECT = 4,
		PROTINT = 5,
		rules = {
			a: [
				["ia",		"", 	INTACT],
				["a",		"", 	INTACT]
			],
			b: [
				["bb",		"b", 	STOP]
			],
			c: [
				["ytic",	"ys", 	STOP],
				["ic",		"", 	CONTINUE],
				["nc",		"nt", 	CONTINUE]
			],
			d: [
				["dd",		"d", 	STOP],
				["ied",		"y", 	CONTINUE],
				["ceed",	"cess", STOP],
				["eed",		"ee", 	STOP],
				["ed",		"", 	CONTINUE],
				["hood",	"", 	CONTINUE]
			],
			e: [
				["e",		"", 	CONTINUE]
			],
			f: [
				["lief",	"liev", STOP],
				["if",		"", 	CONTINUE]
			],
			g: [
				["ing",		"", 	CONTINUE],
				["iag",		"y", 	STOP],
				["ag",		"", 	CONTINUE],
				["gg",		"g", 	STOP]
			],
			h: [
				["th",		"", 	INTACT],
				["guish",	"ct", 	STOP],
				["ish",		"", 	CONTINUE]
			],
			i: [
				["i",		"", 	INTACT],
				["i",		"y", 	CONTINUE]
			],
			j: [
				["ij",		"id", 	STOP],
				["fuj",		"fus", 	STOP],
				["uj",		"ud", 	STOP],
				["oj",		"od", 	STOP],
				["hej",		"her", 	STOP],
				["verj",	"vert", STOP],
				["misj",	"mit", 	STOP],
				["nj",		"nd", 	STOP],
				["j",		"s", 	STOP]
			],
			l: [
				["ifiabl",	"", 	STOP],
				["iabl",	"y", 	STOP],
				["abl",		"", 	CONTINUE],
				["ibl",		"", 	STOP],
				["bil",		"bl", 	CONTINUE],
				["cl",		"c", 	STOP],
				["iful",	"y", 	STOP],
				["ful",		"", 	CONTINUE],
				["ul",		"", 	STOP],
				["ial",		"", 	CONTINUE],
				["ual",		"", 	CONTINUE],
				["al",		"", 	CONTINUE],
				["ll",		"l", 	STOP]
			],
			m: [
				["ium",		"", 	STOP],
				["um",		"", 	INTACT],
				["ism",		"", 	CONTINUE],
				["mm",		"m", 	STOP]
			],
			n: [
				["sion",	"j", 	CONTINUE],
				["xion",	"ct", 	STOP],
				["ion",		"", 	CONTINUE],
				["ian",		"", 	CONTINUE],
				["an",		"", 	CONTINUE],
				["een",		"", 	PROTECT],
				["en",		"", 	CONTINUE],
				["nn",		"n", 	STOP]
			],
			p: [
				["ship",	"", 	CONTINUE],
				["pp",		"p", 	STOP]
			],
			r: [
				["er",		"", 	CONTINUE],
				["ear",		"", 	PROTECT],
				["ar",		"", 	STOP],
				["ior",		"", 	CONTINUE],
				["or",		"", 	CONTINUE],
				["ur",		"", 	CONTINUE],
				["rr",		"r", 	STOP],
				["tr",		"t", 	CONTINUE],
				["ier",		"y", 	CONTINUE]
			],
			s: [
				["ies",		"y", 	CONTINUE],
				["sis",		"s", 	STOP],
				["is",		"", 	CONTINUE],
				["ness",	"", 	CONTINUE],
				["ss",		"", 	PROTECT],
				["ous",		"", 	CONTINUE],
				["us",		"", 	INTACT],
				["s",		"", 	CONTINT],
				["s",		"", 	STOP]
			],
			t: [
				["plicat",	"ply", 	STOP],
				["at",		"", 	CONTINUE],
				["ment",	"", 	CONTINUE],
				["ent",		"", 	CONTINUE],
				["ant",		"", 	CONTINUE],
				["ript",	"rib", 	STOP],
				["orpt",	"orb", 	STOP],
				["duct",	"duc", 	STOP],
				["sumpt",	"sum", 	STOP],
				["cept",	"ceiv", STOP],
				["olut",	"olv", 	STOP],
				["sist",	"", 	PROTECT],
				["ist",		"", 	CONTINUE],
				["tt",		"t", 	STOP]
			],
			u: [
				["iqu",		"", 	STOP],
				["ogu",		"og", 	STOP]
			],
			v: [
				["siv",		"j", 	CONTINUE],
				["eiv",		"", 	PROTECT],
				["iv",		"", 	CONTINUE]
			],
			y: [
				["bly",		"bl", 	CONTINUE],
				["ily",		"y", 	CONTINUE],
				["ply",		"", 	PROTECT],
				["ly",		"", 	CONTINUE],
				["ogy",		"og", 	STOP],
				["phy",		"ph", 	STOP],
				["omy",		"om", 	STOP],
				["opy",		"op", 	STOP],
				["ity",		"", 	CONTINUE],
				["ety",		"", 	CONTINUE],
				["lty",		"l", 	STOP],
				["istry",	"", 	STOP],
				["ary",		"", 	CONTINUE],
				["ory",		"", 	CONTINUE],
				["ify",		"", 	STOP],
				["ncy",		"nt", 	CONTINUE],
				["acy",		"", 	CONTINUE]
			],
			z: [
				["iz",		"", 	CONTINUE],
				["yz",		"ys", 	STOP]
			]
		},

		vowel = /^[aeiouy]$/i,
		isVowel = function(letter){
			return vowel.test(letter);
		},
		acceptable = function(word){
			return (word.length > 3 ||
				word.length >= 2 && isVowel(word[0]) && !isVowel(word[1]) ||
				word.length >= 3 && !isVowel(word[0]) && (isVowel(word[1]) || isVowel(word[2]))
			);
		},
		ruleWalk = function(word, isIntact){
			var lastLetter = word.stem.substr(-1, 1).toLowerCase();
			if(lastLetter in rules){
				for(var i = 0; i < rules[lastLetter].length; i++){
					var result = applyRule(word, rules[lastLetter][i], isIntact);
					if(result != NOTAPPLY){
						return result;
					}
				}
			}
			return STOP;
		},
		applyRule = function(word, rule, isIntact){
			if(
				(isIntact || !(rule[2] & INTACT))
				&& word.stem.substr(-rule[0].length, rule[0].length).toLowerCase() == rule[0]
			){
				if(rule[2] & PROTECT){
					return STOP;
				}else{
					var testWord = word.stem.substr(0, word.stem.length - rule[0].length) + rule[1];
					if(!acceptable(testWord)){
						return STOP;
					}else{
						word.stem = testWord;
						return (rule[2] & CONTINUE) ? CONTINUE : STOP;
					}
				}
			}
			return NOTAPPLY;
		};

	String.prototype.getStem = function(){
		this.stem = this.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, '').replace(/(n't|'s|'m|'re|'ve|'d|'ll)$/i, '');
		if(/[A-Za-z]/.test(this.stem[0]) && acceptable(this.stem)){
			if(ruleWalk(this, true) != STOP){
				while(ruleWalk(this, false) != STOP){}
			}
		}
		return this.stem;
	};

})();