const translate = require('google-translate-api-x');

module.exports = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.send("Utilisation: !t [texte]");

  try {
    // On traduit en Thaï et on demande la phonétique
    const result = await translate(q, { to: 'th' });
    
    // Si la phonétique existe, on l'envoie, sinon on envoie le texte Thaï
    const response = result.transliteration || result.text;
    res.send(response);
  } catch (err) {
    res.send("Erreur de traduction");
  }
};
