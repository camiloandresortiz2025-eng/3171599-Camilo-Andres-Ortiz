// ============================================
// HOOK: useDebounce
// ============================================
// Retrasa la actualización de un valor para optimizar el rendimiento
// Especialmente útil en la búsqueda en tiempo real de remesas

import { useState, useEffect } from 'react';

/**
 * QUÉ: Hook personalizado para aplicar debounce a un valor
 * PARA: Evitar búsquedas excesivas mientras el usuario escribe
 * IMPACTO: Mejora el rendimiento al reducir re-renders innecesarios
 *
 * @param value - Valor al que aplicar debounce
 * @param delay - Milisegundos de retraso antes de actualizar
 * @returns Valor con debounce aplicado
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Crear timer que actualizará el valor después del delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar timer anterior si el valor cambia antes del delay
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
