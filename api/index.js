const translate = require('google-translate-api-x');

module.exports = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.send("Utilisation: !t [texte]");
  try {
    const result = await translate(q, { to: 'th' });
    // On renvoie la phonétique (ex: Sawatdee) ou le texte thaï si pas de phonétique
    res.send(result.transliteration || result.text);
  } catch (err) {
    res.send("Erreur");
  }
};
