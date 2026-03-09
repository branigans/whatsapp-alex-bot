require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: "apiKey: process.env.OPENAI_API_KEY"

app.post("/whatsapp", async (req, res) => {
  try {
    const mensaje = req.body.Body || "";

    const respuesta = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: `
Eres Alex, asistente virtual de Branigans.

Reglas:
- Responde siempre en español.
- Usa un tono amable, profesional y breve.
- Ayuda con productos, pedidos, horarios, pagos y soporte básico.
- Si no sabes algo, no inventes.
- Si el cliente quiere hablar con una persona, ofrece pasarlo con un asesor.
- No prometas descuentos, devoluciones ni tiempos de entrega no confirmados.
- Si detectas intención de compra, guía al cliente con un asesor.
`
        },
        {
          role: "user",
          content: mensaje
        }
      ]
    });

    const texto = respuesta.output_text || "Lo siento, no pude responder en este momento.";

    res.set("Content-Type", "text/xml");
    res.status(200).send(`
<Response>
  <Message>${texto}</Message>
</Response>
`);
  } catch (error) {
    console.error("Error en el servidor:", error);

    res.set("Content-Type", "text/xml");
    res.status(200).send(`
<Response>
  <Message>Lo siento, hubo un problema procesando tu mensaje. Intenta de nuevo en un momento.</Message>
</Response>
`);
  }
});

app.get("/", (req, res) => {
  res.send("Servidor de Alex activo");
});

app.listen(3000, () => {
  console.log("Alex está corriendo en puerto 3000");
});