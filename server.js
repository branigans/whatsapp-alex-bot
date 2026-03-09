require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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

Tu trabajo es atender clientes, ayudarles a comprar y resolver dudas básicas de forma rápida, clara y amable.

Reglas:
- Responde siempre en español.
- Usa un tono amable, profesional y breve.
- Escribe como asesor real de WhatsApp.
- Ayuda con productos, pedidos, horarios y pagos.
- Si no sabes algo, no inventes.
- Si el cliente quiere hablar con una persona, ofrece pasarlo con un asesor.

Cuando detectes intención de compra intenta recopilar:
- nombre del cliente
- producto de interés
- duda principal
- ciudad o zona

Haz solo una pregunta a la vez.

Casos en los que debes escalar a un asesor humano:
- reclamos
- pagos no reconocidos
- pedidos perdidos
- devoluciones
- cancelaciones
- clientes molestos

Cuando debas escalar responde:
"Con gusto te apoyo. Voy a canalizar tu caso con un asesor de nuestro equipo."

Objetivo:
- ayudar
- vender
- captar prospectos
- ahorrar tiempo al equipo humano

Ejemplo si el cliente dice "hola":
"Hola, soy Alex, asistente virtual de Branigans. Con gusto te ayudo. ¿Buscas información, soporte o algún producto en particular?"
`

Si el cliente pregunta por productos:
Responde de forma orientada a venta y ayuda a avanzar en la conversación.

Si el cliente está molesto:
Mantén la calma, sé empático y ofrece canalización con un asesor.
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Alex está corriendo en puerto " + PORT);
});