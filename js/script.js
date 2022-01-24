const ToLang = document.querySelector("#toLang");
const fromLang = document.querySelector("#fromLang");
const source = document.querySelector("#source");
const result = document.querySelector("#translated");
const reverse = document.querySelector("#reverseBtn");
const btn = document.querySelector("#buttonTranslate");
const btnHistory = document.querySelector("#buttonHistory");
const historySection = document.querySelector(".historyBack");
const historyDisplay = document.querySelector("#tableHistory");
const btnClose = document.querySelector("#btnClose");
const key = "history";

// API dari https://rapidapi.com/dickyagustin/api/text-translator2/ 
const translateFunction = async () => {

	const response = await fetch("https://text-translator2.p.rapidapi.com/translate/", {
		method: "POST",
		"headers": {
			"content-type": "application/x-www-form-urlencoded",
			"x-rapidapi-host": "text-translator2.p.rapidapi.com",
			"x-rapidapi-key": "ecf848d4b1msh7eda06cbb7751b0p110947jsna0a8f861a823"
		},
		"body": new URLSearchParams({
			"source_language": fromLang.value,
			"target_language": toLang.value,
			"text": source.value
		})
	})

	const json = await response.json();
	result.value = json.data.translatedText;
	const history = accesStorage("GET");
	history.push({
		id: Date.now(),
		source: source.value,
		result: json.data.translatedText,
		fromLang: fromLang.value,
		toLang: toLang.value
	});
	accesStorage("SET", history);
	// console.log(history);
	getHistory();
}

// // API dari https://rapidapi.com/dickyagustin/api/text-translator2/ 
const GetLanguage = async () => {
	const result = await fetch("https://text-translator2.p.rapidapi.com/getLanguages", {
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "text-translator2.p.rapidapi.com",
			"x-rapidapi-key": "ecf848d4b1msh7eda06cbb7751b0p110947jsna0a8f861a823"
		}
	})

	const resultJSON = await result.json();
	const languagesArray = resultJSON.data.languages;

	languagesArray.forEach(element => {

		fromLang.innerHTML +=
			` <option value="${element.code}">${element.name}</option> `

		toLang.innerHTML +=
			` <option value="${element.code}">${element.name}</option> `

	});
}



function reverseLanguage() {
	if (fromLang.value != "auto") {
		let toValue = toLang.value;
		let resultValue = result.value;
		let sourceValue = source.value;
		toLang.value = fromLang.value;
		fromLang.value = toValue;
		source.value = resultValue;
		result.value = sourceValue;
	} else {
		swalAlert("error", "auto detection tidak bisa di swap language", "Ada yang Salah");
	}

}

function accesStorage(action, data = null) {
	if (action === "GET") {
		return JSON.parse(localStorage.getItem(key));
	} else if (action === "SET" && data !== null) {
		localStorage.setItem(key, JSON.stringify(data));
	}
}

function getHistory() {
	const history = accesStorage("GET");
	if(history != null && history.length > 10){
		history.shift();
	}
	if (localStorage.getItem(key) === null) {
		historyDisplay.innerHTML = `
		<p>history kosong</p>
		`
	} else {
		historyDisplay.innerHTML = 
		`
		<tr>
            <th>source</th>
            <th>from</th>
            <th>to</th>
            <th>result</th>
        </tr>
		`
		for (i = 0; i < history.length; i++) {
			historyDisplay.innerHTML += `
			<tr>
				<td>${history[i].source}</td>
				<td>${history[i].fromLang}</td>
				<td>${history[i].toLang}</td>
				<td>${history[i].result}</td>
			</tr>
			`
		}

	}
}

getHistory()

btnHistory.addEventListener("click", () => {
	historySection.style.opacity = 1;
	historySection.style.pointerEvents = "auto";
})

btnClose.addEventListener("click", () => {
	historySection.style.opacity = 0;
	historySection.style.pointerEvents = "none";
})

btn.addEventListener("click", () => {
	if (source.value == '') {
		swalAlert("error", "source tidak boleh kosong", "Ada yang Salah");
	} else {
		translateFunction();
	}

})

GetLanguage();

if (accesStorage("GET") === null) {
	accesStorage("SET", []);
}

reverse.addEventListener("click", () => {
	reverseLanguage();
})

window.onbeforeunload = () => {
	localStorage.clear()
}