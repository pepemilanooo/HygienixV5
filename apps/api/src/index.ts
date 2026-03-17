import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => res.json({ status: 'OK', hygienix: 'Disinfestazioni SaaS v1' }));

// Crea sede con cartelino
app.post('/api/sedi', async (req, res) => {
  const { nome, indirizzo, cartelino } = req.body;
  const sede = await prisma.sede.create({ data: { nome, indirizzo, cartelino } });
  res.json(sede);
});

// Crea intervento
app.post('/api/interventi', upload.array('foto', 10), async (req, res) => {
  const { sedeId, tecnicoId, prodottiUsati } = req.body;
  const fotoUrls = req.files?.map(f => f.path) || [];
  const intervento = await prisma.intervento.create({
    data: { 
      sedeId: parseInt(sedeId), 
      tecnicoId, 
      prodottiUsati: JSON.parse(prodottiUsati || '[]'),
      foto: fotoUrls 
    }
  });
  res.json(intervento);
});

// GET interventi per tecnico
app.get('/api/interventi/:tecnicoId', async (req, res) => {
  const { tecnicoId } = req.params;
  const interventi = await prisma.intervento.findMany({
    where: { tecnicoId },
    include: { sede: true }
  });
  res.json(interventi);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Hygienix API running on port ${PORT}`);
  console.log(`📱 Test: POST /api/sedi {nome:"Sede1", indirizzo:"Via Roma", cartelino:{trappole:[]}}`);
});
