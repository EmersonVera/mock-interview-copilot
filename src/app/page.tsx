'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, 
  User, 
  Cpu, 
  Database, 
  Server, 
  ShieldAlert, 
  Cloud,
  Terminal,
  Activity,
  Layers,
  Globe
} from 'lucide-react';

const TECHNICAL_ROLES = [
  { id: 'Cloud Architect', label: 'Cloud Architect', desc: 'Diseño de sistemas resilientes, multinube e infraestructura global', icon: Cloud, color: 'text-indigo-400' },
  { id: 'DevOps Engineer', label: 'DevOps Engineer', desc: 'CI/CD, automatización de infraestructura como código y observabilidad', icon: Server, color: 'text-emerald-400' },
  { id: 'Frontend Developer', label: 'Frontend Developer', desc: 'Interfaces de alto rendimiento, optimización UX/UI e interactividad', icon: Layers, color: 'text-pink-400' },
  { id: 'Backend Developer', label: 'Backend Developer', desc: 'APIs escalables, microservicios, bases de datos complejas y caching', icon: Database, color: 'text-cyan-400' },
  { id: 'Security Specialist', label: 'Cloud Security Specialist', desc: 'Gobierno de identidades (IAM), encriptación y cumplimiento normativo', icon: ShieldAlert, color: 'text-rose-400' },
];

const EXPERIENCE_LEVELS = [
  { id: 'Junior', label: 'Junior', duration: '0 - 2 años', desc: 'Enfoque en conceptos básicos y APIs' },
  { id: 'Mid', label: 'Mid-Level', duration: '2 - 5 años', desc: 'Tradeoffs y desarrollo autónomo' },
  { id: 'Senior', label: 'Senior', duration: '5+ años', desc: 'Diseño de sistemas y escalabilidad global' },
];

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [selectedRole, setSelectedRole] = useState(TECHNICAL_ROLES[0].id);
  const [selectedLevel, setSelectedLevel] = useState('Mid');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    'Validando credenciales de Service Account local...',
    'Conectando a base de datos remota Firestore NoSQL...',
    'Inicializando agente Vertex AI Gemini 2.5...',
    'Guardando registro de sesión en la nube...',
    'Estableciendo canal de chat bidireccional...'
  ];


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    
    // Simular pasos de conexión a la nube para el laboratorio
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

try {
       const response = await fetch('/api/sessions', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           candidateName: name,
           technicalRole: selectedRole,
           experienceLevel: selectedLevel,
           language: language,
         }),
       });

      if (!response.ok) {
        throw new Error('Error al crear la sesión');
      }

      const data = await response.json();
      
      // Esperar a completar la animación técnica
      setTimeout(() => {
        clearInterval(stepInterval);
        router.push(`/interview/${data.sessionId}`);
      }, 6000);

    } catch (error) {
      console.error(error);
      alert('Error al conectar con los servicios de GCP. Verifica tu Service Account (gcp-key.json) y el Project ID.');
      setLoading(false);
      clearInterval(stepInterval);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative z-10">
      
      {/* HEADER PREMIUM */}
      <header className="text-center mb-12 max-w-2xl mt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-indigo-300 text-xs font-semibold tracking-wider uppercase mb-4 animate-pulse">
          <Activity className="w-3.5 h-3.5" />
          Laboratorio de Computación en la Nube
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-200 via-white to-emerald-200 bg-clip-text text-transparent">
          Mock Interview Copilot
        </h1>
        <p className="mt-4 text-gray-400 text-sm md:text-base leading-relaxed">
          Valida tu conocimiento técnico frente a un evaluador basado en 
          <span className="text-indigo-400 font-medium"> Vertex AI Gemini 2.5 Flash</span>. 
          Persistencia serverless construida en <span className="text-emerald-400 font-medium">Cloud Firestore NoSQL</span>.
        </p>

      </header>

      {/* FORMULARIO DE ACCESO */}
      <form onSubmit={handleSubmit} className="w-full max-w-4xl glass p-6 md:p-10 rounded-2xl shadow-2xl relative overflow-hidden mb-16">
        
        {/* Glow Decorativo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="space-y-8">
          
          {/* NOMBRE DEL CANDIDATO */}
          <div>
            <label className="block text-sm font-semibold tracking-wide text-gray-300 mb-2 uppercase flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              Nombre del Candidato (Estudiante)
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingresa tu nombre para iniciar la simulación..."
              className="w-full bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
            />
          </div>

          {/* ROL A EVALUAR */}
          <div>
            <label className="block text-sm font-semibold tracking-wide text-gray-300 mb-4 uppercase flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              Rol Técnico a Evaluar
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TECHNICAL_ROLES.map((role) => {
                const IconComponent = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                        : 'bg-gray-900/40 border-gray-800/80 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex gap-3.5 items-start">
                      <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-indigo-500/20' : 'bg-gray-800/60'}`}>
                        <IconComponent className={`w-5 h-5 ${role.color}`} />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{role.label}</div>
                        <div className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{role.desc}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* NIVEL DE EXPERIENCIA */}
          <div>
            <label className="block text-sm font-semibold tracking-wide text-gray-300 mb-4 uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Nivel de Experiencia Requerido
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {EXPERIENCE_LEVELS.map((level) => {
                const isSelected = selectedLevel === level.id;
                return (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setSelectedLevel(level.id)}
                    className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                        : 'bg-gray-900/40 border-gray-800/80 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white text-sm">{level.label}</span>
                      <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded text-indigo-300 font-mono">{level.duration}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{level.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SELECTOR DE IDIOMA */}
          <div>
            <label className="block text-sm font-semibold tracking-wide text-gray-300 mb-4 uppercase flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              Idioma de la Entrevista
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setLanguage('es')}
                className={`flex-1 py-3 rounded-xl border transition-all font-medium text-sm ${
                  language === 'es'
                    ? 'bg-indigo-500/10 border-indigo-500/50 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                    : 'bg-gray-900/40 border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                🇪🇸 Español
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`flex-1 py-3 rounded-xl border transition-all font-medium text-sm ${
                  language === 'en'
                    ? 'bg-indigo-500/10 border-indigo-500/50 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                    : 'bg-gray-900/40 border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                🇺🇸 English
              </button>
            </div>
          </div>

          {/* ENVIAR FORMULARIO */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white font-bold py-4 rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 active:scale-[0.99] flex items-center justify-center gap-2.5 text-base"
            >
              <Cloud className="w-5 h-5 animate-pulse" />
              Iniciar Simulación (Conectar a GCP)
            </button>
          </div>

        </div>
      </form>

      {/* FOOTER */}
      <footer className="text-center text-xs text-gray-500 pb-10">
        Diseñado bajo buenas prácticas de GCP e IAM. © {new Date().getFullYear()} Cloud Computing Sandbox.
      </footer>

      {/* OVERLAY DE CARGA (SIMULACIÓN DE CONEXIÓN DE RED EN LA NUBE) */}
      {loading && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full glass rounded-2xl p-8 border border-indigo-500/20 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 animate-pulse" />
            
            <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <Terminal className="w-7 h-7 text-indigo-400 animate-pulse" />
              <div className="absolute inset-0 border border-indigo-500/30 rounded-full animate-ping scale-75" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Conectando con Google Cloud</h3>
            <p className="text-sm text-gray-400 mb-6 font-mono">Invocando APIs de Vertex AI y Firestore...</p>
            
            {/* Animación de carga técnica */}
            <div className="space-y-3.5 text-left font-mono text-xs bg-black/60 p-4 rounded-xl border border-gray-800 text-gray-300">
              {loadingSteps.map((step, idx) => {
                const isActive = loadingStep === idx;
                const isPassed = loadingStep > idx;
                return (
                  <div key={idx} className="flex items-center gap-2">
                    {isPassed ? (
                      <span className="text-emerald-400">✓</span>
                    ) : isActive ? (
                      <span className="text-indigo-400 animate-spin">⟳</span>
                    ) : (
                      <span className="text-gray-600">○</span>
                    )}
                    <span className={isPassed ? 'text-gray-400' : isActive ? 'text-indigo-300 font-bold' : 'text-gray-600'}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-[10px] text-gray-500 tracking-wider uppercase font-semibold">
              GCP SDK Connection Stage
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
