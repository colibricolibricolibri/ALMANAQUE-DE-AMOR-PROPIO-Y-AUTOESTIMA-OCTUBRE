import React, { useState, useEffect } from 'react';
import { Phone, UserPlus, Trash2, MessageCircle, Heart, X, Search, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';

export interface ScheduledContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  notes?: string;
  isFavorite?: boolean;
}

interface ContactsDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
}

const DEFAULT_SUPPORT_LINES = [
  {
    name: 'Centro de Acompañamiento Emocional & Crisis',
    phone: '135',
    intlPhone: '+541152751135',
    category: 'Salud Emocional',
    desc: 'Línea gratuita de contención en crisis y prevención (Atención 24 hs).'
  },
  {
    name: 'Línea de Salud Mental y Apoyo Psicológico',
    phone: '0800-999-0091',
    intlPhone: '+548009990091',
    category: 'Salud Mental',
    desc: 'Orientación y apoyo profesional en salud mental confidencial.'
  },
  {
    name: 'Línea 144 · Contención y Asesoramiento Integral',
    phone: '144',
    intlPhone: '+54144',
    category: 'Apoyo Familiar & Género',
    desc: 'Atención, contención y asesoramiento las 24 horas.'
  },
  {
    name: 'Emergencias Médicas (SAME / Ambulancia)',
    phone: '107',
    intlPhone: '107',
    category: 'Emergencia Médica',
    desc: 'Atención de emergencias médicas de urgencia.'
  }
];

export const ContactsDirectoryModal: React.FC<ContactsDirectoryModalProps> = ({
  isOpen,
  onClose,
  onShowToast
}) => {
  const [contacts, setContacts] = useState<ScheduledContact[]>(() => {
    try {
      const saved = localStorage.getItem('zen_user_contacts');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'contact-sample-1',
        name: 'Terapeuta / Guía Holístico',
        phone: '+54 9 11 0000 0000',
        relationship: 'Acompañamiento',
        notes: 'Sesiones de meditación y sanación'
      },
      {
        id: 'contact-sample-2',
        name: 'Contacto de Confianza',
        phone: '+54 9 11 1111 1111',
        relationship: 'Amistad / Familia',
        notes: 'Para compartir momentos de paz y charla'
      }
    ];
  });

  const [activeTab, setActiveTab] = useState<'personal' | 'support'>('personal');
  const [filterQuery, setFilterQuery] = useState('');

  // Formulario nuevo contacto
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [isAddingOpen, setIsAddingOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('zen_user_contacts', JSON.stringify(contacts));
    } catch {}
  }, [contacts]);

  if (!isOpen) return null;

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      if (onShowToast) onShowToast('Por favor completa nombre y teléfono.');
      return;
    }

    const newContact: ScheduledContact = {
      id: `contact-${Date.now()}`,
      name: newName.trim(),
      phone: newPhone.trim(),
      relationship: newRelation.trim() || 'Contacto Personal',
      notes: newNotes.trim()
    };

    setContacts(prev => [newContact, ...prev]);
    setNewName('');
    setNewPhone('');
    setNewRelation('');
    setNewNotes('');
    setIsAddingOpen(false);
    if (onShowToast) onShowToast(`✨ ¡Contacto "${newContact.name}" agendado con éxito!`);
  };

  const handleDeleteContact = (id: string, name: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    if (onShowToast) onShowToast(`🗑️ Contacto "${name}" eliminado.`);
  };

  const sanitizePhoneForCall = (phoneStr: string) => {
    return phoneStr.replace(/[^\d+]/g, '');
  };

  const sanitizePhoneForWhatsApp = (phoneStr: string) => {
    return phoneStr.replace(/[^\d]/g, '');
  };

  const filteredPersonal = contacts.filter(c => 
    c.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    c.relationship.toLowerCase().includes(filterQuery.toLowerCase()) ||
    c.phone.includes(filterQuery)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F7F2E7] rounded-3xl shadow-2xl border border-amber-200/90 text-stone-800 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="p-5 sm:p-6 pb-4 border-b border-stone-200/70 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors cursor-pointer"
            title="Cerrar agenda"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-terracotta-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900 leading-tight">
                  Agenda de Teléfonos & Contactos
                </h3>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                  Privada
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Coordina tus teléfonos agendados y líneas de bienestar sin salir del Almanaque
              </p>
            </div>
          </div>

          {/* Pestañas de navegación */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setActiveTab('personal')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'personal'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white/80 hover:bg-white text-stone-600 border border-stone-200'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Mis Contactos Agendados ({contacts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'support'
                  ? 'bg-terracotta-600 text-white shadow-sm'
                  : 'bg-white/80 hover:bg-white text-stone-600 border border-stone-200'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Líneas Gratuitas de Ayuda</span>
            </button>
          </div>
        </div>

        {/* Cuerpo con Scroll */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {activeTab === 'personal' && (
            <>
              {/* Barra de búsqueda y botón de agregar */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    placeholder="Buscar contacto agendado..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-emerald-500 shadow-2xs"
                  />
                </div>
                <button
                  onClick={() => setIsAddingOpen(!isAddingOpen)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isAddingOpen ? 'Cerrar' : 'Agendar Teléfono'}</span>
                </button>
              </div>

              {/* Formulario desplegable para agregar nuevo contacto */}
              {isAddingOpen && (
                <form onSubmit={handleAddContact} className="p-4 bg-white rounded-2xl border border-emerald-200/90 shadow-md space-y-3 animate-fadeIn">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Nuevo Contacto Agendado
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Nombre Completo *</label>
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Ej: Laura Pérez"
                        required
                        className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Teléfono / WhatsApp *</label>
                      <input
                        type="tel"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="Ej: +54 9 11 1234 5678"
                        required
                        className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Relación / Vínculo</label>
                      <input
                        type="text"
                        value={newRelation}
                        onChange={(e) => setNewRelation(e.target.value)}
                        placeholder="Ej: Terapeuta, Mamá, Hermano..."
                        className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Notas / Recordatorio</label>
                      <input
                        type="text"
                        value={newNotes}
                        onChange={(e) => setNewNotes(e.target.value)}
                        placeholder="Ej: Llamar los martes por la tarde"
                        className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingOpen(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-500 hover:bg-stone-100"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                    >
                      Guardar en Agenda
                    </button>
                  </div>
                </form>
              )}

              {/* Lista de contactos guardados */}
              <div className="space-y-2.5">
                {filteredPersonal.length === 0 ? (
                  <div className="text-center py-8 bg-white/60 rounded-2xl border border-stone-200/60 p-4">
                    <Phone className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                    <p className="text-xs text-stone-500">No se encontraron contactos agendados.</p>
                    <p className="text-[11px] text-stone-400 mt-1">Usa el botón "Agendar Teléfono" para guardar tus números importantes.</p>
                  </div>
                ) : (
                  filteredPersonal.map(contact => (
                    <div 
                      key={contact.id}
                      className="p-3.5 bg-white rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-serif font-bold text-sm text-stone-900 truncate">
                            {contact.name}
                          </h4>
                          <span className="text-[9px] font-semibold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full border border-stone-200">
                            {contact.relationship}
                          </span>
                        </div>
                        <p className="text-xs font-mono font-medium text-emerald-800 mt-0.5">
                          {contact.phone}
                        </p>
                        {contact.notes && (
                          <p className="text-[11px] text-stone-500 italic mt-0.5 line-clamp-1">
                            "{contact.notes}"
                          </p>
                        )}
                      </div>

                      {/* Acciones de llamada, WhatsApp y eliminar */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        <a
                          href={`tel:${sanitizePhoneForCall(contact.phone)}`}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200 transition-colors shadow-2xs"
                          title={`Llamar a ${contact.name}`}
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Llamar</span>
                        </a>
                        <a
                          href={`https://wa.me/${sanitizePhoneForWhatsApp(contact.phone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-800 rounded-xl text-xs font-semibold border border-green-200 transition-colors shadow-2xs"
                          title={`Enviar WhatsApp a ${contact.name}`}
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-green-600" />
                          <span>WhatsApp</span>
                        </a>
                        <button
                          onClick={() => handleDeleteContact(contact.id, contact.name)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Eliminar de la agenda"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === 'support' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  Estas líneas telefónicas públicas y gratuitas brindan atención confidencial para momentos de desahogo, crisis emocional o urgencias. Puedes llamar directamente desde tu dispositivo con un solo toque.
                </p>
              </div>

              {DEFAULT_SUPPORT_LINES.map((line, idx) => (
                <div 
                  key={idx}
                  className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-sm text-stone-900">
                        {line.name}
                      </h4>
                      <span className="text-[9px] font-semibold bg-rose-50 text-rose-800 px-2 py-0.5 rounded-full border border-rose-200 shrink-0">
                        {line.category}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1">
                      {line.desc}
                    </p>
                    <span className="text-xs font-mono font-bold text-terracotta-700 mt-1 block">
                      Número: {line.phone}
                    </span>
                  </div>

                  <a
                    href={`tel:${line.intlPhone}`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-terracotta-600 to-terracotta-700 hover:from-terracotta-700 hover:to-terracotta-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 shrink-0 self-end sm:self-center"
                    title={`Llamar a ${line.name}`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Llamar Gratis ({line.phone})</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="p-4 bg-stone-50 border-t border-stone-200/70 flex items-center justify-between text-xs text-stone-500">
          <span className="text-[11px]">Tus contactos se guardan de forma segura en tu navegador</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-full text-xs font-semibold transition-all cursor-pointer"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};
