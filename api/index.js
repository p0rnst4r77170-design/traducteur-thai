module.exports = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.send("Ecris un mot !");

  try {
    // On appelle l'API Google Translate "interne" qui donne la phonétique
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=th&dt=rm&dt=t&q=${encodeURIComponent(q)}`;
    
    const response = await fetch(url);
    const data = await response.json();

    // data[0][1][3] est l'emplacement standard de la phonétique (romanization)
    const phonetique = data[0][1] ? data[0][1][3] : null;

    if (phonetique) {
      res.send(phonetique);
    } else {
      // Si pas de phonétique, on donne la traduction thaïe
      res.send(data[0][0][0]);
    }
  } catch (err) {
    res.send("Erreur Google");
  }
};
