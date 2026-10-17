
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido"
    });
  }

  const ci = process.env.NOVAPAY_CI;
  const cs = process.env.NOVAPAY_CS;

  if (!ci || !cs) {
    return res.status(500).json({
      error: "Credenciais NovaPay não configuradas"
    });
  }

  const { amount, description } = req.body || {};

  if (
    typeof amount !== "number" ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return res.status(400).json({
      error: "Informe um valor válido"
    });
  }

  try {
    const response = await fetch(
      "https://api.anovapay.com.br/charges",
      {
        method: "POST",
        headers: {
          ci,
          cs,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount,
          description: description || "Pedido Central Lanches"
        })
      }
    );

    const result = await response.text();

    let data;
    try {
      data = JSON.parse(result);
    } catch {
      data = { message: result };
    }

    return res.status(response.status).json(data);
  } catch {
    return res.status(502).json({
      error: "Falha ao conectar com a NovaPay"
    });
  }
};
