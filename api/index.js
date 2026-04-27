const translate = require('translate-google-v2');

module.exports = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.send("Ecris un texte !");

  try {
    // On demande la traduction complète
    const result = await translate(q, { to: 'th' });
    
    // result[1] contient généralement la phonétique (romanisation) chez Google
    // Si Google la donne, on l'affiche, sinon on donne le texte
    const phonetique = result && result.transliteration ? result.transliteration : result.text;
    
    res.send(phonetique);
  } catch (err) {
    res.send("Erreur de traduction");
  }
};
