const fs = require('fs');
const prisma = require('../prismaClient');

async function handleUpload(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'File is required' });
  }

  const { filename, path: filepath, mimetype, originalname, size } = req.file;
  const candidateId = req.body.candidateId ? Number(req.body.candidateId) : null;
  const fileType = req.body.fileType;

  try {
    let candidateFileRecord = null;
    if (candidateId && fileType) {
      candidateFileRecord = await prisma.candidateFile.create({
        data: {
          candidateId,
          fileType,
          path: filepath,
          originalName: originalname,
          mimeType: mimetype,
        },
      });
    }

    res.status(201).json({
      filename,
      path: filepath,
      mimetype,
      originalName: originalname,
      size,
      candidateFileId: candidateFileRecord ? candidateFileRecord.id : undefined,
    });
  } catch (error) {
    console.error('Upload failed', error);
    if (filepath && fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
    res.status(500).json({ error: 'Failed to store file' });
  }
}

module.exports = { handleUpload };
