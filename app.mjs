import express from 'express'
import Groq from "groq-sdk";

//enviroments
const GROQ_API_KEY = process.env.GROQ_API_KEY
const AUTH_KEY = process.env.AUTH_KEY

const app = express()
const PORT = process.env.PORT || 3000;
const groq = new Groq({ apiKey: GROQ_API_KEY });

//midlewares
app.use(express.json())

app.post('/', async (req, res) => {
  try {
    const auth = req.headers.authorization

    if (auth === undefined) return res.status(401).json({ response: 'Unauthorized user' })
    else if (!auth.includes(AUTH_KEY)) return res.status(401).json({ response: 'Unauthorized user' })

    if (req.body === undefined) return res.status(400).json({ response: 'data is required!' })
    else if (req.body.message === undefined || req.body.message === '') return res.status(400).json({ response: 'message is not empty!' })
    else if (req.body.name === undefined || req.body.name === '') return res.status(400).json({ response: 'user name is required' })

    const { name, message } = req.body

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          name: name,
          content: message,
        },
      ],
      model: "llama-3.3-70b-versatile",
    })

    const response = completion.choices[0]?.message?.content || ""

    return res.json({ response })

  } catch (err) {
    console.log(err)
    return res.status(500).json({ response: 'A server error has occurred' })
  }
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})