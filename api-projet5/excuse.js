function genererLesExcuses(excuses, sexe) {
	let tabDExcuses = [];
	excuses.forEach(objetExcuse => {
		let phraseExcuse = "";
		for (let i = 0; i < objetExcuse.length; i++) {
			const motExcuse = objetExcuse[i];
			if (motExcuse.type === "verbe") {
				if (objetExcuse[i - 1].mot === "j") {
					motExcuse.avec === "avoir" ? (phraseExcuse += "'ai ") : (phraseExcuse += "e suis ");
					if (sexe === "femme") {
						objetExcuse[i - 1].genre = "2";
					}
				} else {
					if (motExcuse.avec === "avoir") {
						objetExcuse[i - 1].pluriel === "1" ? (phraseExcuse += "ont ") : (phraseExcuse += "a ");
					} else {
						objetExcuse[i - 1].pluriel === "1" ? (phraseExcuse += "sont ") : (phraseExcuse += "est ");
					}
				}
				let index = accorder(objetExcuse[i - 1]);
				phraseExcuse += motExcuse.mot[index];
			}
			if (motExcuse.type === "capacite") {
				phraseExcuse += "ainsi, ";
			}
			if (motExcuse.type !== "verbe" && motExcuse.type !== "calificatiftemps") {
				phraseExcuse += motExcuse.mot;
			}

			if (motExcuse.type === "formule") {
				if (sexe === "femme") {
					if (motExcuse.feminin === "1") {
						phraseExcuse += "e";
					}
				}
				phraseExcuse += ",";
			}
			if (motExcuse.type === "temps") {
				motExcuse.pluriel === "1" ? (phraseExcuse += " ont été pour moi") : (phraseExcuse += " a été pour moi");
			}
			if (motExcuse.type === "calificatiftemps") {
				let index = accorder(objetExcuse[i - 1]);
				phraseExcuse += motExcuse.mot[index];
				phraseExcuse += " en effet,";
			}
			motExcuse.mot === "j" ? (phraseExcuse += "") : (phraseExcuse += " ");
		}
		tabDExcuses.push(phraseExcuse);
	});
	console.log("tabDExcuses", tabDExcuses);
	return tabDExcuses;
}

// fonction qui renvoie le bon index pour accorder à l'objet passé en paramettre
function accorder(objetsujet) {
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
