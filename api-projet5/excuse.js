function genererLesExcuses(excuses, sexe) {
	let tabDExcuses = [];
	excuses.forEach(objetExcuse => {
		let phraseExcuse = "";
		for (let i = 0; i < objetExcuse.length; i++) {
			const motExcuse = objetExcuse[i];
			if (typeof motExcuse.mot === "string") {
				if (motExcuse.mot === "j") {
					objetExcuse.genre = sexe === "femme" ? "2" : "1";
				}
				if (motExcuse.type === "capacite") {
					phraseExcuse += "ainsi, ";
				}
				phraseExcuse += motExcuse.mot;
				if (motExcuse.type === "temps") {
					motExcuse.pluriel === "1" ? (phraseExcuse += " ont été pour moi") : (phraseExcuse += " a été pour moi");
				}
			} else {
				if (motExcuse.type === "formule") {
					phraseExcuse += sexe === "femme" ? motExcuse.mot[1] : motExcuse.mot[0];
					phraseExcuse += ",";
				} else {
					if (motExcuse.type === "verbe") {
						if (objetExcuse[i - 1].mot === "j") {
							phraseExcuse += motExcuse.avec === "avoir" ? "'ai " : "e suis ";
						} else {
							phraseExcuse +=
								motExcuse.avec === "avoir"
									? objetExcuse[i - 1].pluriel === "1"
										? "ont "
										: "a "
									: objetExcuse[i - 1].pluriel === "1"
									? "sont "
									: "est ";
						}
					}
					let index = accordercomplement(objetExcuse[i - 1]);
					phraseExcuse += motExcuse.mot[index];
					if (motExcuse.type === "calificatiftemps") {
						phraseExcuse += " en effet,";
					}
				}
			}
			phraseExcuse += motExcuse.mot === "j" ? "" : " ";
		}
		tabDExcuses.push(phraseExcuse);
	});
	return tabDExcuses;
}
