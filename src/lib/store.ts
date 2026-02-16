import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SelectedModule {
  id: string
  name: string
  type: 'base' | 'plugin' | 'subscription'
  priceMin: number
  priceMax: number
  priceUnit: string
}

interface PricingStore {
  selectedModules: SelectedModule[]
  addModule: (module: SelectedModule) => void
  removeModule: (moduleId: string) => void
  clearModules: () => void
  setModules: (modules: SelectedModule[]) => void
  totalMinPrice: () => number
  totalMaxPrice: () => number
  monthlyPrice: () => number
}

export const usePricingStore = create<PricingStore>()(
  persist(
    (set, get) => ({
      selectedModules: [],
      
      addModule: (module) => set((state) => {
        const exists = state.selectedModules.find(m => m.id === module.id)
        if (exists) return state
        return { selectedModules: [...state.selectedModules, module] }
      }),
      
      removeModule: (moduleId) => set((state) => ({
        selectedModules: state.selectedModules.filter(m => m.id !== moduleId)
      })),
      
      clearModules: () => set({ selectedModules: [] }),
      
      setModules: (modules) => set({ selectedModules: modules }),
      
      totalMinPrice: () => {
        const base = get().selectedModules
          .filter(m => m.type !== 'subscription')
          .reduce((sum, m) => sum + m.priceMin, 0)
        return base
      },
      
      totalMaxPrice: () => {
        const base = get().selectedModules
          .filter(m => m.type !== 'subscription')
          .reduce((sum, m) => sum + m.priceMax, 0)
        return base
      },
      
      monthlyPrice: () => {
        return get().selectedModules
          .filter(m => m.type === 'subscription')
          .reduce((sum, m) => sum + m.priceMin, 0)
      }
    }),
    {
      name: 'starfrom-pricing-store',
    }
  )
)
