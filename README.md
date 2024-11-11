# examen-de-opcion-multiple-en-google-forms
Esta aplicación te permite generar programáticamente (Google Apps Script) exámenes de opción múltiple en Google Forms, lo configuras desde una hoja de cálculo
/**										
*										
* Generador de examen de opción múltiple (multiple choice) realizado en Google Forms + G. Sheets + G. Apps Script										
*										
* desarrollado por Gonzalo Reynoso, DDW -										
* https://ddw.com.ar - gonzita@gmail.com										
*										
* licencia CC0 1.0 Universal (sin copyright / dominio público): podés darle cualquier uso sin garantías y bajo tu responsabilidad,										
*										
**/										
										
DESCRIPCIÓN - 										
Esta aplicación te permite generar programáticamente (Google Apps Script) exámenes de opción múltiple en Google Forms, lo configuras desde una hoja de cálculo										
										
Posee licencia MIT: podés usarlo sin cargo, modificarlo, etc, sin garantías y bajo tu propia responsabilidad, pero no elimines los créditos del autor										
										
PASOS PARA CREAR UN EXAMEN NUEVO DE MULTIPLE CHOICE								
1) crea una copia de esta hoja de cálculo https://docs.google.com/spreadsheets/d/1lMwZk3dF8Km9bsKvuEt_jTuGnTDIgqNiY_9bHuNlzNI/edit?usp=sharing y luego carga tus preguntas y respuestas de opción múltiple en la pestaña "Preguntas" (no alteres el orden de las columnas y no uses la columna C -imagen-)									
2) andá a "Extensiones" >> "Apps Script" y en el editor configura los scripts para personalizar tu examen, así:										
	edita genera.gs en la linea 42 para determinar la cantidad de preguntas que tendrá el examen:									
	const numQuestions = 10; // esto toma 10 preguntas del total que has cargado en la hoja "Preguntas"									
	luego edita la linea 60 para personalizar el título de tu evaluación									
	const form = FormApp.create('Evaluación de Analítica Web');									
	y la linea 68 para personalizar la descripción de tu examen									
	form.setDescription('Evaluación sobre conceptos de Analítica Web. Cada respuesta correcta vale 1 punto.')									
	edita nota.gs en la linea 60 para personalizar el asunto del email con la nota que le llegará al alumno/a									
	const subject = 'Resultados de tu evaluación de Analítica Web';									
3) en el editor ejecuta la función "createQuizForm" (verifica que esté seleccionada en el menú superior y clic en "ejecutar")										
en esta instancia vas a tener que seguir los pasos de autorización de la app para acceder a tu cuenta gmail/drive										
4) una vez creado el formulario de examen, la consola te dará dos enlaces, el público para darle a tus alumnos y el privado editable para que personalices o edites										
si pierdes estos enlaces de acceso al formulario siempre podés encontrarlos aquí: https://docs.google.com/forms/u/0/ (con tu cuenta de gmail que has setupeado esta implementación)										
5) configura el form para las opciones manuales que no se puede setear programáticamente, te recomiendo estas:										
	configuración > presentación > orden de preguntas aleatorio									
	configuración > Respuestas > Limitar a 1 respuesta									
6) en el editor de Google Apps Script, hacé clic en el menú Reloj (⏰) > Disparadores										
Configura un nuevo disparador para ejecutar calificarRespuestas al evento On form submit para que se ejecute cada vez que se agregue una nueva respuesta al formulario.										
esto lo que hace es automatizar las calificaciones de los alumnos en la pestaña "Calificaciones"										
ahora podés agregar otro disparador con la función  onFormSubmit(e)										
esto lo que hace es enviar un email al alumno con su calificación y nota apenas completa el examen, de forma automática										
7) probá el formulario realizando el examen con tu propio email (enlace público del formulario)										
una vez que hayas completado tu examen, chequea las hojas "Respuestas de formulario x", y "Calificaciones" también revisa la bandeja de entrada de tu email										
										
PASOS PARA ELIMINAR UN EXAMEN EXISTENTE Y CREAR UNO NUEVO									
hay dos formas de hacer esto, podés crear una copia de este archivo y realizar todos los pasos anteriores para crear otro examen, o bien:										
1) desvincula la hoja actual de respuestas de tu formulario anterior "Respuestas de formulario x"										
(clic en las opciones de la pestaña -flechita- >> desvincular formulario, luego elimina la hoja  "Respuestas de formulario x")										
2) elimina tu formulario viejo, recordá que lo encontrás en https://docs.google.com/forms/u/0/										
3) andá a "Extensiones" >> "Apps Script" y en el editor personaliza las opciones de tu examen (IDEM instrucción anterior)										
4) en el editor ejecuta la función "createQuizForm" (verifica que esté seleccionada en el menú superior y clic en "ejecutar")										
una vez creado el formulario de examen, la consola te dará dos enlaces, el público para darle a tus alumnos y el privado editable para que personalices o edites										
										
