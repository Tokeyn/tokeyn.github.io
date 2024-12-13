import useSWR from 'swr';

interface Graphics {
  strokes: string[];
}

export default function useCharacterGlyphSWR(character?: string) {
  return useSWR<Graphics>(
    character != null ? [character] : null,
    async ([character]) =>
      (await import(`#/assets/data-cn/${character}.json`)).default
  );
}
