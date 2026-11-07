import { Barre, Rail } from '@/components/Chrome'
import { Bandeau, Releve, Seuil } from '@/components/Seuil'
import { Travaux } from '@/components/Travaux'
import { Matiere, Methode, Parcours } from '@/components/Atelier'
import { Devis } from '@/components/Devis'
import { Pied } from '@/components/Pied'

export default function Accueil() {
  return (
    <>
      <Rail />
      <div className="cadre">
        <Barre />
        <main>
          <Seuil />
          <Bandeau />
          <Releve />
          <Travaux />
          <Matiere />
          <Methode />
          <Parcours />
          <Devis />
        </main>
        <Pied />
      </div>
    </>
  )
}
