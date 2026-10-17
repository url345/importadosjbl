module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido"
    });
  }

  const ci = process.env.NOVAPAY_CLIENT_ID;
  const cs = process.env.NOVAPAY_CLIENT_SECRET;

  if (!ci || !cs) {
    return res.status(500).json({
      error: "Credenciais NovaPay não configuradas"
    });
  }

  const { amount, description, color, customer } = req.body || {};

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
          description: description || "Pedido ImportadosJBL"
        })
      }
    );

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        message: text
      };
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || data.error || "Erro ao criar cobrança na NovaPay",
        details: data
      });
    }

    return res.status(200).json(data);

  } catch (error) {
    return res.status(502).json({
      error: "Falha ao conectar com a NovaPay"
    });
  }
};
