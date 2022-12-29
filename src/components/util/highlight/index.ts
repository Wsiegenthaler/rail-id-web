
// Highlight state including relevant marker and source positions to be highlighted
export type HighlightState = 'clear' | { markerId: string, source: number[]  }

// Setter for updating highlight state
export type SetHighlights = React.Dispatch<React.SetStateAction<HighlightState>>

// Globally provided highlight context including highlight state and setter
export type HighlightContextType = { state: HighlightState, set: SetHighlights }
