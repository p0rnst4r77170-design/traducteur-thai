module.exports = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.send("Ecris un mot !");

  try {
    // On change l'URL pour une version "M" (mobile) souvent plus stable pour la phonétique
    const url = `https://translate.google.com/translate_a/single?client=at&sl=fr&tl=th&dt=rm&dt=t&q=${encodeURIComponent(q)}`;
    
    const response = await fetch(url, {
      headers: { 'User-Agent': 'AndroidTranslate/5.3.0.RC02.130475354-53000644 5.1 phone TRANSLATE_MOBILE_PACKAGE' }
    });
    
    const data = await response.json();

    // On va chercher la phonétique (elle est souvent à la fin du premier bloc)
    let output = "";
    if (data && data[0]) {
      // On cherche la valeur qui n'est PAS du thaï (caractères latins)
      for (let i = 0; i < data[0].length; i++) {
        if (data[0][i][3] && /^[a-zA-Z\s]/.test(data[0][i][3])) {
          output = data[0][i][3];
          break;
        }
      }
    }

    // Si on n'a rien trouvé, on tente un dernier emplacement manuel
    if (!output && data[0][1] && data[0][1][3]) {
      output = data[0][1][3];
    }

    // On nettoie les accents bizarres si on a trouvé quelque chose
    if (output) {
      res.send(output.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
    } else {
      // Si vraiment Google boude, on renvoie une erreur claire au lieu du thaï
      res.send("(Phonétique indisponible)");
    }

  } catch (err) {
    res.send("Erreur Google");
  }
};
