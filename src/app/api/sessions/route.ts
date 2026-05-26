import { db } from '@/lib/firestore';
import { getGenAI } from '@/lib/vertex-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { candidateName, technicalRole, experienceLevel, language = 'es' } = await req.json();

    if (!candidateName || !technicalRole || !experienceLevel) {
      return NextResponse.json(
        { error: 'Todos los campos (Nombre, Rol y Nivel) son requeridos.' },
        { status: 400 }
      );
    }

    const systemInstruction = language === 'en'
      ? `Act as a Senior Technical Recruiter evaluating a candidate for the role of ${technicalRole} with ${experienceLevel} level of experience.

**IMPORTANT LANGUAGE INSTRUCTION**: You MUST respond in English (en-US) only. This is critical for the interview to be conducted properly.

Your goal is to conduct a rigorous but professional and constructive technical interview with the candidate ${candidateName}.

Critical behavior instructions:
1. Briefly introduce yourself professionally in your first message and welcome the candidate.
2. Ask exactly ONE technical question at a time. Wait for the candidate to respond before evaluating and moving to the next one.
3. Accurately and rigorously evaluate the candidate's response. If there are conceptual or implementation errors, explain them constructively and briefly, showing the correct alternative.
4. Adapt the technical difficulty of questions strictly to their level (${experienceLevel}). If Senior, ask about system design, scalability tradeoffs, advanced security, costs, and cloud resilience. If Junior, focus on fundamental concepts, APIs, and basic syntax.
5. Maintain a formal, professional, empathetic, and constructive tone at all times.
6. After 4 or 5 question-answer interactions, explicitly conclude the interview offering a detailed report with:
   - Demonstrated strengths.
   - Identified areas for improvement.
   - A conceptual score from 1 to 10 based on their performance.`
      : `Actúas como un Entrevistador Técnico Senior experto en ${technicalRole} con nivel de experiencia ${experienceLevel}. 

**INSTRUCCIÓN DE IDIOMA CRÍTICA**: Debes responder ÚNICAMENTE en Español (es-ES). Esto es fundamental para que la entrevista se realice correctamente. Nunca respondas en inglés bajo ninguna circunstancia.

Tu objetivo es realizar una entrevista técnica realista, rigurosa pero profesional y constructiva al candidato ${candidateName}.

Instrucciones críticas de comportamiento:
1. Preséntate brevemente de forma profesional en tu primer mensaje y da la bienvenida al candidato.
2. Realiza exactamente UNA pregunta técnica a la vez. Espera a que el candidato responda antes de evaluar y continuar con la siguiente.
3. Evalúa con precisión y rigor técnico la respuesta del candidato. Si hay algún error conceptual o de implementación, explícalo constructivamente de forma concisa y muestra la alternativa correcta.
4. Adapta la dificultad técnica de las preguntas estrictamente a su nivel (${experienceLevel}). Si es Senior, pregunta por diseño de sistemas, tradeoffs de escalabilidad, seguridad avanzada, costos y resiliencia en la nube. Si es Junior, enfócate en conceptos fundamentales, APIs y sintaxis básica.
5. Mantén un tono formal, profesional, empático y constructivo en todo momento.
6. Tras 4 o 5 interacciones de preguntas y respuestas, finaliza la entrevista de manera explícita indicando que ha concluido. Ofrece un reporte detallado con:
   - Fortalezas demostradas.
   - Áreas de mejora identificadas.
   - Una puntuación conceptual de 1 a 10 basada en su desempeño.`;

    // 1. Crear documento de sesión en Firestore con ID autogenerado
    const sessionRef = db.collection('sessions').doc();
    const sessionId = sessionRef.id;

    // 2. Usar el nuevo Google Gen AI SDK
    const ai = getGenAI();

    const initPrompt = language === 'en'
      ? `Start the technical interview. Introduce yourself formally to candidate ${candidateName}, welcome them to this evaluation space for the ${technicalRole} role (${experienceLevel}), and ask your first technical question on a foundational topic for this role.`
      : `Inicia la entrevista técnica. Preséntate con formalidad corporativa ante el candidato ${candidateName}, dale la bienvenida a este espacio para evaluar su postulación como ${technicalRole} (${experienceLevel}), y realiza tu primera pregunta técnica sobre un tema base de este rol.`;

    // Llamar al método del nuevo SDK unificado
    const aiResult = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: initPrompt }] }],
      config: {
        systemInstruction: systemInstruction,
      }
    });

    const now = new Date();

    // Extract text properly from the response - handle different SDK formats
    let aiText = '';
    if (typeof aiResult.text === 'string' && aiResult.text.trim()) {
      aiText = aiResult.text;
    } else if (aiResult.candidates?.[0]?.content?.parts?.[0]?.text) {
      aiText = aiResult.candidates[0].content.parts[0].text;
    }

    console.log('Initial question generation:', { 
      hasAiText: !!aiText, 
      textLength: aiText.length,
      language: language 
    });

    // Fallback messages based on language
    const fallbackEn = `Hello ${candidateName}, welcome to your technical interview for the ${technicalRole} role (${experienceLevel}). My name is Gemini, I'll be your evaluator today. To begin, could you explain what architectural considerations you prioritize when designing a service to be highly available and fault-tolerant?`;
    const fallbackEs = `Hola ${candidateName}, bienvenido a tu entrevista técnica para el rol de ${technicalRole} (${experienceLevel}). Mi nombre es Gemini, seré tu evaluador hoy. Para comenzar, ¿podrías explicarnos qué consideraciones arquitectónicas priorizas al diseñar un servicio para que sea altamente disponible y tolerante a fallos?`;

    const initialQuestion = aiText || (language === 'en' ? fallbackEn : fallbackEs);

    await sessionRef.set({
      id: sessionId,
      candidateName,
      technicalRole,
      experienceLevel,
      language,
      status: 'active',
      systemInstructions: systemInstruction,
      createdAt: now,
      updatedAt: now,
      messageCount: 1,
    });

    // 4. Guardar la pregunta inicial generada por el modelo en la subcolección 'messages'
    const messageRef = sessionRef.collection('messages').doc();
    await messageRef.set({
      id: messageRef.id,
      timestamp: now,
      role: 'model',
      text: initialQuestion,
    });

    return NextResponse.json({
      sessionId,
      initialQuestion,
    });
  } catch (error: any) {
    console.error('Error al crear la sesión en Firestore:', error);
    return NextResponse.json(
      { error: 'Error interno al inicializar la sesión', details: error.message },
      { status: 500 }
    );
  }
}
