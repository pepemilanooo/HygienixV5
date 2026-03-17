import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer, { File as MulterFile } from 'multer';
import path from 'path';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// multer per upload foto (per ora su filesystem locale)
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../../..', 'uploads')));

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', hygienix: 'Disinfestazioni SaaS v1' });
});

// Crea Sede con cartelino
app.post('/api/sedi', async (req: Request, res: Response) => {
  try {
    const { nome, indirizzo, cartelino } = req.body;

    const sede = await prisma.sede.create({
      data: {
        nome,
        indirizzo,
        cartelino
      }
    });

    res.json(sede);
  } catch (err) {
    console.error('Errore /api/sedi', err);
    res.status(500).json({ error: 'Errore creazione sede' });
  }
});

// Crea Intervento con foto upload
app.post(
  '/api/interventi',
  upload.array('foto', 10),
  async (req: Request, res: Response) => {
    try {
      const { sedeId, tecnicoId, prodottiUsati } = req.body;

      const files = (req.files as MulterFile[] | undefined) || [];
      const fotoUrls = files.map((f) => f.path);

      const intervento = await prisma.intervento.create({
        data: {
          sedeId: parseInt(sedeId, 10),
          tecnicoId,
          prodottiUsati: prodottiUsati
            ? JSON.parse(prodottiUsati)
            : [],
          foto: fotoUrls,
          dataInizio: new Date()
        }
      });

      res.json(intervento);
    } catch (err) {
      console.error('Errore /api/interventi', err);
      res.status(500).json({ error: 'Errore creazione intervento' });
    }
  }
);

// Lista interventi per tecnico
app.get(
  '/api/interventi/:tecnicoId',
  async (req: Request, res: Response) => {
    try {
      const { tecnicoId } = req.params;

      const interventi = await prisma.intervento.findMany({
        where: { tecnicoId },
        include: { sede: true }
      });

      res.json(interventi);
    } catch (err) {
      console.error('Errore GET /api/interventi/:tecnicoId', err);
      res.status(500).json({ error: 'Errore lettura interventi' });
    }
  }
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Hygienix API running on port ${PORT}`);
  console.log(
    '📍 Test health: GET /api/health\n' +
      '📍 Test sede:  POST /api/sedi {nome:"Sede1", indirizzo:"Via Roma", cartelino:{trappole:[]}}'
  );
});
