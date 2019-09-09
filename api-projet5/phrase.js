let sujet = null;

function genererLesPhrases(phrases) {
	let tabDePhrases = [];
	phrases.forEach(objetPhrase => {
		let maPhrase = "";
		let compteurdePhrases = objetPhrase.numerodelaPhrase;
		if (compteurdePhrases === 1) {
			maPhrase += phraseInitiale(objetPhrase.phrase);
		}
		if (compteurdePhrases > 1 && compteurdePhrases < 4) {
			maPhrase += situationInitiale(objetPhrase.phrase);
		}
		if (compteurdePhrases === 4) {
			maPhrase += elementDeclancheur(objetPhrase.phrase);
		}
		if (compteurdePhrases > 4) {
			maPhrase += elementAction(objetPhrase.phrase, compteurdePhrases);
		}

		tabDePhrases.push(maPhrase);
	});
	return tabDePhrases;
}

function phraseInitiale(phrase) {
	sujet = phrase.filter(objetMot => objetMot.type === "sujet")[0];
	let determinant = sujet.genre === "2" ? "une " : "un ";
	phrase.shift();

	let maPhrase = "Il était une fois " + determinant + sujet.mot + " ";

	maPhrase += phrase
		.map(element => {
			if (typeof element.mot === "string") {
				return element.mot;
			}
			let index = accordercomplement(sujet);
			return element.mot[index];
		})
		.join(" ");
	return maPhrase + ".";
}

function situationInitiale(tabPhrase) {
	let maPhrase = "";
	let determinant = sujet.genre === "2" ? "La " : "Le ";
	let pour = false;
	maPhrase += determinant + sujet.mot + " ";

	for (let j = 0; j < tabPhrase.length; j++) {
		let objMot = tabPhrase[j];
		if (objMot.suite2 && objMot.suite2 === "personnage") {
			pour = true;
		}
		if (typeof objMot.mot === "string") {
			if (objMot.type === "nourriture" && pour) {
				maPhrase += objMot.mot + " pour ";
			} else {
				maPhrase += objMot.mot;
			}
		} else {
			if (tabPhrase[j - 1].mot === "se moquer des gens") {
				maPhrase += objMot.mot[2];
			} else {
				let index = accordercomplement(tabPhrase[j - 1]);
				maPhrase += objMot.mot[index];
			}
		}
		maPhrase += j === tabPhrase.length - 1 ? addpointendprase(objMot, maPhrase) : " ";
	}

	return maPhrase;
}

function elementDeclancheur(tabPhrase) {
	let maPhrase = "";
	let determinant = sujet.genre === "2" ? " la " : " le ";

	for (let j = 0; j < tabPhrase.length; j++) {
		let objMot = tabPhrase[j];
		if (typeof objMot.mot === "string") {
			if (objMot.type === "declencheur") {
				maPhrase += objMot.mot + determinant + sujet.mot;
				maPhrase = ajouteMajuscule(maPhrase);
			} else {
				maPhrase += objMot.mot;
			}
		} else {
			let index = accordercomplement(tabPhrase[j - 1]);
			maPhrase += objMot.mot[index];
		}
		maPhrase += j === tabPhrase.length - 1 ? addpointendprase(objMot, maPhrase) : " ";
	}

	return maPhrase;
}

function elementAction(tabPhrase, compteurdePhrases) {
	let determinant = sujet.genre === "2" ? "la " : "le ";
	let maPhrase = "";
	if (compteurdePhrases === 5) {
		maPhrase += "Alors, " + determinant + sujet.mot + " ";
	} else {
		let index = accordercomplement(sujet);
		maPhrase += tabPhrase[0].mot[index] + " " + determinant + sujet.mot + " ";
		tabPhrase.shift();
	}

	for (let j = 0; j < tabPhrase.length; j++) {
		let objMot = tabPhrase[j];

		if (typeof objMot.mot === "string") {
			if (objMot.type === "parole" && tabPhrase[j - 1].type === "personnage") {
				maPhrase += tabPhrase[j - 1].pluriel === "1" ? " qui lui dirent : " : " qui lui dit : ";
			}
			if (objMot.type === "objet" && tabPhrase[j - 1].type === "personnage") {
				maPhrase += tabPhrase[j - 1].pluriel === "1" ? "qui lui donnèrent " : " qui lui donna ";
			}
			maPhrase += objMot.mot;
		} else {
			if (objMot.type === "initialisationaction") {
				let index = accordercomplement(sujet);
				maPhrase += objMot.mot[index];
			} else {
				let index = accordercomplement(tabPhrase[j - 1]);
				maPhrase += objMot.mot[index];
			}
		}

		maPhrase += j === tabPhrase.length - 1 ? addpointendprase(objMot, maPhrase) : " ";
		maPhrase = ajouteMajuscule(maPhrase);
	}

	return maPhrase;
}

// fonction qui met la première lettre d'une chaine en majuscule
function ajouteMajuscule(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

// fonction qui ajoute un point ou rien à la fin de la phrase
function addpointendprase(objMot, phrase) {
	let point = "";
	if (objMot.type === "parole") {
		let tabmot = objMot.mot.split(" ");
		if (tabmot[tabmot.length - 1] !== "?" && tabmot[tabmot.length - 1] !== "!") {
			point = ".";
		}
	} else {
		point = ".";
	}

	return point;
}

// fonction qui renvoie le bon index pour accorder à l'objet passé en paramettre
function accordercomplement(objetsujet) {
	let index = 0;
	if (objetsujet.genre === "1") {
		if (objetsujet.pluriel === "1") {
			index = 2;
		} else {
			index = 0;
		}
	}
	if (objetsujet.genre === "2") {
		if (objetsujet.pluriel === "1") {
			index = 3;
		} else {
			index = 1;
		}
	}
	return index;
}
