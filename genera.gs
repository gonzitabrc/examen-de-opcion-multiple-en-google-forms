function loadQuestionsFromSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName("Preguntas");
  const data = sheet.getDataRange().getValues();
  
  const questions = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    
    const questionNumber = row[0];
    const question = row[1];
    const image = row[2] ? row[2] : null; // Si no hay imagen, asignar null
    const correctAnswer = row[3].toLowerCase(); 
    const options = row.slice(4, 10).filter(option => option); 
    
    questions.push({
      questionNumber: questionNumber,
      question: question,
      image: image,
      options: options,
      correctAnswer: correctAnswer
    });
  }
  
 // Logger.log(questions); 
  return questions;
}

function createQuizForm() {
  const questions = loadQuestionsFromSheet();
  createQuizFromSpreadsheet(questions);
}

function createQuizFromSpreadsheet(questions) {

  const numQuestions = 10;  // Número de preguntas a incluir en el examen
  const aleatQuestions = true;  // Si es true, selecciona preguntas aleatorias

  if (!questions || questions.length === 0) {
    throw new Error("El array 'questions' está vacío o no está definido.");
  }

  let selectedQuestions;
  if (aleatQuestions) {
    selectedQuestions = shuffleArray([...questions]).slice(0, numQuestions);
  } else {
    // Si no es aleatorio, tomar las primeras `numQuestions` preguntas
    selectedQuestions = questions.slice(0, numQuestions);
  }

  const form = FormApp.create('Evaluación de Analítica Web');

  const nameItem = form.addTextItem();
  nameItem.setTitle("Nombre del Alumno").setRequired(true);

  form.setConfirmationMessage("Tu examen ha sido enviado correctamente. Ya podés revisar tu correo electrónico para saber tu nota. Muchas gracias!");


  form.setDescription('Evaluación sobre conceptos de Analítica Web. Cada respuesta correcta vale 1 punto.')
      .setCollectEmail(true)
      .setProgressBar(true)
      .setShowLinkToRespondAgain(false)
      .setAllowResponseEdits(false)
      .setPublishingSummary(false);

  selectedQuestions.forEach((q, index) => {
    if (index > 0) {
      form.addPageBreakItem();
    }

    const questionItem = form.addMultipleChoiceItem();
    questionItem.setTitle(`${index + 1}. ${q.question}`)
      .setRequired(true)
      .setChoices(
        q.options.map((option, i) => {
          const label = String.fromCharCode(97 + i); // convierte 0,1,2... a a,b,c...
          return questionItem.createChoice(`${label}) ${option}`);
        })
      );

    questionItem.setHelpText('Selecciona la respuesta correcta');
  });

  try {
    const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    form.setDestination(FormApp.DestinationType.SPREADSHEET, activeSpreadsheet.getId());
  } catch (error) {
    Logger.log('Error al vincular con la hoja de cálculo: ' + error.toString());
  }

  try {
    const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let answerKey = activeSpreadsheet.getSheetByName('Clave de Respuestas');
    
    if (answerKey) {
      answerKey.clear();
    } else {
      answerKey = activeSpreadsheet.insertSheet('Clave de Respuestas');
    }
    
    selectedQuestions.forEach((q, index) => {
      answerKey.getRange(index + 1, 1).setValue(`Pregunta ${index + 1}`);
      answerKey.getRange(index + 1, 2).setValue(`Respuesta correcta: ${q.correctAnswer}`);
    });

  } catch (error) {
    Logger.log('Error al crear o escribir en hoja para clave de respuestas: ' + error.toString());
  }

  Logger.log('Formulario creado');
  Logger.log('URL para compartir: ' + form.getPublishedUrl());
  Logger.log('URL para editar: ' + form.getEditUrl());
}


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


