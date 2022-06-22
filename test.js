let data = {
	"test": {
		"a": "1",
		"b": "2"
	}
}

let psh = {
	"value": {
		"a": "1",
		"b": "2"
	}
}

Object.assign(data ,psh)

console.log(data);