import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

//Middleware
app.use(cors())
app.use(express.json())
app.use(express.static('public'))

//Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({model: 'gemini-1.5-flash'})

app.listen(port, () => {
  console.log(`Gemini Chatbot running on http://localhost:${port}`)
})

//Route
app.get('/', (req, res) => {
  res.send('Gemini Chatbot running')
})

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message
  if(!userMessage) {
    return res.status(400).json({error: 'No message provided'})
  }

  try {
    const result = await model.generateContent(userMessage)
    const text = result.response.text()

    res.status(200).json({reply: text})
  } catch (error) {
    console.error(error)
    res.status(500).json({error: 'Internal Server Error'})
  }
})