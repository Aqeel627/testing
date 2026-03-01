let soundEnabled = true

export const toggleBetSound = () => {
  soundEnabled = !soundEnabled
  localStorage.setItem("betSound", JSON.stringify(soundEnabled))
  return soundEnabled
}

export const isBetSoundEnabled = () => {
  if (typeof window === "undefined") return true
  const saved = localStorage.getItem("betSound")
  soundEnabled = saved ? JSON.parse(saved) : true
  return soundEnabled
}

export const playSuccessSound = () => {
  if (!isBetSoundEnabled()) return
  const audio = new Audio("/sounds/bet-success.mp3")
  audio.volume = 0.6
  audio.play()
  navigator.vibrate?.(50)
}

export const playErrorSound = () => {
  if (!isBetSoundEnabled()) return
  const audio = new Audio("/sounds/bet-error.mp3")
  audio.volume = 0.6
  audio.play()
  navigator.vibrate?.([100, 50, 100])
}