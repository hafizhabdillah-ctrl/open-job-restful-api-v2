import { nanoid } from 'nanoid';
import ClientError from '../../../exceptions/client-error.js';
import response from '../../../utils/response.js';
import path from 'path';
import fs from 'fs';

const documents = [];

export const uploadDocuments = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ClientError('A File is required'));
    }

    const { filename, originalname, size } = req.file;
    const documentId = nanoid(16);
    // const host = process.env.HOST || 'localhost';
    // const port = process.env.PORT || 3000;
    // const encodedFilename = encodeURIComponent(req.file.filename);
    // const fileLocation = `http://${host}:${port}/uploads/${encodedFilename}`;

    const newDocument = {
      documentId: documentId,
      filename: filename,
      originalName: originalname,
      size: size,
    };

    documents.push(newDocument);

    return response(res, 201, 'success', newDocument);

  } catch (error) {
    next(error);
  }
};

export const getAllDocuments = async (req, res, next) => {
  try {
    return response(res, 200, 'success', {
      documents: documents,
    });

  } catch (error) {
    next(error);
  }
};

export const getDocumentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const document = documents.find((doc) => doc.documentId === id);

    if (!document) {
      return next(new ClientError('Dokumen tidak ditemukan', 404));
    }

    const filePath = path.resolve('src/services/uploads/documents/', document.filename);

    if (!fs.existsSync(filePath)) {
      return next(new ClientError('File tidak ditemukan', 404));
    }

    res.download(filePath, document.originalName);
  } catch (error) {
    next(error);
  }
};

export const deleteDocumentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const index = documents.findIndex((doc) => doc.documentId === id);

    if (index === -1) {
      return next(new ClientError('Dokumen tidak ditemukan', 404));
    }

    const document = documents[index];
    const filePath = path.resolve('src/services/uploads/documents', document.filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    documents.splice(index, 1);

    res.status(200).json({
      status: 'success',
      message: 'Dokumen berhasil dihapus',
    });

  } catch (error) {
    next(error);
  }
};