function onFormSubmit(e) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const answerKeySheet = spreadsheet.getSheetByName('Clave de Respuestas');
  

  const answerKey = answerKeySheet.getRange(1, 1, answerKeySheet.getLastRow(), 2)
    .getValues()
    .map(row => ({
      questionNumber: parseInt(row[0].match(/\d+/)[0]), 
      correctAnswer: row[1].split(": ")[1].trim()      
    }));

  const studentName = e.values[2]; 
  const email = e.values[1];       
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let correctQuestions = [];
  let incorrectQuestions = [];


  for (let j = 3; j < e.values.length; j++) {
    const studentAnswer = e.values[j];
    const questionNumber = j - 2; 
    
    if (isNaN(questionNumber) || questionNumber > answerKey.length || questionNumber < 1) {
      continue; 
    }

    const studentAnswerLetter = studentAnswer.split(')')[0].trim();

    const correctAnswerEntry = answerKey.find(entry => entry.questionNumber === questionNumber);

    if (correctAnswerEntry) {
      const correctAnswer = correctAnswerEntry.correctAnswer;

      if (studentAnswerLetter === correctAnswer) {
        correctAnswers += 1;
        correctQuestions.push(questionNumber);
      } else {
        incorrectAnswers += 1;
        incorrectQuestions.push(questionNumber);
      }
    }
  }

  const totalQuestions = correctAnswers + incorrectAnswers;
  const nota = (correctAnswers / totalQuestions) * 10;
  const resultado = nota >= 6 ? "Aprobado" : "Desaprobado"; // Determinar si es aprobado o desaprobado

  const correctQuestionsText = '[' + correctQuestions.join(', ') + ']';
  const incorrectQuestionsText = '[' + incorrectQuestions.join(', ') + ']';

  const subject = 'Resultados de tu evaluación de Analítica Web';
  const message = `
    Hola ${studentName},

    A continuación los resultados de tu evaluación:

    Respuestas Correctas: ${correctAnswers}
    Respuestas Incorrectas: ${incorrectAnswers}
    Preguntas Correctas: ${correctQuestionsText}
    Preguntas Incorrectas: ${incorrectQuestionsText}
    Nota Final: ${nota.toFixed(2)} (${resultado})

    ¡Gracias!
  `;

  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: message
  });
}



function calificarRespuestas() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  const responsesSheet = getSheetByPartialName('Respuestas de formulario'); 
  const answerKeySheet = spreadsheet.getSheetByName('Clave de Respuestas');
  
  let gradesSheet = spreadsheet.getSheetByName('Calificaciones');
  if (!gradesSheet) {
    gradesSheet = spreadsheet.insertSheet('Calificaciones');
    gradesSheet.appendRow(['Email', 'Respuestas Correctas', 'Respuestas Incorrectas', 'Preguntas Correctas', 'Preguntas Incorrectas', 'Nota']);
  } else {
    gradesSheet.clear();
    gradesSheet.appendRow(['Email', 'Respuestas Correctas', 'Respuestas Incorrectas', 'Preguntas Correctas', 'Preguntas Incorrectas', 'Nota']);
  }

  const responses = responsesSheet.getDataRange().getValues();
  
  const answerKey = answerKeySheet.getRange(1, 1, answerKeySheet.getLastRow(), 2)
    .getValues()
    .map(row => ({
      questionNumber: parseInt(row[0].match(/\d+/)[0]), 
      correctAnswer: row[1].split(": ")[1].trim()      
    }));

  Logger.log("Answer Key: %s", JSON.stringify(answerKey));

  for (let i = 1; i < responses.length; i++) {
    const email = responses[i][1]; 
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let correctQuestions = [];
    let incorrectQuestions = [];
    
    Logger.log("Evaluando respuestas para: %s", email);

    for (let j = 3; j < responses[i].length; j++) {
      const studentAnswer = responses[i][j];
      const questionNumber = j - 2; 
      
      Logger.log("Pregunta %d - Respuesta del alumno: %s", questionNumber, studentAnswer);

      if (isNaN(questionNumber) || questionNumber > answerKey.length || questionNumber < 1) {
        Logger.log("Número de pregunta inválido: %d. Saltando esta entrada.", questionNumber);
        continue; 
      }

      const studentAnswerLetter = studentAnswer.split(')')[0].trim(); 

      Logger.log("Letra de respuesta del alumno para pregunta %d: %s", questionNumber, studentAnswerLetter);

      const correctAnswerEntry = answerKey.find(entry => entry.questionNumber === questionNumber);

      if (correctAnswerEntry) {
        const correctAnswer = correctAnswerEntry.correctAnswer;
        
        Logger.log("Respuesta correcta para pregunta %d: %s", questionNumber, correctAnswer);

        if (studentAnswerLetter === correctAnswer) {
          correctAnswers += 1;
          correctQuestions.push(questionNumber);
          Logger.log("Respuesta correcta para pregunta %d.", questionNumber);
        } else {
          incorrectAnswers += 1;
          incorrectQuestions.push(questionNumber);
          Logger.log("Respuesta incorrecta para pregunta %d.", questionNumber);
        }
      } else {
        Logger.log("No se encontró entrada en clave de respuestas para pregunta %d.", questionNumber);
      }
    }

    const totalQuestions = correctAnswers + incorrectAnswers;
    const nota = (correctAnswers / totalQuestions) * 10; 

    const correctQuestionsText = '[' + correctQuestions.join(', ') + ']';
    const incorrectQuestionsText = '[' + incorrectQuestions.join(', ') + ']';

    Logger.log("Email: %s, Correctas: %d, Incorrectas: %d, Preguntas Correctas: [%s], Preguntas Incorrectas: [%s], Nota: %f",
               email, correctAnswers, incorrectAnswers, correctQuestionsText, incorrectQuestionsText, nota);

    gradesSheet.appendRow([email, correctAnswers, incorrectAnswers, correctQuestionsText, incorrectQuestionsText, nota.toFixed(2)]);
  }
}

function getSheetByPartialName(partialName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = spreadsheet.getSheets();
  
  for (let i = 0; i < sheets.length; i++) {
    const sheet = sheets[i];
    if (sheet.getName().includes(partialName)) {
      return sheet;
    }
  }
  
  throw new Error(`No se encontró una hoja cuyo nombre contenga "${partialName}".`);
}
