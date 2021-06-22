
export const h1 = ({ isDisplay = true, isWeighted = true }) => `${isDisplay ? "font-display" : "font-body"} ${isWeighted && "font-semibold"} text-4xl`
export const h2 = ({ isDisplay = true, isWeighted = true }) => `${isDisplay ? "font-display" : "font-body"} ${isWeighted && "font-semibold"} text-3xl`
export const h3 = ({ isDisplay = true, isWeighted = true }) => `${isDisplay ? "font-display" : "font-body"} ${isWeighted && "font-semibold"} text-2xl`
export const h4 = ({ isDisplay = true, isWeighted = true }) => `${isDisplay ? "font-display" : "font-body"} ${isWeighted && "font-semibold"} text-xl`
export const h5 = ({ isDisplay = true, isWeighted = true }) => `${isDisplay ? "font-display" : "font-body"} ${isWeighted && "font-semibold"} text-lg`
export const p1 = ({ isDisplay = false, isWeighted = true }) => `${isDisplay ? "font-display" : "font-body"} ${isWeighted && "font-normal"} text-base`
export const p2 = ({ isDisplay = false, isWeighted = true }) => `${isDisplay ? "font-display" : "font-body"} ${isWeighted && "font-normal"} text-sm`
export const p3 = ({ isDisplay = false, isWeighted = true }) => `${isDisplay ? "font-display" : "font-body"} ${isWeighted && "font-normal"} text-xs`
