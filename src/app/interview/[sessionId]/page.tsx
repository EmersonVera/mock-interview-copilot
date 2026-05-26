import { db } from '@/lib/firestore';
import { notFound } from 'next/navigation';
import InterviewRoomClient from './InterviewRoomClient';

interface Props {
  params: Promise<{
    sessionId: string;
  }>;
}

export default async function InterviewPage({ params }: Props) {
  const resolvedParams = await params;
  const { sessionId } = resolvedParams;

  try {
    const sessionDoc = await db.collection('sessions').doc(sessionId).get();

    if (!sessionDoc.exists) {
      notFound();
    }

    const sessionData = sessionDoc.data()!;
    const session = {
      id: sessionData.id,
      candidateName: sessionData.candidateName,
      technicalRole: sessionData.technicalRole,
      experienceLevel: sessionData.experienceLevel,
      language: (sessionData.language || 'es') as 'es' | 'en',
      status: sessionData.status,
    };

    const messagesSnapshot = await db
      .collection('sessions')
      .doc(sessionId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .get();

    const initialMessages = messagesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        role: data.role as 'user' | 'model',
        text: data.text,
        timestamp: data.timestamp?.toDate()?.toISOString() || new Date().toISOString(),
      };
    });

    return (
      <InterviewRoomClient
        session={session}
        initialMessages={initialMessages}
      />
    );
  } catch (error: any) {
    console.error('Error al recuperar la sesión desde Firestore:', error);
    
    // Proporcionar una pantalla de fallback amigable y educacional para el alumno del laboratorio.
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center min-h-[85vh]">
        <div className="max-w-2xl glass p-8 md:p-10 rounded-2xl border border-rose-500/20 shadow-2xl">
          <div className="w-14 h-14 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-rose-400 text-2xl font-bold">!</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Error de Autenticación / Conexión a Firestore</h2>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            No pudimos conectar con Cloud Firestore en tu cuenta de GCP. En el contexto de este laboratorio, esto ocurre habitualmente si la variable de credenciales o el ID del proyecto no se han expuesto localmente.
          </p>
          
          <div className="text-left font-mono text-xs bg-slate-950 p-5 rounded-xl border border-gray-800 text-gray-300 space-y-4 mb-6 leading-relaxed">
            <div>
              <p className="text-rose-400 font-semibold mb-1">// Explicación del Error:</p>
              <p className="text-gray-400">{error.message || 'Credenciales de GCP no encontradas por el Default Application Credentials (ADC) de Google.'}</p>
            </div>
            <div>
              <p className="text-emerald-400 font-semibold mb-1">// Solución paso a paso para el laboratorio:</p>
              <p className="text-gray-400">1. Asegúrate de haber guardado tu llave <code className="text-white bg-gray-800 px-1 py-0.5 rounded">gcp-key.json</code> en la raíz de tu proyecto.</p>
              <p className="text-gray-400">2. En tu terminal local, corre los siguientes comandos antes de iniciar el servidor:</p>
              <pre className="bg-black p-2 rounded mt-2 text-indigo-300 overflow-x-auto select-all">
export GOOGLE_APPLICATION_CREDENTIALS="./gcp-key.json"{"\n"}
export GCP_PROJECT_ID="tu-proyecto-de-gcp-id"
              </pre>
            </div>
          </div>
          
          <a
            href="/"
            className="inline-flex bg-gray-800 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }
}
