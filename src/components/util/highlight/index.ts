
export type HighlightState = 'clear' | { markerId: string, source: number[]  }

export type SetHighlights = React.Dispatch<React.SetStateAction<HighlightState>>

export type HighlightContextType = { state: HighlightState, set: SetHighlights }
