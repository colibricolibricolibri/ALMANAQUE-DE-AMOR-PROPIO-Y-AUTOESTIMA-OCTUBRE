import React, { useState, useEffect, useTransition } from 'react';
import { X, Globe, Check, Sparkles, Search, Loader2, Thermometer, Clock } from 'lucide-react';
import { CountryTimezone } from '../../types';
import { COUNTRIES_TIMEZONES, getTimeInTimezone } from '../utils/timezone';
import { 
  WeatherInfo, 
  fetchLiveWeather, 
  searchOpenMeteoCities, 
  GeocodedCityResult 
} from '../utils/weather';

interface TimezoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCountry: CountryTimezone;
  onSelectCountry: (country: CountryTimezone) => void;
  weatherInfo?: WeatherInfo | null;
}

export const TimezoneModal: React.FC<TimezoneModalProps> = ({
  isOpen,
  onClose,
  selectedCountry,
  onSelectCountry,
  weatherInfo
}) => {
  const [search, setSearch] = useState('');
  const [now, setNow] = useState(new Date());
  const [isSearchingExternal, setIsSearchingExternal] = useState(false);
  const [externalResults, setExternalResults] = useState<CountryTimezone[]>([]);
  const [cityTemperatures, setCityTemperatures] = useState<Record<string, WeatherInfo>>({});
  const [, startTransition] = useTransition();

  // Actualizar segundero
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Cargar temperaturas de las ciudades visibles para tenerlas listas
  useEffect(() => {
    if (!isOpen) return;

    // Cargar para las primeras 6 ciudades principales
    const loadVisibleTemps = async () => {
      const topCities = COUNTRIES_TIMEZONES.slice(0, 8);
      for (const c of topCities) {
        if (c.latitude !== undefined && c.longitude !== undefined) {
          const key = `${c.code}-${c.city}`;
          if (!cityTemperatures[key]) {
            fetchLiveWeather(c.latitude, c.longitude, c.timeZone).then(w => {
              if (w) {
                setCityTemperatures(prev => ({ ...prev, [key]: w }));
              }
            });
          }
        }
      }
    };

    loadVisibleTemps();
  }, [isOpen]);

  // Búsqueda dinámica con Open-Meteo Geocoding cuando el usuario escribe una región o ciudad específica
  useEffect(() => {
    if (!isOpen) return;
    const trimmed = search.trim();
    if (trimmed.length < 2) {
      setExternalResults([]);
      setIsSearchingExternal(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingExternal(true);
      try {
        const results = await searchOpenMeteoCities(trimmed);
        
        // Convertir resultados geocodificados a CountryTimezone
        const formatted: CountryTimezone[] = results.map(r => {
          // Calcular offset aproximado
          let offset = 'GMT';
          try {
            const parts = new Intl.DateTimeFormat('es-AR', {
              timeZone: r.timezone,
              timeZoneName: 'shortOffset'
            }).formatToParts(new Date());
            const tzPart = parts.find(p => p.type === 'timeZoneName');
            if (tzPart) offset = tzPart.value;
          } catch {
            offset = 'GMT';
          }

          return {
            code: r.countryCode || 'GL',
            name: r.country || r.name,
            city: r.admin1 ? `${r.name}, ${r.admin1}` : r.name,
            flag: r.flag,
            timeZone: r.timezone,
            offset,
            latitude: r.latitude,
            longitude: r.longitude
          };
        });

        startTransition(() => {
          setExternalResults(formatted);
          setIsSearchingExternal(false);
        });

        // Pre-cargar temperatura para estos resultados
        formatted.forEach(f => {
          if (f.latitude !== undefined && f.longitude !== undefined) {
            const key = `${f.code}-${f.city}`;
            fetchLiveWeather(f.latitude, f.longitude, f.timeZone).then(w => {
              if (w) {
                setCityTemperatures(prev => ({ ...prev, [key]: w }));
              }
            });
          }
        });

      } catch (err) {
        setIsSearchingExternal(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search, isOpen]);

  if (!isOpen) return null;

  // Filtrado local
  const localFiltered = COUNTRIES_TIMEZONES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.offset.toLowerCase().includes(search.toLowerCase())
  );

  // Combinar resultados locales y externos evitando duplicados
  const combinedList: CountryTimezone[] = [...localFiltered];
  externalResults.forEach(ext => {
    const exists = combinedList.some(
      item => item.city.toLowerCase() === ext.city.toLowerCase() || 
             (Math.abs((item.latitude || 0) - (ext.latitude || 0)) < 0.2 && Math.abs((item.longitude || 0) - (ext.longitude || 0)) < 0.2)
    );
    if (!exists) {
      combinedList.push(ext);
    }
  });

  const activeTime = getTimeInTimezone(selectedCountry.timeZone, now);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-[28px] sm:rounded-[32px] max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header del Modal */}
        <div className="p-5 sm:p-6 pb-4 border-b border-stone-200/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-terracotta-100 flex items-center justify-center text-terracotta-700">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-lg sm:text-xl leading-tight">
                País, Ciudad & Clima
              </h3>
              <p className="text-xs text-stone-500">
                Sincroniza temperatura y hora de tu ciudad o región
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 text-stone-500 hover:text-stone-800 rounded-full transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ciudad actualmente activa con temperatura y hora destacadas */}
        <div className="px-5 sm:px-6 py-3.5 bg-gradient-to-r from-terracotta-50/80 via-amber-50/40 to-stone-50 border-b border-terracotta-100/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl drop-shadow-2xs">{selectedCountry.flag}</span>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-stone-900">
                  {selectedCountry.code} {selectedCountry.city || selectedCountry.name}
                </span>
                {weatherInfo && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300/60 shadow-2xs">
                    <span>{weatherInfo.icon}</span>
                    <span>{weatherInfo.temp}°C</span>
                  </span>
                )}
              </div>
              <span className="text-[11px] text-terracotta-700 font-medium block mt-0.5">
                {selectedCountry.name} · {selectedCountry.offset}
                {weatherInfo && ` · ${weatherInfo.description}`}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="font-mono text-sm sm:text-base font-bold text-stone-900 block tabular-nums">
              {activeTime.timeWithSeconds}
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Activo
            </span>
          </div>
        </div>

        {/* Barra de búsqueda con soporte de ciudades y regiones */}
        <div className="p-4 border-b border-stone-200/60 bg-stone-50/50">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar ciudad o región (ej. El Calafate, Bariloche, Santiago, Madrid)..."
              className="w-full pl-9.5 pr-9 py-2.5 bg-white text-xs text-stone-800 rounded-xl border border-stone-200 focus:border-terracotta-500 outline-none transition-all placeholder:text-stone-400 shadow-2xs"
            />
            {isSearchingExternal && (
              <Loader2 className="w-4 h-4 text-terracotta-600 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
            )}
            {search && !isSearchingExternal && (
              <button
                onClick={() => setSearch('')}
                className="text-stone-400 hover:text-stone-600 absolute right-3 top-1/2 -translate-y-1/2 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Lista de ciudades y países */}
        <div className="p-4 space-y-2 overflow-y-auto flex-1 max-h-[380px]">
          {combinedList.map((country, idx) => {
            const isSelected = 
              (country.code === selectedCountry.code && country.city === selectedCountry.city) ||
              (country.city === selectedCountry.city);
            const liveTime = getTimeInTimezone(country.timeZone, now);
            const tempKey = `${country.code}-${country.city}`;
            const weather = cityTemperatures[tempKey] || (isSelected ? weatherInfo : null);

            return (
              <button
                key={`${country.code}-${country.city}-${idx}`}
                onClick={() => {
                  onSelectCountry(country);
                  onClose();
                }}
                className={`w-full p-3 sm:p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-terracotta-600 to-terracotta-700 border-terracotta-600 text-white shadow-md'
                    : 'bg-white hover:bg-stone-50 border-stone-200/70 text-stone-800 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0">{country.flag}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`font-serif font-bold text-sm truncate ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                        {country.code} {country.city}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-md shrink-0 font-mono ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {country.offset}
                      </span>
                    </div>
                    <span className={`text-xs block truncate ${isSelected ? 'text-white/80' : 'text-stone-500'}`}>
                      {country.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-2">
                  {/* Temperatura */}
                  {weather ? (
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${
                      isSelected 
                        ? 'bg-white/20 text-white' 
                        : 'bg-amber-50 text-amber-800 border border-amber-200/50'
                    }`}>
                      <span>{weather.icon}</span>
                      <span className="font-mono">{weather.temp}°C</span>
                    </div>
                  ) : country.latitude !== undefined ? (
                    <div className={`text-[10px] flex items-center gap-0.5 ${isSelected ? 'text-white/70' : 'text-stone-400'}`}>
                      <Thermometer className="w-3 h-3" />
                      <span>--°C</span>
                    </div>
                  ) : null}

                  {/* Hora de la ciudad */}
                  <div className="text-right min-w-[52px]">
                    <span className={`font-mono text-xs sm:text-sm font-bold block tabular-nums ${isSelected ? 'text-white' : 'text-stone-800'}`}>
                      {liveTime.timeString}
                    </span>
                    <span className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-stone-400'}`}>
                      {liveTime.isNight ? '🌙 Noche' : '☀️ Día'}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-white text-terracotta-700 flex items-center justify-center shrink-0 shadow-2xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}

          {combinedList.length === 0 && !isSearchingExternal && (
            <div className="py-8 text-center text-xs text-stone-500 space-y-1">
              <p>No se encontraron resultados para &ldquo;{search}&rdquo;.</p>
              <p className="text-[11px] text-stone-400">Prueba con otra ciudad o nombre de país.</p>
            </div>
          )}
        </div>

        {/* Footer del Modal */}
        <div className="p-4 border-t border-stone-200/70 bg-stone-50/80 flex items-center justify-between text-xs text-stone-600">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            Clima en tiempo real (Open-Meteo)
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-semibold transition-all cursor-pointer"
          >
            Listo
          </button>
        </div>

      </div>
    </div>
  );
};
