export default async function handler(req, res) {
  const { order } = req.query;

  if (!order) {
    return res.status(400).send("Missing order ID");
  }

  return res.redirect(302, `/confirm/${order}?status=failed`);
}
