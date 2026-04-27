module.exports = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.send("Ecris un mot !");

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=th&dt=rm&dt=t&q=${encodeURIComponent(q)}`;
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const data = await response.json();

    let phonetique = "";
    if (data && data[0]) {
      for (let i = 0; i < data[0].length; i++) {
        if (data[0][i][3]) { phonetique = data[0][i][3]; break; }
      }
    }

    if (phonetique) {
      // CETTE LIGNE ENLÈVE LES ACCENTS BIZARRES (S̄wạs̄dī -> Sawasdi)
      const propre = phonetique.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      res.send(propre);
    } else {
      res.send(data[0][0][0]);
    }
  } catch (err) {
    res.send("Erreur");
  }
};
