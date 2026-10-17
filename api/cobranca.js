export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { amount, description } = req.body;

  const r = await fetch("https://api.anovapay.com.br/charges", {
    method: "POST",
    headers: {
      ci: process.env.NOVAPAY_CLIENT_ID,
      cs: process.env.NOVAPAY_CLIENT_SECRET,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount, description }),
  });

  const data = await r.json().catch(() => null);
  return res.status(r.ok ? 200 : 502).json(data ?? { error: "Falha na Nova Pay" });
}
