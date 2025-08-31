const fs = require('fs');
const pdf = require('pdf-parse');
const Tesseract = require('tesseract.js');
const Document = require('../models/Document');

// Text extraction from PDF
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    throw new Error('PDF text extraction failed: ' + error.message);
  }
};

// Text extraction from Image using OCR
const extractTextFromImage = async (filePath) => {
  try {
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
    return text;
  } catch (error) {
    throw new Error('OCR processing failed: ' + error.message);
  }
};

// Summary generation algorithm (statistical method)
const generateSummary = (text, lengthOption) => {
  if (!text || text.trim().length === 0) {
    return 'No text could be extracted from this document.';
  }

  // Split text into sentences
  const sentences = text.split(/[.!?]+/).filter(s => s.length > 0);
  const words = text.toLowerCase().match(/\b(\w+)\b/g) || [];

  // Calculate word frequencies (ignore short words)
  const wordFrequencies = {};
  words.forEach(word => {
    if (word.length > 3) {
      wordFrequencies[word] = (wordFrequencies[word] || 0) + 1;
    }
  });

  // Score sentences based on word frequency
  const sentenceScores = {};
  sentences.forEach((sentence, index) => {
    const sentenceWords = sentence.toLowerCase().match(/\b(\w+)\b/g) || [];
    let score = 0;
    sentenceWords.forEach(word => {
      if (wordFrequencies[word]) {
        score += wordFrequencies[word];
      }
    });
    sentenceScores[index] = score / (sentenceWords.length || 1);
  });

  // Determine number of sentences for summary
  let sentenceCount;
  switch (lengthOption) {
    case 'short':
      sentenceCount = Math.max(1, Math.floor(sentences.length * 0.2));
      break;
    case 'long':
      sentenceCount = Math.max(2, Math.floor(sentences.length * 0.5));
      break;
    case 'medium':
    default:
      sentenceCount = Math.max(1, Math.floor(sentences.length * 0.3));
  }

  // Get top-scored sentences
  const sortedSentences = Object.keys(sentenceScores)
    .sort((a, b) => sentenceScores[b] - sentenceScores[a])
    .slice(0, sentenceCount)
    .sort((a, b) => a - b); // Restore original order

  // Generate summary
  const summary = sortedSentences.map(idx => sentences[idx].trim()).join('. ') + '.';
  return summary;
};

// Controller for document processing
exports.processDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { summaryLength } = req.body;
    const filePath = req.file.path;

    // Extract text based on file type
    let extractedText = '';
    if (req.file.mimetype === 'application/pdf') {
      extractedText = await extractTextFromPDF(filePath);
    } else if (req.file.mimetype.startsWith('image/')) {
      extractedText = await extractTextFromImage(filePath);
    }

    // Generate summary
    const summary = generateSummary(extractedText, summaryLength);

    // Save to database
    const document = new Document({
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      extractedText,
      summary,
      summaryLength,
    });
    await document.save();

    // Return results
    res.json({
      success: true,
      originalName: req.file.originalname,
      extractedText,
      summary,
    });

    // Clean up uploaded file
    fs.unlinkSync(filePath);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};