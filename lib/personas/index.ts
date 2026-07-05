import { hitesh } from "./hitesh";
import { piyush } from "./piyush";
import { Persona, PersonaId } from "./types";

export const personas: Record<PersonaId, Persona> = {
  hitesh,
  piyush,
};

export function getPersona(id: PersonaId): Persona {
  const persona = personas[id];
  if (!persona) throw new Error(`Unknown persona: ${id}`);
  return persona;
}

export * from "./types";
